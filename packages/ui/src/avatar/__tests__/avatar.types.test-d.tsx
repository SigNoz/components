/**
 * Type-level tests for the props of {@link Avatar}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse that prop. TypeScript reports an
 * unused `@ts-expect-error` as an error of its own, so loosening a constraint by accident fails the
 * build instead of passing silently.
 *
 * The comment suppresses the line directly below it, which is why it sits inside `assertType(...)`
 * right above the opening `<Avatar` tag. Keep every prop on that opening tag line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Avatar } from '../avatar.js';

const avatarRef = createRef<HTMLSpanElement>();

const noop = (): void => undefined;

// Props held in a variable and spread skip the excess property check a literal attribute gets, so
// these catch a rejected prop that reaches the avatar through a spread.
const classNameSpread = {
	name: 'Alex Example',
	size: 'md',
	color: 'primary',
	className: 'avatar',
} as const;
const styleSpread = {
	name: 'Alex Example',
	size: 'md',
	color: 'primary',
	style: { width: 40 },
} as const;
const unknownColorSpread = { name: 'Alex Example', size: 'md', color: 'robin' } as const;
const clickSpread = {
	name: 'Alex Example',
	size: 'md',
	color: 'primary',
	onClick: () => undefined,
} as const;
const declaredSpread = {
	name: 'Alex Example',
	size: 'md',
	color: 'primary',
	src: '/alex.png',
	'data-row': 'first',
} as const;

describe('Avatar accepted props', () => {
	test('needs a name, a size and a color', () => {
		assertType(<Avatar color="primary" name="Alex Example" size="md" />);
	});

	test('accepts every prop it declares, aria and data attributes', () => {
		assertType(
			<Avatar
				color="primary"
				name="Alex Example"
				src="/alex.png"
				size="sm"
				shape="square"
				testId="avatar"
				id="avatar"
				aria-hidden="true"
				aria-describedby="hint"
				data-row="host-1"
				ref={avatarRef}
			/>,
		);
	});

	test('accepts both sizes and both shapes', () => {
		assertType(<Avatar color="primary" name="Alex Example" size="sm" />);
		assertType(<Avatar color="primary" name="Alex Example" size="md" />);
		assertType(<Avatar color="primary" name="Alex Example" size="md" shape="circle" />);
		assertType(<Avatar color="primary" name="Alex Example" size="md" shape="square" />);
	});

	test('accepts every color', () => {
		assertType(<Avatar color="primary" name="Alex Example" size="md" />);
		assertType(<Avatar color="secondary" name="Alex Example" size="md" />);
		assertType(<Avatar color="danger" name="Alex Example" size="md" />);
		assertType(<Avatar color="warning" name="Alex Example" size="md" />);
		assertType(<Avatar color="success" name="Alex Example" size="md" />);
		assertType(<Avatar color="info" name="Alex Example" size="md" />);
		assertType(<Avatar color="archive" name="Alex Example" size="md" />);
		assertType(<Avatar color="highlight-danger" name="Alex Example" size="md" />);
	});

	test('accepts an empty name, it renders the generic icon', () => {
		assertType(<Avatar color="primary" name="" size="md" />);
	});

	test('accepts a spread of the props it declares', () => {
		assertType(<Avatar {...declaredSpread} />);
	});
});

describe('Avatar required props', () => {
	test('rejects a missing name', () => {
		// @ts-expect-error - `name` is the accessible name and the source of the initials
		assertType(<Avatar color="primary" size="md" />);
	});

	test('rejects a missing size', () => {
		// @ts-expect-error - `size` has no default
		assertType(<Avatar color="primary" name="Alex Example" />);
	});

	test('rejects a missing color', () => {
		// @ts-expect-error - `color` has no default
		assertType(<Avatar name="Alex Example" size="md" />);
	});

	test('rejects a name that is not a string', () => {
		// @ts-expect-error - `name` is a string
		assertType(<Avatar color="primary" name={42} size="md" />);
	});

	test('rejects a src that is not a string', () => {
		// @ts-expect-error - `src` is a URL
		assertType(<Avatar color="primary" name="Alex Example" size="md" src={42} />);
	});
});

describe('Avatar size and shape', () => {
	test('rejects lg, there is no size above md', () => {
		// @ts-expect-error - `size` is `sm` or `md`
		assertType(<Avatar color="primary" name="Alex Example" size="lg" />);
	});

	test('rejects xl, there is no size above md', () => {
		// @ts-expect-error - `size` is `sm` or `md`
		assertType(<Avatar color="primary" name="Alex Example" size="xl" />);
	});

	test('rejects a size in pixels', () => {
		// @ts-expect-error - `size` is `sm` or `md`
		assertType(<Avatar color="primary" name="Alex Example" size={40} />);
	});

	test('rejects a shape outside circle and square', () => {
		// @ts-expect-error - `shape` is `circle` or `square`
		assertType(<Avatar color="primary" name="Alex Example" size="md" shape="rounded" />);
	});
});

describe('Avatar color', () => {
	test('rejects a color outside the palette', () => {
		// @ts-expect-error - `color` is one of the eight colors of the palette
		assertType(<Avatar color="robin" name="Alex Example" size="md" />);
	});

	test('rejects a color that is not a string', () => {
		// @ts-expect-error - `color` is one of the eight colors of the palette
		assertType(<Avatar color={42} name="Alex Example" size="md" />);
	});
});

describe('Avatar rejected props', () => {
	test('rejects className, the size comes from size', () => {
		// @ts-expect-error - `Avatar` takes no `className`
		assertType(<Avatar color="primary" name="Alex Example" size="md" className="avatar" />);
	});

	test('rejects style, the size comes from size', () => {
		// @ts-expect-error - `Avatar` takes no `style`
		assertType(<Avatar color="primary" name="Alex Example" size="md" style={{ width: 40 }} />);
	});

	test('rejects alt, it is name', () => {
		// @ts-expect-error - `alt` is `name`
		assertType(<Avatar color="primary" name="Alex Example" size="md" alt="Alex Example" />);
	});

	test('rejects children, the initials come from name', () => {
		// @ts-expect-error - the initials come from `name`
		assertType(<Avatar color="primary" name="Alex Example" size="md" children="AE" />);
	});

	test('rejects children written between the tags', () => {
		assertType(
			// @ts-expect-error - the initials come from `name`
			<Avatar color="primary" name="Alex Example" size="md">
				AE
			</Avatar>,
		);
	});

	test('rejects loading, it is Skeleton.Avatar', () => {
		// @ts-expect-error - render `Skeleton.Avatar` while the person loads
		assertType(<Avatar color="primary" name="Alex Example" size="md" loading />);
	});

	test('rejects onClick, the avatar is display only', () => {
		// @ts-expect-error - wrap the avatar in a `Button` or a menu trigger
		assertType(<Avatar color="primary" name="Alex Example" size="md" onClick={noop} />);
	});

	test('rejects the props of the native elements it does not forward', () => {
		// @ts-expect-error - the avatar is not focusable
		assertType(<Avatar color="primary" name="Alex Example" size="md" tabIndex={0} />);
		// @ts-expect-error - the root is always an image
		assertType(<Avatar color="primary" name="Alex Example" size="md" role="presentation" />);
		// @ts-expect-error - the avatar reacts to no pointer event
		assertType(<Avatar color="primary" name="Alex Example" size="md" onMouseEnter={noop} />);
		// @ts-expect-error - the avatar has no tooltip
		assertType(<Avatar color="primary" name="Alex Example" size="md" title="Alex Example" />);
	});
});

describe('Avatar spread props', () => {
	test('rejects a className spread', () => {
		// @ts-expect-error - a spread is checked like written props, `className` is not one
		assertType(<Avatar {...classNameSpread} />);
	});

	test('rejects a style spread', () => {
		// @ts-expect-error - a spread is checked like written props, `style` is not one
		assertType(<Avatar {...styleSpread} />);
	});

	test('rejects a spread with a color outside the palette', () => {
		// @ts-expect-error - a spread is checked like written props, `robin` is not a color
		assertType(<Avatar {...unknownColorSpread} />);
	});

	test('rejects an onClick spread', () => {
		// @ts-expect-error - a spread is checked like written props, `onClick` is not one
		assertType(<Avatar {...clickSpread} />);
	});
});
