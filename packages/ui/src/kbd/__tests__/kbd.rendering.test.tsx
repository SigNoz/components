import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Kbd, type KbdKey } from '../index.js';
import { mockPlatform, withDesktopViewport } from './kbd.test-utils.js';

function renderDescribed(node: React.ReactNode) {
	render(
		<>
			<span aria-describedby="hint">Open</span>
			{node}
		</>,
	);

	return screen.getByText('Open');
}

withDesktopViewport();

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Kbd rendering', () => {
	it.each<[KbdKey, string, string]>([
		['Escape', '⎋', 'Escape'],
		['Enter', '↵', 'Enter'],
		['Backspace', '⌫', 'Backspace'],
		['Tab', '⇥', 'Tab'],
		['Shift', '⇧', 'Shift'],
		['Meta', '⌘', 'Meta'],
		['Alt', '⌥', 'Alt'],
		['Control', '⌃', 'Control'],
		['Mod', '⌃', 'Control'],
		['ArrowUp', '↑', 'Up arrow'],
		['ArrowDown', '↓', 'Down arrow'],
		['ArrowLeft', '←', 'Left arrow'],
		['ArrowRight', '→', 'Right arrow'],
		['k', 'K', 'K'],
		['7', '7', '7'],
		['/', '/', 'Slash'],
		['?', '?', 'Question mark'],
		[',', ',', 'Comma'],
		['.', '.', 'Period'],
		['+', '+', 'Plus'],
		['-', '-', 'Minus'],
		['[', '[', 'Left bracket'],
		['§', '§', '§'],
		['é', 'É', 'É'],
		['ß', 'ß', 'ß'],
		['ŉ', 'ŉ', 'ŉ'],
	])('draws %s as %s and reads it as %s', (value, glyph, word) => {
		const owner = renderDescribed(<Kbd id="hint" value={value} />);
		const key = document.querySelector('[data-slot="kbd"]');

		expect(key?.querySelector('[aria-hidden="true"]')).toHaveTextContent(glyph);
		expect(owner).toHaveAccessibleDescription(word);
	});

	it('draws Mod as ⌘, reads Alt as Option and Meta as Command on macOS', () => {
		mockPlatform('MacIntel');
		render(
			<>
				<span aria-describedby="mod">mod</span>
				<span aria-describedby="alt">alt</span>
				<span aria-describedby="meta">meta</span>
				<Kbd id="mod" value="Mod" />
				<Kbd id="alt" value="Alt" />
				<Kbd id="meta" value="Meta" />
			</>,
		);

		expect(screen.getByText('mod')).toHaveAccessibleDescription('Command');
		expect(screen.getByText('alt')).toHaveAccessibleDescription('Option');
		expect(screen.getByText('meta')).toHaveAccessibleDescription('Command');
		expect(document.querySelector('[data-key="Mod"] [aria-hidden="true"]')).toHaveTextContent('⌘');
	});

	it('renders a kbd element with its slot, key and test id', () => {
		render(<Kbd value="Escape" testId="close-key" />);

		const key = screen.getByTestId('close-key');
		expect(key.tagName).toBe('KBD');
		expect(key).toHaveAttribute('data-slot', 'kbd');
		expect(key).toHaveAttribute('data-key', 'Escape');
		expect(key).not.toHaveAttribute('data-pressed');
		expect(key).not.toHaveAttribute('data-disabled');
		expect(key).not.toHaveAttribute('tabindex');
	});

	it('marks a disabled key', () => {
		render(<Kbd value="K" testId="key" disabled />);

		expect(screen.getByTestId('key')).toHaveAttribute('data-disabled');
	});

	it('forwards aria-* and data-* but not className, style or children', () => {
		const props = {
			className: 'custom',
			style: { color: 'red' },
			children: 'esc',
		} as Record<string, unknown>;
		render(
			<Kbd
				value="Escape"
				testId="key"
				aria-hidden
				data-origin="footer"
				data-slot="other"
				{...props}
			/>,
		);

		const key = screen.getByTestId('key');
		expect(key).toHaveAttribute('aria-hidden', 'true');
		expect(key).toHaveAttribute('data-origin', 'footer');
		expect(key).toHaveAttribute('data-slot', 'kbd');
		expect(key).not.toHaveClass('custom');
		expect(key).not.toHaveAttribute('style');
		expect(key).not.toHaveTextContent('esc');
	});

	it('sits inline by default, and mirrors display', () => {
		render(
			<>
				<Kbd value="K" testId="inline" />
				<Kbd value="K" testId="block" display="block" />
			</>,
		);

		expect(screen.getByTestId('inline')).toHaveAttribute('data-display', 'inline');
		expect(screen.getByTestId('block')).toHaveAttribute('data-display', 'block');
	});

	it('writes the margin of a block key as an internal custom property', () => {
		render(<Kbd value="K" testId="key" display="block" margin={2} marginBottom={6} />);

		const key = screen.getByTestId('key');
		expect(key.style.getPropertyValue('--kbd-internal-margin')).toBe(
			'var(--spacing-2) var(--spacing-2) var(--spacing-6)',
		);
		expect(key).not.toHaveAttribute('margin');
		expect(key).not.toHaveAttribute('marginbottom');
	});

	it('drops the margin of an inline key', () => {
		const props = { margin: 4 } as Record<string, unknown>;
		render(<Kbd value="K" testId="key" {...props} />);

		expect(screen.getByTestId('key')).not.toHaveAttribute('style');
		expect(screen.getByTestId('key')).not.toHaveAttribute('margin');
	});

	it.each(['', ' ', '\t', 'esc', 'Space', '⌘K'])(
		'renders nothing for %j and logs an error',
		(value) => {
			const error = vi.spyOn(console, 'error').mockImplementation(() => {});
			const { container } = render(<Kbd value={value} />);

			expect(container).toBeEmptyDOMElement();
			expect(error).toHaveBeenCalledWith(
				expect.stringContaining('is not a key, so the key renders nothing'),
			);
		},
	);
});

describe('Kbd.Shortcut rendering', () => {
	it('renders one kbd per key inside an outer kbd', () => {
		render(<Kbd.Shortcut keys={['Mod', 'K']} testId="open" />);

		const root = screen.getByTestId('open');
		expect(root.tagName).toBe('KBD');
		expect(root).toHaveAttribute('data-slot', 'kbd-shortcut');
		expect(root).toHaveAttribute('data-mode', 'chord');
		expect(screen.getByTestId('open-key-0')).toHaveAttribute('data-key', 'Mod');
		expect(screen.getByTestId('open-key-1')).toHaveAttribute('data-key', 'K');
		expect(root.querySelectorAll('[data-slot="kbd"]')).toHaveLength(2);
	});

	it('moves modifiers first and keeps their order', () => {
		render(<Kbd.Shortcut keys={['C', 'Meta', 'Shift']} testId="copy" />);

		const keys = [...screen.getByTestId('copy').querySelectorAll('[data-slot="kbd"]')].map((key) =>
			key.getAttribute('data-key'),
		);
		expect(keys).toEqual(['Meta', 'Shift', 'C']);
	});

	it.each<{ keys: KbdKey[] }>([{ keys: ['Mod', 'K', 'Mod', 'S'] }, { keys: ['G', 'Shift'] }])(
		'keeps the order of the sequence $keys',
		({ keys }) => {
			render(<Kbd.Shortcut keys={keys} mode="sequence" testId="sequence" />);

			const order = [...screen.getByTestId('sequence').querySelectorAll('[data-slot="kbd"]')].map(
				(key) => key.getAttribute('data-key'),
			);
			expect(order).toEqual(keys);
		},
	);

	it('reads a chord as its words', () => {
		const owner = renderDescribed(
			<Kbd.Shortcut id="hint" aria-hidden keys={['Mod', 'Shift', 'K']} />,
		);

		expect(owner).toHaveAccessibleDescription('Control Shift K');
	});

	it('reads a symbol in a chord by its name', () => {
		const owner = renderDescribed(<Kbd.Shortcut id="hint" aria-hidden keys={['Mod', '/']} />);

		expect(owner).toHaveAccessibleDescription('Control Slash');
	});

	it('reads a sequence with then', () => {
		const owner = renderDescribed(
			<Kbd.Shortcut id="hint" aria-hidden keys={['G', 'D']} mode="sequence" />,
		);

		expect(owner).toHaveAccessibleDescription('G then D');
		expect(document.querySelector('[data-slot="kbd-shortcut"]')).toHaveAttribute(
			'data-mode',
			'sequence',
		);
	});

	it('disables every key', () => {
		render(<Kbd.Shortcut keys={['Mod', 'K']} testId="open" disabled />);

		expect(screen.getByTestId('open')).toHaveAttribute('data-disabled');
		expect(screen.getByTestId('open-key-0')).toHaveAttribute('data-disabled');
		expect(screen.getByTestId('open-key-1')).toHaveAttribute('data-disabled');
	});

	it('takes display and the margin of a block shortcut on the outer kbd only', () => {
		render(<Kbd.Shortcut keys={['Mod', 'K']} testId="open" display="block" marginTop={4} />);

		const shortcut = screen.getByTestId('open');
		expect(shortcut).toHaveAttribute('data-display', 'block');
		expect(shortcut.style.getPropertyValue('--kbd-shortcut-internal-margin')).toBe(
			'var(--spacing-4) 0 0',
		);
		expect(screen.getByTestId('open-key-0')).not.toHaveAttribute('data-display');
		expect(screen.getByTestId('open-key-0')).not.toHaveAttribute('style');
	});

	it('renders nothing for an empty list, without an error', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { container } = render(<Kbd.Shortcut keys={[]} />);

		expect(container).toBeEmptyDOMElement();
		expect(error).not.toHaveBeenCalled();
	});

	it('renders nothing and logs an error when a key is not a key', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		const { container } = render(<Kbd.Shortcut keys={['Mod', 'esc']} />);

		expect(container).toBeEmptyDOMElement();
		expect(error).toHaveBeenCalledWith(
			expect.stringContaining('"esc" is not a key, so the shortcut renders nothing'),
		);
	});
});
