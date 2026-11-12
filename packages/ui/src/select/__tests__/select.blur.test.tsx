import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FocusEvent, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SelectField } from '../presets/select-field.js';
import { Select } from '../select.js';
import { FRAMEWORKS } from './select.test-utils.js';

/**
 * The blur is judged one task after the focus moved. A check that it was not called has to wait
 * past that task, or it passes before the call could happen.
 */
function settle(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 50));
}

function trigger(): HTMLElement {
	return screen.getByRole('combobox', { name: 'Framework' });
}

function renderSelect(
	multiple: boolean,
	onBlur: (event: FocusEvent<HTMLElement>) => void,
): ReactElement {
	const props = {
		'aria-label': 'Framework',
		placeholder: 'Pick one',
		items: FRAMEWORKS,
		onBlur,
	};

	return (
		<div>
			<button type="button">Before</button>
			{multiple ? <Select multiple {...props} /> : <Select {...props} />}
			<button type="button">After</button>
			<p>Outside text</p>
		</div>
	);
}

async function openWithKeyboard(): Promise<void> {
	trigger().focus();
	await userEvent.keyboard('{Enter}');
	await screen.findByRole('listbox');
	await waitFor(() => {
		expect(screen.getByRole('option', { name: 'React' })).toHaveFocus();
	});
	await settle();
}

describe.each([
	['single', false],
	['multiple', true],
])('Select onBlur, %s', (_mode, multiple) => {
	it('stays quiet while the popup opens and closes, and fires once when Tab leaves', async () => {
		const onBlur = vi.fn();
		render(renderSelect(multiple, onBlur));

		await userEvent.click(trigger());
		await screen.findByRole('listbox');
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		await waitFor(() => {
			expect(trigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.tab();

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();

		await settle();

		expect(onBlur).toHaveBeenCalledTimes(1);

		await userEvent.tab({ shift: true });
		await waitFor(() => {
			expect(trigger()).toHaveFocus();
		});
		await userEvent.tab();

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(2);
		});
	});

	it('fires once when Tab leaves while the popup is open', async () => {
		const onBlur = vi.fn();
		render(renderSelect(multiple, onBlur));
		await openWithKeyboard();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.tab();

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		await settle();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('stays quiet when Shift+Tab gives the focus back to the trigger', async () => {
		const onBlur = vi.fn();
		render(renderSelect(multiple, onBlur));
		await openWithKeyboard();

		await userEvent.tab({ shift: true });

		await waitFor(() => {
			expect(trigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();
	});

	it('fires once when a press on another control closes the popup', async () => {
		const onBlur = vi.fn();
		render(renderSelect(multiple, onBlur));

		await userEvent.click(trigger());
		await screen.findByRole('listbox');
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.click(screen.getByRole('button', { name: 'After' }));

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		await settle();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('fires once when a press on plain text closes the popup', async () => {
		const onBlur = vi.fn();
		render(renderSelect(multiple, onBlur));

		await userEvent.click(trigger());
		await screen.findByRole('listbox');
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.click(screen.getByText('Outside text'));

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		await settle();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});

describe('Select onBlur, one value', () => {
	it('stays quiet when picking a row gives the focus back to the trigger', async () => {
		const onBlur = vi.fn();
		render(renderSelect(false, onBlur));

		await userEvent.click(trigger());
		await userEvent.click(await screen.findByRole('option', { name: 'Vue' }));
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		await waitFor(() => {
			expect(trigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();
	});
});

describe('Select onBlur, the row under the focus goes away', () => {
	it('stays quiet while the popup takes the focus back', async () => {
		const onBlur = vi.fn();

		function Loading({ loading }: { loading: boolean }): ReactElement {
			return (
				<Select
					aria-label="Framework"
					placeholder="Pick one"
					items={FRAMEWORKS}
					loading={loading}
					onBlur={onBlur}
				/>
			);
		}
		const { rerender } = render(<Loading loading={false} />);
		await openWithKeyboard();

		rerender(<Loading loading />);
		await waitFor(() => {
			expect(screen.queryByRole('option')).toBeNull();
		});
		await settle();

		expect(screen.getByRole('listbox')).toBeInTheDocument();
		expect(onBlur).not.toHaveBeenCalled();
	});
});

describe('Select onBlur, a press that leaves the focus on the trigger', () => {
	it('does not count against a later blur that leaves the focus in the select', async () => {
		const onBlur = vi.fn();
		render(
			<div>
				<Select aria-label="Framework" placeholder="Pick one" items={FRAMEWORKS} onBlur={onBlur} />
				<button type="button" onMouseDown={(event) => event.preventDefault()}>
					Keeps the focus
				</button>
			</div>,
		);

		await userEvent.click(trigger());
		await screen.findByRole('listbox');
		await settle();

		await userEvent.click(screen.getByRole('button', { name: 'Keeps the focus' }));
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		await waitFor(() => {
			expect(trigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		// A blur whose focus is back inside before the check runs, as when the window loses it.
		act(() => {
			trigger().blur();
			trigger().focus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();
	});
});

describe('Select onBlur, the event', () => {
	it.each([
		['the trigger', false],
		['the popup', true],
	])(
		'has the root of the select as currentTarget when the focus leaves %s',
		async (_part, popup) => {
			let currentTarget: EventTarget | null = null;
			const onBlur = vi.fn((event: FocusEvent<HTMLElement>) => {
				currentTarget = event.currentTarget;
			});
			render(renderSelect(false, onBlur));

			if (popup) {
				await openWithKeyboard();
			} else {
				trigger().focus();
			}

			await userEvent.tab();

			await waitFor(() => {
				expect(onBlur).toHaveBeenCalledTimes(1);
			});
			expect(currentTarget).not.toBeNull();
			expect(currentTarget).toHaveAttribute('data-slot', 'select');
			expect(currentTarget).toContainElement(trigger());
		},
	);
});

describe('SelectField onBlur', () => {
	it('hands a handler without parameters to the select', async () => {
		const onBlur = vi.fn<() => void>();
		render(
			<div>
				<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} onBlur={onBlur} />
				<button type="button">After</button>
			</div>,
		);

		await userEvent.click(trigger());
		await screen.findByRole('listbox');
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.click(screen.getByRole('button', { name: 'After' }));

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
	});

	it('hands the blur event to the handler', async () => {
		const onBlur = vi.fn<(event: FocusEvent<HTMLElement>) => void>();
		render(
			<div>
				<SelectField label="Framework" placeholder="Pick one" items={FRAMEWORKS} onBlur={onBlur} />
				<button type="button">After</button>
			</div>,
		);

		await userEvent.click(trigger());
		await screen.findByRole('listbox');
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.keyboard('{Escape}');
		await waitFor(() => {
			expect(trigger()).toHaveFocus();
		});
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		await userEvent.tab();

		await waitFor(() => {
			expect(onBlur).toHaveBeenCalledTimes(1);
		});
		expect(onBlur.mock.calls[0]?.[0].type).toBe('blur');
		expect(onBlur.mock.calls[0]?.[0].relatedTarget).toBe(
			screen.getByRole('button', { name: 'After' }),
		);
	});
});
