import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Pill } from '../pill.js';

describe('Pill width', () => {
	it('maps width to the width custom property', () => {
		render(
			<Pill variant="outlined" color="primary" width="10rem">
				Active
			</Pill>,
		);

		expect(screen.getByRole('button').style.getPropertyValue('--pill-internal-width')).toBe(
			'10rem',
		);
	});

	it('maps maxWidth to the max-width custom property', () => {
		render(
			<Pill variant="outlined" color="primary" maxWidth="20rem">
				Active
			</Pill>,
		);

		expect(screen.getByRole('button').style.getPropertyValue('--pill-internal-max-width')).toBe(
			'20rem',
		);
	});

	it('writes a number as px, custom properties get no unit from React', () => {
		render(
			<Pill variant="outlined" color="primary" width={200} maxWidth={240}>
				Active
			</Pill>,
		);

		const { style } = screen.getByRole('button');
		expect(style.getPropertyValue('--pill-internal-width')).toBe('200px');
		expect(style.getPropertyValue('--pill-internal-max-width')).toBe('240px');
	});

	it('keeps a zero, which is a real length', () => {
		render(
			<Pill variant="outlined" color="primary" maxWidth={0}>
				Active
			</Pill>,
		);

		expect(screen.getByRole('button').style.getPropertyValue('--pill-internal-max-width')).toBe(
			'0px',
		);
	});

	it('leaves both custom properties unset by default, so the size tokens win', () => {
		render(
			<Pill variant="outlined" color="primary">
				Active
			</Pill>,
		);

		const { style } = screen.getByRole('button');
		expect(style.getPropertyValue('--pill-internal-width')).toBe('');
		expect(style.getPropertyValue('--pill-internal-max-width')).toBe('');
	});

	it('keeps the caller style alongside the custom properties', () => {
		render(
			<Pill
				variant="outlined"
				color="primary"
				width="10rem"
				style={{ color: 'red', marginTop: '4px' }}
			>
				Active
			</Pill>,
		);

		const pill = screen.getByRole('button');
		expect(pill).toHaveStyle({ color: 'rgb(255, 0, 0)', marginTop: '4px' });
		expect(pill.style.getPropertyValue('--pill-internal-width')).toBe('10rem');
	});
});

describe('Pill.Closeable width', () => {
	it('maps width and maxWidth to the same custom properties the root Pill uses', () => {
		render(
			<Pill.Closeable onClose={() => {}} width="10rem" maxWidth="20rem">
				env:prod
			</Pill.Closeable>,
		);

		const { style } = screen.getByRole('button', { name: 'env:prod' });
		expect(style.getPropertyValue('--pill-internal-width')).toBe('10rem');
		expect(style.getPropertyValue('--pill-internal-max-width')).toBe('20rem');
	});

	it('writes a number as px', () => {
		render(
			<Pill.Closeable onClose={() => {}} width={200}>
				env:prod
			</Pill.Closeable>,
		);

		expect(
			screen
				.getByRole('button', { name: 'env:prod' })
				.style.getPropertyValue('--pill-internal-width'),
		).toBe('200px');
	});

	it('keeps the caller style alongside the custom properties', () => {
		render(
			<Pill.Closeable onClose={() => {}} maxWidth="20rem" style={{ marginTop: '4px' }}>
				env:prod
			</Pill.Closeable>,
		);

		const body = screen.getByRole('button', { name: 'env:prod' });
		expect(body).toHaveStyle({ marginTop: '4px' });
		expect(body.style.getPropertyValue('--pill-internal-max-width')).toBe('20rem');
	});
});
