import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './index.js';

describe('Resizable forwardRef', () => {
	it('ResizablePanelGroup forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<ResizablePanelGroup ref={ref} orientation="horizontal">
				<ResizablePanel>Panel 1</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>Panel 2</ResizablePanel>
			</ResizablePanelGroup>,
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
