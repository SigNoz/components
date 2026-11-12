import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { Combobox } from '../combobox.js';
import { ComboboxField } from '../index.js';
import { FRAMEWORKS } from './combobox.test-utils.js';

const SEARCH = { placeholder: 'Search' };

function trigger(): HTMLElement {
	return screen.getByRole('combobox', { name: 'Framework' });
}

function withoutGeneratedIds(html: string): string {
	const seen = new Map<string, string>();

	return html.replace(/(?:base-ui-)?:r[0-9a-z]+:/g, (id) => {
		if (!seen.has(id)) {
			seen.set(id, `#${seen.size}`);
		}

		return seen.get(id) ?? id;
	});
}

describe('ComboboxField naming and description', () => {
	it('names a single trigger by the label', () => {
		render(
			<ComboboxField
				label="Framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).toHaveTextContent('Pick one');
		expect(trigger()).toHaveAttribute(
			'aria-labelledby',
			screen.getByText('Framework').closest('label')?.id,
		);
	});

	it('names a multiple trigger by the label, not by the placeholder', async () => {
		render(
			<ComboboxField
				multiple
				label="Framework"
				placeholder="Pick some"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toBeInTheDocument();
		expect(screen.queryByRole('combobox', { name: 'Pick some' })).toBeNull();
	});

	it('focuses a multiple trigger when the label is clicked', async () => {
		render(
			<ComboboxField
				multiple
				label="Framework"
				placeholder="Pick some"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);
		const multipleTrigger = await screen.findByRole('combobox', { name: 'Framework' });

		await userEvent.click(screen.getByText('Framework'));

		expect(multipleTrigger).toHaveFocus();
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('describes the trigger with the description, then the label tooltip text', () => {
		render(
			<ComboboxField
				label="Framework"
				description="The stack of the service"
				labelTooltip="Picked once"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).toHaveAccessibleDescription('The stack of the service Picked once');
	});

	it('describes a multiple trigger the same way', async () => {
		render(
			<ComboboxField
				multiple
				label="Framework"
				description="The stack of the service"
				placeholder="Pick some"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toHaveAccessibleDescription(
			'The stack of the service',
		);
	});

	it('swaps the description for the message while one shows', () => {
		render(
			<ComboboxField
				label="Framework"
				description="The stack of the service"
				error="Pick a framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).toHaveAccessibleDescription('Pick a framework');
	});
});

describe('ComboboxField with its own id', () => {
	it('names a single trigger by the label', async () => {
		render(
			<ComboboxField
				label="Framework"
				id="framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'id',
			'framework',
		);
	});

	it('names a multiple trigger by the label and focuses it from the label', async () => {
		render(
			<ComboboxField
				multiple
				label="Framework"
				id="framework"
				placeholder="Pick some"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);
		const multipleTrigger = await screen.findByRole('combobox', { name: 'Framework' });

		await userEvent.click(screen.getByText('Framework'));

		expect(multipleTrigger).toHaveAttribute('id', 'framework');
		expect(multipleTrigger).toHaveFocus();
	});
});

describe('ComboboxField status', () => {
	it('sets aria-invalid on the trigger for an error, which tints its frame', () => {
		render(
			<ComboboxField
				label="Framework"
				error="Pick a framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).toHaveAttribute('aria-invalid', 'true');
	});

	it('sets aria-invalid on a multiple trigger too', async () => {
		render(
			<ComboboxField
				multiple
				label="Framework"
				error="Pick a framework"
				placeholder="Pick some"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-invalid',
			'true',
		);
	});

	it('leaves aria-invalid off for a warning, a success and no status', () => {
		const { rerender } = render(
			<ComboboxField
				label="Framework"
				status="warning"
				message="Deprecated"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).not.toHaveAttribute('aria-invalid');
		expect(trigger()).toHaveAccessibleDescription('Deprecated');

		rerender(
			<ComboboxField
				label="Framework"
				status="success"
				message="Available"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).not.toHaveAttribute('aria-invalid');

		rerender(
			<ComboboxField
				label="Framework"
				error={undefined}
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).not.toHaveAttribute('aria-invalid');
	});

	it('clears aria-invalid once the error goes away', () => {
		const { rerender } = render(
			<ComboboxField
				label="Framework"
				error="Pick a framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		rerender(
			<ComboboxField
				label="Framework"
				error={undefined}
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).not.toHaveAttribute('aria-invalid');
	});
});

describe('ComboboxField required', () => {
	it('marks the label and sets aria-required on the trigger', () => {
		render(
			<ComboboxField
				label="Framework"
				required
				testId="cb"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).toHaveAttribute('aria-required', 'true');
		expect(
			screen.getByTestId('cb-label').querySelector('[data-slot="field-required-marker"]'),
		).toHaveAttribute('aria-hidden', 'true');
	});

	it('sets aria-required on a multiple trigger', async () => {
		render(
			<ComboboxField
				multiple
				label="Framework"
				required
				placeholder="Pick some"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toHaveAttribute(
			'aria-required',
			'true',
		);
	});

	it('sets neither without required', () => {
		render(
			<ComboboxField
				label="Framework"
				testId="cb"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).not.toHaveAttribute('aria-required');
		expect(
			screen.getByTestId('cb-label').querySelector('[data-slot="field-required-marker"]'),
		).toBeNull();
	});
});

describe('ComboboxField test ids and prop split', () => {
	it('gives the field parts the test id as prefix and keeps it on the trigger', () => {
		render(
			<ComboboxField
				label="Framework"
				labelTooltip="Picked once"
				description="The stack"
				testId="cb"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(screen.getByTestId('cb')).toBe(trigger());
		expect(screen.getAllByTestId('cb')).toHaveLength(1);
		expect(screen.getByTestId('cb-label')).toHaveTextContent('Framework');
		expect(screen.getByTestId('cb-label-tooltip')).toBeInTheDocument();
		expect(screen.getByTestId('cb-description')).toHaveTextContent('The stack');
		expect(trigger().closest('[data-slot="field"]')).not.toHaveAttribute('data-testid');
	});

	it('names the message part with the test id', () => {
		render(
			<ComboboxField
				label="Framework"
				error="Pick a framework"
				testId="cb"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(screen.getByTestId('cb-message')).toHaveTextContent('Pick a framework');
	});

	it('hands everything that is not a field prop to the combobox', async () => {
		render(
			<ComboboxField
				label="Framework"
				placeholder="Pick one"
				searchInputProps={{ placeholder: 'Find a framework' }}
				items={FRAMEWORKS}
				data-origin="form"
				width={240}
				contentMaxHeight={120}
				testId="cb"
			/>,
		);

		expect(trigger()).toHaveAttribute('data-origin', 'form');
		expect(trigger().closest('[data-slot="combobox"]')).toHaveStyle({
			'--combobox-internal-width': '240px',
		});

		await userEvent.click(trigger());

		expect(await screen.findByRole('combobox', { name: 'Find a framework' })).toBeInTheDocument();
		expect(screen.getAllByRole('option')).toHaveLength(FRAMEWORKS.length);
	});

	it('joins its own aria-describedby with the field description', () => {
		render(
			<div>
				<span id="hint">Use the framework of the repo</span>
				<ComboboxField
					label="Framework"
					description="The stack"
					aria-describedby="hint"
					placeholder="Pick one"
					searchInputProps={SEARCH}
					items={FRAMEWORKS}
				/>
			</div>,
		);

		expect(trigger()).toHaveAccessibleDescription(expect.stringContaining('The stack'));
		expect(trigger()).toHaveAccessibleDescription(
			expect.stringContaining('Use the framework of the repo'),
		);
	});

	it('lets an own aria-label win over the label', () => {
		render(
			<ComboboxField
				label="Framework"
				aria-label="Stack"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(screen.getByRole('combobox', { name: 'Stack' })).toBeInTheDocument();
	});
});

describe('ComboboxField ref', () => {
	it('forwards the ref to the single trigger, which is the field label target', () => {
		const ref = createRef<HTMLElement>();
		render(
			<ComboboxField
				label="Framework"
				testId="cb"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
				ref={ref}
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByTestId('cb'));
		expect(screen.getByTestId('cb-label')).toHaveAttribute('for', ref.current?.id);
	});

	it('forwards the ref to the multiple trigger, a div that takes focus', async () => {
		const ref = createRef<HTMLElement>();
		render(
			<ComboboxField
				multiple
				label="Framework"
				testId="cb"
				placeholder="Pick some"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
				ref={ref}
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('cb'));

		ref.current?.focus();

		expect(await screen.findByRole('combobox', { name: 'Framework' })).toHaveFocus();
	});
});

describe('ComboboxField value', () => {
	it('reports the picked value from an uncontrolled combobox', async () => {
		const onChange = vi.fn();
		render(
			<ComboboxField
				label="Framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);

		await userEvent.click(trigger());
		await userEvent.click(await screen.findByRole('option', { name: 'Vue' }));

		expect(onChange).toHaveBeenCalledWith('vue');
		await waitFor(() => expect(trigger()).toHaveTextContent('Vue'));
	});

	it('starts from defaultValue', () => {
		render(
			<ComboboxField
				label="Framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
				defaultValue="svelte"
			/>,
		);

		expect(trigger()).toHaveTextContent('Svelte');
	});

	it('follows a controlled value', async () => {
		function Controlled() {
			const [framework, setFramework] = useState<string | undefined>('react');

			return (
				<>
					<ComboboxField
						label="Framework"
						placeholder="Pick one"
						searchInputProps={SEARCH}
						items={FRAMEWORKS}
						value={framework}
						onChange={setFramework}
					/>
					<button type="button" onClick={() => setFramework('angular')}>
						Set Angular
					</button>
				</>
			);
		}
		render(<Controlled />);

		expect(trigger()).toHaveTextContent('React');

		await userEvent.click(screen.getByRole('button', { name: 'Set Angular' }));

		expect(trigger()).toHaveTextContent('Angular');
	});

	it('reports the values of a multiple combobox as an array', async () => {
		const onChange = vi.fn();
		render(
			<ComboboxField
				multiple
				label="Framework"
				placeholder="Pick some"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);

		await userEvent.click(await screen.findByRole('combobox', { name: 'Framework' }));
		await userEvent.click(await screen.findByRole('option', { name: 'Vue' }));
		await userEvent.click(screen.getByRole('option', { name: 'Svelte' }));

		expect(onChange).toHaveBeenLastCalledWith(['vue', 'svelte']);
	});

	it('takes the value, the change and the ref of a Controller field spread', async () => {
		const ref = createRef<HTMLElement>();
		const onFieldChange = vi.fn();

		function Controlled() {
			const [value, setValue] = useState<string | undefined>(undefined);
			const field = {
				value,
				onChange: (next: string | undefined) => {
					onFieldChange(next);
					setValue(next);
				},
				ref,
			};

			return (
				<ComboboxField
					label="Framework"
					placeholder="Pick one"
					searchInputProps={SEARCH}
					items={FRAMEWORKS}
					{...field}
					error={value === undefined ? 'Pick a framework' : undefined}
				/>
			);
		}
		render(<Controlled />);

		expect(trigger()).toHaveAttribute('aria-invalid', 'true');
		expect(ref.current).toBe(trigger());

		await userEvent.click(trigger());
		await userEvent.click(await screen.findByRole('option', { name: 'Angular' }));

		expect(onFieldChange).toHaveBeenCalledWith('angular');
		await waitFor(() => expect(trigger()).toHaveTextContent('Angular'));
		expect(trigger()).not.toHaveAttribute('aria-invalid');
	});
});

describe('ComboboxField against the hand-written Field', () => {
	it('renders the same DOM, single', () => {
		const shorthand = render(
			<ComboboxField
				label="Framework"
				description="The stack"
				labelTooltip="Picked once"
				required
				error="Pick a framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);
		const shorthandHtml = withoutGeneratedIds(shorthand.container.innerHTML);

		shorthand.unmount();

		const handWritten = render(
			<Field
				label="Framework"
				description="The stack"
				labelTooltip="Picked once"
				required
				error="Pick a framework"
			>
				<Combobox placeholder="Pick one" searchInputProps={SEARCH} items={FRAMEWORKS} />
			</Field>,
		);

		expect(withoutGeneratedIds(handWritten.container.innerHTML)).toBe(shorthandHtml);
	});

	it('renders the same DOM, multiple', async () => {
		const shorthand = render(
			<ComboboxField
				multiple
				label="Framework"
				description="The stack"
				required
				placeholder="Pick some"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		await screen.findByRole('combobox', { name: 'Framework' });

		const shorthandHtml = withoutGeneratedIds(shorthand.container.innerHTML);

		shorthand.unmount();

		const handWritten = render(
			<Field label="Framework" description="The stack" required>
				<Combobox multiple placeholder="Pick some" searchInputProps={SEARCH} items={FRAMEWORKS} />
			</Field>,
		);

		await screen.findByRole('combobox', { name: 'Framework' });

		expect(withoutGeneratedIds(handWritten.container.innerHTML)).toBe(shorthandHtml);
	});
});

describe('Combobox inside a hand-written Field', () => {
	it('reads required from the field', () => {
		render(
			<Field label="Framework" required>
				<Combobox placeholder="Pick one" searchInputProps={SEARCH} items={FRAMEWORKS} />
			</Field>,
		);

		expect(trigger()).toHaveAttribute('aria-required', 'true');
	});

	it('lets its own required win over the field', () => {
		render(
			<Field label="Framework" required>
				<Combobox
					required={false}
					placeholder="Pick one"
					searchInputProps={SEARCH}
					items={FRAMEWORKS}
				/>
			</Field>,
		);

		expect(trigger()).not.toHaveAttribute('aria-required');
	});

	it('announces the field required with aria-required and no native required', async () => {
		const user = userEvent.setup();
		const { container } = render(
			<Field label="Framework" required>
				<Combobox placeholder="Pick one" searchInputProps={SEARCH} items={FRAMEWORKS} />
			</Field>,
		);

		expect(trigger()).toHaveAttribute('aria-required', 'true');
		expect(container.querySelector('input[required]')).toBeNull();

		await user.click(trigger());
		await screen.findByRole('listbox');

		expect(trigger()).toHaveAttribute('aria-required', 'true');
		expect(document.querySelector('input[required]')).toBeNull();
	});

	it('announces the field required on a multiple trigger with no native required', async () => {
		const { container } = render(
			<Field label="Framework" required>
				<Combobox multiple placeholder="Pick some" searchInputProps={SEARCH} items={FRAMEWORKS} />
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
				<Combobox required placeholder="Pick one" searchInputProps={SEARCH} items={FRAMEWORKS} />
			</Field>,
		);

		expect(trigger()).toHaveAttribute('aria-required', 'true');
		expect(container.querySelector('input[required]')).not.toBeNull();
	});

	it('lets an aria-required of its own win over the field', () => {
		render(
			<Field label="Framework" required>
				<Combobox
					aria-required="false"
					placeholder="Pick one"
					searchInputProps={SEARCH}
					items={FRAMEWORKS}
				/>
			</Field>,
		);

		expect(trigger()).toHaveAttribute('aria-required', 'false');
	});

	it('lets a plain form submit while nothing is picked in a required field', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
		const { container } = render(
			<form onSubmit={onSubmit}>
				<ComboboxField
					label="Framework"
					required
					placeholder="Pick one"
					searchInputProps={SEARCH}
					items={FRAMEWORKS}
				/>
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
				<Combobox
					required
					aria-label="Framework"
					placeholder="Pick one"
					searchInputProps={SEARCH}
					items={FRAMEWORKS}
				/>
				<button type="submit">Save</button>
			</form>,
		);

		expect(container.querySelector('form')?.checkValidity()).toBe(false);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('takes required from its own prop outside a field', () => {
		render(
			<Combobox
				required
				aria-label="Framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).toHaveAttribute('aria-required', 'true');
	});

	it('is not required without the prop or a field', () => {
		render(
			<Combobox
				aria-label="Framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		expect(trigger()).not.toHaveAttribute('aria-required');
	});

	it('keeps the search row named by its placeholder, not by the field label', async () => {
		render(
			<Field label="Framework">
				<Combobox placeholder="Pick one" searchInputProps={SEARCH} items={FRAMEWORKS} />
			</Field>,
		);

		await userEvent.click(trigger());

		expect(await screen.findByRole('combobox', { name: 'Search' })).toBeInTheDocument();
		expect(screen.getAllByRole('combobox', { name: 'Framework' })).toHaveLength(1);
	});

	it('leaves the search row without aria-labelledby outside a field', async () => {
		render(
			<Combobox
				aria-label="Framework"
				placeholder="Pick one"
				searchInputProps={SEARCH}
				items={FRAMEWORKS}
			/>,
		);

		await userEvent.click(trigger());

		expect(await screen.findByRole('combobox', { name: 'Search' })).not.toHaveAttribute(
			'aria-labelledby',
		);
	});

	it('names a multiple trigger by the field label and keeps the popup list named too', async () => {
		render(
			<Field label="Framework">
				<Combobox multiple placeholder="Pick some" searchInputProps={SEARCH} items={FRAMEWORKS} />
			</Field>,
		);

		await userEvent.click(await screen.findByRole('combobox', { name: 'Framework' }));

		expect(await screen.findByRole('dialog', { name: 'Framework' })).toBeInTheDocument();
	});
});
