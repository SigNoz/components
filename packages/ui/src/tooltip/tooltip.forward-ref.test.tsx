import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipSimple,
	TooltipTrigger,
} from './index.js';

describe('Tooltip forwardRef', () => {
	it('TooltipTrigger forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<TooltipProvider>
				<TooltipRoot>
					<TooltipTrigger ref={ref}>Trigger</TooltipTrigger>
				</TooltipRoot>
			</TooltipProvider>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('TooltipSimple forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<TooltipProvider>
				<TooltipSimple ref={ref} title="Tooltip">
					<button type="button">Trigger</button>
				</TooltipSimple>
			</TooltipProvider>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toHaveTextContent('Trigger');
	});

	it('TooltipContent forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<TooltipProvider>
				<TooltipRoot open>
					<TooltipTrigger>Trigger</TooltipTrigger>
					<TooltipContent ref={ref}>Content</TooltipContent>
				</TooltipRoot>
			</TooltipProvider>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
