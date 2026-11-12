import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ColorPicker } from '../index.js';
import {
	getAlphaField,
	getHexField,
	getTrigger,
	MID_RED,
	MID_RED_HALF,
	openPicker,
	typeInto,
} from './color-picker.test-utils.js';

function getForm(): HTMLFormElement {
	return screen.getByRole('form', { name: 'Panel' }) as HTMLFormElement;
}

function submitted(): FormData {
	return new FormData(getForm());
}

function renderInForm(picker: ReactElement, onSubmit = vi.fn()) {
	render(
		<form
			aria-label="Panel"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit(new FormData(event.currentTarget));
			}}
		>
			{picker}
			<button type="submit">Save</button>
		</form>,
	);

	return onSubmit;
}

describe('ColorPicker forms', () => {
	it.each([
		['#3A2A63', '#3a2a63'],
		['#3A2A63FF', '#3a2a63'],
		['#3A2A6380', '#3a2a6380'],
		['#abc', '#aabbcc'],
		['#abcd', '#aabbccdd'],
	])('submits %s as %s under its name', (value, submittedValue) => {
		renderInForm(
			<ColorPicker nativeButton side="bottom" align="start" name="color" value={value}>
				<button type="button">Color</button>
			</ColorPicker>,
		);

		expect(submitted().get('color')).toBe(submittedValue);
	});

	it('submits #rrggbb with opaque, from a value that has an alpha', () => {
		renderInForm(
			<ColorPicker nativeButton side="bottom" align="start" name="color" value="#3A2A6380" opaque>
				<button type="button">Color</button>
			</ColorPicker>,
		);

		expect(submitted().get('color')).toBe('#3a2a63');
	});

	it('submits an empty string while there is no color', () => {
		renderInForm(
			<ColorPicker nativeButton side="bottom" align="start" name="color">
				<button type="button">Color</button>
			</ColorPicker>,
		);

		expect(submitted().get('color')).toBe('');
	});

	it('submits the color the user picked', async () => {
		renderInForm(
			<ColorPicker nativeButton side="bottom" align="start" name="color" defaultValue={MID_RED}>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		await openPicker();

		await userEvent.keyboard('{End}');

		expect(submitted().get('color')).toBe('#800000');
	});

	it('submits the alpha the user picked, as #rrggbbaa', async () => {
		renderInForm(
			<ColorPicker nativeButton side="bottom" align="start" name="color" defaultValue={MID_RED}>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		await openPicker();

		await typeInto(getAlphaField(), '50{Enter}');

		expect(submitted().get('color')).toBe(MID_RED_HALF);

		await typeInto(getAlphaField(), '100{Enter}');

		expect(submitted().get('color')).toBe(MID_RED);
	});

	it('submits with the form named by form, from outside it', () => {
		render(
			<>
				<form id="panel-form" aria-label="Panel" />
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					name="color"
					form="panel-form"
					value={MID_RED}
				>
					<button type="button">Color</button>
				</ColorPicker>
			</>,
		);

		expect(submitted().get('color')).toBe(MID_RED);
	});

	it('leaves a disabled picker out of the submit', () => {
		renderInForm(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				name="color"
				value={MID_RED}
				disabled
				disabledTooltip={undefined}
			>
				<button type="button">Color</button>
			</ColorPicker>,
		);

		expect(submitted().has('color')).toBe(false);
	});

	it('submits the alpha of a readOnly picker', () => {
		renderInForm(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				name="locked"
				value={MID_RED_HALF}
				readOnly
				readOnlyTooltip={undefined}
			>
				<button type="button">Locked</button>
			</ColorPicker>,
		);

		expect(submitted().get('locked')).toBe(MID_RED_HALF);
	});

	it('submits a readOnly picker, also when it is disabled too', () => {
		renderInForm(
			<>
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					name="locked"
					value={MID_RED}
					readOnly
					readOnlyTooltip={undefined}
				>
					<button type="button">Locked</button>
				</ColorPicker>
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					name="both"
					value={MID_RED}
					disabled
					disabledTooltip={undefined}
					readOnly
					readOnlyTooltip={undefined}
				>
					<button type="button">Both</button>
				</ColorPicker>
			</>,
		);

		expect(submitted().get('locked')).toBe(MID_RED);
		expect(submitted().get('both')).toBe(MID_RED);
	});

	it('blocks the submit while required holds no color, and focuses the trigger', async () => {
		const onSubmit = renderInForm(
			<ColorPicker nativeButton side="bottom" align="start" name="color" required>
				<button type="button">Color</button>
			</ColorPicker>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
		expect(getTrigger()).toHaveFocus();
	});

	it('submits a required picker with no color while it is readOnly, since nobody can fill it in', async () => {
		const onSubmit = renderInForm(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				name="color"
				required
				readOnly
				readOnlyTooltip="Set by the dashboard owner"
			>
				<button type="button">Color</button>
			</ColorPicker>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
		expect(onSubmit.mock.calls[0][0].get('color')).toBe('');
	});

	it('submits a required picker that holds a color', async () => {
		const onSubmit = renderInForm(
			<ColorPicker nativeButton side="bottom" align="start" name="color" required value={MID_RED}>
				<button type="button">Color</button>
			</ColorPicker>,
		);

		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
		expect((onSubmit.mock.calls[0][0] as FormData).get('color')).toBe(MID_RED);
	});

	it('blocks the submit again once a required color is cleared', async () => {
		const onSubmit = renderInForm(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				name="color"
				required
				allowClear
				defaultValue={MID_RED}
			>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		getTrigger().focus();

		await userEvent.keyboard('{Delete}');
		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onSubmit).not.toHaveBeenCalled();
		await waitFor(() => expect(getTrigger()).toHaveFocus());
	});

	it('keeps the input it submits with out of the tab order and away from screen readers', async () => {
		render(
			<>
				<ColorPicker nativeButton side="bottom" align="start" name="color" value={MID_RED}>
					<button type="button">Color</button>
				</ColorPicker>
				<button type="button">After</button>
			</>,
		);
		getTrigger().focus();

		await userEvent.tab();

		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
		expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	});
});

describe('ColorPicker form reset', () => {
	async function pickGreen(): Promise<void> {
		await openPicker();
		await userEvent.click(getHexField());
		await userEvent.clear(getHexField());
		await userEvent.type(getHexField(), '00ff00{Enter}');
		await userEvent.keyboard('{Escape}');
	}

	it('brings an uncontrolled picker back to defaultValue, without onChange', async () => {
		const onChange = vi.fn();
		renderInForm(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				name="color"
				defaultValue={MID_RED}
				onChange={onChange}
			>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		await pickGreen();
		expect(submitted().get('color')).toBe('#00ff00');
		onChange.mockClear();

		getForm().reset();

		await waitFor(() => expect(submitted().get('color')).toBe(MID_RED));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('brings the alpha back to the one in defaultValue', async () => {
		renderInForm(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				name="color"
				defaultValue={MID_RED_HALF}
			>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		await pickGreen();
		expect(submitted().get('color')).toBe('#00ff0080');

		getForm().reset();

		await waitFor(() => expect(submitted().get('color')).toBe(MID_RED_HALF));
	});

	it('resets with the form it names through form', async () => {
		render(
			<>
				<form id="panel" aria-label="Panel" />
				<ColorPicker nativeButton side="bottom" align="start" name="color" form="panel">
					<button type="button">Color</button>
				</ColorPicker>
			</>,
		);
		await pickGreen();
		expect(submitted().get('color')).toBe('#00ff00');

		getForm().reset();

		await waitFor(() => expect(submitted().get('color')).toBe(''));
	});

	it('changes nothing for a reset the form cancels', async () => {
		render(
			<form aria-label="Panel" onReset={(event) => event.preventDefault()}>
				<ColorPicker nativeButton side="bottom" align="start" name="color" defaultValue={MID_RED}>
					<button type="button">Color</button>
				</ColorPicker>
			</form>,
		);
		await pickGreen();

		fireEvent.reset(getForm());
		await new Promise((resolve) => setTimeout(resolve, 10));

		expect(submitted().get('color')).toBe('#00ff00');
	});
});
