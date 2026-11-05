import { render } from '@testing-library/react';
import type * as React from 'react';
import type * as JsxDevRuntime from 'react/jsx-dev-runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import { TRAIL } from './breadcrumb.test-utils.js';

const crumbProps = vi.hoisted(() => [] as Record<string, unknown>[]);

vi.mock('react', async (importOriginal) => ({
	...(await importOriginal<typeof React>()),
	version: '19.0.0',
}));

// The props a crumb hands to React DOM, read before React DOM turns them into attributes.
vi.mock('react/jsx-dev-runtime', async (importOriginal) => {
	const actual = await importOriginal<typeof JsxDevRuntime>();

	return {
		...actual,
		jsxDEV: (type: unknown, props: Record<string, unknown>, ...rest: unknown[]) => {
			if (type === 'li' && props['data-slot'] === 'breadcrumb-item') {
				crumbProps.push(props);
			}

			return (actual.jsxDEV as (...args: unknown[]) => unknown)(type, props, ...rest);
		},
	};
});

afterEach(() => {
	crumbProps.length = 0;
	vi.restoreAllMocks();
});

describe('Breadcrumb collapsed crumbs on React 19', () => {
	it('pass `inert` as `true`, since React 19 reads the empty string as `false`', () => {
		// The installed React DOM is 18, which drops a boolean `inert` with a warning. Only the props
		// the crumbs hand over are asserted, so the warning is not.
		vi.spyOn(console, 'error').mockImplementation(() => {});

		render(<Breadcrumb items={TRAIL} maxVisible={3} />);

		const collapsed = crumbProps.filter((props) => props['data-collapsed'] === true);
		const visible = crumbProps.filter((props) => props['data-collapsed'] === undefined);

		expect(collapsed).toHaveLength(2);
		for (const props of collapsed) {
			expect(props['inert']).toBe(true);
			expect(props['aria-hidden']).toBe(true);
		}
		for (const props of visible) {
			expect(props).not.toHaveProperty('inert');
		}
	});
});
