import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AlertStrip } from '../alert-strip/alert-strip.js';
import { Callout } from '../callout/callout.js';
import { Typography } from '../typography/typography.js';

type ActionLink = (onClick: () => void) => ReactNode;

// Every link built on `useRenderLink`. A new one joins this list, so whether a click-only link runs
// its `onClick` is a decision made on purpose, never a default someone forgot to turn on.
const LINKS: Array<[string, ActionLink]> = [
	[
		'Callout.Link',
		(onClick) => (
			<Callout color="primary" size="sm" icon={<svg />}>
				<Callout.Link onClick={onClick}>action</Callout.Link>
			</Callout>
		),
	],
	[
		'AlertStrip.Link',
		(onClick) => (
			<AlertStrip color="primary" side="bottom">
				<AlertStrip.Link onClick={onClick}>action</AlertStrip.Link>
			</AlertStrip>
		),
	],
	[
		'Typography.Link',
		(onClick) => (
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				onClick={onClick}
			>
				action
			</Typography.Link>
		),
	],
];

afterEach(() => vi.restoreAllMocks());

describe('useRenderLink consumers', () => {
	it.each(LINKS)(
		'%s renders a button that runs onClick when it has no destination',
		async (_name, renderLink) => {
			const user = userEvent.setup();
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const onClick = vi.fn();
			render(renderLink(onClick));

			await user.click(screen.getByRole('button', { name: 'action' }));

			expect(onClick).toHaveBeenCalledTimes(1);
			expect(warn).not.toHaveBeenCalled();
		},
	);
});
