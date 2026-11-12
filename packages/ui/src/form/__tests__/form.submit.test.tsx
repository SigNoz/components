import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../button/button.js';
import { InputField } from '../../input/presets/input-field.js';
import { Form } from '../form.js';

type Seen = { defaultPrevented: boolean; target: EventTarget | null };

function recordSubmit(): { onSubmit: (event: FormEvent<HTMLFormElement>) => void; seen: Seen[] } {
	const seen: Seen[] = [];

	return {
		seen,
		onSubmit: (event) => {
			seen.push({ defaultPrevented: event.defaultPrevented, target: event.currentTarget });
		},
	};
}

function SubmitButton({ form }: { form?: string }) {
	return (
		<Button size="md" variant="solid" color="primary" type="submit" form={form}>
			Save
		</Button>
	);
}

describe('Form submit', () => {
	it('calls preventDefault before onSubmit', async () => {
		const user = userEvent.setup();
		const { onSubmit, seen } = recordSubmit();
		render(
			<Form onSubmit={onSubmit} testId="form">
				<SubmitButton />
			</Form>,
		);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(seen).toHaveLength(1);
		expect(seen[0]?.defaultPrevented).toBe(true);
		expect(seen[0]?.target).toBe(screen.getByTestId('form'));
	});

	it('leaves the page alone when the consumer never prevents the default', async () => {
		const user = userEvent.setup();
		const reachedWindow = vi.fn((event: Event) => event.defaultPrevented);
		window.addEventListener('submit', reachedWindow);
		render(
			<Form onSubmit={() => {}}>
				<SubmitButton />
			</Form>,
		);

		await user.click(screen.getByRole('button', { name: 'Save' }));
		window.removeEventListener('submit', reachedWindow);

		expect(reachedWindow).toHaveBeenCalledTimes(1);
		expect(reachedWindow).toHaveReturnedWith(true);
	});

	it('survives a consumer that prevents the default again', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
		render(
			<Form onSubmit={onSubmit}>
				<SubmitButton />
			</Form>,
		);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('calls the latest onSubmit after a rerender', async () => {
		const user = userEvent.setup();
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = render(
			<Form onSubmit={first}>
				<SubmitButton />
			</Form>,
		);

		rerender(
			<Form onSubmit={second}>
				<SubmitButton />
			</Form>,
		);
		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledTimes(1);
	});

	it('does not submit from a Button that is not a submit button', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(
			<Form onSubmit={onSubmit}>
				<Button size="md" variant="solid" color="primary">
					Preview
				</Button>
			</Form>,
		);

		await user.click(screen.getByRole('button', { name: 'Preview' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('submits even when a required field is empty, the form is noValidate', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(
			<Form onSubmit={onSubmit}>
				<InputField label="Email" required />
				<SubmitButton />
			</Form>,
		);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(screen.getByRole('textbox', { name: 'Email' })).toBeRequired();
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it('hands the values of its fields to the submit through the form data', async () => {
		const user = userEvent.setup();
		let values: FormData | undefined;
		render(
			<Form
				onSubmit={(event) => {
					values = new FormData(event.currentTarget);
				}}
			>
				<InputField label="Email" name="email" />
				<InputField.TextArea label="Notes" name="notes" />
				<SubmitButton />
			</Form>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Email' }), 'alex@example.com');
		await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'First line');
		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(values?.get('email')).toBe('alex@example.com');
		expect(values?.get('notes')).toBe('First line');
	});
});

describe('Form implicit submission', () => {
	it('submits on Enter in an input when the form has a submit button', async () => {
		const user = userEvent.setup();
		const { onSubmit, seen } = recordSubmit();
		render(
			<Form onSubmit={onSubmit}>
				<InputField label="Email" />
				<InputField label="Name" />
				<SubmitButton />
			</Form>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Email' }), 'alex@example.com{Enter}');

		expect(seen).toHaveLength(1);
		expect(seen[0]?.defaultPrevented).toBe(true);
	});

	it('does nothing on Enter without a submit button in a form of several fields', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(
			<Form onSubmit={onSubmit}>
				<InputField label="Email" />
				<InputField label="Name" />
			</Form>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Email' }), 'alex@example.com{Enter}');

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('adds a line on Enter in a TextArea and does not submit', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(
			<Form onSubmit={onSubmit}>
				<InputField.TextArea label="Notes" />
				<SubmitButton />
			</Form>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'one{Enter}two');

		expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('one\ntwo');
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('submits on Enter in the only text field of a form without a submit button', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(
			<Form onSubmit={onSubmit}>
				<InputField label="Email" />
			</Form>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Email' }), 'alex@example.com{Enter}');

		expect(onSubmit).toHaveBeenCalledTimes(1);
	});
});

describe('Form submit from outside', () => {
	function renderWithOutsideButton(onSubmit: (event: FormEvent<HTMLFormElement>) => void) {
		render(
			<>
				<Form onSubmit={onSubmit} id="signup-form" testId="form">
					<InputField label="Email" />
				</Form>
				<SubmitButton form="signup-form" />
			</>,
		);
	}

	it('submits the form named by the form attribute of a Button outside it', async () => {
		const user = userEvent.setup();
		const { onSubmit, seen } = recordSubmit();
		renderWithOutsideButton(onSubmit);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(seen).toHaveLength(1);
		expect(seen[0]?.defaultPrevented).toBe(true);
		expect(seen[0]?.target).toBe(screen.getByTestId('form'));
	});

	it('does not submit a Button outside the form that names no form', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(
			<>
				<Form onSubmit={onSubmit} id="signup-form">
					<InputField label="Email" />
				</Form>
				<SubmitButton />
			</>,
		);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});
});

describe('Form reset', () => {
	function renderWithReset(onReset?: (event: FormEvent<HTMLFormElement>) => void) {
		render(
			<Form onSubmit={() => {}} onReset={onReset}>
				<InputField label="Email" name="email" defaultValue="" />
				<Button size="md" variant="solid" color="secondary" type="reset">
					Reset
				</Button>
			</Form>,
		);
	}

	it('calls onReset when a reset button resets the form', async () => {
		const user = userEvent.setup();
		const targets: Array<EventTarget | null> = [];
		renderWithReset((event) => targets.push(event.currentTarget));

		await user.type(screen.getByRole('textbox', { name: 'Email' }), 'alex@example.com');
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		expect(targets).toHaveLength(1);
		expect(targets[0]).toBeInstanceOf(HTMLFormElement);
	});

	it('clears the uncontrolled native inputs', async () => {
		const user = userEvent.setup();
		renderWithReset();

		await user.type(screen.getByRole('textbox', { name: 'Email' }), 'alex@example.com');
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('');
	});

	it('does not submit on reset', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(
			<Form onSubmit={onSubmit}>
				<Button size="md" variant="solid" color="secondary" type="reset">
					Reset
				</Button>
			</Form>,
		);

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		expect(onSubmit).not.toHaveBeenCalled();
	});
});

// A Dialog or a Drawer opened from a form portals its own form out of the outer one, but React
// still bubbles the submit and the reset of the inner form through the outer one.
describe('Form inside a portal of another form', () => {
	function renderNested() {
		const outer = { onSubmit: vi.fn(), onReset: vi.fn() };
		const inner = { onSubmit: vi.fn(), onReset: vi.fn() };
		render(
			<Form {...outer} testId="outer">
				{createPortal(
					<Form {...inner} testId="inner">
						<Button size="md" variant="solid" color="primary" type="submit">
							Add
						</Button>
						<Button size="md" variant="solid" color="secondary" type="reset">
							Clear
						</Button>
					</Form>,
					document.body,
				)}
				<SubmitButton />
			</Form>,
		);

		return { outer, inner };
	}

	it('submits the inner form only', async () => {
		const user = userEvent.setup();
		const { outer, inner } = renderNested();

		await user.click(screen.getByRole('button', { name: 'Add' }));

		expect(inner.onSubmit).toHaveBeenCalledTimes(1);
		expect(outer.onSubmit).not.toHaveBeenCalled();
	});

	it('resets the inner form only', async () => {
		const user = userEvent.setup();
		const { outer, inner } = renderNested();

		await user.click(screen.getByRole('button', { name: 'Clear' }));

		expect(inner.onReset).toHaveBeenCalledTimes(1);
		expect(outer.onReset).not.toHaveBeenCalled();
	});

	it('still submits the outer form from its own button', async () => {
		const user = userEvent.setup();
		const { outer, inner } = renderNested();

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(outer.onSubmit).toHaveBeenCalledTimes(1);
		expect(inner.onSubmit).not.toHaveBeenCalled();
	});
});
