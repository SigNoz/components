import { render, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useIsModalLayerOpen, useReportModalLayer } from './modal-layer.js';

function Layer({ isOpen }: { isOpen: boolean }): null {
	useReportModalLayer(isOpen);
	return null;
}

describe('modal layer', () => {
	it('is false while no layer reports', () => {
		const { result } = renderHook(() => useIsModalLayerOpen());

		expect(result.current).toBe(false);
	});

	it('is true while a layer reports open, and false once it stops', () => {
		const { result } = renderHook(() => useIsModalLayerOpen());
		const layer = render(<Layer isOpen={false} />);
		expect(result.current).toBe(false);

		layer.rerender(<Layer isOpen />);
		expect(result.current).toBe(true);

		layer.rerender(<Layer isOpen={false} />);
		expect(result.current).toBe(false);
	});

	it('stays true until every open layer is gone', () => {
		const { result } = renderHook(() => useIsModalLayerOpen());
		const first = render(<Layer isOpen />);
		const second = render(<Layer isOpen />);

		first.unmount();
		expect(result.current).toBe(true);

		second.rerender(<Layer isOpen={false} />);
		expect(result.current).toBe(false);
		second.unmount();
	});

	it('drops a layer that unmounts while open', () => {
		const { result } = renderHook(() => useIsModalLayerOpen());
		const layer = render(<Layer isOpen />);
		expect(result.current).toBe(true);

		layer.unmount();

		expect(result.current).toBe(false);
	});
});
