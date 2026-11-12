import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { SelectField } from '../presets/select-field.js';
import { Select } from '../select.js';
import { FRAMEWORKS } from './select.test-utils.js';

function withoutIds(html: string): string {
	return html.replace(/(base-ui-)?:r[0-9a-z]+:/g, ':id:');
}

describe('SelectField', () => {
	it('names a single trigger with the label, not the placeholder', () => {
		render(<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} />);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toBeInTheDocument();
		expect(screen.getByText('Framework').closest('label')).not.toBeNull();
	});

	it('names a multiple trigger with the label, not the placeholder', async () => {
		render(<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} multiple />);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toBeInstanceOf(
			HTMLDivElement,
		);
	});

	it('names the popup list with the label too', async () => {
		render(<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} multiple />);

		await userEvent.click(await screen.findByRole('combobox', { name: 'Framework' }));

		expect(await screen.findByRole('listbox', { name: 'Framework' })).toBeInTheDocument();
	});

	it('moves the focus to a multiple trigger when the label is clicked', async () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				multiple
				testId="framework"
			/>,
		);
		await screen.findByRole('combobox', { name: 'Framework' });

		await userEvent.click(screen.getByTestId('framework-label'));

		expect(screen.getByTestId('framework')).toHaveFocus();
	});

	it('describes the trigger with the description', () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				description="The one the team builds with."
			/>,
		);

		expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
			'The one the team builds with.',
		);
	});

	it('describes the trigger with the message in place of the description', () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				description="The one the team builds with."
				status="warning"
				message="Vue is deprecated here."
			/>,
		);

		expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Vue is deprecated here.');
	});

	it('adds the label tooltip text after the row', () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				description="The one the team builds with."
				labelTooltip="Applies to new projects"
			/>,
		);

		expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
			'The one the team builds with. Applies to new projects',
		);
	});

	it('describes a multiple trigger too', async () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				multiple
				error="Pick at least one"
			/>,
		);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toHaveAccessibleDescription(
			'Pick at least one',
		);
	});

	it('sets aria-invalid with an error and with a danger status', () => {
		const { rerender } = render(
			<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} error="Required" />,
		);

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');

		rerender(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				status="danger"
				message="Required"
			/>,
		);

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
	});

	it('sets aria-invalid on a multiple trigger', async () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				multiple
				error="Required"
			/>,
		);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-invalid',
			'true',
		);
	});

	it('leaves aria-invalid off for warning, success and a valid field', () => {
		const { rerender } = render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				status="warning"
				message="Careful"
			/>,
		);

		expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');

		rerender(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				status="success"
				message="Checked"
			/>,
		);

		expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');

		rerender(
			<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} error={undefined} />,
		);

		expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
	});

	it('marks the label and the trigger as required', () => {
		render(<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} required />);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-required',
			'true',
		);
		expect(document.querySelector('[data-slot="field-required-marker"]')).toHaveAttribute(
			'aria-hidden',
			'true',
		);
	});

	it('marks a multiple trigger as required', async () => {
		render(
			<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} multiple required />,
		);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-required',
			'true',
		);
	});

	it('is not required by default', () => {
		render(<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} />);

		expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-required');
		expect(document.querySelector('[data-slot="field-required-marker"]')).toBeNull();
	});

	it('names the field parts from the testId and keeps the testId on the trigger', () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				labelTooltip="Applies to new projects"
				description="The one the team builds with."
				testId="framework"
			/>,
		);

		expect(screen.getByTestId('framework')).toBe(screen.getByRole('combobox'));
		expect(screen.getByTestId('framework-label')).toHaveTextContent('Framework');
		expect(screen.getByTestId('framework-label-tooltip')).toBeInTheDocument();
		expect(screen.getByTestId('framework-description')).toHaveTextContent(
			'The one the team builds with.',
		);
		expect(document.querySelector('[data-slot="field"]')).not.toHaveAttribute('data-testid');
	});

	it('names the message part while a message shows', () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				error="Required"
				testId="framework"
			/>,
		);

		expect(screen.getByTestId('framework-message')).toHaveTextContent('Required');
	});

	it('still names the rows from the testId', async () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				testId="framework"
			/>,
		);

		await userEvent.click(screen.getByTestId('framework'));

		expect(await screen.findByTestId('framework-item-vue')).toBeInTheDocument();
	});

	it('adds no testId to any part without one', () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				description="Help"
				labelTooltip="Tip"
			/>,
		);

		expect(document.querySelectorAll('[data-slot^="field"][data-testid]')).toHaveLength(0);
		expect(screen.getByRole('combobox')).not.toHaveAttribute('data-testid');
	});

	it('hands every other prop to the select', () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				id="framework-select"
				aria-keyshortcuts="F"
				data-source="settings"
				defaultValue="vue"
			/>,
		);

		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		expect(trigger).toHaveAttribute('id', 'framework-select');
		expect(trigger).toHaveAttribute('aria-keyshortcuts', 'F');
		expect(trigger).toHaveAttribute('data-source', 'settings');
		expect(trigger).toHaveTextContent('Vue');
		expect(document.querySelector('[data-slot="field"]')).not.toHaveAttribute('data-source');
	});

	it('keeps the name when the select brings its own id', () => {
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				id="framework-select"
				multiple
			/>,
		);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'id',
			'framework-select',
		);
		expect(screen.getByText('Framework').closest('label')).toHaveAttribute(
			'for',
			'framework-select',
		);
	});

	it('forwards the ref to the trigger, a button for one value and a div for several', () => {
		const single = createRef<HTMLElement>();
		const multiple = createRef<HTMLElement>();
		render(
			<>
				<SelectField
					label="One"
					placeholder="Pick one"
					items={FRAMEWORKS}
					ref={single}
					testId="one"
				/>
				<SelectField
					label="Several"
					placeholder="Pick some"
					items={FRAMEWORKS}
					multiple
					ref={multiple}
					testId="several"
				/>
			</>,
		);

		expect(single.current).toBeInstanceOf(HTMLButtonElement);
		expect(single.current).toBe(screen.getByTestId('one'));
		expect(multiple.current).toBeInstanceOf(HTMLDivElement);
		expect(multiple.current).toBe(screen.getByTestId('several'));
	});

	it('puts the focus on the trigger when the ref gets focus(), the way react-hook-form does', () => {
		const ref = createRef<HTMLElement>();
		render(<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} ref={ref} />);

		ref.current?.focus();

		expect(screen.getByRole('combobox')).toHaveFocus();
	});

	it('picks a row and reports a string, controlled and uncontrolled', async () => {
		const onChange = vi.fn();

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<SelectField
					label="Controlled"
					placeholder="Pick one"
					items={FRAMEWORKS}
					value={value}
					onChange={(next) => {
						onChange(next);
						setValue(next);
					}}
				/>
			);
		}

		render(
			<>
				<Controlled />
				<SelectField label="Free" placeholder="Pick one" items={FRAMEWORKS} />
			</>,
		);

		await userEvent.click(screen.getByRole('combobox', { name: 'Controlled' }));
		await userEvent.click(
			within(await screen.findByRole('listbox')).getByRole('option', { name: 'Vue' }),
		);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('vue');
		await waitFor(() => {
			expect(screen.getByRole('combobox', { name: 'Controlled' })).toHaveTextContent('Vue');
		});

		await userEvent.click(screen.getByRole('combobox', { name: 'Free' }));
		await userEvent.click(
			within(await screen.findByRole('listbox')).getByRole('option', { name: 'Svelte' }),
		);

		await waitFor(() => {
			expect(screen.getByRole('combobox', { name: 'Free' })).toHaveTextContent('Svelte');
		});
	});

	it('reports an array with multiple', async () => {
		const onChange = vi.fn();
		render(
			<SelectField
				label="Frameworks"
				placeholder="Pick some"
				items={FRAMEWORKS}
				multiple
				onChange={onChange}
			/>,
		);

		await userEvent.click(await screen.findByRole('combobox', { name: 'Frameworks' }));
		await userEvent.click(
			within(await screen.findByRole('listbox')).getByRole('option', { name: 'Vue' }),
		);

		expect(onChange).toHaveBeenCalledWith(['vue']);
	});

	it('takes the value, onChange and ref a Controller hands over', async () => {
		const ref = createRef<HTMLElement>();
		const onChange = vi.fn();
		const field = { value: 'react', onChange, ref };
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				{...field}
				error="Required"
			/>,
		);

		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		expect(trigger).toHaveTextContent('React');
		expect(ref.current).toBe(trigger);

		await userEvent.click(trigger);
		await userEvent.click(
			within(await screen.findByRole('listbox')).getByRole('option', { name: 'Angular' }),
		);

		expect(onChange).toHaveBeenCalledWith('angular');
	});

	it('renders the DOM of the hand-written Field and Select', () => {
		const { container: shorthand } = render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				labelTooltip="Applies to new projects"
				description="The one the team builds with."
				required
				error="Required"
			/>,
		);
		const { container: written } = render(
			<Field
				label="Framework"
				labelTooltip="Applies to new projects"
				description="The one the team builds with."
				required
				error="Required"
			>
				<Select placeholder="Pick one" items={FRAMEWORKS} />
			</Field>,
		);

		expect(withoutIds(shorthand.innerHTML)).toBe(withoutIds(written.innerHTML));
	});
});

describe('the danger tint', () => {
	afterEach(() => {
		document.querySelector('[data-test-tokens]')?.remove();
	});

	function declareDestructive(): void {
		const tokens = document.createElement('style');
		tokens.dataset['testTokens'] = '';
		tokens.textContent = ':root { --destructive: rgb(255, 0, 0); }';
		document.head.append(tokens);
	}

	it('paints the border of the trigger with the destructive color while the field is in danger', () => {
		declareDestructive();
		render(
			<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} error="Required" />,
		);

		expect(getComputedStyle(screen.getByRole('combobox')).borderTopColor).toBe('rgb(255, 0, 0)');
	});

	it('leaves the border alone for a valid field', () => {
		declareDestructive();
		render(<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} />);

		expect(getComputedStyle(screen.getByRole('combobox')).borderTopColor).not.toBe(
			'rgb(255, 0, 0)',
		);
	});

	it('leaves the border alone for warning and success', () => {
		declareDestructive();
		render(
			<SelectField
				label="Framework"
				placeholder="Pick one"
				items={FRAMEWORKS}
				status="warning"
				message="Careful"
			/>,
		);

		expect(getComputedStyle(screen.getByRole('combobox')).borderTopColor).not.toBe(
			'rgb(255, 0, 0)',
		);
	});
});

describe('Select inside a hand-written Field', () => {
	it('takes required from the field', () => {
		render(
			<Field label="Framework" required>
				<Select placeholder="Pick one" items={FRAMEWORKS} />
			</Field>,
		);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-required',
			'true',
		);
	});

	it('lets its own required win over the field', () => {
		render(
			<Field label="Framework" required>
				<Select placeholder="Pick one" items={FRAMEWORKS} required={false} />
			</Field>,
		);

		expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-required');
	});

	it('announces the field required with aria-required and no native required', async () => {
		const { container } = render(
			<Field label="Framework" required>
				<Select placeholder="Pick one" items={FRAMEWORKS} />
			</Field>,
		);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-required',
			'true',
		);
		expect(container.querySelector('input[required]')).toBeNull();
	});

	it('announces the field required on a multiple trigger with no native required', async () => {
		const { container } = render(
			<Field label="Framework" required>
				<Select placeholder="Pick one" items={FRAMEWORKS} multiple />
			</Field>,
		);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-required',
			'true',
		);
		expect(container.querySelector('input[required]')).toBeNull();
	});

	it('keeps the native required for its own required inside a field', () => {
		const { container } = render(
			<Field label="Framework" required>
				<Select placeholder="Pick one" items={FRAMEWORKS} required />
			</Field>,
		);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-required',
			'true',
		);
		expect(container.querySelector('input[required]')).not.toBeNull();
	});

	it('lets an aria-required of its own win over the field', () => {
		render(
			<Field label="Framework" required>
				<Select placeholder="Pick one" items={FRAMEWORKS} aria-required="false" />
			</Field>,
		);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-required',
			'false',
		);
	});

	it('lets a plain form submit while nothing is picked in a required field', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const { container } = render(
			<form onSubmit={onSubmit}>
				<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} required />
				<button type="submit">Save</button>
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(true);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('blocks a plain form with its own required while nothing is picked', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const { container } = render(
			<form onSubmit={onSubmit}>
				<Select aria-label="Framework" placeholder="Pick one" items={FRAMEWORKS} required />
				<button type="submit">Save</button>
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(false);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('takes required from a Field.Group around it', () => {
		render(
			<Field.Group label="Size" required>
				<Select aria-label="Amount" placeholder="Pick one" items={FRAMEWORKS} />
			</Field.Group>,
		);

		expect(screen.getByRole('combobox', { name: 'Amount' })).toHaveAttribute(
			'aria-required',
			'true',
		);
	});

	it('is required with its own prop outside any field', () => {
		render(<Select aria-label="Framework" placeholder="Pick one" items={FRAMEWORKS} required />);

		expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
	});

	it('is not required outside a field', () => {
		render(<Select aria-label="Framework" placeholder="Pick one" items={FRAMEWORKS} />);

		expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-required');
	});

	it('keeps its own aria-label ahead of the field label', () => {
		render(
			<Field label="Framework">
				<Select aria-label="Pick a framework" placeholder="Pick one" items={FRAMEWORKS} />
			</Field>,
		);

		expect(screen.getByRole('combobox', { name: 'Pick a framework' })).toBeInTheDocument();
	});
});
