import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';

describe('Tooltip empty title', () => {
	it.each([
		['undefined', undefined],
		['null', null],
		['false', false],
		['an empty string', ''],
	] as const)('renders no tooltip for %s', async (_, title) => {
		const user = userEvent.setup();
		render(
			<Tooltip title={title}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');
		expect(trigger).not.toHaveAttribute('aria-describedby');

		await user.hover(trigger);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();
	});

	it('renders no tooltip for an empty controlled title even while open', () => {
		render(
			<Tooltip open title="">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('still marks the element as a trigger while the title is empty', () => {
		render(
			<Tooltip title={undefined}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'tooltip-trigger');
	});
});

describe('Tooltip non-empty title', () => {
	it('treats 0 as content', () => {
		render(
			<Tooltip open title={0}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).toHaveTextContent('0');
	});

	it('updates the content when the title changes while open', () => {
		const { rerender } = render(
			<Tooltip open title="Before">
				<button type="button">Hover</button>
			</Tooltip>,
		);
		expect(screen.getByRole('tooltip')).toHaveTextContent('Before');

		rerender(
			<Tooltip open title="After">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).toHaveTextContent('After');
	});
});

describe('Tooltip title element identity', () => {
	it('keeps the same trigger element when the title comes and goes', () => {
		const { rerender } = render(
			<Tooltip title={undefined}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		rerender(
			<Tooltip title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);
		expect(screen.getByRole('button')).toBe(trigger);
		expect(trigger).toHaveAttribute('aria-describedby');

		rerender(
			<Tooltip title={null}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		expect(screen.getByRole('button')).toBe(trigger);
		expect(trigger).not.toHaveAttribute('aria-describedby');
	});

	it('keeps focus on the trigger when the title comes and goes', () => {
		const { rerender } = render(
			<Tooltip title={undefined}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		screen.getByRole('button').focus();

		rerender(
			<Tooltip title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);
		expect(screen.getByRole('button')).toHaveFocus();

		rerender(
			<Tooltip title={undefined}>
				<button type="button">Hover</button>
			</Tooltip>,
		);
		expect(screen.getByRole('button')).toHaveFocus();
	});

	it('closes an open tooltip once the title is gone', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Tooltip title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));
		expect(await screen.findByRole('tooltip')).toBeInTheDocument();

		rerender(
			<Tooltip title={undefined}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});
