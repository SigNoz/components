import { screen, waitFor, within } from '@testing-library/react';
import { Eye, Info } from '@signozhq/icons';
import { describe, expect, it } from 'vitest';
import { highlightedOption, renderOpenCommand, searchField } from './command.test-utils.js';

describe('Command accessibility', () => {
	it('names the dialog and the field with label', async () => {
		await renderOpenCommand();

		expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
		expect(searchField()).toHaveAttribute('aria-autocomplete', 'list');
		expect(searchField()).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
		expect(searchField()).toHaveAttribute('placeholder', 'Search…');
	});

	it('marks the highlighted row with aria-selected', async () => {
		await renderOpenCommand();
		await waitFor(() => {
			expect(highlightedOption()).not.toBeNull();
		});

		const options = screen.getAllByRole('option');

		expect(options[0]).toHaveAttribute('aria-selected', 'true');
		expect(options[1]).toHaveAttribute('aria-selected', 'false');
	});

	it('names each group by its label', async () => {
		await renderOpenCommand();

		const navigation = screen.getByRole('group', { name: 'Navigation' });

		expect(within(navigation).getAllByRole('option')).toHaveLength(3);
		expect(screen.getByRole('group', { name: 'Settings' })).toBeInTheDocument();
	});

	it('hides the search glyph and the row icons', async () => {
		await renderOpenCommand();

		expect(screen.getByTestId('command-search-prefix')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('command-item-home-suffix')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByRole('option', { name: 'Go to Home' })).toBeInTheDocument();
	});

	it('reads the shortcut as the description of the row', async () => {
		await renderOpenCommand();

		const option = screen.getByRole('option', { name: 'Go to Home' });

		expect(option).toHaveAccessibleDescription('Shift+H');
		expect(screen.getByRole('option', { name: 'Logs Explorer' })).not.toHaveAttribute(
			'aria-describedby',
		);
	});
});

describe('Command parts', () => {
	it('writes the test IDs and slots', async () => {
		await renderOpenCommand({
			items: [
				{
					type: 'group',
					value: 'nav',
					label: 'Nav',
					items: [
						{
							type: 'item',
							value: 'home',
							label: 'Go to Home',
							prefix: <Info />,
							suffix: <Eye />,
							onClick: () => {},
						},
						{ type: 'item', value: 'own', label: 'Own', testId: 'mine', onClick: () => {} },
					],
				},
			],
			searchInputProps: { suffix: <Eye /> },
		});

		const parts: Array<[string, string]> = [
			['command', 'command'],
			['command-search', 'command-search-input'],
			['command-search-prefix', 'command-search-prefix'],
			['command-search-suffix', 'command-search-suffix'],
			['command-group-nav', 'command-group'],
			['command-item-home', 'command-item'],
			['command-item-home-prefix', 'command-item-prefix'],
			['command-item-home-suffix', 'command-item-suffix'],
			['mine', 'command-item'],
		];

		for (const [testId, slot] of parts) {
			expect(screen.getByTestId(testId)).toHaveAttribute('data-slot', slot);
		}

		for (const slot of [
			'command-search',
			'command-list',
			'command-group-label',
			'command-item-label',
		]) {
			expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
		}

		expect(screen.queryByTestId('command-item-own')).not.toBeInTheDocument();
	});

	it('renders the shortcut through Kbd in the suffix slot', async () => {
		await renderOpenCommand();

		const suffix = screen.getByTestId('command-item-home-suffix');

		expect(suffix.querySelector('[data-slot="kbd"]')).toHaveTextContent('Shift+H');
	});

	it('leaves out the affix slots when the shortcut or the icon renders nothing', async () => {
		await renderOpenCommand({
			items: [
				{ type: 'item', value: 'off-mac', label: 'Off a Mac', shortcut: false, onClick: () => {} },
				{ type: 'item', value: 'blank', label: 'Blank', shortcut: null, onClick: () => {} },
			],
		});

		for (const value of ['off-mac', 'blank']) {
			expect(screen.queryByTestId(`command-item-${value}-suffix`)).not.toBeInTheDocument();
			expect(screen.getByTestId(`command-item-${value}`)).not.toHaveAttribute('aria-describedby');
		}
	});

	it('shows <No label> for a label that renders nothing', async () => {
		await renderOpenCommand({
			items: [{ type: 'item', value: 'blank', label: '', onClick: () => {} }],
		});

		const label = screen
			.getByTestId('command-item-blank')
			.querySelector('[data-slot="command-item-label"]');

		expect(label).toHaveTextContent('<No label>');
		expect(label).toHaveAttribute('data-empty-label', 'true');
	});

	it('renders loose rows without a group', async () => {
		await renderOpenCommand({
			items: [{ type: 'item', value: 'alone', label: 'Alone', onClick: () => {} }],
		});

		expect(screen.queryByRole('group')).not.toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Alone' })).toBeInTheDocument();
	});

	it('swaps the search glyph for a spinner while loading', async () => {
		await renderOpenCommand({ searchInputProps: { loading: true } });

		const prefix = screen.getByTestId('command-search-prefix');

		expect(prefix).toHaveAttribute('data-loading', 'true');
		expect(prefix.querySelector('[data-slot="spinner"]')).not.toBeNull();
		expect(searchField()).toBeEnabled();
	});
});

describe('Command styles', () => {
	it('draws the panel and the backdrop with the command tokens', async () => {
		const root = document.documentElement.style;
		const tokens: Array<[string, string]> = [
			['--command-background', 'rgb(10, 20, 30)'],
			['--command-border', 'rgb(40, 50, 60)'],
			['--command-backdrop', 'rgba(1, 2, 3, 0.5)'],
		];

		for (const [property, value] of tokens) {
			root.setProperty(property, value);
		}

		try {
			await renderOpenCommand();
			const panel = getComputedStyle(screen.getByTestId('command'));
			const backdrop = document.querySelector('[data-slot="command-backdrop"]');

			if (backdrop === null) {
				throw new Error('No backdrop rendered');
			}

			expect(panel.backgroundColor).toBe('rgb(10, 20, 30)');
			expect(panel.borderTopColor).toBe('rgb(40, 50, 60)');
			expect(getComputedStyle(backdrop).backgroundColor).toBe('rgba(1, 2, 3, 0.5)');
		} finally {
			for (const [property] of tokens) {
				root.removeProperty(property);
			}
		}
	});

	it('opens 110px below the top of the viewport, centred and at most 32rem wide', async () => {
		await renderOpenCommand();
		const rect = screen.getByTestId('command').getBoundingClientRect();

		expect(rect.top).toBe(110);
		expect(rect.width).toBeLessThanOrEqual(512);
		expect(Math.abs(rect.left - (window.innerWidth - rect.right))).toBeLessThanOrEqual(1);
	});

	it('sizes row icons at 14px whatever size they carry', async () => {
		await renderOpenCommand({
			items: [
				{
					type: 'item',
					value: 'home',
					label: 'Home',
					prefix: <Info width={24} height={24} />,
					onClick: () => {},
				},
			],
		});

		const icon = screen.getByTestId('command-item-home-prefix').querySelector('svg');

		if (icon === null) {
			throw new Error('No icon rendered');
		}

		expect(getComputedStyle(icon).width).toBe('14px');
		expect(getComputedStyle(icon).height).toBe('14px');
	});

	it('stops short of the bottom of a short viewport and scrolls the list', async () => {
		const root = document.documentElement.style;
		// Leaves 200px under the top of the panel, less than the 20rem the list may take.
		root.setProperty('--command-inset-block-start', 'calc(100dvh - 200px)');

		try {
			await renderOpenCommand({
				items: Array.from({ length: 40 }, (_, index) => ({
					type: 'item' as const,
					value: `row-${index}`,
					label: `Row ${index}`,
					onClick: () => {},
				})),
			});

			const panel = screen.getByTestId('command').getBoundingClientRect();
			const viewport = document.querySelector<HTMLElement>('[data-slot="command-viewport"]');

			if (viewport === null) {
				throw new Error('No viewport rendered');
			}

			expect(panel.bottom).toBeLessThanOrEqual(window.innerHeight);
			expect(viewport.getBoundingClientRect().bottom).toBeLessThanOrEqual(panel.bottom);
			expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
		} finally {
			root.removeProperty('--command-inset-block-start');
		}
	});

	it('caps the list at 20rem and scrolls', async () => {
		await renderOpenCommand({
			items: Array.from({ length: 40 }, (_, index) => ({
				type: 'item' as const,
				value: `row-${index}`,
				label: `Row ${index}`,
				onClick: () => {},
			})),
		});

		const viewport = document.querySelector<HTMLElement>('[data-slot="command-viewport"]');

		if (viewport === null) {
			throw new Error('No viewport rendered');
		}

		expect(viewport.getBoundingClientRect().height).toBeLessThanOrEqual(320);
		expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
		await waitFor(() => {
			expect(viewport).toHaveAttribute('data-scroll-end', 'true');
		});
	});

	it('caps the panel at contentMaxWidth and the list at contentMaxHeight', async () => {
		await renderOpenCommand({
			contentMaxWidth: 280,
			contentMaxHeight: '10rem',
			items: Array.from({ length: 40 }, (_, index) => ({
				type: 'item' as const,
				value: `row-${index}`,
				label: `Row ${index}`,
				onClick: () => {},
			})),
		});

		const panel = screen.getByTestId('command');
		const viewport = document.querySelector<HTMLElement>('[data-slot="command-viewport"]');

		if (viewport === null) {
			throw new Error('No viewport rendered');
		}

		expect(panel.style.getPropertyValue('--command-internal-max-inline-size')).toBe('280px');
		expect(panel.style.getPropertyValue('--command-internal-max-block-size')).toBe('10rem');
		expect(panel.getBoundingClientRect().width).toBe(280);
		expect(viewport.getBoundingClientRect().height).toBe(160);
		expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
	});

	it('lets the tokens outrank contentMaxWidth and contentMaxHeight', async () => {
		const root = document.documentElement.style;
		root.setProperty('--command-max-inline-size', '300px');
		root.setProperty('--command-viewport-max-block-size', '100px');

		try {
			await renderOpenCommand({
				contentMaxWidth: 280,
				contentMaxHeight: 200,
				items: Array.from({ length: 40 }, (_, index) => ({
					type: 'item' as const,
					value: `row-${index}`,
					label: `Row ${index}`,
					onClick: () => {},
				})),
			});

			const viewport = document.querySelector<HTMLElement>('[data-slot="command-viewport"]');

			if (viewport === null) {
				throw new Error('No viewport rendered');
			}

			expect(screen.getByTestId('command').getBoundingClientRect().width).toBe(300);
			expect(viewport.getBoundingClientRect().height).toBe(100);
		} finally {
			root.removeProperty('--command-max-inline-size');
			root.removeProperty('--command-viewport-max-block-size');
		}
	});
});
