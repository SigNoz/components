import { render } from '@testing-library/react';
import { createRef } from 'react';
import { beforeAll, describe, expect, it } from 'vitest';

import {
	Popover,
	PopoverAnchor,
	PopoverArrow,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from './index.js';

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

describe('Popover forwardRef', () => {
	it('PopoverTrigger forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Popover>
				<PopoverTrigger ref={ref}>Open</PopoverTrigger>
			</Popover>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('PopoverAnchor forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Popover>
				<PopoverAnchor ref={ref} asChild>
					<div>Anchor</div>
				</PopoverAnchor>
			</Popover>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('PopoverContent forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Popover open>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent ref={ref}>Content</PopoverContent>
			</Popover>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('PopoverClose forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Popover open>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>
					<PopoverClose ref={ref}>Close</PopoverClose>
				</PopoverContent>
			</Popover>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('PopoverArrow forwards ref', () => {
		const ref = createRef<SVGSVGElement>();
		render(
			<Popover open>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>
					<PopoverArrow ref={ref} />
					Content
				</PopoverContent>
			</Popover>
		);
		expect(ref.current).toBeInstanceOf(SVGSVGElement);
	});
});
