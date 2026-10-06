/**
 * Type-level tests for the props of {@link Divider}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Each `@ts-expect-error` suppresses the line directly below it, which is why it sits inside
 * `assertType(...)` right above the opening `<Divider` tag. Keep every prop on that opening tag line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Divider } from '../divider.js';

const dividerRef = createRef<HTMLDivElement>();

describe('orientation', () => {
	test('is optional', () => {
		assertType(<Divider />);
	});

	test('accepts horizontal and vertical', () => {
		assertType(<Divider orientation="horizontal" />);
		assertType(<Divider orientation="vertical" />);
	});

	test('rejects a value outside the two', () => {
		// @ts-expect-error - `left` is a label position, and the label is always centred
		assertType(<Divider orientation="left" />);
	});
});

describe('children', () => {
	test('is accepted on a horizontal divider', () => {
		assertType(<Divider>OR</Divider>);
		assertType(<Divider orientation="horizontal">OR</Divider>);
	});

	test('is rejected on a vertical divider', () => {
		// @ts-expect-error - only a horizontal divider has a label
		assertType(<Divider orientation="vertical">OR</Divider>);
	});
});

describe('length and spacing', () => {
	test('a horizontal divider takes width, maxWidth and spacing', () => {
		assertType(<Divider width={240} maxWidth="50%" spacing={16} />);
		assertType(<Divider spacing="10px 16px">OR</Divider>);
	});

	test('a vertical divider takes height, maxHeight and spacing', () => {
		assertType(<Divider orientation="vertical" height="100%" maxHeight={24} spacing={0} />);
	});

	test('rejects height on a horizontal divider', () => {
		// @ts-expect-error - a horizontal divider takes `width` for its length
		assertType(<Divider height={16} />);
	});

	test('rejects maxHeight on a horizontal divider', () => {
		// @ts-expect-error - a horizontal divider takes `maxWidth` for its length
		assertType(<Divider maxHeight={16} />);
	});

	test('rejects width on a vertical divider', () => {
		// @ts-expect-error - a vertical divider takes `height` for its length
		assertType(<Divider orientation="vertical" width={16} />);
	});

	test('rejects maxWidth on a vertical divider', () => {
		// @ts-expect-error - a vertical divider takes `height` for its length
		assertType(<Divider orientation="vertical" maxWidth={16} />);
	});
});

describe('accepted props', () => {
	test('accepts every prop it declares, aria and data attributes', () => {
		assertType(
			<Divider
				orientation="vertical"
				dashed
				height={16}
				spacing={0}
				testId="divider"
				id="divider"
				aria-hidden
				data-row="toolbar"
				ref={dividerRef}
			/>,
		);
	});
});

describe('rejected props', () => {
	test('rejects className, length and spacing have their own props', () => {
		// @ts-expect-error - use `spacing` for the margin, `width` or `height` for the length
		assertType(<Divider className="divider" />);
	});

	test('rejects style, length and spacing have their own props', () => {
		// @ts-expect-error - use `spacing` for the margin, `width` or `height` for the length
		assertType(<Divider style={{ marginBlock: 16 }} />);
	});

	test('rejects type, replaced by orientation', () => {
		// @ts-expect-error - `type="vertical"` is written `orientation="vertical"`
		assertType(<Divider type="vertical" />);
	});

	test('rejects plain, the label is styled with Typography', () => {
		// @ts-expect-error - wrap the label in Typography to set its weight
		assertType(<Divider plain>OR</Divider>);
	});

	test('rejects orientationMargin, the label is always centred', () => {
		// @ts-expect-error - the label is always centred
		assertType(<Divider orientationMargin={8}>OR</Divider>);
	});

	test('rejects color, every divider has the same color', () => {
		// @ts-expect-error - the color is not a choice of the call site
		assertType(<Divider color="red" />);
	});

	test('rejects onClick, the divider has no events', () => {
		// @ts-expect-error - the divider is informational only
		assertType(<Divider onClick={() => {}} />);
	});
});
