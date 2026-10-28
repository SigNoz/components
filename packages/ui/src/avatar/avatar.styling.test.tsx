import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './index.js';

describe('Avatar type', () => {
	it.each([
		['sm', 24],
		['md', 32],
		['lg', 40],
		['xl', 48],
	] as const)('keeps %s initials in a %ipx box', (size, box) => {
		render(
			<Avatar size={size} testId="a">
				AB
			</Avatar>,
		);

		expect(screen.getByTestId('a').getBoundingClientRect().height).toBe(box);
	});
});
