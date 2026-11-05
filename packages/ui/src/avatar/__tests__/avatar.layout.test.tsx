import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Avatar } from '../avatar.js';

// The design tokens are not loaded here, so the steps the avatar reads are declared in the test,
// with the numbers `@signozhq/design-tokens` ships.
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--label-small-500-font-family: Inter, sans-serif;
		--label-small-500-font-size: 11px;
		--label-small-500-font-weight: 500;
		--label-small-500-line-height: 1;
		--label-small-500-letter-spacing: 0px;
		--label-small-500-text-transform: none;
		--label-base-500-font-family: Inter, sans-serif;
		--label-base-500-font-size: 13px;
		--label-base-500-font-weight: 500;
		--label-base-500-line-height: 1;
		--label-base-500-letter-spacing: -0.5px;
		--label-base-500-text-transform: none;
		--radius-3: 6px;
		--radius-round: 999999px;
		--avatar-primary-background: rgb(10, 20, 30);
		--avatar-primary-foreground: rgb(200, 210, 220);
		--avatar-danger-background: rgb(40, 50, 60);
		--avatar-danger-foreground: rgb(230, 240, 250);
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

describe('Avatar layout', () => {
	it.each([
		['sm', 24, '11px', 'normal'],
		['md', 32, '13px', '-0.5px'],
	] as const)('is %s: %ipx wide and tall, with a %s letter', (size, pixels, fontSize, spacing) => {
		render(<Avatar color="primary" name="Alex Example" size={size} testId="avatar" />);

		const avatar = screen.getByTestId('avatar');
		const rect = avatar.getBoundingClientRect();

		expect(rect.width).toBe(pixels);
		expect(rect.height).toBe(pixels);
		expect(getComputedStyle(avatar).fontSize).toBe(fontSize);
		expect(getComputedStyle(avatar).letterSpacing).toBe(spacing);
		expect(getComputedStyle(avatar).lineHeight).toBe(fontSize);
	});

	it('is a circle by default and a rounded square on request', () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />,
		);
		expect(
			parseFloat(getComputedStyle(screen.getByTestId('avatar')).borderTopLeftRadius),
		).toBeGreaterThan(16);

		rerender(
			<Avatar color="primary" name="Alex Example" size="md" shape="square" testId="avatar" />,
		);
		expect(getComputedStyle(screen.getByTestId('avatar')).borderTopLeftRadius).toBe('6px');
	});

	it('does not shrink in a flex row', () => {
		render(
			<div style={{ display: 'flex', width: 20 }}>
				<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />
				<div style={{ width: 100, flexShrink: 1 }} />
			</div>,
		);

		expect(screen.getByTestId('avatar').getBoundingClientRect().width).toBe(32);
	});

	it('clips its content to the shape', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		expect(getComputedStyle(screen.getByTestId('avatar')).overflow).toBe('hidden');
	});

	it('keeps a long name inside the avatar', () => {
		render(
			<Avatar
				color="primary"
				name="Wolfeschlegelsteinhausenbergerdorff Wolfeschlegelsteinhausenbergerdorff"
				size="sm"
				testId="avatar"
			/>,
		);

		const rect = screen.getByTestId('avatar').getBoundingClientRect();

		expect(rect.width).toBe(24);
		expect(rect.height).toBe(24);
		expect(screen.getByTestId('avatar-fallback').textContent).toBe('WW');
	});

	it('puts the initials on the surface of its color, centred', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		const avatar = screen.getByTestId('avatar');
		const style = getComputedStyle(avatar);
		const fallback = screen.getByTestId('avatar-fallback').getBoundingClientRect();
		const root = avatar.getBoundingClientRect();

		expect(style.backgroundColor).toBe('rgb(10, 20, 30)');
		expect(style.color).toBe('rgb(200, 210, 220)');
		expect(style.fontWeight).toBe('500');
		expect(fallback.width).toBe(root.width);
		expect(fallback.height).toBe(root.height);
		expect(getComputedStyle(screen.getByTestId('avatar-fallback')).justifyContent).toBe('center');
	});

	it('takes the fill and the letter color of its color', () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />,
		);
		expect(getComputedStyle(screen.getByTestId('avatar')).backgroundColor).toBe('rgb(10, 20, 30)');

		rerender(<Avatar color="danger" name="Alex Example" size="md" testId="avatar" />);

		const style = getComputedStyle(screen.getByTestId('avatar'));

		expect(style.backgroundColor).toBe('rgb(40, 50, 60)');
		expect(style.color).toBe('rgb(230, 240, 250)');
	});

	it('does not take the case or the weight of the text around it', () => {
		render(
			<p style={{ textTransform: 'lowercase', fontWeight: 700 }}>
				<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />
			</p>,
		);

		const style = getComputedStyle(screen.getByTestId('avatar'));

		expect(style.textTransform).toBe('none');
		expect(style.fontWeight).toBe('500');
	});

	it('does not take the italics of the text around it', () => {
		render(
			<em style={{ fontStyle: 'italic' }}>
				<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />
			</em>,
		);

		expect(getComputedStyle(screen.getByTestId('avatar')).fontStyle).toBe('normal');
		expect(getComputedStyle(screen.getByTestId('avatar-fallback')).fontStyle).toBe('normal');
	});

	it('lays the image over the whole shape', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		const root = screen.getByTestId('avatar').getBoundingClientRect();
		const image = screen.getByTestId('avatar-image').getBoundingClientRect();

		expect(image.width).toBe(root.width);
		expect(image.height).toBe(root.height);
		expect(image.left).toBe(root.left);
		expect(image.top).toBe(root.top);
	});

	it('has no rule for hover, focus or press', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		const root = screen.getByTestId('avatar');
		const className = root.className;
		const interactive = Array.from(document.styleSheets).flatMap((sheet) =>
			Array.from(sheet.cssRules)
				.filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
				.filter((rule) => rule.selectorText.includes(className))
				.filter((rule) => /:(hover|focus|focus-visible|active)/.test(rule.selectorText)),
		);

		expect(className).not.toBe('');
		expect(interactive).toEqual([]);
	});
});
