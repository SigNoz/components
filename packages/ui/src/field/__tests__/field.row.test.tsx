import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from '../../input/input.js';
import { Field } from '../field.js';
import { describedByIds, slot } from './field.test-utils.js';

describe('Field description', () => {
	it('renders the description below the control, in the neutral row', () => {
		render(
			<Field label="Organisation" description="The name on your invoices" testId="field">
				<Input />
			</Field>,
		);

		const description = screen.getByTestId('field-description');

		expect(description).toHaveAttribute('data-slot', 'field-description');
		expect(description).toHaveTextContent('The name on your invoices');
		expect(description.previousElementSibling).toBe(
			slot(screen.getByTestId('field'), 'field-control'),
		);
		expect(description.querySelector('svg')).toBeNull();
		expect(screen.getByTestId('field')).not.toHaveAttribute('data-status');
	});

	it('describes the control with the description', () => {
		render(
			<Field label="Organisation" description="The name on your invoices" testId="field">
				<Input />
			</Field>,
		);

		const input = screen.getByRole('textbox');

		expect(describedByIds(input)).toEqual([screen.getByTestId('field-description').id]);
		expect(input).toHaveAccessibleDescription('The name on your invoices');
	});

	it.each([
		['undefined', undefined],
		['null', null],
		['an empty string', ''],
		['false', false],
	])('renders no row for a description that is %s', (_name, description) => {
		render(
			<Field label="Organisation" description={description} testId="field">
				<Input />
			</Field>,
		);

		expect(screen.queryByTestId('field-description')).toBeNull();
		expect(slot(screen.getByTestId('field'), 'field-description')).toBeNull();
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
	});

	it('ends the field at the control without a description or a message', () => {
		render(
			<Field label="Organisation" testId="field">
				<Input />
			</Field>,
		);

		const root = screen.getByTestId('field');

		expect(root.children).toHaveLength(3);
		expect(root.children[1]).toBe(slot(root, 'field-control'));
		expect(root.lastElementChild).toBe(slot(root, 'field-announcer'));
	});
});

describe('Field description replaced by the message', () => {
	it('shows the message in the same row as the description, with the same id', () => {
		const { rerender } = render(
			<Field label="Organisation" description="The name on your invoices" testId="field">
				<Input />
			</Field>,
		);
		const row = screen.getByTestId('field-description');
		const id = row.id;

		rerender(
			<Field
				label="Organisation"
				description="The name on your invoices"
				error="Taken"
				testId="field"
			>
				<Input />
			</Field>,
		);

		const message = screen.getByTestId('field-message');

		expect(message).toBe(row);
		expect(message.id).toBe(id);
		expect(message).toHaveAttribute('data-slot', 'field-message');
		expect(message).toHaveTextContent('Taken');
		expect(message).not.toHaveTextContent('The name on your invoices');
		expect(screen.queryByTestId('field-description')).toBeNull();
		expect(screen.queryByText('The name on your invoices')).toBeNull();
	});

	it('brings the description back in the same row once the message clears', () => {
		const { rerender } = render(
			<Field
				label="Organisation"
				description="The name on your invoices"
				error="Taken"
				testId="field"
			>
				<Input />
			</Field>,
		);
		const row = screen.getByTestId('field-message');

		rerender(
			<Field
				label="Organisation"
				description="The name on your invoices"
				error={undefined}
				testId="field"
			>
				<Input />
			</Field>,
		);

		const description = screen.getByTestId('field-description');

		expect(description).toBe(row);
		expect(description).toHaveAttribute('data-slot', 'field-description');
		expect(description).toHaveTextContent('The name on your invoices');
		expect(screen.queryByTestId('field-message')).toBeNull();
	});

	it('keeps the aria-describedby of the control while the message replaces the description', () => {
		const { rerender } = render(
			<Field label="Organisation" description="The name on your invoices" labelTooltip="Why">
				<Input />
			</Field>,
		);
		const before = screen.getByRole('textbox').getAttribute('aria-describedby');

		rerender(
			<Field
				label="Organisation"
				description="The name on your invoices"
				labelTooltip="Why"
				error="Taken"
			>
				<Input />
			</Field>,
		);

		expect(before).not.toBeNull();
		expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', before);
		expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Taken Why');
	});

	it('does not grow the field by a line when the message replaces the description', () => {
		const { rerender } = render(
			<div style={{ inlineSize: 320 }}>
				<Field label="Organisation" description="The name on your invoices" testId="field">
					<Input />
				</Field>
			</div>,
		);
		const before = screen.getByTestId('field').getBoundingClientRect().height;

		rerender(
			<div style={{ inlineSize: 320 }}>
				<Field
					label="Organisation"
					description="The name on your invoices"
					error="Name taken"
					testId="field"
				>
					<Input />
				</Field>
			</div>,
		);

		expect(before).toBeGreaterThan(0);
		expect(screen.getByTestId('field').getBoundingClientRect().height).toBe(before);
	});
});

describe('Field aria-describedby', () => {
	it('lists the own value, then the row, then the tooltip text', () => {
		render(
			<div>
				<span id="hint">Use the legal name</span>
				<Field
					label="Organisation"
					description="The name on your invoices"
					labelTooltip="Why we ask"
					testId="field"
				>
					<Input aria-describedby="hint" />
				</Field>
			</div>,
		);

		const ids = describedByIds(screen.getByRole('textbox'));
		const tooltipText = document.getElementById(ids[2] as string);

		expect(ids).toHaveLength(3);
		expect(ids[0]).toBe('hint');
		expect(ids[1]).toBe(screen.getByTestId('field-description').id);
		expect(tooltipText).toHaveTextContent('Why we ask');
		expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
			'Use the legal name The name on your invoices Why we ask',
		);
	});

	it('lists the message before the tooltip text', () => {
		render(
			<Field label="Organisation" error="Taken" labelTooltip="Why we ask" testId="field">
				<Input />
			</Field>,
		);

		const ids = describedByIds(screen.getByRole('textbox'));

		expect(ids).toHaveLength(2);
		expect(ids[0]).toBe(screen.getByTestId('field-message').id);
		expect(document.getElementById(ids[1] as string)).toHaveTextContent('Why we ask');
	});

	it('lists only the tooltip text without a row', () => {
		render(
			<Field label="Organisation" labelTooltip="Why we ask">
				<Input />
			</Field>,
		);

		const ids = describedByIds(screen.getByRole('textbox'));

		expect(ids).toHaveLength(1);
		expect(document.getElementById(ids[0] as string)).toHaveTextContent('Why we ask');
	});

	it('keeps the row ahead of the tooltip text when the row appears after the first render', () => {
		const { rerender } = render(
			<Field label="Organisation" labelTooltip="Why we ask" testId="field">
				<Input />
			</Field>,
		);

		rerender(
			<Field label="Organisation" labelTooltip="Why we ask" error="Taken" testId="field">
				<Input />
			</Field>,
		);

		const ids = describedByIds(screen.getByRole('textbox'));

		expect(ids[0]).toBe(screen.getByTestId('field-message').id);
		expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Taken Why we ask');
	});

	it('leaves the attribute off while nothing describes the control', () => {
		render(
			<Field label="Organisation">
				<Input />
			</Field>,
		);

		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
	});
});

describe('Field live region', () => {
	it('keeps a polite live region mounted with no text while there is no message', () => {
		render(
			<Field label="Organisation" description="The name on your invoices" testId="field">
				<Input />
			</Field>,
		);

		const announcer = slot(screen.getByTestId('field'), 'field-announcer');

		expect(announcer).toHaveAttribute('aria-live', 'polite');
		expect(announcer).toBeEmptyDOMElement();
	});

	it('holds the text of the message', () => {
		render(
			<Field label="Organisation" error="This name is taken" testId="field">
				<Input />
			</Field>,
		);

		expect(slot(screen.getByTestId('field'), 'field-announcer')).toHaveTextContent(
			'This name is taken',
		);
	});

	it('is the same element before and after a message appears, and follows it as it changes', () => {
		const { rerender } = render(
			<Field label="Organisation" testId="field">
				<Input />
			</Field>,
		);
		const announcer = slot(screen.getByTestId('field'), 'field-announcer');

		rerender(
			<Field label="Organisation" error="This name is taken" testId="field">
				<Input />
			</Field>,
		);

		expect(slot(screen.getByTestId('field'), 'field-announcer')).toBe(announcer);
		expect(announcer).toHaveTextContent('This name is taken');

		rerender(
			<Field label="Organisation" error="Use at least 3 letters" testId="field">
				<Input />
			</Field>,
		);

		expect(slot(screen.getByTestId('field'), 'field-announcer')).toBe(announcer);
		expect(announcer).toHaveTextContent('Use at least 3 letters');

		rerender(
			<Field label="Organisation" error={undefined} testId="field">
				<Input />
			</Field>,
		);

		expect(announcer).toBeEmptyDOMElement();
	});

	it('does not announce the description', () => {
		const { rerender } = render(
			<Field label="Organisation" testId="field">
				<Input />
			</Field>,
		);

		rerender(
			<Field label="Organisation" description="The name on your invoices" testId="field">
				<Input />
			</Field>,
		);

		expect(slot(screen.getByTestId('field'), 'field-announcer')).toBeEmptyDOMElement();
	});

	it('holds the text of a message with a link, not a second link to tab to', () => {
		const message = (
			<>
				This name is taken. <a href="#existing">Open it</a>
			</>
		);
		const { rerender } = render(
			<Field label="Organisation" status="danger" message={message} testId="field">
				<Input />
			</Field>,
		);
		const announcer = slot(screen.getByTestId('field'), 'field-announcer');

		expect(screen.getAllByRole('link', { name: 'Open it' })).toHaveLength(1);
		expect(announcer).toHaveTextContent('This name is taken. Open it');
		expect(announcer?.children).toHaveLength(0);

		rerender(
			<Field label="Organisation" status="danger" message="Use at least 3 letters" testId="field">
				<Input />
			</Field>,
		);

		expect(announcer).toHaveTextContent('Use at least 3 letters');
	});

	it('takes no space', () => {
		render(
			<Field label="Organisation" error="This name is taken" testId="field">
				<Input />
			</Field>,
		);

		const rect = (
			slot(screen.getByTestId('field'), 'field-announcer') as HTMLElement
		).getBoundingClientRect();

		expect(rect.width).toBeLessThanOrEqual(1);
		expect(rect.height).toBeLessThanOrEqual(1);
	});
});

describe('Field labelTooltip', () => {
	it('renders an aria-hidden info icon after the label text', () => {
		render(
			<Field label="Organisation" labelTooltip="Why we ask" required testId="field">
				<Input />
			</Field>,
		);

		const label = screen.getByTestId('field-label');
		const icon = screen.getByTestId('field-label-tooltip');

		expect(label).toContainElement(icon);
		expect(icon).toHaveAttribute('data-slot', 'field-label-tooltip');
		expect(icon).toHaveAttribute('aria-hidden', 'true');
		expect(icon.querySelector('svg')).not.toBeNull();
		expect(icon.previousElementSibling).toBe(slot(label, 'field-required-marker'));
	});

	it('is not a tab stop', async () => {
		const user = userEvent.setup();
		render(
			<Field label="Organisation" labelTooltip="Why we ask" testId="field">
				<Input />
			</Field>,
		);
		const icon = screen.getByTestId('field-label-tooltip');

		await user.tab();

		expect(screen.getByRole('textbox')).toHaveFocus();
		expect(icon).not.toHaveAttribute('tabindex');
		expect(icon.matches('button, a, input, [tabindex]')).toBe(false);
		expect(icon.querySelector('button, a, input, [tabindex]')).toBeNull();
	});

	it('keeps the icon out of the control name', () => {
		render(
			<Field label="Organisation" labelTooltip="Why we ask">
				<Input />
			</Field>,
		);

		expect(screen.getByRole('textbox')).toHaveAccessibleName('Organisation');
	});

	it('puts the tooltip text in the description of the control, hidden on screen', () => {
		render(
			<Field label="Organisation" labelTooltip="Why we ask" testId="field">
				<Input />
			</Field>,
		);

		const input = screen.getByRole('textbox');
		const text = document.getElementById(describedByIds(input)[0] as string);

		expect(text).toHaveTextContent('Why we ask');
		expect(text).not.toBeVisible();
		expect(input).toHaveAccessibleDescription('Why we ask');
	});

	it('shows the tooltip on hover of the icon', async () => {
		const user = userEvent.setup();
		render(
			<Field label="Organisation" labelTooltip="Why we ask" testId="field">
				<Input />
			</Field>,
		);

		await user.hover(screen.getByTestId('field-label-tooltip'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent('Why we ask');
	});

	it.each([
		['undefined', undefined],
		['null', null],
		['an empty string', ''],
		['false', false],
		['an empty fragment', <></>],
	])('renders no icon and no description for a tooltip that is %s', (_name, labelTooltip) => {
		render(
			<Field label="Organisation" labelTooltip={labelTooltip} testId="field">
				<Input />
			</Field>,
		);

		expect(screen.queryByTestId('field-label-tooltip')).toBeNull();
		expect(slot(screen.getByTestId('field-label'), 'field-label-tooltip')).toBeNull();
		expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
	});
});
