import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Skeleton } from '../index.js';

describe('Skeleton forwardRef', () => {
	it('forwards the ref to the root element', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Skeleton ref={ref} testId="card" />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('card'));
		expect(ref.current).toHaveAttribute('data-slot', 'skeleton');
	});

	it('calls a callback ref with the root element', () => {
		const ref = vi.fn();
		render(<Skeleton ref={ref} testId="card" />);

		expect(ref).toHaveBeenCalledWith(screen.getByTestId('card'));
	});
});

describe('Skeleton.Input forwardRef', () => {
	it('forwards the ref to the placeholder element', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Skeleton.Input ref={ref} size="md" testId="field" />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('field'));
		expect(ref.current).toHaveAttribute('data-slot', 'skeleton-input');
	});

	it('names itself Skeleton.Input', () => {
		expect(Skeleton.Input.displayName).toBe('Skeleton.Input');
	});
});

describe('Skeleton.Button forwardRef', () => {
	it('forwards the ref to the placeholder element', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Skeleton.Button ref={ref} size="md" testId="action" />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('action'));
		expect(ref.current).toHaveAttribute('data-slot', 'skeleton-button');
	});

	it('names itself Skeleton.Button', () => {
		expect(Skeleton.Button.displayName).toBe('Skeleton.Button');
	});
});

describe('Skeleton.Avatar forwardRef', () => {
	it('forwards the ref to the placeholder element', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Skeleton.Avatar ref={ref} size="md" testId="owner" />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('owner'));
		expect(ref.current).toHaveAttribute('data-slot', 'skeleton-avatar');
	});

	it('names itself Skeleton.Avatar', () => {
		expect(Skeleton.Avatar.displayName).toBe('Skeleton.Avatar');
	});
});
