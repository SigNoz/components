import {
	type LayoutCursor,
	type LayoutLineRange,
	layoutNextLine,
	type PreparedTextWithSegments,
	prepareWithSegments,
	walkLineRanges,
} from '@chenglou/pretext';
import { type RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../lib/utils.js';
import styles from './text-ellipsis.module.css';

type TextEllipsisPosition = 'start' | 'center' | 'end';

export interface TextEllipsisProps {
	/**
	 * The text content to display with ellipsis truncation.
	 */
	children: string;
	/**
	 * Where to place the ellipsis when text overflows.
	 * @default 'center'
	 */
	position?: TextEllipsisPosition;
	/**
	 * The ellipsis string to use.
	 * @default '...'
	 */
	ellipsis?: string;
	/**
	 * The width of the container. If not provided, the component will measure its own width.
	 * Use this when you need to control the width externally (e.g., when combining with other components).
	 */
	width?: number;
	/**
	 * Optional className for the container.
	 */
	className?: string;
	/**
	 * Optional title attribute. If not provided, the full text will be used as title when truncated.
	 */
	title?: string;
}

const START_CURSOR: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
const LARGE_WIDTH = Number.MAX_SAFE_INTEGER;

function getComputedFont(element: HTMLElement): string {
	const style = getComputedStyle(element);
	// Build a minimal valid canvas ctx.font string manually.
	// We cannot use style.font directly — it can include non-shorthand font
	// properties (e.g. font-variant-numeric: "slashed-zero" from badge CSS)
	// that are invalid in the CSS font shorthand syntax accepted by canvas,
	// causing canvas to silently reject the whole string and fall back to
	// "10px sans-serif", producing completely wrong measurements.
	// Only fontStyle, fontWeight, fontSize, fontFamily are safe to include.
	return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

/**
 * Measures the natural (unwrapped) width of prepared text.
 */
function measureNaturalWidth(prepared: PreparedTextWithSegments): number {
	let width = 0;
	walkLineRanges(prepared, LARGE_WIDTH, (line: LayoutLineRange) => {
		width = line.width;
	});
	return width;
}

/**
 * Returns true if the text fits on a single line within maxWidth.
 */
function fitsInSingleLine(prepared: PreparedTextWithSegments, maxWidth: number): boolean {
	const line = layoutNextLine(prepared, START_CURSOR, maxWidth);
	if (line === null) return true;
	return layoutNextLine(prepared, line.end, maxWidth) === null;
}

/**
 * Finds the longest suffix of text that fits within maxWidth.
 * Unlike getLastLine which uses line-breaking (may leave space unused),
 * this directly measures substrings from the end to maximize content.
 */
function getMaxSuffix(text: string, maxWidth: number, font: string): string {
	if (!text) return '';

	// Use floor for available width to be conservative
	const availableWidth = Math.floor(maxWidth);

	// Check if full text fits
	const fullPrepared = prepareWithSegments(text, font);
	const fullWidth = Math.ceil(measureNaturalWidth(fullPrepared));
	if (fullWidth <= availableWidth) {
		return text;
	}

	// Collect all possible start positions (word boundaries + character positions)
	const startPositions: number[] = [];

	// Add word boundary positions (after each whitespace sequence)
	for (const match of text.matchAll(/\s+/g)) {
		const afterSpace = (match.index ?? 0) + match[0].length;
		if (afterSpace < text.length) {
			startPositions.push(afterSpace);
		}
	}

	// If no word boundaries, add character positions
	if (startPositions.length === 0) {
		for (let i = 1; i < text.length; i++) {
			startPositions.push(i);
		}
	}

	// Sort positions (should already be sorted, but ensure it)
	startPositions.sort((a, b) => a - b);

	// Binary search: find the earliest start position where suffix fits
	let left = 0;
	let right = startPositions.length - 1;
	let bestStart = text.length; // Default to empty suffix

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const startIdx = startPositions[mid];
		const suffix = text.slice(startIdx);
		const suffixPrepared = prepareWithSegments(suffix, font);
		// Use ceil for measured width to be conservative
		const suffixWidth = Math.ceil(measureNaturalWidth(suffixPrepared));

		if (suffixWidth <= availableWidth) {
			bestStart = startIdx;
			right = mid - 1; // Try earlier start (more text)
		} else {
			left = mid + 1; // Try later start (less text)
		}
	}

	return text.slice(bestStart);
}

function truncateText(
	text: string,
	maxWidth: number,
	font: string,
	position: TextEllipsisPosition,
	ellipsis: string
): { truncated: string; isTruncated: boolean } {
	if (!text) {
		return { truncated: text, isTruncated: false };
	}

	const prepared = prepareWithSegments(text, font);

	if (fitsInSingleLine(prepared, maxWidth)) {
		return { truncated: text, isTruncated: false };
	}

	const ellipsisPrepared = prepareWithSegments(ellipsis, font);
	const ellipsisWidth = Math.ceil(measureNaturalWidth(ellipsisPrepared));

	if (ellipsisWidth >= maxWidth) {
		return { truncated: ellipsis, isTruncated: true };
	}

	// Use floor and subtract safety margin for canvas vs browser rendering differences
	const targetWidth = Math.floor(maxWidth - ellipsisWidth) - 2;

	if (position === 'end') {
		// layoutNextLine at targetWidth gives the maximum prefix at grapheme granularity
		// (word boundaries first, then grapheme boundaries via overflow-wrap: break-word)
		const line = layoutNextLine(prepared, START_CURSOR, targetWidth);
		if (line === null) {
			return { truncated: ellipsis, isTruncated: true };
		}
		return { truncated: line.text.trimEnd() + ellipsis, isTruncated: true };
	}

	if (position === 'start') {
		// Find the longest suffix that fits
		const suffix = getMaxSuffix(text, targetWidth, font);
		if (!suffix) {
			return { truncated: ellipsis, isTruncated: true };
		}
		return { truncated: ellipsis + suffix, isTruncated: true };
	}

	// center: smart split maximizing visible content without overlap
	// Strategy: try different cut points and pick the one showing most characters
	// Cut points are at word boundaries when possible, falling back to character positions

	// Find all potential cut points (word boundaries + some character positions)
	const cutPoints: number[] = [];

	// Add word boundary positions
	let pos = 0;
	for (const match of text.matchAll(/\s+/g)) {
		// Position after the word (before whitespace)
		if (match.index !== undefined && match.index > 0) {
			cutPoints.push(match.index);
		}
		// Position after whitespace (start of next word)
		pos = (match.index ?? 0) + match[0].length;
		if (pos < text.length) {
			cutPoints.push(pos);
		}
	}

	// If no word boundaries (single word), add character positions at intervals
	if (cutPoints.length === 0) {
		const step = Math.max(1, Math.floor(text.length / 10));
		for (let i = step; i < text.length; i += step) {
			cutPoints.push(i);
		}
	}

	// Ensure we try positions near the middle too
	const mid = Math.floor(text.length / 2);
	if (!cutPoints.includes(mid)) {
		cutPoints.push(mid);
	}

	// Sort and dedupe
	const uniqueCutPoints = [...new Set(cutPoints)].sort((a, b) => a - b);

	let bestResult = { prefix: '', suffix: '', totalLength: 0, wastedSpace: Infinity };

	for (const cutPoint of uniqueCutPoints) {
		const prefixText = text.slice(0, cutPoint).trimEnd();
		const suffixText = text.slice(cutPoint).trimStart();

		if (!prefixText || !suffixText) continue;

		const prefixPrepared = prepareWithSegments(prefixText, font);

		// Get what fits from prefix (from start)
		const prefixLine = layoutNextLine(prefixPrepared, START_CURSOR, targetWidth);
		const shownPrefix = prefixLine?.text.trimEnd() ?? '';
		// Use ceil for measured widths to be conservative
		const prefixWidth = Math.ceil(measureNaturalWidth(prepareWithSegments(shownPrefix, font)));

		// Use floor for remaining width to be conservative
		const remainingWidth = Math.floor(targetWidth - prefixWidth);
		if (remainingWidth <= 0) continue;

		const shownSuffix = getMaxSuffix(suffixText, remainingWidth, font);
		const suffixWidth = Math.ceil(measureNaturalWidth(prepareWithSegments(shownSuffix, font)));

		if (prefixWidth + suffixWidth > targetWidth) continue;

		const totalLength = shownPrefix.length + shownSuffix.length;
		const wastedSpace = targetWidth - prefixWidth - suffixWidth;

		// Prefer more content, then less wasted space
		if (
			totalLength > bestResult.totalLength ||
			(totalLength === bestResult.totalLength && wastedSpace < bestResult.wastedSpace)
		) {
			bestResult = { prefix: shownPrefix, suffix: shownSuffix, totalLength, wastedSpace };
		}
	}

	// Fallback if no good cut point found
	if (bestResult.totalLength === 0) {
		const halfWidth = Math.floor(targetWidth / 2);
		const prefixLine = layoutNextLine(prepared, START_CURSOR, halfWidth);
		const prefix = prefixLine?.text.trimEnd() ?? '';
		const prefixWidth = Math.ceil(measureNaturalWidth(prepareWithSegments(prefix, font)));
		const remainingText = text.slice(prefix.length).trimStart();
		const suffix = getMaxSuffix(remainingText, Math.floor(targetWidth - prefixWidth), font);
		return { truncated: prefix + ellipsis + suffix, isTruncated: true };
	}

	return {
		truncated: bestResult.prefix + ellipsis + bestResult.suffix,
		isTruncated: true,
	};
}

/**
 * Hook to track element width using ResizeObserver.
 * More performant than MutationObserver for size changes.
 *
 * @example
 * ```tsx
 * const { ref, width } = useTextEllipsisWidth();
 *
 * return (
 *   <div ref={ref} style={{ width: '100%' }}>
 *     <TextEllipsis width={width}>Long text here</TextEllipsis>
 *   </div>
 * );
 * ```
 */
export function useTextEllipsisWidth<T extends HTMLElement = HTMLElement>(): {
	ref: RefObject<T | null>;
	width: number;
} {
	const ref = useRef<T>(null);
	const [width, setWidth] = useState(0);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;

		setWidth(element.clientWidth);

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.contentBoxSize) {
					const contentBoxSize = Array.isArray(entry.contentBoxSize)
						? entry.contentBoxSize[0]
						: entry.contentBoxSize;
					setWidth(contentBoxSize.inlineSize);
				} else {
					setWidth(entry.contentRect.width);
				}
			}
		});

		observer.observe(element);

		return () => observer.disconnect();
	}, []);

	return { ref, width };
}

/**
 * A text component that truncates content with ellipsis at start, center, or end.
 * Uses pretext for accurate text measurement without DOM reflows.
 *
 * @example
 * ```tsx
 * <TextEllipsis>This is a very long text that will be truncated</TextEllipsis>
 * <TextEllipsis position="start">path/to/very/long/filename.txt</TextEllipsis>
 * <TextEllipsis position="end">A long description here</TextEllipsis>
 * ```
 */
export function TextEllipsis({
	children,
	position = 'center',
	ellipsis = '...',
	width: externalWidth,
	className,
	title,
}: TextEllipsisProps) {
	const containerRef = useRef<HTMLSpanElement>(null);
	const [internalWidth, setInternalWidth] = useState(0);
	const [font, setFont] = useState('');

	const width = externalWidth ?? internalWidth;

	useLayoutEffect(() => {
		const element = containerRef.current;
		if (!element) return;

		setFont(getComputedFont(element));

		if (externalWidth !== undefined) return;

		setInternalWidth(element.clientWidth);

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.contentBoxSize) {
					const contentBoxSize = Array.isArray(entry.contentBoxSize)
						? entry.contentBoxSize[0]
						: entry.contentBoxSize;
					setInternalWidth(contentBoxSize.inlineSize);
				} else {
					setInternalWidth(entry.contentRect.width);
				}
			}
		});

		observer.observe(element);

		return () => observer.disconnect();
	}, [externalWidth]);

	const { truncated, isTruncated } = useMemo(() => {
		if (!font || width <= 0) {
			return { truncated: children, isTruncated: false };
		}

		return truncateText(children, Math.floor(width), font, position, ellipsis);
	}, [children, width, font, position, ellipsis]);

	return (
		<span
			ref={containerRef}
			className={cn(styles.textEllipsis, className)}
			title={isTruncated ? (title ?? children) : title}
			data-truncated={isTruncated}
		>
			{truncated}
		</span>
	);
}
