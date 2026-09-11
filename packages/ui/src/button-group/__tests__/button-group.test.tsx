import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../button/index.js';
import { ButtonGroup } from '../button-group.js';

describe('ButtonGroup rendering', () => {
	it('renders a div with role=group', () => {
		render(
			<ButtonGroup variant="solid" color="primary" testId="group">
				<Button size="md" variant="solid" color="primary">
					A
				</Button>
			</ButtonGroup>,
		);

		const group = screen.getByRole('group');
		expect(group.tagName).toBe('DIV');
		expect(group).toBe(screen.getByTestId('group'));
	});

	it('renders every child button', () => {
		render(
			<ButtonGroup variant="solid" color="primary">
				<Button size="md" variant="solid" color="primary">
					A
				</Button>
				<Button size="md" variant="solid" color="primary">
					B
				</Button>
			</ButtonGroup>,
		);

		expect(screen.getAllByRole('button')).toHaveLength(2);
	});

	it('exposes size, variant and color on the group element', () => {
		render(
			<ButtonGroup size="sm" variant="outlined" color="secondary" testId="group">
				<Button size="md" variant="solid" color="primary">
					A
				</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId('group');
		expect(group).toHaveAttribute('data-size', 'sm');
		expect(group).toHaveAttribute('data-variant', 'outlined');
		expect(group).toHaveAttribute('data-color', 'secondary');
	});

	it('keeps the component class next to a custom className', () => {
		render(
			<ButtonGroup variant="solid" color="primary" className="custom-class" testId="group">
				<Button size="md" variant="solid" color="primary">
					A
				</Button>
			</ButtonGroup>,
		);

		const group = screen.getByTestId('group');
		expect(group).toHaveClass('custom-class');
		expect(group.className.split(' ').length).toBeGreaterThan(1);
	});

	it('forwards arbitrary div attributes', () => {
		render(
			<ButtonGroup variant="solid" color="primary" aria-label="Time range" id="ranges">
				<Button size="md" variant="solid" color="primary">
					A
				</Button>
			</ButtonGroup>,
		);

		const group = screen.getByRole('group', { name: 'Time range' });
		expect(group).toHaveAttribute('id', 'ranges');
	});

	it('forwards ref to the group element', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<ButtonGroup variant="solid" color="primary" ref={ref}>
				<Button size="md" variant="solid" color="primary">
					A
				</Button>
			</ButtonGroup>,
		);

		expect(ref.current).toBe(screen.getByRole('group'));
	});
});

describe('ButtonGroup child styling', () => {
	it('styles the cluster only, children keep their own tokens', () => {
		render(
			<ButtonGroup size="sm" variant="outlined" color="secondary">
				<Button size="md" variant="solid" color="primary" testId="a">
					A
				</Button>
				<Button size="sm" variant="solid" color="danger" testId="b">
					B
				</Button>
			</ButtonGroup>,
		);

		const a = screen.getByTestId('a');
		expect(a).toHaveAttribute('data-size', 'md');
		expect(a).toHaveAttribute('data-variant', 'solid');
		expect(a).toHaveAttribute('data-color', 'primary');

		const b = screen.getByTestId('b');
		expect(b).toHaveAttribute('data-size', 'sm');
		expect(b).toHaveAttribute('data-color', 'danger');
	});
});
