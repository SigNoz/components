import { Pagination, type PaginationCursorProps } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { paginationArgTypes, paginationParameters } from './shared/pagination-arg-types.js';
import { positionOf } from './shared/pagination-play.js';
import { waitForEffects } from './shared/play.js';

/**
 * The static members of `Pagination`, grouped under `Pagination/Components` in the sidebar. They
 * are documented on the `Pagination` page, `pagination.mdx`, so this file has no docs page of its
 * own.
 */
const meta: Meta<typeof Pagination> = {
	title: 'Composed Components/Pagination/Components',
	component: Pagination,
	tags: ['!autodocs'],
	parameters: paginationParameters,
	argTypes: paginationArgTypes,
};

export default meta;

/**
 * Owns the page, as a consumer does, so a click moves the bar. A `current` set from the Controls
 * panel is only where it starts.
 */
function ControlledCursor({
	current,
	defaultCurrent,
	onPageChange,
	...props
}: PaginationCursorProps): ReactElement {
	const [page, setPage] = useState(current ?? defaultCurrent ?? 1);

	return (
		<Pagination.Cursor
			{...props}
			current={page}
			onPageChange={(next) => {
				setPage(next);
				onPageChange?.(next);
			}}
		/>
	);
}

/**
 * `Pagination.Cursor` is the bar for a list that pages forward without knowing its total. The
 * position label shows the page number, and it always renders the compact controls.
 */
export const Cursor: StoryObj<typeof Pagination.Cursor> = {
	parameters: {
		// `Pagination.Cursor` has no total, no total label and no variant.
		controls: { exclude: ['total', 'showTotalLabel', 'variant'] },
		// Every state it can be driven into is covered by `PaginationShowcase`.
		chromatic: { disableSnapshot: true },
	},
	args: {
		testId: 'cursor',
		hasNextPage: true,
		onPageChange: fn(),
	},
	argTypes: {
		hasNextPage: {
			control: 'boolean',
			description:
				'Required. Whether a page exists after the current one. The consumer knows it from the cursor of the API, or from a full page. Next hides, and keeps its space, while it is `false`.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		showTotal: {
			control: 'boolean',
			description:
				'Renders the position label at the start of the bar, which shows the page number.',
			table: {
				category: 'Content',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		onPageChange: {
			control: false,
			description: 'Called with the new page when the user presses Previous or Next.',
			table: { category: 'Events', type: { summary: '(page: number) => void' } },
		},
	},
	render: (args) => (
		<div className="story-container-full">
			<ControlledCursor key={`${args.current}/${args.defaultCurrent}`} {...args} />
		</div>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await waitForEffects();
		await expect(positionOf(canvas, 'cursor-total')).toBe('Page 1');
		await expect(canvas.queryByRole('button', { name: 'Previous' })).toBeNull();

		await userEvent.click(canvas.getByRole('button', { name: 'Next' }));

		await waitFor(() => expect(positionOf(canvas, 'cursor-total')).toBe('Page 2'));
		await expect(args.onPageChange).toHaveBeenLastCalledWith(2);
		await expect(canvas.getByRole('button', { name: 'Previous' })).toBeVisible();
		await expect(canvas.getByRole('button', { name: 'Next' })).toHaveFocus();
	},
};
