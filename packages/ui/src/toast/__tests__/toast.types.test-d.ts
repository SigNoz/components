/**
 * Type-level tests for the arguments of {@link toast}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a call written the way a consumer writes it: it either
 * compiles, or it is marked `@ts-expect-error` because we refuse it. TypeScript reports an unused
 * `@ts-expect-error` as an error of its own, so loosening a constraint by accident fails the build.
 */
import type { MouseEvent } from 'react';
import { assertType, describe, test } from 'vitest';
import { toast } from '../toast.js';

declare const save: Promise<void>;

describe('toast.danger', () => {
	test('requires an action, since a danger toast never closes on its own', () => {
		// @ts-expect-error - no way out from the keyboard
		assertType(toast.danger('Could not save'));
		// @ts-expect-error - no way out from the keyboard
		assertType(toast.danger('Could not save', { description: 'Try again.' }));
	});

	test('accepts an action with a label', () => {
		assertType<string>(toast.danger('Could not save', { action: { label: 'Close' } }));
	});
});

describe('position and timeout', () => {
	test('accept a position and a timeout on a call', () => {
		assertType<string>(toast.info('Copied', { position: 'bottom-left', timeout: 2000 }));
		assertType<Promise<void>>(
			toast.promise(save, {
				loading: 'Saving',
				success: 'Saved',
				error: 'Failed',
				errorAction: { label: 'Close' },
				position: 'bottom-left',
			}),
		);
	});

	test('refuse a position that is not one', () => {
		// @ts-expect-error - not a position
		assertType(toast.info('Copied', { position: 'middle' }));
	});

	test('refuse a timeout on danger and loading, which stay until dismissed or replaced', () => {
		// @ts-expect-error - a danger toast stays until it is dismissed
		assertType(toast.danger('Could not save', { action: { label: 'Close' }, timeout: 2000 }));
		// @ts-expect-error - a loading toast stays until it is replaced
		assertType(toast.loading('Saving', { timeout: 2000 }));
	});
});

describe('toast.promise', () => {
	test('requires an errorAction, for the danger toast it turns into', () => {
		// @ts-expect-error - the rejected toast would have no way out
		assertType(toast.promise(save, { loading: 'Saving', success: 'Saved', error: 'Failed' }));
	});

	test('accepts an id and a testId', () => {
		assertType<Promise<void>>(
			toast.promise(save, {
				loading: 'Saving',
				success: 'Saved',
				error: 'Failed',
				errorAction: { label: 'Close' },
				id: 'save',
				testId: 'save-toast',
			}),
		);
	});
});

describe('action.onClick', () => {
	test('receives the mouse event, so it can call preventDefault', () => {
		assertType<string>(
			toast.success('Panel deleted', {
				action: {
					label: 'Undo',
					onClick: (event: MouseEvent<HTMLButtonElement>) => event.preventDefault(),
				},
			}),
		);
	});
});
