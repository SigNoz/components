import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipContent } from '../subcomponents/tooltip-content.js';
import { TooltipRoot } from '../subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../subcomponents/tooltip-trigger.js';

describe('Tooltip inside another tooltip', () => {
	it('adds its title to the wrapping popup instead of opening a second one', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title="Outer title">
				<Tooltip title="Inner title">
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent('Outer titleInner title');
	});

	it('separates the two titles with a divider, in a stack', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title="Outer title">
				<Tooltip title="Inner title">
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.querySelector('[data-slot="tooltip-stack"]')).toBeInTheDocument();
		expect(tooltip.querySelectorAll('[data-slot="tooltip-divider"]')).toHaveLength(1);
	});

	it('leaves a single trigger on the element', () => {
		render(
			<Tooltip title="Outer title">
				<Tooltip title="Inner title">
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);

		expect(document.querySelectorAll('[data-slot="tooltip-trigger"]')).toHaveLength(1);
		expect(screen.getAllByRole('button')).toHaveLength(1);
	});

	it('describes the trigger with the one popup', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title="Outer title">
				<Tooltip title="Inner title">
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		await user.hover(trigger);

		const tooltip = await screen.findByRole('tooltip');
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('stacks three levels into the one popup', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title="Outer">
				<Tooltip title="Middle">
					<Tooltip title="Inner">
						<button type="button">Hover</button>
					</Tooltip>
				</Tooltip>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]?.textContent?.startsWith('Outer')).toBe(true);
		expect(tooltips[0]).toHaveTextContent('Middle');
		expect(tooltips[0]).toHaveTextContent('Inner');
		expect(tooltips[0]?.querySelectorAll('[data-slot="tooltip-divider"]')).toHaveLength(2);
	});

	it('adds nothing when the nested title is empty', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title="Outer title">
				<Tooltip title={undefined}>
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent('Outer title');
		expect(tooltip.querySelector('[data-slot="tooltip-divider"]')).toBeNull();
	});

	it('shows only the nested title when the wrapping one is empty', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={undefined}>
				<Tooltip title="Inner title">
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		await user.hover(trigger);

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip).toHaveTextContent('Inner title');
		expect(tooltip.querySelector('[data-slot="tooltip-divider"]')).toBeNull();
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('shows nothing when both titles are empty', async () => {
		const user = userEvent.setup();
		render(
			<Tooltip title={undefined}>
				<Tooltip title={undefined}>
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');
		expect(trigger).not.toHaveAttribute('aria-describedby');

		await user.hover(trigger);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('keeps its own tooltip when it is not inside another trigger', () => {
		render(
			<>
				<Tooltip open title="First">
					<button type="button">First</button>
				</Tooltip>
				<Tooltip open title="Second">
					<button type="button">Second</button>
				</Tooltip>
			</>,
		);

		expect(screen.getAllByRole('tooltip')).toHaveLength(2);
	});
});

describe('Tooltip stacked content lifecycle', () => {
	it('drops the stacked content once the nested tooltip is gone', () => {
		const { rerender } = render(
			<TooltipRoot open>
				<TooltipTrigger>
					<Tooltip title="Inner title">
						<button type="button">Hover</button>
					</Tooltip>
				</TooltipTrigger>
				<TooltipContent>Outer title</TooltipContent>
			</TooltipRoot>,
		);
		expect(screen.getByRole('tooltip')).toHaveTextContent('Inner title');

		rerender(
			<TooltipRoot open>
				<TooltipTrigger>
					<button type="button">Hover</button>
				</TooltipTrigger>
				<TooltipContent>Outer title</TooltipContent>
			</TooltipRoot>,
		);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toHaveTextContent('Outer title');
		expect(tooltip).not.toHaveTextContent('Inner title');
		expect(tooltip.querySelector('[data-slot="tooltip-divider"]')).toBeNull();
	});

	it('drops the stacked content once the nested title turns empty', () => {
		const { rerender } = render(
			<TooltipRoot open>
				<TooltipTrigger>
					<Tooltip title="Inner title">
						<button type="button">Hover</button>
					</Tooltip>
				</TooltipTrigger>
				<TooltipContent>Outer title</TooltipContent>
			</TooltipRoot>,
		);
		expect(screen.getByRole('tooltip')).toHaveTextContent('Inner title');

		rerender(
			<TooltipRoot open>
				<TooltipTrigger>
					<Tooltip title={undefined}>
						<button type="button">Hover</button>
					</Tooltip>
				</TooltipTrigger>
				<TooltipContent>Outer title</TooltipContent>
			</TooltipRoot>,
		);

		expect(screen.getByRole('tooltip')).not.toHaveTextContent('Inner title');
		expect(screen.getByRole('tooltip').querySelector('[data-slot="tooltip-divider"]')).toBeNull();
	});

	it('replaces the stacked content when the nested title changes', () => {
		const { rerender } = render(
			<TooltipRoot open>
				<TooltipTrigger>
					<Tooltip title="Before">
						<button type="button">Hover</button>
					</Tooltip>
				</TooltipTrigger>
				<TooltipContent>Outer title</TooltipContent>
			</TooltipRoot>,
		);

		rerender(
			<TooltipRoot open>
				<TooltipTrigger>
					<Tooltip title="After">
						<button type="button">Hover</button>
					</Tooltip>
				</TooltipTrigger>
				<TooltipContent>Outer title</TooltipContent>
			</TooltipRoot>,
		);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toHaveTextContent('Outer titleAfter');
		expect(tooltip).not.toHaveTextContent('Before');
	});

	it('keeps the same trigger element as the nested title comes and goes', () => {
		const { rerender } = render(
			<Tooltip title="Outer title">
				<Tooltip title={undefined}>
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		rerender(
			<Tooltip title="Outer title">
				<Tooltip title="Inner title">
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);

		expect(screen.getByRole('button')).toBe(trigger);
	});
});

describe('Tooltip stacked props', () => {
	it('puts className, style, id, testId and data-* on the trigger element it clones', () => {
		render(
			<Tooltip title="Outer title">
				<Tooltip
					title="Inner title"
					className="inner-class"
					style={{ color: 'red' }}
					id="inner-id"
					testId="inner"
					data-inner="yes"
				>
					<button type="button" className="own-class">
						Hover
					</button>
				</Tooltip>
			</Tooltip>,
		);

		const trigger = screen.getByRole('button');
		expect(trigger).toHaveClass('own-class', 'inner-class');
		expect(trigger).toHaveStyle({ color: 'rgb(255, 0, 0)' });
		expect(trigger).toHaveAttribute('id', 'inner-id');
		expect(trigger).toHaveAttribute('data-testid', 'inner');
		expect(trigger).toHaveAttribute('data-inner', 'yes');
	});

	it('drops the positioning and container of a stacked tooltip, the popup above owns them', async () => {
		const user = userEvent.setup();
		const container = document.createElement('div');
		document.body.append(container);
		render(
			<Tooltip title="Outer title" side="bottom">
				<Tooltip title="Inner title" side="right" align="end" container={container}>
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');
		expect(trigger).not.toHaveAttribute('side');
		expect(trigger).not.toHaveAttribute('align');

		await user.hover(trigger);

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.closest('[data-slot="tooltip-positioner"]')).toHaveAttribute(
			'data-side',
			'bottom',
		);
		expect(container).toBeEmptyDOMElement();
		container.remove();
	});

	it('keeps the props of the wrapping tooltip on the popup', () => {
		render(
			<Tooltip open title="Outer title" testId="outer" className="outer-class">
				<Tooltip title="Inner title" testId="inner">
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toHaveAttribute('data-testid', 'outer');
		expect(tooltip).toHaveClass('outer-class');
		expect(screen.getByRole('button')).toHaveAttribute('data-testid', 'inner');
	});

	it('mounts no root, portal or content of its own', () => {
		render(
			<Tooltip open title="Outer title">
				<Tooltip title="Inner title">
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
		);

		expect(document.querySelectorAll('[data-slot="tooltip-content"]')).toHaveLength(1);
		expect(document.querySelectorAll('[data-slot="tooltip-positioner"]')).toHaveLength(1);
	});
});

describe('TooltipRoot inside a trigger', () => {
	it('renders its children in place, without a root of its own', () => {
		render(
			<TooltipRoot open>
				<TooltipTrigger>
					<span data-testid="inner">
						<TooltipRoot>
							Hover
							<TooltipContent>Inner title</TooltipContent>
						</TooltipRoot>
					</span>
				</TooltipTrigger>
				<TooltipContent>Outer title</TooltipContent>
			</TooltipRoot>,
		);

		expect(screen.getByTestId('inner')).toBeInTheDocument();
		expect(screen.getAllByRole('tooltip')).toHaveLength(1);
		expect(screen.getByRole('tooltip')).toHaveTextContent('Outer titleInner title');
	});
});
