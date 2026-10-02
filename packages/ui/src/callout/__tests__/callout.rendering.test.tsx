import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Callout } from '../callout.js';

const icon = <svg data-testid="icon" />;

describe('Callout rendering', () => {
	it('renders the description with its icon', () => {
		render(
			<Callout color="primary" size="sm" icon={icon} testId="c">
				Heads up
			</Callout>,
		);

		expect(screen.getByTestId('c')).toHaveAttribute('data-slot', 'callout');
		expect(screen.getByTestId('c-description')).toHaveTextContent('Heads up');
		expect(screen.getByTestId('c-icon')).toBeInTheDocument();
	});

	it('hides the icon from assistive tech', () => {
		render(
			<Callout color="primary" size="sm" icon={icon} testId="c">
				a
			</Callout>,
		);

		expect(screen.getByTestId('c-icon')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('c-icon')).toContainElement(screen.getByTestId('icon'));
	});

	it('mirrors color and size as data attributes', () => {
		render(
			<Callout color="danger" size="md" icon={icon} testId="c">
				a
			</Callout>,
		);

		expect(screen.getByTestId('c')).toHaveAttribute('data-color', 'danger');
		expect(screen.getByTestId('c')).toHaveAttribute('data-size', 'md');
	});

	it('forwards aria and data attributes and the id', () => {
		render(
			<Callout
				color="primary"
				size="sm"
				icon={icon}
				id="x"
				aria-label="note"
				data-foo="bar"
				testId="c"
			>
				a
			</Callout>,
		);

		expect(screen.getByTestId('c')).toHaveAttribute('id', 'x');
		expect(screen.getByTestId('c')).toHaveAttribute('aria-label', 'note');
		expect(screen.getByTestId('c')).toHaveAttribute('data-foo', 'bar');
	});

	it.each([null, undefined, '', false])('renders nothing for empty children %s', (children) => {
		const { container } = render(
			<Callout color="primary" size="sm" icon={icon}>
				{children}
			</Callout>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it('has no title, toggle or close button', () => {
		render(
			<Callout color="primary" size="sm" icon={icon} testId="c">
				a
			</Callout>,
		);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
		expect(screen.getByTestId('c')).not.toHaveAttribute('data-has-title');
	});
});

describe('Callout live region', () => {
	it.each(['danger', 'highlight-danger'] as const)('is an alert for %s', (color) => {
		render(
			<Callout color={color} size="sm" icon={icon}>
				a
			</Callout>,
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it.each(['primary', 'secondary', 'success', 'warning', 'info', 'archive'] as const)(
		'is a status for %s',
		(color) => {
			render(
				<Callout color={color} size="sm" icon={icon}>
					a
				</Callout>,
			);

			expect(screen.getByRole('status')).toBeInTheDocument();
		},
	);

	it.each(['danger', 'primary'] as const)('is no live region when expandable, %s', (color) => {
		render(
			<Callout.Expandable color={color} size="sm" icon={icon} title="Title" defaultExpanded={false}>
				a
			</Callout.Expandable>,
		);

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		expect(screen.queryByRole('status')).not.toBeInTheDocument();
	});
});

describe('Callout sizing', () => {
	it('writes width, maxWidth, height and maxHeight as internal custom properties', () => {
		render(
			<Callout
				color="primary"
				size="sm"
				icon={icon}
				testId="c"
				width={300}
				maxWidth="50%"
				height="10rem"
				maxHeight={200}
			>
				a
			</Callout>,
		);

		const style = screen.getByTestId('c').style;
		expect(style.getPropertyValue('--callout-internal-width')).toBe('300px');
		expect(style.getPropertyValue('--callout-internal-max-width')).toBe('50%');
		expect(style.getPropertyValue('--callout-internal-height')).toBe('10rem');
		expect(style.getPropertyValue('--callout-internal-max-height')).toBe('200px');
	});
});
