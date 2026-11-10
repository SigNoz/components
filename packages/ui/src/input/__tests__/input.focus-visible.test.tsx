import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import { describe, expect, it } from 'vitest';
import { Input } from '../input.js';

function stopPropagation(event: SyntheticEvent): void {
	event.stopPropagation();
}

const RING = 'rgb(10, 20, 30)';
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

// The ring fades, so the outline color is read once every running transition has ended.
async function settleTransitions(...elements: HTMLElement[]): Promise<void> {
	await Promise.all(
		elements.flatMap((element) => element.getAnimations().map((animation) => animation.finished)),
	);
}

// The last modality is shared by the whole document, so every test sets it with its own first
// interaction instead of trusting what the previous one left.
describe('Input focus ring', () => {
	it.each([
		['Input', <Input key="input" aria-label="Field" testId="field" />],
		['Input.Password', <Input.Password key="password" aria-label="Field" testId="field" />],
		['Input.TextArea', <Input.TextArea key="textarea" aria-label="Field" testId="field" />],
		['Input.Number', <Input.Number key="number" aria-label="Field" testId="field" />],
	])('%s draws the ring on keyboard focus and not on a click', async (_name, element) => {
		const user = userEvent.setup();
		render(
			<>
				<button type="button">Before</button>
				{element}
			</>,
		);

		const frame = screen.getByTestId('field');
		const field = screen.getByTestId('field-field');

		await user.click(field);

		expect(field).toHaveFocus();
		expect(frame).not.toHaveAttribute('data-focus-visible');

		await user.tab({ shift: true });

		expect(frame).not.toHaveAttribute('data-focus-visible');

		await user.tab();

		expect(field).toHaveFocus();
		expect(frame).toHaveAttribute('data-focus-visible');
	});

	it.each([
		[
			'Input',
			<Input
				key="input"
				aria-label="Field"
				testId="field"
				onFocus={stopPropagation}
				onBlur={stopPropagation}
			/>,
		],
		[
			'Input.Number',
			<Input.Number
				key="number"
				aria-label="Field"
				testId="field"
				onFocus={stopPropagation}
				onBlur={stopPropagation}
			/>,
		],
	])(
		'%s draws and drops the ring when the field callbacks stop propagation',
		async (_name, element) => {
			const user = userEvent.setup();
			render(
				<>
					{element}
					<button type="button">After</button>
				</>,
			);

			await user.tab();

			expect(screen.getByTestId('field')).toHaveAttribute('data-focus-visible');

			await user.click(screen.getByRole('button', { name: 'After' }));

			expect(screen.getByTestId('field')).not.toHaveAttribute('data-focus-visible');
		},
	);

	it('leaves the ring of a field rendered in a portal from a slot to that field', async () => {
		const user = userEvent.setup();
		render(
			<Input
				aria-label="Outer"
				testId="outer"
				suffix={createPortal(<Input aria-label="Inner" testId="inner" />, document.body)}
			/>,
		);

		await user.keyboard('a');
		act(() => screen.getByRole('textbox', { name: 'Inner' }).focus());

		expect(screen.getByTestId('inner')).toHaveAttribute('data-focus-visible');
		expect(screen.getByTestId('outer')).not.toHaveAttribute('data-focus-visible');
	});

	it('leaves the ring off an Input nested in the slot of a focused one', async () => {
		const user = userEvent.setup();
		render(
			<div style={{ ['--input-focus-ring-color' as string]: RING }}>
				<Input
					aria-label="Outer"
					testId="outer"
					suffix={<Input aria-label="Inner" testId="inner" />}
				/>
			</div>,
		);

		await user.tab();

		const outer = screen.getByTestId('outer');
		const inner = screen.getByTestId('inner');
		await settleTransitions(outer, inner);

		expect(outer).toHaveAttribute('data-focus-visible');
		expect(getComputedStyle(outer).outlineColor).toBe(RING);
		expect(getComputedStyle(inner).outlineColor).toBe(TRANSPARENT);
	});

	it('keeps the ring off while typing into a clicked field', async () => {
		const user = userEvent.setup();
		render(<Input aria-label="Field" testId="field" />);

		await user.click(screen.getByRole('textbox'));
		await user.keyboard('Springfield');

		expect(screen.getByTestId('field')).not.toHaveAttribute('data-focus-visible');
	});

	it('drops the ring when focus leaves for a click elsewhere', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Input aria-label="Field" testId="field" />
				<button type="button">After</button>
			</>,
		);

		await user.tab();

		expect(screen.getByTestId('field')).toHaveAttribute('data-focus-visible');

		await user.click(screen.getByRole('button', { name: 'After' }));

		expect(screen.getByTestId('field')).not.toHaveAttribute('data-focus-visible');
	});

	it('drops the ring when the focused field is clicked', async () => {
		const user = userEvent.setup();
		render(<Input aria-label="Field" testId="field" />);

		await user.tab();

		expect(screen.getByTestId('field')).toHaveAttribute('data-focus-visible');

		await user.click(screen.getByRole('textbox'));

		expect(screen.getByRole('textbox')).toHaveFocus();
		expect(screen.getByTestId('field')).not.toHaveAttribute('data-focus-visible');
	});

	it('draws the ring for focus moved by a script after a key press', async () => {
		const user = userEvent.setup();
		render(<Input aria-label="Field" testId="field" />);

		await user.keyboard('a');
		act(() => screen.getByRole('textbox').focus());

		expect(screen.getByTestId('field')).toHaveAttribute('data-focus-visible');
	});

	it('ignores a shortcut held with a modifier', async () => {
		const user = userEvent.setup();
		render(
			<>
				<button type="button">Before</button>
				<Input aria-label="Field" testId="field" />
			</>,
		);

		await user.click(screen.getByRole('button', { name: 'Before' }));
		await user.keyboard('{Control>}l{/Control}');
		act(() => screen.getByRole('textbox').focus());

		expect(screen.getByTestId('field')).not.toHaveAttribute('data-focus-visible');
	});

	it('leaves the password toggle out of the field focus', async () => {
		const user = userEvent.setup();
		render(<Input.Password aria-label="Password" testId="password" />);

		await user.keyboard('a');
		act(() => screen.getByTestId('password-toggle').focus());

		expect(screen.getByTestId('password')).not.toHaveAttribute('data-focus-visible');
	});

	it('keeps data-focus-visible with noFocusRing, the stylesheet drops the ring', async () => {
		const user = userEvent.setup();
		render(<Input aria-label="Field" noFocusRing testId="field" />);

		await user.tab();

		expect(screen.getByTestId('field')).toHaveAttribute('data-focus-visible');
		expect(screen.getByTestId('field')).toHaveAttribute('data-no-focus-ring');
	});
});
