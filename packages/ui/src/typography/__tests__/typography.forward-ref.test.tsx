import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Typography } from '../index.js';

describe('Typography forwardRef', () => {
	it('forwards the ref to the element of as', () => {
		const ref = createRef<HTMLElement>();
		render(
			<Typography
				ref={ref}
				variant="label"
				size="large"
				weight="bold"
				color="main"
				as="h2"
				textOverflow="visible"
			>
				Title
			</Typography>,
		);

		expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
		expect(ref.current).toHaveAttribute('data-slot', 'typography');
	});

	it('forwards the ref through the tooltip of an ellipsis', () => {
		const ref = createRef<HTMLElement>();
		render(
			<Typography
				ref={ref}
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="ellipsis"
			>
				Text
			</Typography>,
		);

		expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
		expect(ref.current).toHaveAttribute('data-slot', 'typography');
	});

	it('forwards the ref of Typography.Link to the anchor', () => {
		const ref = createRef<HTMLElement>();
		render(
			<Typography.Link
				ref={ref}
				variant="label"
				size="base"
				weight="medium"
				textOverflow="visible"
				href="/docs"
			>
				docs
			</Typography.Link>,
		);

		expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
		expect(ref.current).toHaveAttribute('data-slot', 'typography-link');
	});
});
