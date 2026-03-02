import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, ButtonBackground, ButtonColor, ButtonVariant } from './button.js';

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
				<a href="#">Link</a>
			</Button>
		);
		const link = screen.getByTestId('link-btn');
		expect(link.tagName).toBe('A');
		expect(link).toHaveAttribute('href', '#');
		expect(link).toHaveAttribute('data-color', 'primary');
	});

	it('calls onClick when clicked', () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Click me</Button>);
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(expect.any(Object));
	});

	it('calls onDoubleClick when double-clicked', () => {
		const onDoubleClick = vi.fn();
		render(<Button onDoubleClick={onDoubleClick}>Double</Button>);
		fireEvent.doubleClick(screen.getByRole('button'));
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
});
