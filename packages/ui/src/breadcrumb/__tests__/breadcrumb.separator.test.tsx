import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbItemType } from '../types.js';

const ITEMS: BreadcrumbItemType[] = [
	{ title: 'Home', href: '/' },
	{ title: 'Services', href: '/services' },
	{ title: 'Checkout', href: '/services/checkout' },
	{ title: 'Overview' },
];

/**
 * A `string`, which the type that rejects the literal `'chevron'` cannot see. It is what a value
 * read from a config, a prop or a plain JavaScript call site looks like.
 */
const CHEVRON: string = 'chevron';

let warn: MockInstance<typeof console.warn>;

beforeEach(() => {
	warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Breadcrumb chevron separator', () => {
	it('warns that `chevron` prints the word, and still prints it', () => {
		render(<Breadcrumb items={ITEMS} separator={CHEVRON} testId="bc" />);

		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('`chevron`'));
		expect(screen.getByTestId('bc-item-separator-1')).toHaveTextContent('chevron');
	});

	it('warns once for the trail, not once for each separator', () => {
		render(<Breadcrumb items={ITEMS} separator={CHEVRON} testId="bc" />);

		expect(document.querySelectorAll('[data-slot="breadcrumb-separator"]')).toHaveLength(3);
		expect(warn).toHaveBeenCalledTimes(1);
	});

	it('warns again only when the separator changes to `chevron`', () => {
		const { rerender } = render(<Breadcrumb items={ITEMS} separator={CHEVRON} />);
		expect(warn).toHaveBeenCalledTimes(1);

		rerender(<Breadcrumb items={[...ITEMS]} separator={CHEVRON} />);
		expect(warn).toHaveBeenCalledTimes(1);

		rerender(<Breadcrumb items={ITEMS} separator="›" />);
		expect(warn).toHaveBeenCalledTimes(1);

		rerender(<Breadcrumb items={ITEMS} separator={CHEVRON} />);
		expect(warn).toHaveBeenCalledTimes(2);
	});

	it.each([undefined, '/', '›', 'chevron-right', 'Chevron'])(
		'stays quiet for the separator %s',
		(separator) => {
			render(<Breadcrumb items={ITEMS} separator={separator} />);

			expect(warn).not.toHaveBeenCalled();
		},
	);
});
