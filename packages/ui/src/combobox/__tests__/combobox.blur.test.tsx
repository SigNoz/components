import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FocusEvent, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from '../combobox.js';
import { ComboboxField } from '../presets/combobox-field.js';
import { FRAMEWORKS, openCombobox, searchInput } from './combobox.test-utils.js';

const SEARCH = { placeholder: 'Search' };

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

function renderCombobox(
	multiple: boolean,
	onBlur: (event: FocusEvent<HTMLElement>) => void,
): ReactElement {
	const props = {
		'aria-label': 'Framework',
		placeholder: 'Pick one',
		searchInputProps: SEARCH,
		items: FRAMEWORKS,
		onBlur,
	};

	return (
		<div>
			<button type="button">Before</button>
			{multiple ? <Combobox multiple {...props} /> : <Combobox {...props} />}
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
		expect(searchInput()).toHaveFocus();
	});
	await settle();
}

describe.each([
	['single', false],
	['multiple', true],
])('Combobox onBlur, %s', (_mode, multiple) => {
	it('stays quiet while the popup opens and closes, and fires once when Tab leaves', async () => {
		const onBlur = vi.fn();
		render(renderCombobox(multiple, onBlur));

		await openCombobox();
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

	it('stays quiet while the search row is typed in and a row is picked', async () => {
		const onBlur = vi.fn();
		render(renderCombobox(multiple, onBlur));
		await openCombobox();

		await userEvent.keyboard('an');
		await userEvent.click(await screen.findByRole('option', { name: 'Angular' }));
		await settle();

		expect(onBlur).not.toHaveBeenCalled();

		if (!multiple) {
			await waitFor(() => {
				expect(trigger()).toHaveFocus();
			});
			await settle();

			expect(onBlur).not.toHaveBeenCalled();
		}
	});

	it('fires once when Tab leaves while the popup is open', async () => {
		const onBlur = vi.fn();
		render(renderCombobox(multiple, onBlur));
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
		render(renderCombobox(multiple, onBlur));
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
		render(renderCombobox(multiple, onBlur));
		await openCombobox();
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
		render(renderCombobox(multiple, onBlur));
		await openCombobox();
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

describe('Combobox onBlur, a press that leaves the focus on the trigger', () => {
	it('does not count against a later blur that leaves the focus in the combobox', async () => {
		const onBlur = vi.fn();
		render(
			<div>
				<Combobox
					aria-label="Framework"
					placeholder="Pick one"
					searchInputProps={SEARCH}
					items={FRAMEWORKS}
					onBlur={onBlur}
				/>
				<button type="button" onMouseDown={(event) => event.preventDefault()}>
					Keeps the focus
				</button>
			</div>,
		);

		await openCombobox();
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

describe('Combobox onBlur, the event', () => {
	it.each([
		['the trigger', false],
		['the popup', true],
	])(
		'has the root of the combobox as currentTarget when the focus leaves %s',
		async (_part, popup) => {
			let currentTarget: EventTarget | null = null;
			const onBlur = vi.fn((event: FocusEvent<HTMLElement>) => {
				currentTarget = event.currentTarget;
			});
			render(renderCombobox(false, onBlur));

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
			expect(currentTarget).toHaveAttribute('data-slot', 'combobox');
			expect(currentTarget).toContainElement(trigger());
		},
	);
});

describe('ComboboxField onBlur', () => {
	it('hands a handler without parameters to the combobox', async () => {
		const onBlur = vi.fn<() => void>();
		render(
			<div>
				<ComboboxField
					label="Framework"
					placeholder="Pick one"
					searchInputProps={SEARCH}
					items={FRAMEWORKS}
					onBlur={onBlur}
				/>
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
				<ComboboxField
					label="Framework"
					placeholder="Pick one"
					searchInputProps={SEARCH}
					items={FRAMEWORKS}
					onBlur={onBlur}
				/>
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
