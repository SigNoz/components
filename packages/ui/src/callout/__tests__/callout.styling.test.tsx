import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { describe, expect, it } from 'vitest';

import { Callout } from '../callout.js';

const icon = <svg />;

function renderExpandable(size: 'sm' | 'md', style: CSSProperties = {}, title = 'What is it?') {
	return render(
		<div style={style}>
			<Callout.Expandable
				color="primary"
				size={size}
				icon={icon}
				testId="c"
				title={title}
				defaultExpanded
			>
				The answer
			</Callout.Expandable>
		</div>,
	);
}

describe('Callout styling', () => {
	it('cuts a long title on the inline axis only, so its descenders stay visible', () => {
		renderExpandable(
			'sm',
			{ width: '160px' },
			'A title that is far too long to fit in the title row of the callout',
		);

		const title = screen.getByTestId('c-title');
		const style = getComputedStyle(title);

		expect(style.overflowX).toBe('clip');
		expect(style.overflowY).toBe('visible');
		expect(style.textOverflow).toBe('ellipsis');
		expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
	});
});

describe('Callout.Link styling', () => {
	it('draws an action like the anchor link inside the prose', () => {
		render(
			<Callout color="primary" size="md" icon={icon}>
				Read the{' '}
				<Callout.Link href="#docs" testId="anchor">
					docs
				</Callout.Link>{' '}
				or{' '}
				<Callout.Link onClick={() => {}} testId="action">
					act
				</Callout.Link>
				.
			</Callout>,
		);

		const anchor = getComputedStyle(screen.getByTestId('anchor'));
		const action = getComputedStyle(screen.getByTestId('action'));

		for (const property of [
			'color',
			'fontFamily',
			'fontSize',
			'fontWeight',
			'lineHeight',
			'letterSpacing',
			'textTransform',
			'textDecorationLine',
			'cursor',
		] as const) {
			expect(action[property], property).toBe(anchor[property]);
		}

		expect(action.backgroundColor).toBe('rgba(0, 0, 0, 0)');
		expect(action.borderTopWidth).toBe('0px');
		expect(action.paddingTop).toBe('0px');
		expect(action.paddingLeft).toBe('0px');
	});
});
