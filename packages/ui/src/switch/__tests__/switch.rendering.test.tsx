import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Switch } from '../switch.js';

describe('Switch rendering', () => {
	it('renders a switch named by its label', () => {
		render(
			<Switch color="primary" textPlacement="right">
				Wrap text
			</Switch>,
		);

		expect(screen.getByRole('switch', { name: 'Wrap text' })).toBeInTheDocument();
	});

	it('renders bare with no children: no wrapper, no label element', () => {
		render(<Switch color="primary" textPlacement="right" testId="switch" aria-label="Wrap text" />);

		const root = screen.getByTestId('switch');
		expect(root).toBe(screen.getByRole('switch', { name: 'Wrap text' }));
		expect(root.closest('[data-slot="switch-container"]')).toBeNull();
		expect(document.querySelector('[data-slot="switch-label"]')).toBeNull();
	});

	it('wraps the switch in a label container when children are passed', () => {
		render(
			<Switch color="primary" textPlacement="right" testId="switch" containerTestId="container">
				Wrap text
			</Switch>,
		);

		const container = screen.getByTestId('container');
		expect(container.tagName).toBe('LABEL');
		expect(container).toHaveAttribute('data-slot', 'switch-container');
		expect(container.contains(screen.getByTestId('switch'))).toBe(true);
	});

	it('renders the wrapper for a container prop alone, with no text column', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Wrap text"
				containerTestId="container"
			/>,
		);

		const container = screen.getByTestId('container');
		expect(container).toHaveAttribute('data-slot', 'switch-container');
		expect(container.querySelector('[data-slot="switch-text"]')).toBeNull();
	});

	it('stamps the slots', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				containerTestId="container"
				description="Use the 24-hour convention"
			>
				Display timestamp in 24-hour format
			</Switch>,
		);

		const container = screen.getByTestId('container');
		expect(screen.getByTestId('switch')).toHaveAttribute('data-slot', 'switch');
		expect(container.querySelector('[data-slot="switch-thumb"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="switch-text"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="switch-label"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="switch-description"]')).toBeInTheDocument();
	});

	it('mirrors color on the root', () => {
		const { rerender } = render(
			<Switch color="primary" textPlacement="right" testId="switch" aria-label="Wrap text" />,
		);
		expect(screen.getByTestId('switch')).toHaveAttribute('data-color', 'primary');

		rerender(
			<Switch color="danger" textPlacement="right" testId="switch" aria-label="Wrap text" />,
		);
		expect(screen.getByTestId('switch')).toHaveAttribute('data-color', 'danger');
	});

	it('mirrors textPlacement and textOverflow on the wrapper', () => {
		const { rerender } = render(
			<Switch color="primary" textPlacement="right" containerTestId="container">
				Wrap text
			</Switch>,
		);
		expect(screen.getByTestId('container')).toHaveAttribute('data-text-placement', 'right');
		expect(screen.getByTestId('container')).toHaveAttribute('data-text-overflow', 'ellipsis');

		// Re-queried after the rerender: moving off `ellipsis` unmounts the tooltip trigger, which
		// remounts the row.
		rerender(
			<Switch color="primary" textPlacement="left" textOverflow="wrap" containerTestId="container">
				Wrap text
			</Switch>,
		);
		expect(screen.getByTestId('container')).toHaveAttribute('data-text-placement', 'left');
		expect(screen.getByTestId('container')).toHaveAttribute('data-text-overflow', 'wrap');
	});

	it('puts the text after the switch for "right" and before it for "left"', () => {
		const { rerender } = render(
			<Switch color="primary" textPlacement="right" containerTestId="container">
				Wrap text
			</Switch>,
		);
		const container = screen.getByTestId('container');

		expect(container.firstElementChild).toHaveAttribute('data-slot', 'switch');

		rerender(
			<Switch color="primary" textPlacement="left" containerTestId="container">
				Wrap text
			</Switch>,
		);
		expect(container.firstElementChild).toHaveAttribute('data-slot', 'switch-text');
	});

	it('forwards aria and data attributes to the switch itself', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				aria-label="Wrap text"
				data-analytics="wrap-toggle"
			/>,
		);

		const root = screen.getByTestId('switch');
		expect(root).toHaveAttribute('aria-label', 'Wrap text');
		expect(root).toHaveAttribute('data-analytics', 'wrap-toggle');
	});

	it('keeps container props on the wrapper, away from the switch', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				containerTestId="container"
				containerId="row"
			>
				Wrap text
			</Switch>,
		);

		const container = screen.getByTestId('container');
		expect(container).toHaveAttribute('id', 'row');
		expect(screen.getByTestId('switch')).not.toHaveAttribute('id', 'row');
	});

	it('checks the defaultValue on first render', () => {
		render(<Switch color="primary" textPlacement="right" aria-label="Wrap text" defaultValue />);

		expect(screen.getByRole('switch', { name: 'Wrap text' })).toBeChecked();
	});

	it('checks the controlled value', () => {
		const { rerender } = render(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Wrap text"
				value
				onChange={() => {}}
			/>,
		);
		expect(screen.getByRole('switch')).toBeChecked();

		rerender(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Wrap text"
				value={false}
				onChange={() => {}}
			/>,
		);
		expect(screen.getByRole('switch')).not.toBeChecked();
	});

	it('submits under its name through the hidden input', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="Wrap text"
				name="wrap"
				defaultValue
			/>,
		);

		const input = document.querySelector<HTMLInputElement>('input[name="wrap"]');
		expect(input).not.toBeNull();
		expect(input).toBeChecked();
	});

	it('marks itself required', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				aria-label="Wrap text"
				required
			/>,
		);

		expect(screen.getByTestId('switch')).toHaveAttribute('aria-required', 'true');
	});

	it('describes the switch from its description', () => {
		render(
			<Switch color="primary" textPlacement="right" description="Use the 24-hour convention">
				Display in 24-hour format
			</Switch>,
		);

		expect(
			screen.getByRole('switch', { name: 'Display in 24-hour format' }),
		).toHaveAccessibleDescription('Use the 24-hour convention');
	});
});

// The stylesheet reads these off the switch, and the wrapper picks them back up with `:has()`.
// Nothing else pins them, so a Base UI change that moved one would only show up as a silent
// styling regression.
describe('Switch styling hooks', () => {
	it('marks a checked switch', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				aria-label="Wrap text"
				defaultValue
			/>,
		);
		const root = screen.getByTestId('switch');

		expect(root).toHaveAttribute('data-checked');
		expect(root).not.toHaveAttribute('data-unchecked');
	});

	it('marks an unchecked switch', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				aria-label="Wrap text"
				value={false}
				onChange={() => {}}
			/>,
		);
		const root = screen.getByTestId('switch');

		expect(root).toHaveAttribute('data-unchecked');
		expect(root).not.toHaveAttribute('data-checked');
	});

	// The switch is a `<span role="switch">`, never a native button, so `disabled` is announced
	// rather than applied. It stays reachable, which is the only reason `disabledTooltip` can be
	// read at all.
	it('keeps the disabled switch hoverable and in the tab order', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				aria-label="Wrap text"
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);

		const root = screen.getByTestId('switch');
		expect(root.tagName).toBe('SPAN');
		expect(root).not.toHaveAttribute('disabled');
		expect(root).toHaveAttribute('aria-disabled', 'true');
		expect(root).toHaveAttribute('data-disabled');
		expect(root).toHaveAttribute('tabindex', '0');
	});

	it('marks the switch readonly while staying enabled', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				aria-label="Wrap text"
				readOnly
				readOnlyTooltip="Saving"
			/>,
		);

		const root = screen.getByTestId('switch');
		expect(root).toHaveAttribute('data-readonly');
		expect(root).toHaveAttribute('aria-readonly', 'true');
		expect(root).not.toHaveAttribute('data-disabled');
	});
});

describe('Switch empty label', () => {
	it.each([
		['null', null],
		['false', false],
		['an empty string', ''],
	])('renders bare when children render %s', (_name, label) => {
		render(
			<Switch color="primary" textPlacement="right" testId="switch" aria-label="Wrap text">
				{label}
			</Switch>,
		);

		expect(screen.getByTestId('switch').closest('[data-slot="switch-container"]')).toBeNull();
		expect(document.querySelector('[data-slot="switch-label"]')).toBeNull();
	});

	it('renders a description alone, with no label element', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				aria-label="24-hour format"
				description="Use the 24-hour convention"
				containerTestId="container"
			/>,
		);

		const container = screen.getByTestId('container');
		expect(container.querySelector('[data-slot="switch-description"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="switch-label"]')).toBeNull();
	});
});
