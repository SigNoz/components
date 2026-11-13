import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';
import { Collapse } from '../collapse.js';
import { GROUP_ITEMS } from './collapse.test-utils.js';

const TITLE = 'A title that is far too long to fit in the title row of the collapse section';

afterEach(resetLabelMeasurement);

function renderCollapse(textOverflow?: 'ellipsis' | 'wrap') {
	return render(
		<Collapse
			variant="outlined"
			size="sm"
			testId="c"
			title={TITLE}
			textOverflow={textOverflow}
			defaultExpanded={false}
		>
			Body
		</Collapse>,
	);
}

describe('Collapse title truncation', () => {
	it('marks the title as truncated while the text is cut', () => {
		mockLabelMeasurement('collapse-title');
		truncate();
		renderCollapse();

		expect(screen.getByTestId('c-title')).toHaveAttribute('data-truncated');
	});

	it('keeps the whole title in the DOM while it is cut', () => {
		mockLabelMeasurement('collapse-title');
		truncate();
		renderCollapse();

		expect(screen.getByTestId('c-title')).toHaveTextContent(TITLE);
		expect(screen.getByRole('button', { name: TITLE })).toBeInTheDocument();
	});

	it('does not mark the title while it fits', () => {
		mockLabelMeasurement('collapse-title');
		renderCollapse();

		expect(screen.getByTestId('c-title')).not.toHaveAttribute('data-truncated');
	});

	it('follows the width of the title as it changes', async () => {
		mockLabelMeasurement('collapse-title');
		renderCollapse();

		expect(screen.getByTestId('c-title')).not.toHaveAttribute('data-truncated');

		resize(300, 100);
		await waitFor(() => expect(screen.getByTestId('c-title')).toHaveAttribute('data-truncated'));

		resize(100, 100);
		await waitFor(() =>
			expect(screen.getByTestId('c-title')).not.toHaveAttribute('data-truncated'),
		);
	});

	it('shows the whole title in a tooltip on hover once it is cut', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('collapse-title');
		truncate();
		renderCollapse();

		await user.hover(screen.getByTestId('c-toggle'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('shows the whole title in a tooltip on keyboard focus of the header button', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('collapse-title');
		truncate();
		renderCollapse();

		await user.tab();

		expect(screen.getByRole('button', { name: TITLE })).toHaveFocus();
		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('shows no tooltip while the title fits', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('collapse-title');
		renderCollapse();

		await user.hover(screen.getByTestId('c-toggle'));
		await user.tab();

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('still toggles the section while the tooltip is on the header button', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('collapse-title');
		truncate();
		renderCollapse();

		await user.click(screen.getByTestId('c-toggle'));

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByRole('region', { name: TITLE })).toBeInTheDocument();
	});
});

describe('Collapse wrap', () => {
	it('never marks the title as truncated', () => {
		mockLabelMeasurement('collapse-title');
		truncate();
		renderCollapse('wrap');

		expect(screen.getByTestId('c')).toHaveAttribute('data-text-overflow', 'wrap');
		expect(screen.getByTestId('c-title')).not.toHaveAttribute('data-truncated');
		expect(screen.getByTestId('c-title')).toHaveTextContent(TITLE);
	});

	it('shows no tooltip', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('collapse-title');
		truncate();
		renderCollapse('wrap');

		await user.hover(screen.getByTestId('c-toggle'));
		await user.tab();

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});
});

describe('Collapse description', () => {
	it('never carries data-truncated', () => {
		mockLabelMeasurement('collapse-title');
		truncate();
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				description={TITLE}
				defaultExpanded={false}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-description')).not.toHaveAttribute('data-truncated');
		expect(screen.getByTestId('c-description')).toHaveTextContent(TITLE);
	});
});

describe('Collapse.Group title truncation', () => {
	const items = [
		{ value: 'long', title: TITLE, children: 'a' },
		{ value: 'short', title: 'Short', children: 'b' },
	];

	it('marks the title of an item while the text is cut', () => {
		mockLabelMeasurement('collapse-title');
		truncate();
		render(
			<Collapse.Group variant="outlined" size="sm" testId="g" items={items} defaultValue={[]} />,
		);

		expect(screen.getByTestId('g-item-long-title')).toHaveAttribute('data-truncated');
	});

	it('shows the whole title of an item in a tooltip on hover once it is cut', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('collapse-title');
		truncate();
		render(
			<Collapse.Group variant="outlined" size="sm" testId="g" items={items} defaultValue={[]} />,
		);

		await user.hover(screen.getByTestId('g-item-long-toggle'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(TITLE);
	});

	it('shows no tooltip while the titles fit', async () => {
		const user = userEvent.setup();
		mockLabelMeasurement('collapse-title');
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={[]}
			/>,
		);

		await user.hover(screen.getByTestId('g-item-logs-toggle'));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		expect(screen.getByTestId('g-item-logs-title')).not.toHaveAttribute('data-truncated');
	});

	it('never marks the title of an item with textOverflow wrap', () => {
		mockLabelMeasurement('collapse-title');
		truncate();
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				textOverflow="wrap"
				items={items}
				defaultValue={[]}
			/>,
		);

		expect(screen.getByTestId('g-item-long-title')).not.toHaveAttribute('data-truncated');
	});
});

describe('Collapse nested in another section', () => {
	it('keeps the title of a wrap section wrapped inside an ellipsis section', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="outer" title="Outer" defaultExpanded>
				<Collapse
					variant="ghost"
					size="sm"
					testId="inner"
					title={TITLE}
					textOverflow="wrap"
					defaultExpanded={false}
				>
					Body
				</Collapse>
			</Collapse>,
		);

		const title = getComputedStyle(screen.getByTestId('inner-title'));

		expect(title.whiteSpace).not.toBe('nowrap');
		expect(title.textOverflow).not.toBe('ellipsis');
	});

	it('keeps the title of a wrap section wrapped inside an ellipsis group item', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				defaultValue={['outer']}
				items={[
					{
						value: 'outer',
						title: 'Outer',
						children: (
							<Collapse
								variant="ghost"
								size="sm"
								testId="inner"
								title={TITLE}
								textOverflow="wrap"
								defaultExpanded={false}
							>
								Body
							</Collapse>
						),
					},
				]}
			/>,
		);

		expect(getComputedStyle(screen.getByTestId('inner-title')).whiteSpace).not.toBe('nowrap');
	});

	it('cuts the title of an ellipsis section inside a wrap section', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="outer"
				title="Outer"
				textOverflow="wrap"
				defaultExpanded
			>
				<Collapse variant="ghost" size="sm" testId="inner" title={TITLE} defaultExpanded={false}>
					Body
				</Collapse>
			</Collapse>,
		);

		const inner = getComputedStyle(screen.getByTestId('inner-title'));

		expect(inner.whiteSpace).toBe('nowrap');
		expect(inner.textOverflow).toBe('ellipsis');
		expect(getComputedStyle(screen.getByTestId('outer-title')).whiteSpace).not.toBe('nowrap');
	});
});
