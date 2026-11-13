import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '../card.js';
import type { CardLoadingParts } from '../types.js';
import { slotsOf } from './card.test-utils.js';

describe('Card loading', () => {
	it('marks the root busy', () => {
		render(
			<Card testId="card" loading>
				Body
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(root).toHaveAttribute('aria-busy', 'true');
		expect(root).toHaveAttribute('data-loading');
	});

	it('marks nothing busy while it is not loading', () => {
		render(<Card testId="card">Body</Card>);

		const root = screen.getByTestId('card');

		expect(root).not.toHaveAttribute('aria-busy');
		expect(root).not.toHaveAttribute('data-loading');
	});

	it('does not render the children while it loads', () => {
		render(
			<Card testId="card" loading>
				<p>The chart</p>
			</Card>,
		);

		expect(screen.queryByText('The chart')).toBeNull();
	});

	it('shows three lines of Skeleton when loading is true', () => {
		render(
			<Card testId="card" loading>
				Body
			</Card>,
		);

		const body = screen.getByTestId('card-body');
		const skeleton = body.querySelector('[data-active="true"]');

		expect(body).toHaveAttribute('data-skeleton');
		expect(skeleton).not.toBeNull();
		expect(skeleton?.querySelectorAll('[data-active]')).toHaveLength(0);
		expect(skeleton?.children).toHaveLength(1);
		expect(skeleton?.firstElementChild?.children).toHaveLength(3);
	});

	it('shows a node passed to loading in place of the children', () => {
		render(
			<Card testId="card" loading={<div data-testid="shape">Shape</div>}>
				<p>The chart</p>
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(screen.getByTestId('shape')).toBeInTheDocument();
		expect(screen.queryByText('The chart')).toBeNull();
		expect(screen.getByTestId('card-body').querySelector('[data-active]')).toBeNull();
		expect(screen.getByTestId('card-body')).not.toHaveAttribute('data-skeleton');
		expect(root).toHaveAttribute('aria-busy', 'true');
		expect(root).toHaveAttribute('data-loading');
	});

	it.each([
		['an empty fragment', <></>],
		['an empty array', []],
	])('shows the default content when loading is %s', (_, loading) => {
		render(
			<Card testId="card" loading={loading}>
				Body
			</Card>,
		);

		expect(screen.getByTestId('card')).toHaveAttribute('aria-busy', 'true');
		expect(screen.getByTestId('card-body')).toHaveAttribute('data-skeleton');
	});

	it.each([
		['false', false],
		['null', null],
		['undefined', undefined],
		['an empty string', ''],
		['0', 0],
	])('does not load when loading is %s', (_, loading) => {
		render(
			<Card testId="card" loading={loading}>
				<p>The chart</p>
			</Card>,
		);

		expect(screen.getByText('The chart')).toBeInTheDocument();
		expect(screen.getByTestId('card')).not.toHaveAttribute('aria-busy');
	});

	it('gives the default content the padding of the header and the footer, over the padding props', () => {
		render(
			<Card testId="card" title="Title" padding={0} loading>
				Body
			</Card>,
		);

		const body = screen.getByTestId('card-body');

		expect(body).toHaveAttribute('data-skeleton');
		expect(body).not.toHaveAttribute('data-flush');
	});

	it('keeps the padding props and the flush body for a node passed to loading', () => {
		render(
			<Card testId="card" title="Title" padding={0} loading={<div />}>
				Body
			</Card>,
		);

		const body = screen.getByTestId('card-body');

		expect(body).not.toHaveAttribute('data-skeleton');
		expect(body).toHaveAttribute('data-flush');
	});

	it('renders the body of a card with no children', () => {
		render(<Card testId="card" title="Title" loading />);

		expect(slotsOf(screen.getByTestId('card'))).toEqual(['card-header', 'card-body']);
	});

	it('keeps the header and the footer, and their controls interactive', () => {
		render(
			<Card
				title="Title"
				headerSuffix={<button type="button">Refresh</button>}
				footerSuffix={<button type="button">Save</button>}
				loading
			>
				Body
			</Card>,
		);

		expect(screen.getByRole('button', { name: 'Refresh' })).toBeEnabled();
		expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
		expect(screen.getByText('Title')).toBeInTheDocument();
	});

	it('shows the children again once it has loaded', () => {
		const { rerender } = render(
			<Card testId="card" loading>
				<p>The chart</p>
			</Card>,
		);

		rerender(
			<Card testId="card" loading={false}>
				<p>The chart</p>
			</Card>,
		);

		expect(screen.getByText('The chart')).toBeInTheDocument();
		expect(screen.getByTestId('card')).not.toHaveAttribute('aria-busy');
	});

	describe('header and footer', () => {
		function renderFull(loading: CardLoadingParts) {
			render(
				<Card
					testId="card"
					title="Title"
					titlePrefix={<svg />}
					titleSuffix="Beta"
					description="Description"
					headerSuffix={<button type="button">Refresh</button>}
					footerPrefix="Refreshed a minute ago."
					footerSuffix={<button type="button">Save</button>}
					loading={loading}
				>
					<p>The chart</p>
				</Card>,
			);
		}

		it('loads the body with the default content', () => {
			renderFull({ header: true, footer: true });

			const root = screen.getByTestId('card');

			expect(root).toHaveAttribute('aria-busy', 'true');
			expect(screen.getByTestId('card-body')).toHaveAttribute('data-skeleton');
			expect(screen.queryByText('The chart')).toBeNull();
		});

		it('swaps every part of the header for a Skeleton', () => {
			renderFull({ header: true });

			const header = screen.getByTestId('card-header');

			expect(header).toHaveAttribute('data-loading');
			expect(screen.queryByText('Title')).toBeNull();
			expect(screen.queryByText('Beta')).toBeNull();
			expect(screen.queryByText('Description')).toBeNull();
			expect(screen.queryByTestId('card-title-prefix')).toBeNull();
			expect(screen.queryByRole('button', { name: 'Refresh' })).toBeNull();
			expect(header.querySelectorAll('[data-active="true"]')).toHaveLength(3);
			expect(screen.getByTestId('card-header-suffix')).toBeInTheDocument();
		});

		it('draws no description bar for a header with no description', () => {
			render(<Card testId="card" title="Title" loading={{ header: true }} />);

			const header = screen.getByTestId('card-header');

			expect(header.querySelectorAll('[data-active="true"]')).toHaveLength(1);
			expect(screen.queryByTestId('card-header-suffix')).toBeNull();
		});

		it('swaps every part of the footer for a Skeleton', () => {
			renderFull({ footer: true });

			const footer = screen.getByTestId('card-footer');

			expect(footer).toHaveAttribute('data-loading');
			expect(screen.queryByText('Refreshed a minute ago.')).toBeNull();
			expect(screen.queryByRole('button', { name: 'Save' })).toBeNull();
			expect(footer.querySelectorAll('[data-active="true"]')).toHaveLength(2);
		});

		it('leaves the part that is not loading as it is', () => {
			renderFull({ footer: true });

			expect(screen.getByTestId('card-header')).not.toHaveAttribute('data-loading');
			expect(screen.getByText('Title')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Refresh' })).toBeEnabled();
		});

		it('renders no header and no footer that the card does not have', () => {
			render(
				<Card testId="card" loading={{ header: true, footer: true }}>
					Body
				</Card>,
			);

			expect(slotsOf(screen.getByTestId('card'))).toEqual(['card-body']);
		});

		it('shows the parts again once it has loaded', () => {
			const { rerender } = render(
				<Card
					testId="card"
					title="Title"
					footerPrefix="Hint"
					loading={{ header: true, footer: true }}
				/>,
			);

			rerender(<Card testId="card" title="Title" footerPrefix="Hint" loading={false} />);

			expect(screen.getByText('Title')).toBeInTheDocument();
			expect(screen.getByText('Hint')).toBeInTheDocument();
			expect(screen.getByTestId('card-header')).not.toHaveAttribute('data-loading');
			expect(screen.getByTestId('card-footer')).not.toHaveAttribute('data-loading');
		});
	});
});
