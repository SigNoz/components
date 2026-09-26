import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipRoot } from '../subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../subcomponents/tooltip-trigger.js';

describe('Tooltip trigger rendering', () => {
	it('renders as the element it is given, instead of wrapping it', () => {
		render(
			<Tooltip title="Helpful information">
				<button type="button" data-testid="child">
					Hover
				</button>
			</Tooltip>,
		);

		expect(screen.getAllByRole('button')).toHaveLength(1);
		expect(screen.getByTestId('child')).toHaveAttribute('data-slot', 'tooltip-trigger');
		expect(document.querySelectorAll('[data-slot="tooltip-trigger"]')).toHaveLength(1);
	});

	it('keeps the props the child element set for itself', () => {
		render(
			<Tooltip title="Helpful information">
				<button type="submit" className="own-class" id="own-id" aria-label="Own label">
					Hover
				</button>
			</Tooltip>,
		);

		const trigger = screen.getByRole('button', { name: 'Own label' });
		expect(trigger).toHaveAttribute('type', 'submit');
		expect(trigger).toHaveClass('own-class');
		expect(trigger).toHaveAttribute('id', 'own-id');
	});

	it('falls back to a button for children that are not an element', () => {
		render(
			<TooltipRoot open={false}>
				<TooltipTrigger>Hover</TooltipTrigger>
			</TooltipRoot>,
		);

		expect(screen.getByRole('button')).toHaveTextContent('Hover');
	});

	it('renders a non-button element as the trigger too', () => {
		render(
			<Tooltip title="Helpful information">
				<span data-testid="child">Hover</span>
			</Tooltip>,
		);

		expect(screen.getByTestId('child').tagName).toBe('SPAN');
		expect(screen.getByTestId('child')).toHaveAttribute('data-slot', 'tooltip-trigger');
	});

	it('leaves data-testid off the trigger when no testId is given', () => {
		render(
			<Tooltip title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('button')).not.toHaveAttribute('data-testid');
	});
});

describe('Tooltip content rendering', () => {
	it('marks the trigger, positioner and content with their slot', () => {
		render(
			<Tooltip open title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'tooltip-trigger');
		expect(document.querySelector('[data-slot="tooltip-positioner"]')).toBeInTheDocument();
		expect(screen.getByRole('tooltip')).toHaveAttribute('data-slot', 'tooltip-content');
	});

	it('exposes testId as data-testid on the content, not the trigger', () => {
		render(
			<Tooltip open title="Helpful information" testId="tooltip">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).toHaveAttribute('data-testid', 'tooltip');
		expect(screen.getByRole('button')).not.toHaveAttribute('data-testid');
	});

	it('leaves data-testid off the content when no testId is given', () => {
		render(
			<Tooltip open title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).not.toHaveAttribute('data-testid');
	});

	it('forwards data-* to the content, not to the trigger', () => {
		render(
			<Tooltip open title="Helpful information" data-state-of="the world">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).toHaveAttribute('data-state-of', 'the world');
		expect(screen.getByRole('button')).not.toHaveAttribute('data-state-of');
	});

	it('keeps its own slot when the call site sends a data-slot', () => {
		render(
			<Tooltip open title="Helpful information" data-slot="mine">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).toHaveAttribute('data-slot', 'tooltip-content');
	});

	it('keeps the component class next to a custom className', () => {
		render(
			<Tooltip open title="Helpful information" className="custom-class">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toHaveClass('custom-class');
		expect(tooltip.className.split(' ').length).toBeGreaterThan(1);
	});

	it('forwards style to the content', () => {
		render(
			<Tooltip open title="Helpful information" style={{ color: 'red' }}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
	});

	it('renders a rich title, not only text', () => {
		render(
			<Tooltip open title={<strong data-testid="rich">Ask an admin</strong>}>
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(screen.getByRole('tooltip')).toContainElement(screen.getByTestId('rich'));
	});

	it('renders a lone title bare, without the stack wrapper', () => {
		render(
			<Tooltip open title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(document.querySelector('[data-slot="tooltip-stack"]')).toBeNull();
		expect(document.querySelector('[data-slot="tooltip-divider"]')).toBeNull();
	});
});
