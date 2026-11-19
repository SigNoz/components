import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AlertDialog } from '../../alert-dialog/index.js';
import { Dialog } from '../../dialog/index.js';
import { useDialogHandle } from '../../dialog/use-dialog-handle.js';
import { Drawer } from '../../drawer/index.js';
import type { ToastPageInset, ToastPositionType } from '../index.js';
import { Toaster } from '../toaster.js';

const OFFSET = 8;
const BOTTOM = 24;
const POSITIONS = [
	'top-left',
	'top-center',
	'top-right',
	'bottom-left',
	'bottom-center',
	'bottom-right',
] as const satisfies readonly ToastPositionType[];

function viewport(position: ToastPositionType): HTMLElement {
	return document.querySelector(
		`[data-slot="toaster"][data-position="${position}"]`,
	) as HTMLElement;
}

function distance(position: ToastPositionType, edge: 'top' | 'bottom'): string {
	return getComputedStyle(viewport(position))[edge];
}

function underModal(): number {
	return document.querySelectorAll('[data-slot="toaster"][data-under-modal]').length;
}

type Layer = 'none' | 'inspector' | 'task' | 'dialog' | 'alert-dialog';

function Page({ layer, open = true }: { layer: Layer; open?: boolean }) {
	return (
		<>
			<Toaster offset={OFFSET} pageInset={{ top: 40, bottom: BOTTOM }} />
			{layer === 'inspector' || layer === 'task' ? (
				<Drawer type={layer} stack="overlay" title="Span" open={open} onClose={() => {}}>
					Details
				</Drawer>
			) : null}
			{layer === 'dialog' ? (
				<Dialog title="Edit view" open={open} onClose={() => {}}>
					Details
				</Dialog>
			) : null}
			{layer === 'alert-dialog' ? (
				<AlertDialog
					title="Delete it?"
					color="danger"
					confirmText="Delete"
					open={open}
					onConfirm={() => {}}
					onCancel={() => {}}
				>
					It goes away.
				</AlertDialog>
			) : null}
		</>
	);
}

const WITH_INSET = `${OFFSET + BOTTOM}px`;
const WITHOUT_INSET = `${OFFSET}px`;

// No transition, so the computed place is the final one.
beforeEach(() => {
	document.body.style.setProperty('--toast-viewport-transition-duration', '0s');
});

afterEach(() => {
	for (const name of [
		'--toast-viewport-transition-duration',
		'--spacing-8',
		'--bottom-strip-height',
		'--toast-viewport-offset-bottom',
		'--toast-viewport-page-inset-top',
		'--toast-viewport-page-inset-bottom',
	]) {
		document.body.style.removeProperty(name);
	}
});

describe('toast page inset', () => {
	it('sits one offset beyond the inset at the edge a stack sits against', () => {
		render(<Page layer="none" />);

		for (const position of ['top-left', 'top-center', 'top-right'] as const) {
			expect(distance(position, 'top')).toBe(`${OFFSET + 40}px`);
		}
		for (const position of ['bottom-left', 'bottom-center', 'bottom-right'] as const) {
			expect(distance(position, 'bottom')).toBe(WITH_INSET);
		}
		expect(underModal()).toBe(0);
	});

	it('leaves the offset of an edge the inset does not name', () => {
		render(<Toaster offset={OFFSET} pageInset={{ bottom: BOTTOM }} />);

		expect(distance('top-right', 'top')).toBe(WITHOUT_INSET);
		expect(distance('bottom-right', 'bottom')).toBe(WITH_INSET);
	});

	it('leaves the default offset alone with no inset', () => {
		document.body.style.setProperty('--spacing-8', '16px');
		render(<Toaster />);

		expect(distance('top-right', 'top')).toBe('16px');
		expect(distance('bottom-right', 'bottom')).toBe('16px');
	});

	it('takes a number as px and a string as a CSS length', () => {
		render(<Toaster offset={OFFSET} pageInset={{ top: 10, bottom: '2rem' }} />);

		const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
		expect(distance('top-right', 'top')).toBe(`${OFFSET + 10}px`);
		expect(distance('bottom-right', 'bottom')).toBe(`${OFFSET + 2 * rem}px`);
	});

	it('takes a unitless number in a string as px', () => {
		render(<Toaster offset={OFFSET} pageInset={{ bottom: '24' }} />);

		expect(distance('bottom-right', 'bottom')).toBe(WITH_INSET);
	});

	it('follows a variable the page publishes on body, and falls back when it is missing', () => {
		document.body.style.setProperty('--bottom-strip-height', '24px');
		render(<Toaster offset={OFFSET} pageInset={{ bottom: 'var(--bottom-strip-height, 0px)' }} />);

		expect(distance('bottom-right', 'bottom')).toBe(WITH_INSET);

		document.body.style.setProperty('--bottom-strip-height', '32px');
		expect(distance('bottom-right', 'bottom')).toBe(`${OFFSET + 32}px`);

		document.body.style.removeProperty('--bottom-strip-height');
		expect(distance('bottom-right', 'bottom')).toBe(WITHOUT_INSET);
	});

	it('adds nothing for a variable the page never published, even with no fallback', () => {
		render(<Toaster offset={OFFSET} pageInset={{ bottom: 'var(--never-published)' }} />);

		expect(distance('bottom-right', 'bottom')).toBe(WITHOUT_INSET);
	});

	it('keeps 0, and skips an edge that is null or undefined, as an untyped caller can pass', () => {
		render(
			<Toaster offset={OFFSET} pageInset={{ top: null, bottom: 0 } as unknown as ToastPageInset} />,
		);

		expect(distance('top-right', 'top')).toBe(WITHOUT_INSET);
		expect(distance('bottom-right', 'bottom')).toBe(WITHOUT_INSET);
	});

	it('adds to an offset set from the CSS of the app', () => {
		document.body.style.setProperty('--toast-viewport-offset-bottom', '20px');
		render(<Toaster offset={OFFSET} pageInset={{ bottom: BOTTOM }} />);

		expect(distance('bottom-right', 'bottom')).toBe(`${20 + BOTTOM}px`);
	});

	it('lets --toast-viewport-page-inset-<edge> beat the prop', () => {
		document.body.style.setProperty('--toast-viewport-page-inset-bottom', '5px');
		render(<Toaster offset={OFFSET} pageInset={{ bottom: BOTTOM }} />);

		expect(distance('bottom-right', 'bottom')).toBe(`${OFFSET + 5}px`);
	});

	it('takes --toast-viewport-page-inset-<edge> with no prop', () => {
		document.body.style.setProperty('--toast-viewport-page-inset-top', '12px');
		render(<Toaster offset={OFFSET} />);

		expect(distance('top-right', 'top')).toBe(`${OFFSET + 12}px`);
	});
});

describe('toast page inset transition', () => {
	it('slides every stack to its new top and bottom, as it slides a right stack aside', () => {
		document.body.style.removeProperty('--toast-viewport-transition-duration');
		render(<Page layer="none" />);

		for (const position of POSITIONS) {
			const style = getComputedStyle(viewport(position));
			expect(style.transitionProperty).toBe('top, right, bottom');
			expect(style.transitionDuration).toBe('0.24s');
		}
	});
});

describe('toast page inset beside layers', () => {
	it('keeps the inset beside an inspector drawer, which leaves the page usable', () => {
		render(<Page layer="inspector" />);

		expect(distance('bottom-right', 'bottom')).toBe(WITH_INSET);
		expect(distance('top-right', 'top')).toBe(`${OFFSET + 40}px`);
		expect(viewport('bottom-right')).toHaveAttribute('data-beside-drawer');
		expect(underModal()).toBe(0);
	});

	it.each(['task', 'dialog', 'alert-dialog'] as const)(
		'drops the inset on every stack while a %s is open',
		(layer) => {
			render(<Page layer={layer} />);

			for (const position of POSITIONS) {
				expect(viewport(position)).toHaveAttribute('data-under-modal');
			}
			for (const position of ['top-left', 'top-center', 'top-right'] as const) {
				expect(distance(position, 'top')).toBe(WITHOUT_INSET);
			}
			for (const position of ['bottom-left', 'bottom-center', 'bottom-right'] as const) {
				expect(distance(position, 'bottom')).toBe(WITHOUT_INSET);
			}
		},
	);

	it('keeps the stack beside a task drawer at the offset from the edge, not the inset', () => {
		render(<Page layer="task" />);

		expect(viewport('bottom-right')).toHaveAttribute('data-beside-drawer');
		expect(viewport('bottom-right')).toHaveAttribute('data-under-modal');
		expect(distance('bottom-right', 'bottom')).toBe(WITHOUT_INSET);
	});

	it('drops the inset set from the CSS of the app too', () => {
		document.body.style.setProperty('--toast-viewport-page-inset-bottom', '5px');
		const { rerender } = render(<Page layer="none" />);
		expect(distance('bottom-right', 'bottom')).toBe(`${OFFSET + 5}px`);

		rerender(<Page layer="dialog" />);

		expect(distance('bottom-right', 'bottom')).toBe(WITHOUT_INSET);
	});

	it.each(['task', 'dialog', 'alert-dialog'] as const)(
		'restores the inset as soon as a %s starts closing',
		(layer) => {
			const { rerender } = render(<Page layer={layer} />);
			expect(distance('bottom-right', 'bottom')).toBe(WITHOUT_INSET);

			rerender(<Page layer={layer} open={false} />);

			expect(distance('bottom-right', 'bottom')).toBe(WITH_INSET);
			expect(underModal()).toBe(0);
		},
	);

	it('restores the inset when an open layer unmounts', () => {
		const { rerender } = render(<Page layer="dialog" />);

		rerender(<Page layer="none" />);

		expect(distance('bottom-right', 'bottom')).toBe(WITH_INSET);
		expect(underModal()).toBe(0);
	});

	it('drops the inset while a dialog on a handle is open, and restores it after it closes', async () => {
		function Handled() {
			const handle = useDialogHandle();

			return (
				<>
					<Toaster offset={OFFSET} pageInset={{ bottom: BOTTOM }} />
					<button type="button" onClick={() => handle.open()}>
						Open dialog
					</button>
					<Dialog handle={handle} title="Edit view">
						Details
					</Dialog>
				</>
			);
		}
		render(<Handled />);
		expect(distance('bottom-right', 'bottom')).toBe(WITH_INSET);

		await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
		await waitFor(() => expect(distance('bottom-right', 'bottom')).toBe(WITHOUT_INSET));

		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		await waitFor(() => expect(distance('bottom-right', 'bottom')).toBe(WITH_INSET));
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
		expect(distance('bottom-right', 'bottom')).toBe(WITH_INSET);
	});

	it('keeps the inset dropped while another modal layer is still open', () => {
		function Stacked({ dialogOpen }: { dialogOpen: boolean }) {
			return (
				<>
					<Toaster offset={OFFSET} pageInset={{ bottom: BOTTOM }} />
					<Drawer type="task" stack="overlay" title="Span" open onClose={() => {}}>
						Details
					</Drawer>
					<Dialog title="Edit view" open={dialogOpen} onClose={() => {}}>
						Details
					</Dialog>
				</>
			);
		}
		const { rerender } = render(<Stacked dialogOpen />);

		rerender(<Stacked dialogOpen={false} />);

		expect(underModal()).toBe(POSITIONS.length);
		expect(distance('bottom-right', 'bottom')).toBe(WITHOUT_INSET);
	});
});
