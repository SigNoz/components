import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	truncate,
} from '../../__tests__/test-utils.js';
import { Button, InternalButton } from '../button.js';

/**
 * `render` and `tooltipEntries` are private props of `InternalButton`, which the library's own
 * components build on. `Button`, the public one, takes neither.
 */
const GROUP_REASON = 'This dashboard is locked';
const MEMBER_REASON = 'Monthly views need a paid plan';
const LABEL = 'A very long destructive label';

beforeAll(() => mockLabelMeasurement('button-label'));
afterEach(resetLabelMeasurement);

describe('InternalButton render', () => {
	it('renders the element it is given, a real link with no role of its own', () => {
		render(
			<InternalButton size="md" variant="link" color="primary" render={<a href="/docs" />}>
				Docs
			</InternalButton>,
		);

		const link = screen.getByRole('link', { name: 'Docs' });
		expect(link.tagName).toBe('A');
		expect(link).toHaveAttribute('href', '/docs');
		expect(link).not.toHaveAttribute('role');
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('keeps the data attributes and the slots of a button', () => {
		render(
			<InternalButton
				size="sm"
				variant="solid"
				color="info"
				prefix={<svg data-testid="prefix" />}
				suffix={<svg data-testid="suffix" />}
				testId="docs"
				render={<a href="/docs" />}
			>
				Docs
			</InternalButton>,
		);

		const link = screen.getByTestId('docs');
		expect(link).toHaveAttribute('data-slot', 'button');
		expect(link).toHaveAttribute('data-variant', 'solid');
		expect(link).toHaveAttribute('data-color', 'info');
		expect(link).toHaveAttribute('data-size', 'sm');
		expect(link.querySelector('[data-slot="button-label"]')).toHaveTextContent('Docs');
		expect(link.querySelector('[data-slot="button-prefix-slot"]')).toContainElement(
			screen.getByTestId('prefix'),
		);
		expect(link.querySelector('[data-slot="button-suffix-slot"]')).toContainElement(
			screen.getByTestId('suffix'),
		);
	});

	it('keeps the own attributes of the element and drops its children', () => {
		render(
			<InternalButton
				size="md"
				variant="link"
				color="primary"
				render={
					<a href="/docs" data-owner="nav" target="_blank">
						Ignored
					</a>
				}
			>
				Docs
			</InternalButton>,
		);

		const link = screen.getByRole('link', { name: 'Docs' });
		expect(link).toHaveAttribute('data-owner', 'nav');
		expect(link).toHaveAttribute('target', '_blank');
		expect(screen.queryByText('Ignored')).not.toBeInTheDocument();
	});

	it('renders an icon button as the element too, named by its aria-label', () => {
		render(
			<InternalButton
				size="md"
				variant="ghost"
				color="secondary"
				icon
				aria-label="Open docs"
				render={<a href="/docs" />}
			>
				<svg data-testid="icon" />
			</InternalButton>,
		);

		const link = screen.getByRole('link', { name: 'Open docs' });
		expect(link).toHaveAttribute('data-icon', 'true');
		expect(link).toContainElement(screen.getByTestId('icon'));
	});

	it('hands the ref to the element it renders', () => {
		const ref = createRef<HTMLButtonElement>();

		render(
			<InternalButton
				size="md"
				variant="link"
				color="primary"
				render={<a href="/docs" />}
				ref={ref}
			>
				Docs
			</InternalButton>,
		);

		expect(ref.current).toBe(screen.getByRole('link', { name: 'Docs' }));
	});

	it('runs onClick on the element', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());

		render(
			<InternalButton
				size="md"
				variant="link"
				color="primary"
				render={<a href="#docs" />}
				onClick={onClick}
			>
				Docs
			</InternalButton>,
		);

		await user.click(screen.getByRole('link', { name: 'Docs' }));

		expect(onClick).toHaveBeenCalledOnce();
	});

	it('falls back to a plain button, with no href, while disabled', () => {
		render(
			<InternalButton
				size="md"
				variant="link"
				color="primary"
				disabled
				disabledTooltip="No access"
				render={<a href="/docs" />}
			>
				Docs
			</InternalButton>,
		);

		const button = screen.getByRole('button', { name: 'Docs' });
		expect(button.tagName).toBe('BUTTON');
		expect(button).toHaveAttribute('aria-disabled', 'true');
		expect(button).not.toHaveAttribute('href');
		expect(button).toHaveAttribute('data-slot', 'button');
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('falls back to a plain button, with no href, while loading', () => {
		render(
			<InternalButton
				size="md"
				variant="link"
				color="primary"
				loading
				loadingTooltip="Opening"
				render={<a href="/docs" />}
			>
				Docs
			</InternalButton>,
		);

		const button = screen.getByRole('button', { name: 'Docs' });
		expect(button.tagName).toBe('BUTTON');
		expect(button).toHaveAttribute('aria-disabled', 'true');
		expect(button).toHaveAttribute('aria-busy', 'true');
		expect(button).not.toHaveAttribute('href');
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('does not navigate or run onClick from the fallback', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(
			<InternalButton
				size="md"
				variant="link"
				color="primary"
				disabled
				disabledTooltip="No access"
				render={<a href="/docs" />}
				onClick={onClick}
			>
				Docs
			</InternalButton>,
		);

		await user.click(screen.getByRole('button', { name: 'Docs' }));

		expect(onClick).not.toHaveBeenCalled();
	});

	it('is a link again once it is usable', () => {
		const { rerender } = render(
			<InternalButton
				size="md"
				variant="link"
				color="primary"
				disabled
				disabledTooltip="No access"
				render={<a href="/docs" />}
			>
				Docs
			</InternalButton>,
		);
		expect(screen.queryByRole('link')).not.toBeInTheDocument();

		rerender(
			<InternalButton size="md" variant="link" color="primary" render={<a href="/docs" />}>
				Docs
			</InternalButton>,
		);

		expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});

describe('InternalButton tooltipEntries', () => {
	it('stacks the entries above the disabled reason', async () => {
		const user = userEvent.setup();

		render(
			<InternalButton
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={MEMBER_REASON}
				tooltipEntries={[{ id: 'group', content: GROUP_REASON }]}
			>
				Month
			</InternalButton>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.textContent).toBe(`${GROUP_REASON}${MEMBER_REASON}`);
	});

	it('stacks the entries above the loading reason', async () => {
		const user = userEvent.setup();

		render(
			<InternalButton
				size="md"
				variant="solid"
				color="primary"
				loading
				loadingTooltip="Saving"
				tooltipEntries={[{ id: 'group', content: GROUP_REASON }]}
			>
				Month
			</InternalButton>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.textContent).toBe(`${GROUP_REASON}Saving`);
	});

	it('stacks the entries, then the reason, then the truncated label', async () => {
		const user = userEvent.setup();
		truncate();

		render(
			<InternalButton
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={MEMBER_REASON}
				tooltipEntries={[
					{ id: 'first', content: 'First entry' },
					{ id: 'second', content: 'Second entry' },
				]}
			>
				{LABEL}
			</InternalButton>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.textContent).toBe(`First entrySecond entry${MEMBER_REASON}${LABEL}`);
	});

	it('shows the entries on a button that is not blocked', async () => {
		const user = userEvent.setup();

		render(
			<InternalButton
				size="md"
				variant="solid"
				color="primary"
				textOverflow="hidden"
				tooltipEntries={[{ id: 'group', content: GROUP_REASON }]}
			>
				Month
			</InternalButton>,
		);

		await user.hover(screen.getByRole('button'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(GROUP_REASON);
	});

	it('skips an entry with nothing to show', async () => {
		const user = userEvent.setup();

		render(
			<InternalButton
				size="md"
				variant="solid"
				color="primary"
				disabled
				disabledTooltip={MEMBER_REASON}
				tooltipEntries={[
					{ id: 'empty', content: '' },
					{ id: 'none', content: null },
				]}
			>
				Month
			</InternalButton>,
		);

		await user.hover(screen.getByRole('button'));

		const tooltip = await screen.findByRole('tooltip');
		expect(tooltip.textContent).toBe(MEMBER_REASON);
		expect(tooltip.querySelector('[data-slot="tooltip-divider"]')).toBeNull();
	});

	it('shows no tooltip when no entry has content and nothing else does', async () => {
		const user = userEvent.setup();

		render(
			<InternalButton
				size="md"
				variant="solid"
				color="primary"
				textOverflow="hidden"
				tooltipEntries={[{ id: 'empty', content: '' }]}
			>
				Month
			</InternalButton>,
		);

		await user.hover(screen.getByRole('button'));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('keeps the button mounted and focused when an entry appears', () => {
		const props = {
			size: 'md',
			variant: 'solid',
			color: 'primary',
			textOverflow: 'hidden',
		} as const;
		const { rerender } = render(
			<InternalButton {...props} tooltipEntries={[]}>
				Month
			</InternalButton>,
		);

		const button = screen.getByRole('button');
		act(() => button.focus());

		rerender(
			<InternalButton
				{...props}
				disabled
				disabledTooltip={MEMBER_REASON}
				tooltipEntries={[{ id: 'group', content: GROUP_REASON }]}
			>
				Month
			</InternalButton>,
		);

		expect(screen.getByRole('button')).toBe(button);
		expect(button).toHaveFocus();
	});

	it('keeps an icon button mounted and focused when an entry appears', () => {
		const props = { size: 'md', variant: 'solid', color: 'primary', icon: true } as const;
		const { rerender } = render(
			<InternalButton {...props} aria-label="Refresh" tooltipEntries={[]}>
				<svg />
			</InternalButton>,
		);

		const button = screen.getByRole('button', { name: 'Refresh' });
		act(() => button.focus());

		rerender(
			<InternalButton
				{...props}
				aria-label="Refresh"
				tooltipEntries={[{ id: 'group', content: GROUP_REASON }]}
			>
				<svg />
			</InternalButton>,
		);

		expect(screen.getByRole('button', { name: 'Refresh' })).toBe(button);
		expect(button).toHaveFocus();
	});
});

describe('Button, the public one', () => {
	it('renders a <button> and ignores a render element passed through a cast', () => {
		render(
			<Button
				size="md"
				variant="link"
				color="primary"
				{...({ render: <a href="/docs" /> } as object)}
			>
				Docs
			</Button>,
		);

		const button = screen.getByRole('button', { name: 'Docs' });
		expect(button.tagName).toBe('BUTTON');
		expect(button).not.toHaveAttribute('href');
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('ignores tooltipEntries passed through a cast', async () => {
		const user = userEvent.setup();

		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				textOverflow="hidden"
				{...({ tooltipEntries: [{ id: 'group', content: GROUP_REASON }] } as object)}
			>
				Month
			</Button>,
		);

		await user.hover(screen.getByRole('button'));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
		expect(screen.queryByText(GROUP_REASON)).not.toBeInTheDocument();
	});

	it('does not leak the private props onto the button as attributes', () => {
		render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				{...({
					render: <a href="/docs" />,
					tooltipEntries: [{ id: 'group', content: GROUP_REASON }],
				} as object)}
			>
				Month
			</Button>,
		);

		const button = screen.getByRole('button', { name: 'Month' });
		expect(button).not.toHaveAttribute('render');
		expect(button).not.toHaveAttribute('tooltipentries');
	});
});
