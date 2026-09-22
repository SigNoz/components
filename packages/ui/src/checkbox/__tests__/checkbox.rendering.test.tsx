import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../checkbox.js';

describe('Checkbox rendering', () => {
	it('renders a checkbox named by its label', () => {
		render(<Checkbox color="primary">Accept the terms</Checkbox>);

		expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).toBeInTheDocument();
	});

	it('renders bare with no children: no wrapper, no label element', () => {
		render(<Checkbox color="primary" testId="checkbox" aria-label="Accept the terms" />);

		const root = screen.getByTestId('checkbox');
		expect(root).toBe(screen.getByRole('checkbox', { name: 'Accept the terms' }));
		expect(root.closest('[data-slot="checkbox-container"]')).toBeNull();
		expect(document.querySelector('[data-slot="checkbox-label"]')).toBeNull();
	});

	it('wraps the checkbox in a label container when children are passed', () => {
		render(
			<Checkbox color="primary" testId="checkbox" containerTestId="container">
				Accept the terms
			</Checkbox>,
		);

		const container = screen.getByTestId('container');
		expect(container.tagName).toBe('LABEL');
		expect(container).toHaveAttribute('data-slot', 'checkbox-container');
		expect(container.contains(screen.getByTestId('checkbox'))).toBe(true);
	});

	it('renders the wrapper for a container prop alone, with no label element', () => {
		render(<Checkbox color="primary" aria-label="Accept the terms" containerTestId="container" />);

		const container = screen.getByTestId('container');
		expect(container).toHaveAttribute('data-slot', 'checkbox-container');
		expect(container.querySelector('[data-slot="checkbox-label"]')).toBeNull();
	});

	it('stamps the slots', () => {
		render(
			<Checkbox color="primary" testId="checkbox" containerTestId="container" defaultValue>
				Accept the terms
			</Checkbox>,
		);

		const container = screen.getByTestId('container');
		expect(screen.getByTestId('checkbox')).toHaveAttribute('data-slot', 'checkbox');
		expect(container.querySelector('[data-slot="checkbox-box"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="checkbox-indicator"]')).toBeInTheDocument();
		expect(container.querySelector('[data-slot="checkbox-label"]')).toBeInTheDocument();
	});

	it('mirrors the color prop', () => {
		const { rerender } = render(
			<Checkbox color="primary" testId="checkbox" aria-label="Accept the terms" />,
		);
		expect(screen.getByTestId('checkbox')).toHaveAttribute('data-color', 'primary');

		rerender(<Checkbox color="danger" testId="checkbox" aria-label="Accept the terms" />);
		expect(screen.getByTestId('checkbox')).toHaveAttribute('data-color', 'danger');
	});

	it('mirrors textOverflow on the wrapper, with its default', () => {
		const { rerender } = render(
			<Checkbox color="primary" containerTestId="container">
				Accept the terms
			</Checkbox>,
		);
		expect(screen.getByTestId('container')).toHaveAttribute('data-text-overflow', 'ellipsis');

		// Re-queried after the rerender: moving off `ellipsis` unmounts the tooltip trigger, which
		// remounts the row.
		rerender(
			<Checkbox color="primary" containerTestId="container" textOverflow="wrap">
				Accept the terms
			</Checkbox>,
		);
		expect(screen.getByTestId('container')).toHaveAttribute('data-text-overflow', 'wrap');
	});

	it('forwards className, style, aria and data attributes to the checkbox itself', () => {
		render(
			<Checkbox
				color="primary"
				testId="checkbox"
				className="custom"
				style={{ marginInline: '4px' }}
				aria-label="Accept the terms"
				data-analytics="tos-checkbox"
			/>,
		);

		const root = screen.getByTestId('checkbox');
		expect(root).toHaveClass('custom');
		expect(root).toHaveStyle({ marginInline: '4px' });
		expect(root).toHaveAttribute('aria-label', 'Accept the terms');
		expect(root).toHaveAttribute('data-analytics', 'tos-checkbox');
	});

	it('keeps container props on the wrapper, away from the checkbox', () => {
		render(
			<Checkbox
				color="primary"
				testId="checkbox"
				containerTestId="container"
				containerId="row"
				containerClassName="row-class"
				containerStyle={{ marginBlock: '12px' }}
			>
				Accept the terms
			</Checkbox>,
		);

		const container = screen.getByTestId('container');
		expect(container).toHaveAttribute('id', 'row');
		expect(container).toHaveClass('row-class');
		expect(container).toHaveStyle({ marginBlock: '12px' });
		expect(screen.getByTestId('checkbox')).not.toHaveClass('row-class');
	});

	it('checks the defaultValue on first render', () => {
		render(<Checkbox color="primary" aria-label="Accept the terms" defaultValue />);

		expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).toBeChecked();
	});

	it('checks the controlled value', () => {
		const { rerender } = render(
			<Checkbox color="primary" aria-label="Accept the terms" value onChange={() => {}} />,
		);
		expect(screen.getByRole('checkbox')).toBeChecked();

		rerender(
			<Checkbox color="primary" aria-label="Accept the terms" value={false} onChange={() => {}} />,
		);
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('submits under its name through the hidden input', () => {
		render(<Checkbox color="primary" aria-label="Accept the terms" name="tos" defaultValue />);

		const input = document.querySelector<HTMLInputElement>('input[name="tos"]');
		expect(input).not.toBeNull();
		expect(input).toBeChecked();
	});

	it('puts id on the hidden input, not on the checkbox itself', () => {
		render(<Checkbox color="primary" testId="checkbox" aria-label="Accept the terms" id="tos" />);

		const input = document.querySelector<HTMLInputElement>('input[type="checkbox"]');
		expect(input).toHaveAttribute('id', 'tos');
		expect(screen.getByTestId('checkbox')).not.toHaveAttribute('id', 'tos');
	});

	it('marks itself required', () => {
		render(<Checkbox color="primary" testId="checkbox" aria-label="Accept the terms" required />);

		expect(screen.getByTestId('checkbox')).toHaveAttribute('aria-required', 'true');
	});

	// Two renders rather than one rerender: Base UI keeps the indicator mounted through the
	// unchecking transition, so only a fresh unchecked checkbox is provably empty.
	it('shows the check glyph while checked and no glyph while unchecked', () => {
		const { unmount } = render(
			<Checkbox color="primary" aria-label="Accept the terms" value onChange={() => {}} />,
		);
		expect(screen.getByTestId('check')).toBeInTheDocument();
		unmount();

		render(
			<Checkbox color="primary" aria-label="Accept the terms" value={false} onChange={() => {}} />,
		);
		expect(screen.queryByTestId('check')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="checkbox-indicator"]')).toBeNull();
	});
});

describe('Checkbox indeterminate', () => {
	it('announces the mixed state instead of a checked one', () => {
		render(<Checkbox color="primary" testId="checkbox" aria-label="Select all" indeterminate />);

		const root = screen.getByTestId('checkbox');
		expect(root).toHaveAttribute('aria-checked', 'mixed');
		expect(root).toHaveAttribute('data-indeterminate');
		expect(root).not.toHaveAttribute('data-checked');
		expect(root).not.toHaveAttribute('data-unchecked');
	});

	it('shows the minus glyph, not the check', () => {
		render(<Checkbox color="primary" aria-label="Select all" indeterminate />);

		expect(screen.getByTestId('minus')).toBeInTheDocument();
		expect(screen.queryByTestId('check')).not.toBeInTheDocument();
	});
});

// The stylesheet reads these off the checkbox, and the wrapper picks them back up with `:has()`.
// Nothing else pins them, so a Base UI change that moved one would only show up as a silent
// styling regression.
describe('Checkbox styling hooks', () => {
	it('marks a checked checkbox', () => {
		render(
			<Checkbox color="primary" testId="checkbox" aria-label="Accept the terms" defaultValue />,
		);
		const root = screen.getByTestId('checkbox');

		expect(root).toHaveAttribute('data-checked');
		expect(root).not.toHaveAttribute('data-unchecked');
	});

	it('marks an unchecked checkbox', () => {
		render(
			<Checkbox
				color="primary"
				testId="checkbox"
				aria-label="Accept the terms"
				value={false}
				onChange={() => {}}
			/>,
		);
		const root = screen.getByTestId('checkbox');

		expect(root).toHaveAttribute('data-unchecked');
		expect(root).not.toHaveAttribute('data-checked');
	});

	// The checkbox is a `<span role="checkbox">`, never a native button, so `disabled` is announced
	// rather than applied. It stays reachable, which is the only reason `disabledTooltip` can be
	// read at all.
	it('keeps the disabled checkbox hoverable and in the tab order', () => {
		render(
			<Checkbox
				color="primary"
				testId="checkbox"
				aria-label="Accept the terms"
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);

		const root = screen.getByTestId('checkbox');
		expect(root.tagName).toBe('SPAN');
		expect(root).not.toHaveAttribute('disabled');
		expect(root).toHaveAttribute('aria-disabled', 'true');
		expect(root).toHaveAttribute('data-disabled');
		expect(root).toHaveAttribute('tabindex', '0');
	});

	it('marks the checkbox readonly while staying enabled', () => {
		render(
			<Checkbox
				color="primary"
				testId="checkbox"
				aria-label="Accept the terms"
				readOnly
				readOnlyTooltip="Saving"
			/>,
		);

		const root = screen.getByTestId('checkbox');
		expect(root).toHaveAttribute('data-readonly');
		expect(root).toHaveAttribute('aria-readonly', 'true');
		expect(root).not.toHaveAttribute('data-disabled');
	});
});

// A checkbox that was given a label keeps one even when it renders nothing: a broken label should
// look broken, not hide a form control. `name` is the nearest human-readable stand-in, and the
// `<No label>` constant is the last resort.
describe('Checkbox empty label', () => {
	it.each([
		['null', null],
		['false', false],
		['an empty string', ''],
	])('falls back to <No label> when children render %s and there is no name', (_name, label) => {
		render(
			<Checkbox color="primary" containerTestId="container">
				{label}
			</Checkbox>,
		);

		const labelEl = screen.getByTestId('container').querySelector('[data-slot="checkbox-label"]');
		expect(labelEl).toHaveTextContent('<No label>');
		expect(labelEl).toHaveAttribute('data-empty-label');
	});

	it('falls back to the name prop first, without the empty-label mark', () => {
		render(
			<Checkbox color="primary" name="tos" containerTestId="container">
				{''}
			</Checkbox>,
		);

		const labelEl = screen.getByTestId('container').querySelector('[data-slot="checkbox-label"]');
		expect(labelEl).toHaveTextContent('tos');
		expect(labelEl).not.toHaveAttribute('data-empty-label');
	});
});
