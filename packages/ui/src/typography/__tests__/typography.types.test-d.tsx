/**
 * Type-level tests for the props of {@link Typography} and `Typography.Link`.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Each `@ts-expect-error` suppresses the line directly below it, which is why it sits inside
 * `assertType(...)` right above the opening `<Typography` tag. Keep every prop on that opening tag
 * line: once oxfmt breaks the props one per line, a prop-level error moves off the tag line and the
 * comment stops covering it. The style props come from a spread so the tag fits on one line.
 */
import { createElement, createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Typography } from '../typography.js';

const body = { variant: 'paragraph', size: 'base', weight: 'regular', color: 'main' } as const;
const font = { variant: 'label', size: 'base', weight: 'medium' } as const;
const textRef = createRef<HTMLElement>();
const noop = (): void => {};
const anchor = createElement('a', { href: '/docs' });

describe('required props', () => {
	test('accepts a text that states its style, color, element and overflow', () => {
		assertType(
			<Typography {...body} as="p" textOverflow="wrap" ref={textRef}>
				text
			</Typography>,
		);
	});

	test('rejects a text without a variant', () => {
		assertType(
			// @ts-expect-error - `variant` has no default
			<Typography size="base" weight="regular" color="main" as="p" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects a text without a weight', () => {
		assertType(
			// @ts-expect-error - `weight` has no default
			<Typography variant="label" size="base" color="main" as="p" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects a text without a color', () => {
		assertType(
			// @ts-expect-error - `color` has no default, `inherit` follows the parent
			<Typography {...font} as="p" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects a text without an element', () => {
		assertType(
			// @ts-expect-error - `as` has no default
			<Typography {...body} textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects a text without an overflow', () => {
		assertType(
			// @ts-expect-error - `textOverflow` has no default
			<Typography {...body} as="p">
				text
			</Typography>,
		);
	});
});

describe('variant and size', () => {
	test('label has every step', () => {
		assertType(
			<Typography {...font} color="main" as="span" textOverflow="visible">
				text
			</Typography>,
		);
		assertType(
			<Typography {...font} size="large" color="main" as="h1" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('paragraph, uppercase and code accept their steps', () => {
		assertType(
			<Typography {...body} size="medium" as="p" textOverflow="wrap">
				text
			</Typography>,
		);
		assertType(
			<Typography {...body} variant="uppercase" size="small" as="p" textOverflow="wrap">
				text
			</Typography>,
		);
		assertType(
			<Typography {...body} variant="code" size="base" as="code" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects large on a paragraph', () => {
		assertType(
			// @ts-expect-error - `paragraph` stops at `medium`
			<Typography {...body} size="large" as="p" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects medium on code', () => {
		assertType(
			// @ts-expect-error - `code` has `small` and `base` only
			<Typography {...body} variant="code" size="medium" as="code" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects the sizes of the old scale', () => {
		assertType(
			// @ts-expect-error - `sm` is `small` on the type scale
			<Typography {...body} size="sm" as="p" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects the weights of the old scale', () => {
		assertType(
			// @ts-expect-error - `semibold` is `bold`, 600
			<Typography {...body} weight="semibold" as="p" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects the old colors', () => {
		assertType(
			// @ts-expect-error - `muted` is `secondary`
			<Typography {...body} color="muted" as="p" textOverflow="wrap">
				text
			</Typography>,
		);
	});
});

describe('box props', () => {
	test('a block element takes them without display', () => {
		assertType(
			<Typography {...body} as="p" textOverflow="ellipsis" width={240} maxWidth="50%">
				text
			</Typography>,
		);
		assertType(
			<Typography {...body} as="div" textOverflow="hidden" align="center" marginY={4}>
				text
			</Typography>,
		);
	});

	test('an inline element takes them with a block, inline-block or flex display', () => {
		assertType(
			<Typography {...body} as="span" display="block" textOverflow="ellipsis" minWidth={0}>
				text
			</Typography>,
		);
		assertType(
			<Typography {...body} as="span" display="inline-block" textOverflow="ellipsis" maxWidth={120}>
				text
			</Typography>,
		);
		assertType(
			<Typography {...body} as="label" display="inline-block" textOverflow="wrap" marginX={2}>
				text
			</Typography>,
		);
		assertType(
			<Typography {...body} as="span" display="inline-flex" textOverflow="wrap" padding={4}>
				text
			</Typography>,
		);
	});

	test('the margin and padding props take steps of the spacing scale, per side', () => {
		assertType(
			<Typography {...body} as="p" textOverflow="wrap" margin={2} marginBottom={6} paddingX={4}>
				text
			</Typography>,
		);
		assertType(
			<Typography {...body} as="div" display="flex" textOverflow="wrap" marginLeft="auto">
				text
			</Typography>,
		);
	});

	test('rejects a length on margin', () => {
		assertType(
			// @ts-expect-error - a margin is a step of the spacing scale
			<Typography {...body} as="p" textOverflow="wrap" margin="8px 0">
				text
			</Typography>,
		);
	});

	test('rejects a number off the scale on padding', () => {
		assertType(
			// @ts-expect-error - the scale has no step 9
			<Typography {...body} as="p" textOverflow="wrap" paddingTop={9}>
				text
			</Typography>,
		);
	});

	test('rejects auto on padding', () => {
		assertType(
			// @ts-expect-error - only a margin takes the free space
			<Typography {...body} as="p" textOverflow="wrap" paddingX="auto">
				text
			</Typography>,
		);
	});

	test('rejects a side margin on an inline element', () => {
		assertType(
			// @ts-expect-error - a span is inline, set `display` first
			<Typography {...body} as="span" textOverflow="wrap" marginBottom={2}>
				text
			</Typography>,
		);
	});

	test('rejects width on an inline element', () => {
		assertType(
			// @ts-expect-error - a span is inline, set `display` first
			<Typography {...body} as="span" textOverflow="wrap" width={240}>
				text
			</Typography>,
		);
	});

	test('rejects align on an inline element', () => {
		assertType(
			// @ts-expect-error - an inline element has no lines to align
			<Typography {...body} as="label" textOverflow="wrap" align="center">
				text
			</Typography>,
		);
	});

	test('rejects margin on an inline element', () => {
		assertType(
			// @ts-expect-error - vertical margin does nothing on an inline element
			<Typography {...body} as="code" textOverflow="wrap" margin={8}>
				text
			</Typography>,
		);
	});

	test('rejects padding on display inline', () => {
		assertType(
			// @ts-expect-error - `display="inline"` has no box, even on a block element
			<Typography {...body} as="p" display="inline" textOverflow="wrap" padding={8}>
				text
			</Typography>,
		);
	});

	test('rejects an ellipsis on an inline element', () => {
		assertType(
			// @ts-expect-error - an inline element has no edge to cut at
			<Typography {...body} as="span" textOverflow="ellipsis">
				text
			</Typography>,
		);
	});

	test('rejects hidden on an inline element', () => {
		assertType(
			// @ts-expect-error - an inline element has no edge to cut at
			<Typography {...body} as="span" textOverflow="hidden">
				text
			</Typography>,
		);
	});
});

describe('flex props', () => {
	test('a flex text takes gap and verticalAlign', () => {
		assertType(
			<Typography {...body} as="div" display="flex" gap={4} verticalAlign="end" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('rejects a length on gap', () => {
		assertType(
			// @ts-expect-error - a gap is a step of the spacing scale
			<Typography {...body} as="div" display="flex" textOverflow="wrap" gap="4px">
				text
			</Typography>,
		);
	});

	test('rejects gap on a block', () => {
		assertType(
			// @ts-expect-error - only a flex text has children to space
			<Typography {...body} as="div" textOverflow="wrap" gap={4}>
				text
			</Typography>,
		);
	});

	test('rejects verticalAlign on a block', () => {
		assertType(
			// @ts-expect-error - only a flex text aligns its children
			<Typography {...body} as="div" textOverflow="wrap" verticalAlign="center">
				text
			</Typography>,
		);
	});

	test('rejects gap on an inline-block', () => {
		assertType(
			// @ts-expect-error - an inline-block has a box, not a row of children
			<Typography {...body} as="span" display="inline-block" textOverflow="wrap" gap={2}>
				text
			</Typography>,
		);
	});
});

describe('maxLines', () => {
	test('is accepted with an ellipsis', () => {
		assertType(
			<Typography {...body} as="p" textOverflow="ellipsis" maxLines={2}>
				text
			</Typography>,
		);
	});

	test('is rejected without an ellipsis', () => {
		assertType(
			// @ts-expect-error - only an ellipsis counts lines
			<Typography {...body} as="p" textOverflow="wrap" maxLines={2}>
				text
			</Typography>,
		);
	});

	test('is accepted at 1 on a text that is not a paragraph', () => {
		assertType(
			<Typography {...font} color="main" as="p" textOverflow="ellipsis" maxLines={1}>
				text
			</Typography>,
		);
	});

	test('is rejected past 1 on a text that is not a paragraph', () => {
		assertType(
			// @ts-expect-error - only a paragraph wraps past one line
			<Typography {...font} color="main" as="p" textOverflow="ellipsis" maxLines={2}>
				text
			</Typography>,
		);
	});
});

describe('htmlFor', () => {
	test('is accepted on a label', () => {
		assertType(
			<Typography {...body} as="label" htmlFor="name" textOverflow="wrap">
				text
			</Typography>,
		);
	});

	test('is rejected on another element', () => {
		assertType(
			// @ts-expect-error - only a label names a control
			<Typography {...body} as="span" htmlFor="name" textOverflow="wrap">
				text
			</Typography>,
		);
	});
});

describe('rejected props', () => {
	test('rejects className', () => {
		assertType(
			// @ts-expect-error - the font and the layout come from props
			<Typography {...body} as="p" textOverflow="wrap" className="title">
				text
			</Typography>,
		);
	});

	test('rejects style', () => {
		assertType(
			// @ts-expect-error - the font and the layout come from props
			<Typography {...body} as="p" textOverflow="wrap" style={{ color: 'red' }}>
				text
			</Typography>,
		);
	});

	test('rejects onClick', () => {
		assertType(
			// @ts-expect-error - clickable text is a `Typography.Link` or a link `Button`
			<Typography {...body} as="p" textOverflow="wrap" onClick={noop}>
				text
			</Typography>,
		);
	});

	test('rejects href', () => {
		assertType(
			// @ts-expect-error - a link is `Typography.Link`
			<Typography {...body} as="p" textOverflow="wrap" href="/docs">
				text
			</Typography>,
		);
	});

	test('rejects level', () => {
		assertType(
			// @ts-expect-error - the heading is `as`, the look is `size` and `weight`
			<Typography {...body} as="h2" textOverflow="wrap" level={2}>
				text
			</Typography>,
		);
	});

	test('rejects truncate', () => {
		assertType(
			// @ts-expect-error - `truncate` is `textOverflow="ellipsis"` with `maxLines`
			<Typography {...body} as="p" textOverflow="wrap" truncate={1}>
				text
			</Typography>,
		);
	});

	test('rejects strong', () => {
		assertType(
			// @ts-expect-error - `strong` is `weight="bold"`
			<Typography {...body} as="p" textOverflow="wrap" strong>
				text
			</Typography>,
		);
	});

	test('rejects italic', () => {
		assertType(
			// @ts-expect-error - none of the text styles is italic
			<Typography {...body} as="p" textOverflow="wrap" italic>
				text
			</Typography>,
		);
	});

	test('rejects title', () => {
		assertType(
			// @ts-expect-error - a tooltip is a `Tooltip`, or the one of an ellipsis
			<Typography {...body} as="p" textOverflow="wrap" title="Text">
				text
			</Typography>,
		);
	});
});

describe('Typography.Link', () => {
	test('accepts the style props and a destination', () => {
		assertType(
			<Typography.Link {...font} textOverflow="visible" href="/docs">
				text
			</Typography.Link>,
		);
		assertType(
			<Typography.Link {...font} textOverflow="wrap" render={anchor}>
				text
			</Typography.Link>,
		);
	});

	test('takes the number features', () => {
		assertType(
			<Typography.Link {...font} textOverflow="visible" href="/x" tabularNumbers slashedZero>
				4f0a-27b0
			</Typography.Link>,
		);
	});

	test('takes the box props with a block, inline-block or flex display', () => {
		assertType(
			<Typography.Link {...font} display="block" textOverflow="ellipsis" maxWidth={200} href="/">
				text
			</Typography.Link>,
		);
		assertType(
			<Typography.Link {...font} display="inline-block" textOverflow="wrap" paddingX={2} href="/">
				text
			</Typography.Link>,
		);
		assertType(
			<Typography.Link {...font} display="inline-flex" gap={4} textOverflow="wrap" href="/">
				text
			</Typography.Link>,
		);
	});

	test('rejects width on an inline link', () => {
		assertType(
			// @ts-expect-error - a link is inline, set `display` first
			<Typography.Link {...font} textOverflow="wrap" width={200} href="/">
				text
			</Typography.Link>,
		);
	});

	test('rejects color', () => {
		assertType(
			// @ts-expect-error - a link has one color
			<Typography.Link {...font} color="danger" textOverflow="wrap" href="/">
				text
			</Typography.Link>,
		);
	});

	test('rejects as', () => {
		assertType(
			// @ts-expect-error - a link renders the `render` element
			<Typography.Link {...font} as="span" textOverflow="wrap" href="/">
				text
			</Typography.Link>,
		);
	});

	test('rejects className', () => {
		assertType(
			// @ts-expect-error - the font and the layout come from props
			<Typography.Link {...font} textOverflow="wrap" href="/" className="x">
				text
			</Typography.Link>,
		);
	});
});
