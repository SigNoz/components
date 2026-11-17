import { render, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCoverRightEdge, useRightEdgeCover } from './right-edge-cover.js';

function Cover({ width }: { width: number | undefined }): null {
	useCoverRightEdge(width);
	return null;
}

describe('right edge cover', () => {
	it('is 0 while nothing covers the right edge', () => {
		const { result } = renderHook(() => useRightEdgeCover());

		expect(result.current).toBe(0);
	});

	it('follows the widest cover, and drops each one as it ends', () => {
		const { result } = renderHook(() => useRightEdgeCover());
		const wide = render(<Cover width={500} />);
		const narrow = render(<Cover width={300} />);

		expect(result.current).toBe(500);

		wide.rerender(<Cover width={undefined} />);
		expect(result.current).toBe(300);

		narrow.unmount();
		expect(result.current).toBe(0);
		wide.unmount();
	});

	it('follows a cover that changes width', () => {
		const { result } = renderHook(() => useRightEdgeCover());
		const cover = render(<Cover width={400} />);

		cover.rerender(<Cover width={600} />);
		expect(result.current).toBe(600);

		cover.unmount();
		expect(result.current).toBe(0);
	});
});
