import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import { ButtonGroupColor } from '../constants.js';
import type { ButtonGroupItemType, ButtonGroupVariantColorType } from '../types.js';
import {
	BASE,
	ITEMS,
	MANY_ITEMS,
	noop,
	renderInFrame,
	TOKENS,
	visibleMembers,
} from './button-group.test-utils.js';

const PAIRS: ButtonGroupVariantColorType[] = [
	...Object.values(ButtonGroupColor).map((color) => ({ variant: 'solid', color }) as const),
	...Object.values(ButtonGroupColor).map((color) => ({ variant: 'link', color }) as const),
	{ variant: 'outlined', color: 'secondary' },
	{ variant: 'dashed', color: 'secondary' },
	{ variant: 'ghost', color: 'secondary' },
];

describe('ButtonGroup variant and color', () => {
	it.each(PAIRS)('draws every member in $variant $color', (pair) => {
		render(<ButtonGroup {...pair} size="md" items={ITEMS} testId="group" />);

		const group = screen.getByTestId('group');
		expect(group).toHaveAttribute('data-variant', pair.variant);
		expect(group).toHaveAttribute('data-color', pair.color);

		const members = screen.getAllByRole('button');
		expect(members).toHaveLength(ITEMS.length);

		for (const member of members) {
			expect(member).toHaveAttribute('data-variant', pair.variant);
			expect(member).toHaveAttribute('data-color', pair.color);
		}
	});

	it('draws a member in the pair it sets for itself, and the rest in the group pair', () => {
		render(
			<ButtonGroup
				{...BASE}
				testId="group"
				items={[
					{ value: 'day', label: 'Day', onClick: noop },
					{
						value: 'delete',
						label: 'Delete',
						onClick: noop,
						variant: 'solid',
						color: 'danger',
					},
					{ value: 'week', label: 'Week', onClick: noop },
				]}
			/>,
		);

		const group = screen.getByTestId('group');
		expect(group).toHaveAttribute('data-variant', 'outlined');
		expect(group).toHaveAttribute('data-color', 'secondary');

		const own = screen.getByTestId('group-item-delete');
		expect(own).toHaveAttribute('data-variant', 'solid');
		expect(own).toHaveAttribute('data-color', 'danger');

		for (const name of ['Day', 'Week']) {
			const member = screen.getByRole('button', { name });
			expect(member).toHaveAttribute('data-variant', 'outlined');
			expect(member).toHaveAttribute('data-color', 'secondary');
		}
	});

	it('lets an icon member and a link member set their own pair too', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={[
					{
						value: 'next',
						icon: <svg />,
						'aria-label': 'Next',
						onClick: noop,
						variant: 'solid',
						color: 'primary',
					},
					{
						value: 'docs',
						label: 'Docs',
						render: <a href="/docs" />,
						variant: 'link',
						color: 'info',
					},
				]}
			/>,
		);

		const icon = screen.getByRole('button', { name: 'Next' });
		expect(icon).toHaveAttribute('data-variant', 'solid');
		expect(icon).toHaveAttribute('data-color', 'primary');

		const link = screen.getByRole('link', { name: 'Docs' });
		expect(link).toHaveAttribute('data-variant', 'link');
		expect(link).toHaveAttribute('data-color', 'info');
	});

	it('keeps the group pair on the ellipsis, whatever the members set for themselves', async () => {
		const items = MANY_ITEMS.map(
			(item) => ({ ...item, variant: 'solid', color: 'danger' }) as ButtonGroupItemType,
		);

		renderInFrame(<ButtonGroup {...BASE} items={items} testId="group" />, {
			size: 300,
			style: TOKENS,
		});

		const overflow = await screen.findByTestId('group-overflow');
		expect(overflow).toHaveAttribute('data-variant', 'outlined');
		expect(overflow).toHaveAttribute('data-color', 'secondary');

		for (const member of visibleMembers()) {
			expect(member).toHaveAttribute('data-variant', 'solid');
			expect(member).toHaveAttribute('data-color', 'danger');
		}
	});

	it('draws the ellipsis in the group pair when the group is not outlined', async () => {
		renderInFrame(
			<ButtonGroup variant="solid" color="primary" size="md" items={MANY_ITEMS} testId="group" />,
			{ size: 300, style: TOKENS },
		);

		const overflow = await screen.findByTestId('group-overflow');
		expect(overflow).toHaveAttribute('data-variant', 'solid');
		expect(overflow).toHaveAttribute('data-color', 'primary');
	});
});

describe('ButtonGroup noLoadingEffect', () => {
	it('reaches every member of a ghost group', () => {
		render(
			<ButtonGroup variant="ghost" color="secondary" size="md" items={ITEMS} noLoadingEffect />,
		);

		for (const member of screen.getAllByRole('button')) {
			expect(member).toHaveAttribute('data-no-loading-effect', 'true');
		}
	});

	it('is absent unless it is set', () => {
		render(<ButtonGroup variant="ghost" color="secondary" size="md" items={ITEMS} />);

		for (const member of screen.getAllByRole('button')) {
			expect(member).not.toHaveAttribute('data-no-loading-effect');
		}
	});

	it('reaches only the ghost member that sets it for itself', () => {
		render(
			<ButtonGroup
				{...BASE}
				testId="group"
				items={[
					{ value: 'day', label: 'Day', onClick: noop },
					{
						value: 'week',
						label: 'Week',
						onClick: noop,
						variant: 'ghost',
						color: 'secondary',
						noLoadingEffect: true,
					},
				]}
			/>,
		);

		expect(screen.getByTestId('group-item-week')).toHaveAttribute('data-no-loading-effect', 'true');
		expect(screen.getByTestId('group-item-day')).not.toHaveAttribute('data-no-loading-effect');
	});

	it('reaches the ellipsis of a ghost group', async () => {
		renderInFrame(
			<ButtonGroup
				variant="ghost"
				color="secondary"
				size="md"
				items={MANY_ITEMS}
				noLoadingEffect
				testId="group"
			/>,
			{ size: 300, style: TOKENS },
		);

		expect(await screen.findByTestId('group-overflow')).toHaveAttribute(
			'data-no-loading-effect',
			'true',
		);
	});
});

describe('ButtonGroup member that sets its own pair', () => {
	// Everything but the pair, so two renders only differ in where the pair comes from.
	const RICH = {
		value: 'delete',
		label: 'Delete',
		prefix: <svg />,
		suffix: <svg />,
		onClick: noop,
		disabled: false,
		disabledTooltip: 'Nobody can delete this',
		testId: 'delete',
	} as const satisfies ButtonGroupItemType;

	function attributeNamesOf(testId: string): string[] {
		return screen.getByTestId(testId).getAttributeNames().sort();
	}

	it('does not put its own keys on the button', () => {
		render(
			<ButtonGroup
				{...BASE}
				items={[{ ...RICH, variant: 'solid', color: 'danger', 'data-owner': 'alerts' }]}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Delete' });

		for (const leaked of [
			'value',
			'label',
			'variant',
			'color',
			'icon',
			'prefix',
			'suffix',
			'onclick',
			'render',
			'disabledtooltip',
			'testid',
			'noloadingeffect',
		]) {
			expect(button, leaked).not.toHaveAttribute(leaked);
		}

		expect(button).toHaveAttribute('data-owner', 'alerts');
		expect(button).toHaveAttribute('data-testid', 'delete');
	});

	it('carries the same attributes as the member of a group drawn in that pair', () => {
		const { unmount } = render(
			<ButtonGroup
				variant="solid"
				color="danger"
				size="md"
				items={[{ ...RICH, 'data-owner': 'alerts' }]}
			/>,
		);
		const fromGroup = attributeNamesOf('delete');
		unmount();

		render(
			<ButtonGroup
				{...BASE}
				items={[{ ...RICH, variant: 'solid', color: 'danger', 'data-owner': 'alerts' }]}
			/>,
		);

		expect(attributeNamesOf('delete')).toEqual(fromGroup);
	});

	it('still runs its onClick once', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(
			<ButtonGroup
				{...BASE}
				items={[{ value: 'delete', label: 'Delete', onClick, variant: 'solid', color: 'danger' }]}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Delete' }));
		expect(onClick).toHaveBeenCalledOnce();
	});
});
