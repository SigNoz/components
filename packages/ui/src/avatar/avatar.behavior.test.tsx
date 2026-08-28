import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './index.js';

describe('Avatar content', () => {
	it('shows the fallback children when there is no image', () => {
		render(<Avatar>YM</Avatar>);
		expect(screen.getByText('YM')).toBeInTheDocument();
		expect(document.querySelector('img')).toBeNull();
	});

	it('keeps the fallback visible until the image has loaded', () => {
		// CHANGED (Base UI migration): the image element is only swapped in once
		// it loads successfully, so a broken or slow src no longer flashes an
		// empty frame. jsdom never loads images, so the fallback is what renders
		// here; the loaded state is verified in a real browser instead.
		render(
			<Avatar src="/me.png" alt="Yunus">
				YM
			</Avatar>,
		);

		expect(screen.getByText('YM')).toBeInTheDocument();
		expect(document.querySelector('img')).toBeNull();
	});

	it('shows the loading skeleton instead of image or fallback', () => {
		render(
			<Avatar loading src="/me.png" testId="av">
				YM
			</Avatar>,
		);

		expect(screen.getByTestId('av')).toHaveAttribute('data-loading');
		expect(document.querySelector('img')).toBeNull();
		expect(screen.queryByText('YM')).not.toBeInTheDocument();
	});
});

describe('Avatar styling hooks', () => {
	it('exposes size and shape', () => {
		render(
			<Avatar size="xl" shape="square" testId="av">
				YM
			</Avatar>,
		);

		const root = screen.getByTestId('av');
		expect(root).toHaveAttribute('data-size', 'xl');
		expect(root).toHaveAttribute('data-shape', 'square');
	});

	it('maps semantic colors onto the palette token', () => {
		const { rerender } = render(
			<Avatar color="error" testId="av">
				YM
			</Avatar>,
		);
		expect(screen.getByTestId('av')).toHaveAttribute('data-color', 'cherry');

		rerender(
			<Avatar color="aqua" testId="av">
				YM
			</Avatar>,
		);
		expect(screen.getByTestId('av')).toHaveAttribute('data-color', 'aqua');
	});
});
