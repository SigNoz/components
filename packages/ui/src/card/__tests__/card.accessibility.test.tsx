import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '../../switch/switch.js';
import { Card } from '../card.js';
import type { CardHeaderSuffixField } from '../types.js';

describe('Card headerSuffix as a function', () => {
	it('names a Switch after the title', () => {
		render(
			<Card
				title="Display timestamp in 24-hour format"
				description="Use the 24-hour convention while showing timestamps."
				headerSuffix={(field) => <Switch color="primary" {...field} />}
			/>,
		);

		const control = screen.getByRole('switch', { name: 'Display timestamp in 24-hour format' });

		expect(control).toHaveAccessibleDescription(
			'Use the 24-hour convention while showing timestamps.',
		);
	});

	it('names a Switch with no description and leaves aria-describedby out', () => {
		render(
			<Card
				title="Send anonymous usage telemetry"
				headerSuffix={(field) => <Switch color="primary" {...field} />}
			/>,
		);

		const control = screen.getByRole('switch', { name: 'Send anonymous usage telemetry' });

		expect(control).not.toHaveAttribute('aria-describedby');
	});

	it('names a plain input after the title', () => {
		render(
			<Card title="Retention period" headerSuffix={(field) => <input type="text" {...field} />} />,
		);

		expect(screen.getByRole('textbox', { name: 'Retention period' })).toBeInTheDocument();
	});

	it('passes the id of the title, and the id of the description when there is one', () => {
		const headerSuffix = vi.fn((_field: CardHeaderSuffixField) => <span>Control</span>);

		render(
			<Card testId="card" title="Title" description="Description" headerSuffix={headerSuffix} />,
		);

		const field = headerSuffix.mock.calls[0]?.[0];

		expect(field?.id).toEqual(expect.any(String));
		expect(field?.['aria-labelledby']).toBe(screen.getByTestId('card-title').id);
		expect(field?.['aria-describedby']).toBe(screen.getByTestId('card-description').id);
	});

	it('leaves aria-describedby out of the field without a description', () => {
		const headerSuffix = vi.fn((_field: CardHeaderSuffixField) => <span>Control</span>);

		render(<Card title="Title" description="   " headerSuffix={headerSuffix} />);

		expect(headerSuffix.mock.calls[0]?.[0]).not.toHaveProperty('aria-describedby');
	});

	it('gives each card its own ids', () => {
		const fields: CardHeaderSuffixField[] = [];
		const headerSuffix = (field: CardHeaderSuffixField) => {
			fields.push(field);
			return <span>Control</span>;
		};

		render(
			<>
				<Card title="One" headerSuffix={headerSuffix} />
				<Card title="Two" headerSuffix={headerSuffix} />
			</>,
		);

		const [first, second] = fields;

		expect(first?.id).not.toBe(second?.id);
		expect(first?.['aria-labelledby']).not.toBe(second?.['aria-labelledby']);
	});

	it('renders no suffix slot for a function that returns nothing', () => {
		render(<Card testId="card" title="Title" headerSuffix={() => null} />);

		expect(screen.queryByTestId('card-header-suffix')).toBeNull();
	});

	it('accepts a node in place of the function', () => {
		render(<Card testId="card" title="Title" headerSuffix={<button type="button">Go</button>} />);

		expect(screen.getByTestId('card-header-suffix')).toContainElement(
			screen.getByRole('button', { name: 'Go' }),
		);
	});
});

describe('Card text', () => {
	it('gives the title and the description an id each', () => {
		render(<Card testId="card" title="Title" description="Description" />);

		const title = screen.getByTestId('card-title');
		const description = screen.getByTestId('card-description');

		expect(title.id).not.toBe('');
		expect(description.id).not.toBe('');
		expect(title.id).not.toBe(description.id);
	});

	it('renders the title as text, not as a heading', () => {
		render(<Card title="Title" description="Description" />);

		expect(screen.queryByRole('heading')).toBeNull();
	});

	it('reads the whole title while it is cut, since the text stays in the page', () => {
		const title = 'A title that is far too long for the row of the card';

		render(<Card testId="card" title={title} />);

		expect(screen.getByTestId('card-title')).toHaveTextContent(title);
	});
});

describe('Card focus', () => {
	it('has no tab stop of its own', () => {
		const { container } = render(
			<Card title="Title" description="Description" footerPrefix="Hint">
				Body
			</Card>,
		);

		expect(container.querySelectorAll('[tabindex]')).toHaveLength(0);
	});
});
