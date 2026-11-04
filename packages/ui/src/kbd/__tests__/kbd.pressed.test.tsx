import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Kbd } from '../index.js';
import { keyDown, keyUp, withDesktopViewport } from './kbd.test-utils.js';

withDesktopViewport();

describe('Kbd pressed', () => {
	it('is not pressed by default', () => {
		render(<Kbd value="K" testId="key" />);

		expect(screen.getByTestId('key')).not.toHaveAttribute('data-pressed');
	});

	it('is not pressed when pressed is false', () => {
		render(<Kbd value="K" testId="key" pressed={false} />);

		expect(screen.getByTestId('key')).not.toHaveAttribute('data-pressed');
	});

	it('draws data-pressed when pressed is true', () => {
		render(<Kbd value="K" testId="key" pressed />);

		expect(screen.getByTestId('key')).toHaveAttribute('data-pressed');
	});

	it('follows the prop as it changes', () => {
		const { rerender } = render(<Kbd value="K" testId="key" />);

		rerender(<Kbd value="K" testId="key" pressed />);
		expect(screen.getByTestId('key')).toHaveAttribute('data-pressed');

		rerender(<Kbd value="K" testId="key" pressed={false} />);
		expect(screen.getByTestId('key')).not.toHaveAttribute('data-pressed');
	});

	it('never shows a disabled key as pressed', () => {
		render(<Kbd value="K" testId="key" pressed disabled />);

		expect(screen.getByTestId('key')).not.toHaveAttribute('data-pressed');
		expect(screen.getByTestId('key')).toHaveAttribute('data-disabled');
	});

	it('does not forward pressed to the kbd element as an attribute', () => {
		render(<Kbd value="K" testId="key" pressed />);

		expect(screen.getByTestId('key')).not.toHaveAttribute('pressed');
	});

	it('presses nothing when a key goes down on the document', () => {
		render(
			<>
				<Kbd value="K" testId="key" />
				<Kbd value="Mod" testId="mod" />
				<Kbd value="Escape" testId="escape" />
			</>,
		);

		keyDown('k');
		keyDown('Control');
		keyDown('Escape');
		keyDown('k', { ctrlKey: true });

		expect(screen.getByTestId('key')).not.toHaveAttribute('data-pressed');
		expect(screen.getByTestId('mod')).not.toHaveAttribute('data-pressed');
		expect(screen.getByTestId('escape')).not.toHaveAttribute('data-pressed');
	});

	it('does not release a pressed key when a key goes up on the document', () => {
		render(<Kbd value="K" testId="key" pressed />);

		keyDown('k');
		keyUp('k');

		expect(screen.getByTestId('key')).toHaveAttribute('data-pressed');
	});
});

describe('Kbd.Shortcut pressed', () => {
	it('is not pressed by default', () => {
		render(<Kbd.Shortcut keys={['Mod', 'K']} testId="open" />);

		expect(screen.getByTestId('open-key-0')).not.toHaveAttribute('data-pressed');
		expect(screen.getByTestId('open-key-1')).not.toHaveAttribute('data-pressed');
	});

	it('presses every key of a chord', () => {
		render(<Kbd.Shortcut keys={['Mod', 'Shift', 'K']} testId="open" pressed />);

		expect(screen.getByTestId('open-key-0')).toHaveAttribute('data-pressed');
		expect(screen.getByTestId('open-key-1')).toHaveAttribute('data-pressed');
		expect(screen.getByTestId('open-key-2')).toHaveAttribute('data-pressed');
	});

	it('presses every key of a sequence', () => {
		render(<Kbd.Shortcut keys={['G', 'D']} mode="sequence" testId="go" pressed />);

		expect(screen.getByTestId('go-key-0')).toHaveAttribute('data-pressed');
		expect(screen.getByTestId('go-key-1')).toHaveAttribute('data-pressed');
	});

	it('follows the prop as it changes', () => {
		const { rerender } = render(<Kbd.Shortcut keys={['G', 'D']} mode="sequence" testId="go" />);

		rerender(<Kbd.Shortcut keys={['G', 'D']} mode="sequence" testId="go" pressed />);
		expect(screen.getByTestId('go-key-1')).toHaveAttribute('data-pressed');

		rerender(<Kbd.Shortcut keys={['G', 'D']} mode="sequence" testId="go" pressed={false} />);
		expect(screen.getByTestId('go-key-0')).not.toHaveAttribute('data-pressed');
		expect(screen.getByTestId('go-key-1')).not.toHaveAttribute('data-pressed');
	});

	it('never shows a disabled shortcut as pressed', () => {
		render(<Kbd.Shortcut keys={['Mod', 'K']} testId="open" pressed disabled />);

		expect(screen.getByTestId('open-key-0')).not.toHaveAttribute('data-pressed');
		expect(screen.getByTestId('open-key-1')).not.toHaveAttribute('data-pressed');
	});

	it('does not put data-pressed on the outer kbd', () => {
		render(<Kbd.Shortcut keys={['Mod', 'K']} testId="open" pressed />);

		expect(screen.getByTestId('open')).not.toHaveAttribute('data-pressed');
		expect(screen.getByTestId('open')).not.toHaveAttribute('pressed');
	});

	it('presses nothing in a chord or a sequence when a key goes down on the document', () => {
		render(
			<>
				<Kbd.Shortcut keys={['Mod', 'K']} testId="open" />
				<Kbd.Shortcut keys={['G', 'D']} mode="sequence" testId="go" />
			</>,
		);

		keyDown('Control');
		keyDown('k', { ctrlKey: true });
		keyDown('g');
		keyUp('g');
		keyDown('d');

		for (const id of ['open-key-0', 'open-key-1', 'go-key-0', 'go-key-1']) {
			expect(screen.getByTestId(id)).not.toHaveAttribute('data-pressed');
		}
	});

	it('keeps the sequence reading with then whatever the press', () => {
		render(
			<>
				<span aria-describedby="hint">Go</span>
				<Kbd.Shortcut id="hint" aria-hidden keys={['G', 'D']} mode="sequence" pressed />
			</>,
		);

		expect(screen.getByText('Go')).toHaveAccessibleDescription('G then D');
	});
});
