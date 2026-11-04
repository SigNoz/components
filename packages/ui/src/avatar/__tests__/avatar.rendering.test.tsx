import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from '../avatar.js';
import { AvatarColor } from '../constants.js';

// What a JavaScript caller, a cast or an untyped spread can pass: every prop the types refuse.
const UntypedAvatar = Avatar as unknown as ComponentType<Record<string, unknown>>;

describe('Avatar rendering', () => {
	it('renders a span that is an image named after the person', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		const avatar = screen.getByRole('img', { name: 'Alex Example' });

		expect(avatar).toBe(screen.getByTestId('avatar'));
		expect(avatar.tagName).toBe('SPAN');
	});

	it('stamps the slots and the test ids of every part', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="alex" />);

		expect(screen.getByTestId('alex')).toHaveAttribute('data-slot', 'avatar');
		expect(screen.getByTestId('alex-image')).toHaveAttribute('data-slot', 'avatar-image');
		expect(screen.getByTestId('alex-fallback')).toHaveAttribute('data-slot', 'avatar-fallback');
		expect(screen.getByTestId('alex')).toContainElement(screen.getByTestId('alex-image'));
		expect(screen.getByTestId('alex')).toContainElement(screen.getByTestId('alex-fallback'));
	});

	it('finds every part by its slot', () => {
		const { container } = render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" />,
		);

		expect(container.querySelector('[data-slot="avatar"]')).not.toBeNull();
		expect(container.querySelector('[data-slot="avatar-image"]')).not.toBeNull();
		expect(container.querySelector('[data-slot="avatar-fallback"]')).not.toBeNull();
	});

	it('renders no test id without a testId', () => {
		const { container } = render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" />,
		);

		expect(container.querySelector('[data-testid]')).toBeNull();
	});

	it('renders no image without a src', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		expect(screen.queryByTestId('avatar-image')).toBeNull();
		expect(screen.getByTestId('avatar')).toHaveTextContent('AE');
	});

	it('renders no image for an empty src', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" src="" testId="avatar" />);

		expect(screen.queryByTestId('avatar-image')).toBeNull();
		expect(screen.getByTestId('avatar')).not.toHaveAttribute('data-image-status');
	});

	it.each(['sm', 'md'] as const)('mirrors the size %s on the root', (size) => {
		render(<Avatar color="primary" name="Alex Example" size={size} testId="avatar" />);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', size);
	});

	it.each(Object.values(AvatarColor))('mirrors the color %s on the root', (color) => {
		render(<Avatar color={color} name="Alex Example" size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-color', color);
	});

	it('follows the color when it changes', () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />,
		);
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-color', 'primary');

		rerender(<Avatar color="danger" name="Alex Example" size="md" testId="avatar" />);
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-color', 'danger');
	});

	it('keeps the color on the root while the image loads and after it fails', () => {
		render(
			<Avatar color="success" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-color', 'success');
	});

	it('mirrors the shape on the root, a circle by default', () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />,
		);
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-shape', 'circle');

		rerender(
			<Avatar color="primary" name="Alex Example" size="md" shape="square" testId="avatar" />,
		);
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-shape', 'square');

		rerender(
			<Avatar color="primary" name="Alex Example" size="md" shape="circle" testId="avatar" />,
		);
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-shape', 'circle');
	});

	it('forwards id, aria and data attributes to the root', () => {
		render(
			<Avatar
				color="primary"
				name="Alex Example"
				size="md"
				testId="avatar"
				id="owner"
				aria-describedby="hint"
				data-row="first"
			/>,
		);

		const avatar = screen.getByTestId('avatar');

		expect(avatar).toHaveAttribute('id', 'owner');
		expect(avatar).toHaveAttribute('aria-describedby', 'hint');
		expect(avatar).toHaveAttribute('data-row', 'first');
	});

	it('lets a data-testid through when there is no testId', () => {
		const props = { 'data-testid': 'plain' };
		render(<Avatar color="primary" name="Alex Example" size="md" {...props} />);

		expect(screen.getByRole('img')).toHaveAttribute('data-testid', 'plain');
	});

	it('prefers testId over a data-testid', () => {
		const props = { 'data-testid': 'plain' };
		render(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" {...props} />);

		expect(screen.getByRole('img')).toHaveAttribute('data-testid', 'avatar');
	});
});

describe('Avatar accessibility', () => {
	it('names the avatar after the person, once', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar')).toHaveAttribute('aria-label', 'Alex Example');
		expect(screen.getAllByRole('img')).toHaveLength(1);
	});

	it('names an avatar with an email after the whole email', () => {
		render(<Avatar color="primary" name="alex.example@example.com" size="md" />);

		expect(screen.getByRole('img', { name: 'alex.example@example.com' })).toBeInTheDocument();
	});

	it('hides the initials from a screen reader', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar-fallback')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByText('AE')).toBeInTheDocument();
		expect(screen.queryByRole('img', { name: 'AE' })).toBeNull();
	});

	it('gives the image an empty alt, so it is not read twice', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		expect(screen.getByTestId('avatar-image')).toHaveAttribute('alt', '');
		expect(screen.getAllByRole('img')).toHaveLength(1);
	});

	it('is hidden from a screen reader with aria-hidden on the root', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" aria-hidden="true" testId="avatar" />,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByRole('img')).toBeNull();
	});

	it('lets a consumer name it otherwise with aria-label', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" aria-label="Alex Example, owner" />,
		);

		expect(screen.getByRole('img', { name: 'Alex Example, owner' })).toBeInTheDocument();
	});

	it('keeps the name when aria-label is undefined', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" aria-label={undefined} />);

		expect(screen.getByRole('img', { name: 'Alex Example' })).toBeInTheDocument();
	});

	it('is not focusable and takes no tab stop', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />
				<button type="button">after</button>
			</>,
		);

		const avatar = screen.getByTestId('avatar');
		expect(avatar).not.toHaveAttribute('tabindex');

		await user.tab();

		expect(document.activeElement).toBe(screen.getByRole('button', { name: 'after' }));
	});
});

describe('Avatar empty name', () => {
	it.each([
		['an empty string', ''],
		['spaces', '   '],
		['tabs and new lines', '\t \n'],
	])('shows a generic icon and an unknown name for %s', (_, name) => {
		render(<Avatar color="primary" name={name} size="md" testId="avatar" />);

		const fallback = screen.getByTestId('avatar-fallback');

		expect(screen.getByRole('img', { name: 'Unknown user' })).toBe(screen.getByTestId('avatar'));
		expect(fallback).toHaveAttribute('data-slot', 'avatar-fallback');
		expect(fallback).toHaveAttribute('aria-hidden', 'true');
		expect(fallback.textContent).toBe('');
		expect(fallback.querySelector('svg')).not.toBeNull();
	});

	it.each([
		['undefined', undefined],
		['null', null],
		['a number', 42],
	])('shows the generic icon and an unknown name for %s', (_, name) => {
		render(<UntypedAvatar color="primary" name={name} size="md" testId="avatar" />);

		expect(screen.getByRole('img', { name: 'Unknown user' })).toBe(screen.getByTestId('avatar'));
		expect(screen.getByTestId('avatar-fallback').textContent).toBe('');
		expect(screen.getByTestId('avatar-fallback').querySelector('svg')).not.toBeNull();
	});

	it.each([
		['an invisible character', '\u200b'],
		['punctuation', '---'],
		['an email that starts with a symbol', '+@example.com'],
	])('keeps the initials and the name for %s, which is not blank', (_, name) => {
		render(<Avatar color="primary" name={name} size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar')).toHaveAttribute('aria-label', name);
		expect(screen.getByTestId('avatar-fallback').textContent).not.toBe('');
		expect(screen.getByTestId('avatar-fallback').querySelector('svg')).toBeNull();
	});

	it('still renders, so a list keeps its alignment', () => {
		render(<Avatar color="primary" name="" size="sm" testId="avatar" />);

		expect(screen.getByTestId('avatar')).toBeInTheDocument();
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'sm');
	});

	it('shows no letters and the icon when the name is empty and the image fails', () => {
		const { rerender } = render(
			<Avatar color="primary" name="" size="md" src="/alex.png" testId="avatar" />,
		);

		expect(screen.getByTestId('avatar-fallback').querySelector('svg')).not.toBeNull();
		expect(screen.getByRole('img', { name: 'Unknown user' })).toBeInTheDocument();

		rerender(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		expect(screen.getByTestId('avatar-fallback').querySelector('svg')).toBeNull();
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
	});
});

describe('Avatar rejected props at runtime', () => {
	it('drops className, style, alt, children and loading', () => {
		render(
			<UntypedAvatar
				color="primary"
				name="Alex Example"
				size="md"
				src="/alex.png"
				testId="avatar"
				className="consumer-class"
				style={{ width: 99, color: 'red' }}
				alt="consumer alt"
				loading
			>
				ZZ
			</UntypedAvatar>,
		);

		const avatar = screen.getByTestId('avatar');

		expect(avatar).not.toHaveClass('consumer-class');
		expect(avatar).not.toHaveAttribute('style');
		expect(avatar).not.toHaveAttribute('alt');
		expect(avatar).not.toHaveAttribute('loading');
		expect(screen.getByTestId('avatar-image')).toHaveAttribute('alt', '');
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
		expect(avatar).not.toHaveTextContent('ZZ');
	});

	it('keeps its own class when a className gets through', () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />,
		);
		const own = screen.getByTestId('avatar').className;

		rerender(
			<UntypedAvatar
				color="primary"
				name="Alex Example"
				size="md"
				testId="avatar"
				className="consumer-class"
			/>,
		);

		expect(screen.getByTestId('avatar').className).toBe(own);
	});

	it('keeps the initials when children get through', () => {
		render(
			<UntypedAvatar color="primary" name="Alex Example" size="md" testId="avatar">
				ZZ
			</UntypedAvatar>,
		);

		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
	});

	it('drops onClick, so a click reaches nothing', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<UntypedAvatar
				color="primary"
				name="Alex Example"
				size="md"
				testId="avatar"
				onClick={onClick}
			/>,
		);

		await user.click(screen.getByTestId('avatar'));

		expect(onClick).not.toHaveBeenCalled();
	});

	it('keeps the role when a role gets through', () => {
		render(
			<UntypedAvatar
				color="primary"
				name="Alex Example"
				size="md"
				testId="avatar"
				role="presentation"
			/>,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('role', 'img');
	});
});
