import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog, DialogContent, DialogTitle } from '../../dialog/index.js';
import { Combobox } from '../index.js';
import { FRAMEWORKS, openCombobox } from './combobox.test-utils.js';

describe('Combobox rendering', () => {
	it('names the trigger with the placeholder when nothing else names it', () => {
		render(
			<Combobox
				searchInputProps={{ placeholder: 'Search' }}
				items={FRAMEWORKS}
				placeholder="Select a framework"
			/>,
		);

		expect(screen.getByRole('combobox', { name: 'Select a framework' })).toBeInTheDocument();
	});

	it.each([false, true])(
		'is named by a label that points at its id, and so is its popup (multiple: %s)',
		async (multiple) => {
			render(
				<>
					<label htmlFor="framework">Framework</label>
					<Combobox
						id="framework"
						searchInputProps={{ placeholder: 'Search' }}
						items={FRAMEWORKS}
						placeholder="Select a framework"
						multiple={multiple}
					/>
				</>,
			);

			expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveAttribute(
				'id',
				'framework',
			);

			await openCombobox();

			expect(screen.getByRole('dialog')).toHaveAccessibleName('Framework');
		},
	);

	it('focuses a multiple trigger when its label is clicked', async () => {
		render(
			<>
				<label htmlFor="framework">Framework</label>
				<Combobox
					id="framework"
					searchInputProps={{ placeholder: 'Search' }}
					items={FRAMEWORKS}
					placeholder="Select a framework"
					multiple
				/>
			</>,
		);

		await userEvent.click(screen.getByText('Framework'));

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveFocus();
	});

	it('keeps an aria-label over a label that points at its id', () => {
		render(
			<>
				<label htmlFor="framework">Framework</label>
				<Combobox
					id="framework"
					aria-label="UI framework"
					searchInputProps={{ placeholder: 'Search' }}
					items={FRAMEWORKS}
					placeholder="Select a framework"
				/>
			</>,
		);

		expect(screen.getByRole('combobox', { name: 'UI framework' })).toBeInTheDocument();
	});

	it('forwards id, aria-* and data-* to the trigger', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				id="framework"
				aria-label="Framework"
				aria-describedby="hint"
				aria-invalid
				data-track="framework-select"
				items={FRAMEWORKS}
				testId="cb"
			/>,
		);
		const trigger = screen.getByTestId('cb');

		expect(trigger).toHaveAttribute('id', 'framework');
		expect(trigger).toHaveAttribute('aria-describedby', 'hint');
		expect(trigger).toHaveAttribute('aria-invalid', 'true');
		expect(trigger).toHaveAttribute('data-track', 'framework-select');
		expect(trigger).toHaveAttribute('data-slot', 'combobox-trigger');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('writes width and maxWidth as custom properties on the root', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				width={240}
				maxWidth="50%"
			/>,
		);
		const root = document.querySelector<HTMLElement>('[data-slot="combobox"]');

		expect(root?.style.getPropertyValue('--combobox-internal-width')).toBe('240px');
		expect(root?.style.getPropertyValue('--combobox-internal-max-width')).toBe('50%');
	});

	it('writes contentMaxWidth and contentMaxHeight on the popup', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={FRAMEWORKS}
				contentMaxWidth={280}
				contentMaxHeight="10rem"
			/>,
		);
		await openCombobox();
		const popup = document.querySelector<HTMLElement>('[data-slot="combobox-popup"]');

		expect(popup?.style.getPropertyValue('--combobox-internal-max-inline-size')).toBe('280px');
		expect(popup?.style.getPropertyValue('--combobox-internal-max-block-size')).toBe('10rem');
	});

	it('makes the popup at least as wide as the trigger', async () => {
		render(
			<div style={{ width: 400 }}>
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={FRAMEWORKS}
				/>
			</div>,
		);
		await openCombobox();
		const trigger = screen.getByRole('combobox', { name: 'Framework' });
		const popup = document.querySelector('[data-slot="combobox-popup"]') as HTMLElement;

		expect(popup.getBoundingClientRect().width).toBeCloseTo(
			trigger.getBoundingClientRect().width,
			0,
		);
	});

	it('marks the root with its state', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				multiple
				aria-label="Framework"
				items={FRAMEWORKS}
				loading
				disabled
				disabledTooltip={undefined}
			/>,
		);
		const root = document.querySelector('[data-slot="combobox"]');

		expect(root).toHaveAttribute('data-multiple');
		expect(root).toHaveAttribute('data-loading');
		expect(root).toHaveAttribute('data-disabled');
	});

	it('marks the edge of the rows that is clipping something, from the first open', async () => {
		render(
			<Combobox
				placeholder="Select a host..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				contentMaxHeight={120}
				items={Array.from({ length: 30 }, (_, index) => ({
					type: 'item' as const,
					value: `host-${index}`,
					label: `host-${index}`,
				}))}
			/>,
		);
		await openCombobox();
		const viewport = document.querySelector('[data-slot="combobox-viewport"]');

		await waitFor(() => {
			expect(viewport).toHaveAttribute('data-scroll-end');
		});
		expect(viewport).not.toHaveAttribute('data-scroll-start');
	});

	it('names the search row after its placeholder', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search frameworks' }}
				aria-label="Framework"
				items={FRAMEWORKS}
			/>,
		);
		await userEvent.click(screen.getByRole('combobox', { name: 'Framework' }));

		expect(await screen.findByRole('combobox', { name: 'Search frameworks' })).toHaveAttribute(
			'placeholder',
			'Search frameworks',
		);
	});

	it('names every row from testId, and lets a row name itself', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[
					{ type: 'item', value: 'react', label: 'React' },
					{ type: 'item', value: 'vue', label: 'Vue', testId: 'my-vue' },
				]}
				testId="cb"
			/>,
		);
		await openCombobox();

		expect(screen.getByTestId('cb-item-react')).toHaveAttribute('data-kind', 'item');
		expect(screen.getByTestId('my-vue')).toBeInTheDocument();
		expect(screen.getByTestId('cb-search')).toBeInTheDocument();
	});

	it('renders prefix and suffix around the label', async () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[
					{
						type: 'item',
						value: 'react',
						label: 'React',
						prefix: <span>P</span>,
						suffix: <span>S</span>,
					},
				]}
				testId="cb"
			/>,
		);
		await openCombobox();

		expect(screen.getByTestId('cb-item-react-prefix')).toHaveTextContent('P');
		expect(screen.getByTestId('cb-item-react-suffix')).toHaveTextContent('S');
	});
});

describe('Combobox inside a dialog', () => {
	function renderInDialog(onOpenChange = vi.fn()) {
		render(
			<Dialog open onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogTitle>Settings</DialogTitle>
					<Combobox
						placeholder="Select a framework..."
						searchInputProps={{ placeholder: 'Search' }}
						aria-label="Framework"
						items={FRAMEWORKS}
					/>
				</DialogContent>
			</Dialog>,
		);

		return onOpenChange;
	}

	it('portals into the dialog panel and keeps the rows clickable', async () => {
		renderInDialog();
		const listbox = await openCombobox();
		const panel = document.querySelector('[data-slot="dialog-content"]') as HTMLElement;

		expect(panel.contains(listbox)).toBe(true);

		await userEvent.click(screen.getByRole('option', { name: 'Vue' }));

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveTextContent('Vue');
	});

	it('closes only the popup on Escape', async () => {
		const onOpenChange = renderInDialog();
		await openCombobox();

		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.anything());
		expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
	});
});

// A modal from another library, such as antd's, has no panel to portal into. The popup goes to the
// body and has to stack above the layer its trigger sits in.
describe('Combobox inside a layer from another library', () => {
	it('stacks the popup above the layer', async () => {
		render(
			<div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
				<Combobox
					placeholder="Select a framework..."
					searchInputProps={{ placeholder: 'Search' }}
					aria-label="Framework"
					items={FRAMEWORKS}
				/>
			</div>,
		);
		await openCombobox();
		const row = screen.getByRole('option', { name: 'Vue' });
		const { left, top, width, height } = row.getBoundingClientRect();

		expect(row.contains(document.elementFromPoint(left + width / 2, top + height / 2))).toBe(true);
	});
});
