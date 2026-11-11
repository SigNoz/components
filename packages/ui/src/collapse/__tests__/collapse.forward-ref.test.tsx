import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Collapse } from '../collapse.js';
import { GROUP_ITEMS } from './collapse.test-utils.js';

describe('Collapse forwardRef', () => {
	it('forwards the ref to the root', () => {
		const ref = createRef<HTMLDivElement>();

		render(
			<Collapse ref={ref} variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
				Body
			</Collapse>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('c'));
		expect(ref.current).toHaveAttribute('data-slot', 'collapse');
	});

	it('forwards the ref of a collapsed section too', () => {
		const ref = createRef<HTMLDivElement>();

		render(
			<Collapse ref={ref} variant="ghost" size="sm" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'collapse');
	});

	it('forwards a callback ref to the root', () => {
		let node: HTMLDivElement | null = null;

		render(
			<Collapse
				ref={(element: HTMLDivElement | null) => {
					node = element;
				}}
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				defaultExpanded
			>
				Body
			</Collapse>,
		);

		expect(node).toBe(screen.getByTestId('c'));
	});

	it('forwards the ref of Collapse.Group to the root of the group', () => {
		const ref = createRef<HTMLDivElement>();

		render(
			<Collapse.Group
				ref={ref}
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={[]}
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('g'));
		expect(ref.current).toHaveAttribute('data-slot', 'collapse-group');
	});

	it('forwards the ref of an empty Collapse.Group', () => {
		const ref = createRef<HTMLDivElement>();

		render(<Collapse.Group ref={ref} variant="outlined" size="sm" items={[]} defaultValue={[]} />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'collapse-group');
	});
});
