import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, ButtonBackground, ButtonColor, ButtonSize, ButtonVariant } from './button.js';
import { ButtonGroup } from './button-group.js';

describe('Button', () => {
	it('renders as button with default props and children', () => {
		render(<Button>Label</Button>);
		const button = screen.getByRole('button', { name: 'Label' });
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
		expect(button).toHaveAttribute('data-color', 'primary');
	});

	it('applies testId to data-testid', () => {
		render(<Button testId="my-button">Click</Button>);
		expect(screen.getByTestId('my-button')).toBeInTheDocument();
	});

	it('disables the button when disabled is true', () => {
		const onClick = vi.fn();

		render(
			<Button disabled onClick={onClick}>
				Disabled
			</Button>
		);
		expect(screen.getByRole('button')).toBeDisabled();

		fireEvent.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(0);
	});

	it('blocks onClick when disabled', () => {
		const onClick = vi.fn();

		render(
			<Button disabled onClick={onClick}>
				Disabled
			</Button>
		);
		const button = screen.getByRole('button');

		fireEvent.click(button);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('stops propagation in asChild mode when disabled', () => {
		const onClick = vi.fn();
		const parentClick = vi.fn();

		render(
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
			<div onClick={parentClick}>
				<Button asChild disabled onClick={onClick} testId="link-btn">
					<a href="#">Learn more about buttons</a>
				</Button>
			</div>
		);
		const link = screen.getByTestId('link-btn');

		fireEvent.click(link);

		expect(onClick).not.toHaveBeenCalled();
		expect(parentClick).not.toHaveBeenCalled();
	});

	it('blocks onClick when loading', () => {
		const onClick = vi.fn();

		render(
			<Button loading onClick={onClick}>
				Loading
			</Button>
		);
		const button = screen.getByRole('button');

		fireEvent.click(button);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('blocks onClick in asChild mode when disabled', () => {
		const onClick = vi.fn();

		render(
			<Button asChild disabled onClick={onClick} testId="link-btn">
				<a href="#">Learn more about buttons</a>
			</Button>
		);
		const link = screen.getByTestId('link-btn');

		fireEvent.click(link);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('disables the button and shows spinner when loading', () => {
		const onClick = vi.fn();

		render(
			<Button loading onClick={onClick}>
				Loading
			</Button>
		);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();

		fireEvent.click(button);
		expect(onClick).toHaveBeenCalledTimes(0);

		expect(button.querySelector('.animate-fast-spin')).toBeInTheDocument();
	});

	it('hides prefix and suffix when loading', () => {
		render(
			<Button loading prefix={<span data-testid="prefix" />} suffix={<span data-testid="suffix" />}>
				Load
			</Button>
		);
		expect(screen.queryByTestId('prefix')).not.toBeInTheDocument();
		expect(screen.queryByTestId('suffix')).not.toBeInTheDocument();
	});

	it('renders prefix and suffix when not loading', () => {
		render(
			<Button prefix={<span data-testid="prefix" />} suffix={<span data-testid="suffix" />}>
				With icons
			</Button>
		);
		expect(screen.getByTestId('prefix')).toBeInTheDocument();
		expect(screen.getByTestId('suffix')).toBeInTheDocument();
	});

	it('renders as child element when asChild is true', () => {
		render(
			<Button asChild testId="link-btn">
				<a href="#">Learn more about buttons</a>
			</Button>
		);
		const link = screen.getByTestId('link-btn');
		expect(link.tagName).toBe('A');
		expect(link).toHaveAttribute('href', '#');
		expect(link).toHaveAttribute('data-color', 'primary');
	});

	it('calls onClick when clicked', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Click me</Button>);
		await user.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(expect.any(Object));
	});

	it('calls onDoubleClick when double-clicked', async () => {
		const user = userEvent.setup();
		const onDoubleClick = vi.fn();
		render(<Button onDoubleClick={onDoubleClick}>Double</Button>);
		await user.dblClick(screen.getByRole('button'));
		expect(onDoubleClick).toHaveBeenCalledTimes(1);
	});

	it('forwards ref to the button element', () => {
		const ref = createRef<HTMLButtonElement>();
		render(<Button ref={ref}>Ref</Button>);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('applies data-color for color prop', () => {
		render(<Button color={ButtonColor.Destructive}>Delete</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('data-color', 'destructive');
	});

	it('applies data-background for Action variant with background', () => {
		render(
			<Button variant={ButtonVariant.Action} background={ButtonBackground.Vanilla100}>
				Action
			</Button>
		);
		expect(screen.getByRole('button')).toHaveAttribute('data-background', 'vanilla-100');
	});

	it('merges custom className', () => {
		render(<Button className="custom-class">Custom</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});

	it('applies type="submit" when specified', () => {
		render(<Button type="submit">Submit</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
	});

	it('forwards native event handlers (onMouseEnter, onFocus, onKeyDown)', async () => {
		const user = userEvent.setup();
		const onMouseEnter = vi.fn();
		const onFocus = vi.fn();
		const onKeyDown = vi.fn();
		render(
			<Button onMouseEnter={onMouseEnter} onFocus={onFocus} onKeyDown={onKeyDown}>
				Hover
			</Button>
		);
		const btn = screen.getByRole('button');
		await user.hover(btn);
		await user.click(btn);
		await user.keyboard('{Enter}');
		expect(onMouseEnter).toHaveBeenCalledTimes(1);
		expect(onFocus).toHaveBeenCalledTimes(1);
		expect(onKeyDown).toHaveBeenCalledTimes(1);
	});

	it('forwards arbitrary aria-* and data-* attributes to the button element', () => {
		render(
			<Button aria-label="Toolbar action" data-foo="bar" tabIndex={-1}>
				X
			</Button>
		);
		const btn = screen.getByRole('button');
		expect(btn).toHaveAttribute('aria-label', 'Toolbar action');
		expect(btn).toHaveAttribute('data-foo', 'bar');
		expect(btn).toHaveAttribute('tabindex', '-1');
	});
});

describe('ButtonGroup', () => {
	it('renders a group with role=group', () => {
		render(
			<ButtonGroup testId="g">
				<Button>A</Button>
				<Button>B</Button>
			</ButtonGroup>
		);
		const group = screen.getByTestId('g');
		expect(group).toHaveAttribute('role', 'group');
	});

	it('propagates size to child buttons that do not override it', () => {
		render(
			<ButtonGroup size={ButtonSize.SM} testId="g">
				<Button testId="a">A</Button>
				<Button testId="b" size={ButtonSize.MD}>
					B
				</Button>
			</ButtonGroup>
		);
		expect(screen.getByTestId('a')).toHaveAttribute('data-size', 'sm');
		expect(screen.getByTestId('b')).toHaveAttribute('data-size', 'md');
	});

	it('propagates variant and color to child buttons', () => {
		render(
			<ButtonGroup variant={ButtonVariant.Outlined} color={ButtonColor.Secondary}>
				<Button testId="a">A</Button>
				<Button testId="b" color={ButtonColor.Destructive}>
					B
				</Button>
			</ButtonGroup>
		);
		const a = screen.getByTestId('a');
		const b = screen.getByTestId('b');
		expect(a).toHaveAttribute('data-variant', 'outlined');
		expect(a).toHaveAttribute('data-color', 'secondary');
		expect(b).toHaveAttribute('data-color', 'destructive');
	});

	it('forwards ref to the group element', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<ButtonGroup ref={ref}>
				<Button>A</Button>
			</ButtonGroup>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
