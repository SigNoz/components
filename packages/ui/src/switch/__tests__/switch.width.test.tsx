import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Switch } from '../switch.js';

describe('Switch width and maxWidth', () => {
	it('writes width onto the wrapper as a custom property, numbers as px', () => {
		render(
			<Switch color="primary" textPlacement="right" containerTestId="container" width={240}>
				Wrap text
			</Switch>,
		);

		const container = screen.getByTestId('container');
		expect(container.style.getPropertyValue('--switch-internal-width')).toBe('240px');
		expect(container.getBoundingClientRect().width).toBe(240);
	});

	it('keeps a string width as written', () => {
		render(
			<Switch color="primary" textPlacement="right" containerTestId="container" width="20rem">
				Wrap text
			</Switch>,
		);

		expect(screen.getByTestId('container').style.getPropertyValue('--switch-internal-width')).toBe(
			'20rem',
		);
	});

	it('writes maxWidth the same way', () => {
		render(
			<Switch color="primary" textPlacement="right" containerTestId="container" maxWidth={160}>
				Wrap text
			</Switch>,
		);

		expect(
			screen.getByTestId('container').style.getPropertyValue('--switch-internal-max-width'),
		).toBe('160px');
	});

	it('composes with a consumer style instead of replacing it', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				containerTestId="container"
				width={240}
				containerStyle={{ marginBlock: '12px' }}
			>
				Wrap text
			</Switch>,
		);

		const container = screen.getByTestId('container');
		expect(container.style.getPropertyValue('--switch-internal-width')).toBe('240px');
		expect(container).toHaveStyle({ marginBlock: '12px' });
	});

	it('lands on the bare switch when there is no wrapper, without resizing the track', () => {
		render(
			<Switch
				color="primary"
				textPlacement="right"
				testId="switch"
				aria-label="Wrap text"
				width={240}
			/>,
		);

		const root = screen.getByTestId('switch');
		expect(root.style.getPropertyValue('--switch-internal-width')).toBe('240px');
		// The track is sized by `--switch-track-width`, never by the row width.
		expect(root.getBoundingClientRect().width).toBe(28);
	});

	it('never writes the properties it was not given', () => {
		render(
			<Switch color="primary" textPlacement="right" containerTestId="container">
				Wrap text
			</Switch>,
		);

		const container = screen.getByTestId('container');
		expect(container.style.getPropertyValue('--switch-internal-width')).toBe('');
		expect(container.style.getPropertyValue('--switch-internal-max-width')).toBe('');
	});
});
