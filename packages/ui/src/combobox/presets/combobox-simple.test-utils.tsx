import { type RenderResult, render } from '@testing-library/react';
import { beforeAll } from 'vitest';
import { TooltipProvider } from '../../tooltip/index.js';

export function setupVirtualMocks(): void {
	beforeAll(() => {
		Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
			configurable: true,
			get() {
				const slot = this.getAttribute?.('data-slot');
				if (slot === 'combobox-virtual-scroll') return 300;
				if (slot === 'combobox-virtual-list') return 3200;
				return 32;
			},
		});
		Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
			configurable: true,
			get() {
				return 200;
			},
		});
	});
}

export function renderWithProviders(ui: React.ReactElement): RenderResult {
	return render(<TooltipProvider>{ui}</TooltipProvider>);
}

export const defaultItems = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];
