import { render, screen } from '@testing-library/react';
import { Search } from '@signozhq/icons';
import { describe, expect, it } from 'vitest';
import { Input } from '../input.js';

describe('Input rendering', () => {
	it('renders a native input inside the frame', () => {
		render(<Input placeholder="For eg. Simpsonville..." testId="org" />);

		const field = screen.getByRole('textbox');
		const frame = screen.getByTestId('org');

		expect(frame).toHaveAttribute('data-slot', 'input');
		expect(field).toHaveAttribute('data-slot', 'input-field');
		expect(field).toHaveAttribute('data-testid', 'org-field');
		expect(frame).toContainElement(field);
	});

	it('defaults to the base size and the default variant', () => {
		render(<Input testId="org" />);

		const frame = screen.getByTestId('org');

		expect(frame).toHaveAttribute('data-size', 'base');
		expect(frame).toHaveAttribute('data-variant', 'default');
		expect(frame).not.toHaveAttribute('data-status');
		expect(frame).not.toHaveAttribute('data-member');
	});

	it('mirrors size, variant and noFocusRing onto the frame', () => {
		render(<Input size="large" variant="unstyled" noFocusRing testId="org" />);

		const frame = screen.getByTestId('org');

		expect(frame).toHaveAttribute('data-size', 'large');
		expect(frame).toHaveAttribute('data-variant', 'unstyled');
		expect(frame).toHaveAttribute('data-no-focus-ring');
	});

	it.each(['success', 'warning', 'danger'] as const)(
		'renders the %s status on the frame with its trailing icon',
		(status) => {
			render(<Input status={status} testId="org" />);

			const frame = screen.getByTestId('org');
			const icon = screen.getByTestId('org-status');

			expect(frame).toHaveAttribute('data-status', status);
			expect(icon).toHaveAttribute('data-slot', 'input-status-icon');
			expect(icon).toHaveAttribute('aria-hidden', 'true');
		},
	);

	it('announces danger as aria-invalid and leaves the other statuses alone', () => {
		const { rerender } = render(<Input status="danger" testId="org" />);

		expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');

		rerender(<Input status="warning" testId="org" />);

		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
	});

	it('renders prefix and suffix in their slots', () => {
		render(<Input prefix={<Search aria-hidden="true" />} suffix={<span>⌘K</span>} testId="org" />);

		expect(screen.getByTestId('org-prefix')).toHaveAttribute('data-slot', 'input-prefix');
		expect(screen.getByTestId('org-suffix')).toHaveAttribute('data-slot', 'input-suffix');
	});

	it('drops a prefix or suffix that renders nothing', () => {
		render(<Input prefix={null} suffix={false} testId="org" />);

		expect(screen.queryByTestId('org-prefix')).toBeNull();
		expect(screen.queryByTestId('org-suffix')).toBeNull();
	});

	it('renders the status icon after the suffix', () => {
		render(<Input suffix={<span>clear</span>} status="danger" testId="org" />);

		const suffix = screen.getByTestId('org-suffix');
		const statusIcon = screen.getByTestId('org-status');

		expect(suffix.compareDocumentPosition(statusIcon)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
	});

	it('writes width and maxWidth as internal custom properties on the frame', () => {
		render(<Input width={240} maxWidth="50%" testId="org" />);

		const frame = screen.getByTestId('org');

		expect(frame.style.getPropertyValue('--input-internal-width')).toBe('240px');
		expect(frame.style.getPropertyValue('--input-internal-max-width')).toBe('50%');
	});

	it('forwards aria-* to the input and data-* to the frame', () => {
		render(<Input aria-label="Organisation" data-analytics="org-input" testId="org" />);

		expect(screen.getByRole('textbox', { name: 'Organisation' })).toBeInTheDocument();
		expect(screen.getByTestId('org')).toHaveAttribute('data-analytics', 'org-input');
	});

	it('marks the frame disabled only while not read-only', () => {
		const { rerender } = render(<Input disabled disabledTooltip={undefined} testId="org" />);

		expect(screen.getByTestId('org')).toHaveAttribute('data-disabled');
		expect(screen.getByRole('textbox')).toBeDisabled();

		rerender(
			<Input
				disabled
				disabledTooltip={undefined}
				readOnly
				readOnlyTooltip={undefined}
				testId="org"
			/>,
		);

		const frame = screen.getByTestId('org');

		expect(frame).not.toHaveAttribute('data-disabled');
		expect(frame).toHaveAttribute('data-readonly');
		expect(screen.getByRole('textbox')).not.toBeDisabled();
		expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
	});
});
