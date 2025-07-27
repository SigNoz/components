import type { IUpdateCodeHTML } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function updateCodeHTML({
	codeInHTML,
	showLineNumbers,
	addedLines,
	removedLines,
	warningLines,
	highlightedLines,
}: IUpdateCodeHTML): string {
	const domparser = new DOMParser();

	if (!domparser) {
		return codeInHTML;
	}

	const doc = domparser.parseFromString(codeInHTML, 'text/html');
	// Select all .line spans
	const lines = doc.querySelectorAll('span.line');

	// Inject line numbers
	lines.forEach((line, index) => {
		const lineNo = index + 1;
		if (highlightedLines && highlightedLines.includes(lineNo)) {
			line.setAttribute('data-highlighted', 'true');
		} else if (addedLines && addedLines.includes(lineNo)) {
			line.setAttribute('data-added', 'true');
		} else if (removedLines && removedLines.includes(lineNo)) {
			line.setAttribute('data-removed', 'true');
		} else if (warningLines && warningLines.includes(lineNo)) {
			line.setAttribute('data-warning', 'true');
		}
		if (showLineNumbers) {
			const lineNumberSpan = doc.createElement('span');
			lineNumberSpan.setAttribute('class', 'line-number');
			lineNumberSpan.textContent = lineNo.toString().padStart(3, ' ') + ' ';

			// Prepend line number to each line span
			line.prepend(lineNumberSpan);
		}
	});
	return doc.body.innerHTML;
}
