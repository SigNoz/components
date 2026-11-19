import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxField } from '../index.js';

describe('CheckboxField name and wiring', () => {
	it('names the checkbox with the label, with nothing above it', () => {
		render(<CheckboxField color="primary" label="Send alerts" testId="alerts" />);

		const checkbox = screen.getByRole('checkbox', { name: 'Send alerts' });

		expect(checkbox).toHaveAttribute('data-testid', 'alerts');
		expect(screen.queryByTestId('alerts-label')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="field-label"]')).not.toBeInTheDocument();
		expect(document.querySelector('label')).toContainElement(checkbox);
		expect(document.querySelector('[data-slot="field"]')).not.toHaveAttribute('data-testid');
	});

	it('toggles from the text, and reports the new value through onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<CheckboxField color="primary" label="Send alerts" onChange={onChange} />);

		await user.click(screen.getByText('Send alerts'));

		expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	it('stays controlled by value', async () => {
		const user = userEvent.setup();

		function Controlled() {
			const [value, setValue] = useState(false);

			return (
				<CheckboxField color="primary" label="Send alerts" value={value} onChange={setValue} />
			);
		}

		render(<Controlled />);
		await user.click(screen.getByRole('checkbox'));

		expect(screen.getByRole('checkbox')).toBeChecked();

		await user.click(screen.getByRole('checkbox'));

		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	it('hands the ref to the checkbox itself', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<CheckboxField color="primary" label="Send alerts" ref={ref} />);

		expect(ref.current).toBe(screen.getByRole('checkbox'));
	});

	it('puts id and name on the checkbox input and forwards aria and data attributes', () => {
		render(
			<CheckboxField
				color="primary"
				label="Send alerts"
				id="alerts-input"
				name="alerts"
				data-analytics="alerts"
				aria-describedby="hint"
			/>,
		);

		const checkbox = screen.getByRole('checkbox');

		expect(document.getElementById('alerts-input')).toHaveAttribute('name', 'alerts');
		expect(checkbox).toHaveAttribute('data-analytics', 'alerts');
		expect(checkbox.getAttribute('aria-describedby')).toContain('hint');
	});

	it('is focusable and keeps its tab stop', async () => {
		const user = userEvent.setup();
		render(<CheckboxField color="primary" label="Send alerts" />);

		await user.tab();

		expect(screen.getByRole('checkbox')).toHaveFocus();
	});

	it('keeps the disabled reason of the checkbox', () => {
		render(
			<CheckboxField color="primary" label="Send alerts" disabled disabledTooltip="Ask an admin" />,
		);

		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-disabled', 'true');
	});

	it('wraps the text, so the marker and the icon are never cut off', () => {
		render(<CheckboxField color="primary" label="Send alerts" />);

		expect(document.querySelector('[data-slot="checkbox-container"]')).toHaveAttribute(
			'data-text-overflow',
			'wrap',
		);
	});

	it('does not render the label of the field or an icon before the text', () => {
		render(<CheckboxField color="primary" label="Send alerts" />);

		expect(document.querySelector('[data-slot="field-label-icon"]')).not.toBeInTheDocument();
	});

	it('shows the missing name of an empty label', () => {
		render(<CheckboxField color="primary" label="" />);

		expect(screen.getByRole('checkbox', { name: '<No label>' })).toBeInTheDocument();
	});
});

describe('CheckboxField description and message', () => {
	it('describes the checkbox with the description, below the text', () => {
		render(
			<CheckboxField
				color="primary"
				label="Send alerts"
				description="Sent to the on-call channel"
				testId="alerts"
			/>,
		);

		const description = screen.getByTestId('alerts-description');

		expect(description).toHaveTextContent('Sent to the on-call channel');
		expect(description).toHaveAttribute('data-slot', 'field-description');
		expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Sent to the on-call channel');
		expect(
			screen.getByText('Send alerts').compareDocumentPosition(description) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it('lines the row up with the text, not with the box', () => {
		// The design tokens are not loaded in the tests, so the gap between the box and the text is
		// declared here, with the step `@signozhq/design-tokens` ships.
		const tokens = document.createElement('style');
		tokens.textContent = ':root { --spacing-4: 8px; --spacing-5: 10px; }';
		document.head.append(tokens);

		render(
			<CheckboxField
				color="primary"
				label="Send alerts"
				description="Sent to the on-call channel"
				testId="alerts"
			/>,
		);

		const box = screen.getByRole('checkbox').getBoundingClientRect();
		const text = screen.getByText('Send alerts').getBoundingClientRect();
		const row = screen.getByTestId('alerts-description').getBoundingClientRect();

		tokens.remove();

		expect(text.left).toBeGreaterThan(box.left);
		expect(Math.abs(row.left - text.left)).toBeLessThanOrEqual(1);
	});

	it('replaces the description with the message in the same row', () => {
		const { rerender } = render(
			<CheckboxField
				color="primary"
				label="Send alerts"
				description="Sent to the on-call channel"
				testId="alerts"
			/>,
		);

		const rowId = screen.getByTestId('alerts-description').id;

		rerender(
			<CheckboxField
				color="primary"
				label="Send alerts"
				description="Sent to the on-call channel"
				error="Accept to continue"
				testId="alerts"
			/>,
		);

		const message = screen.getByTestId('alerts-message');

		expect(message).toHaveAttribute('data-slot', 'field-message');
		expect(message.id).toBe(rowId);
		expect(screen.queryByTestId('alerts-description')).not.toBeInTheDocument();
		expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Accept to continue');
	});

	it('renders no row without a description or a message', () => {
		render(<CheckboxField color="primary" label="Send alerts" testId="alerts" />);

		expect(screen.queryByTestId('alerts-description')).not.toBeInTheDocument();
		expect(screen.queryByTestId('alerts-message')).not.toBeInTheDocument();
		expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-describedby');
	});

	it('announces a message that appears through the polite live region', () => {
		const { rerender } = render(<CheckboxField color="primary" label="Send alerts" />);
		const region = document.querySelector('[data-slot="field-announcer"]');

		expect(region).toHaveAttribute('aria-live', 'polite');
		expect(region).toBeEmptyDOMElement();

		rerender(<CheckboxField color="primary" label="Send alerts" error="Accept to continue" />);

		expect(region).toHaveTextContent('Accept to continue');
	});
});

describe('CheckboxField status', () => {
	it('sets aria-invalid on the checkbox with danger, through error or status', () => {
		const { rerender } = render(
			<CheckboxField color="primary" label="Send alerts" error="Accept to continue" />,
		);

		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
		expect(document.querySelector('[data-slot="field"]')).toHaveAttribute('data-status', 'danger');

		rerender(
			<CheckboxField color="primary" label="Send alerts" status="danger" message="Accept" />,
		);

		expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
	});

	it('leaves aria-invalid off for warning and success', () => {
		const { rerender } = render(
			<CheckboxField color="primary" label="Send alerts" status="warning" message="Careful" />,
		);

		expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
		expect(document.querySelector('[data-slot="field"]')).toHaveAttribute('data-status', 'warning');

		rerender(
			<CheckboxField color="primary" label="Send alerts" status="success" message="Saved" />,
		);

		expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
	});

	it('leaves aria-invalid and data-status off while the error renders nothing', () => {
		render(<CheckboxField color="primary" label="Send alerts" error={undefined} />);

		expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
		expect(document.querySelector('[data-slot="field"]')).not.toHaveAttribute('data-status');
	});

	it('puts the status icon before the message and keeps it out of the name', () => {
		render(<CheckboxField color="primary" label="Send alerts" error="Accept" testId="alerts" />);

		expect(
			screen.getByTestId('alerts-message').querySelector('[aria-hidden="true"]'),
		).toBeInTheDocument();
		expect(screen.getByRole('checkbox', { name: 'Send alerts' })).toBeInTheDocument();
	});
});

describe('CheckboxField required', () => {
	it('shows an aria-hidden asterisk after the text and marks the checkbox required', () => {
		render(<CheckboxField color="primary" label="Accept the terms" required />);

		const checkbox = screen.getByRole('checkbox', { name: 'Accept the terms' });
		const marker = document.querySelector('[data-slot="field-required-marker"]');

		expect(checkbox).toHaveAttribute('aria-required', 'true');
		expect(document.querySelector('input[required]')).toBeNull();
		expect(marker).toHaveAttribute('aria-hidden', 'true');
		expect(marker).toHaveTextContent('*');
		expect(
			screen.getByText('Accept the terms').compareDocumentPosition(marker as Element) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(document.querySelector('[data-slot="field"]')).toHaveAttribute('data-required');
	});

	it('lets a plain form submit while the required checkbox is unchecked', () => {
		const { container } = render(
			<form>
				<CheckboxField color="primary" label="Accept the terms" required />
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(true);
	});

	it('renders no marker while it is not required', () => {
		render(<CheckboxField color="primary" label="Accept the terms" />);

		expect(document.querySelector('[data-slot="field-required-marker"]')).not.toBeInTheDocument();
		expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-required');
	});
});

describe('CheckboxField labelTooltip', () => {
	it('shows an info icon after the text and describes the checkbox with the tooltip text', () => {
		render(
			<CheckboxField
				color="primary"
				label="Share usage data"
				labelTooltip="Only counts, never content"
				testId="usage"
			/>,
		);

		const icon = screen.getByTestId('usage-label-tooltip');
		const checkbox = screen.getByRole('checkbox', { name: 'Share usage data' });

		expect(icon).toHaveAttribute('aria-hidden', 'true');
		expect(checkbox).toHaveAccessibleDescription('Only counts, never content');
		expect(
			screen.getByText('Share usage data').compareDocumentPosition(icon) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it('lists the row before the tooltip text, and keeps that order when the row appears later', () => {
		const { rerender } = render(
			<CheckboxField
				color="primary"
				label="Share usage data"
				labelTooltip="Only counts, never content"
				testId="usage"
			/>,
		);

		rerender(
			<CheckboxField
				color="primary"
				label="Share usage data"
				labelTooltip="Only counts, never content"
				description="Helps us size the product"
				testId="usage"
			/>,
		);

		expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
			'Helps us size the product Only counts, never content',
		);
	});

	it('does not toggle the checkbox when the info icon is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<CheckboxField
				color="primary"
				label="Share usage data"
				labelTooltip="Only counts, never content"
				testId="usage"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByTestId('usage-label-tooltip'));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('checkbox')).not.toBeChecked();

		await user.click(screen.getByText('Share usage data'));

		expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
	});
});

describe('CheckboxField props split', () => {
	it('gives the field parts the testId as their prefix and the root none', () => {
		render(
			<CheckboxField
				color="primary"
				label="Accept the terms"
				description="Read them first"
				labelTooltip="Plain text"
				testId="terms"
			/>,
		);

		expect(screen.getByTestId('terms')).toBe(screen.getByRole('checkbox'));
		expect(screen.getByTestId('terms-description')).toBeInTheDocument();
		expect(screen.getByTestId('terms-label-tooltip')).toBeInTheDocument();
		expect(screen.queryByTestId('terms-label')).not.toBeInTheDocument();
		expect(document.querySelector('[data-slot="field"]')).not.toHaveAttribute('data-testid');
	});

	it('sets no data-testid anywhere without a testId', () => {
		render(
			<CheckboxField
				color="primary"
				label="Accept the terms"
				description="Read them first"
				labelTooltip="Plain text"
			/>,
		);

		// The icon mock of the test setup carries a `data-testid` of its own.
		expect(document.querySelector('[data-testid]:not(svg)')).not.toBeInTheDocument();
	});

	it('drops children, htmlFor and textOverflow that get past the types', () => {
		const props = {
			children: 'Other text',
			htmlFor: 'elsewhere',
			textOverflow: 'ellipsis',
		} as never;

		render(<CheckboxField color="primary" label="Accept the terms" {...props} />);

		expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).toBeInTheDocument();
		expect(screen.queryByText('Other text')).not.toBeInTheDocument();
		expect(screen.getByRole('checkbox')).not.toHaveAttribute('for');
		expect(document.querySelector('[data-slot="checkbox-container"]')).toHaveAttribute(
			'data-text-overflow',
			'wrap',
		);
	});

	it('drops className and style', () => {
		const props = { className: 'styled', style: { color: 'red' } } as never;

		render(<CheckboxField color="primary" label="Accept the terms" {...props} />);

		expect(screen.getByRole('checkbox')).not.toHaveClass('styled');
		expect(screen.getByRole('checkbox')).not.toHaveStyle({ color: 'red' });
	});
});

describe('CheckboxField onBlur', () => {
	it('reaches the checkbox: once when focus leaves, and not on a toggle', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<CheckboxField color="primary" label="Send alerts" onBlur={onBlur} />
				<button type="button">Next</button>
			</>,
		);

		await user.click(screen.getByText('Send alerts'));

		expect(onBlur).not.toHaveBeenCalled();

		await user.tab();

		expect(onBlur).toHaveBeenCalledOnce();
	});
});
