// Helper function to generate a range of numbers
const range = (start: number, end: number): number[] => {
	const length = end - start + 1;
	return Array.from({ length }, (_, i) => start + i);
};

/**
 * Calculates the sequence of page numbers and ellipses to display.
 * @param totalPages - The total number of pages.
 * @param current - The currently active page number.
 * @param siblingCount - The number of page links to show on each side of the current page (default: 1).
 * @returns An array containing page numbers and 'ellipsis' strings.
 */
export const renderPageNumbers = (
	totalPages: number,
	current: number,
	siblingCount = 1,
): (number | 'ellipsis')[] => {
	// Total visible page numbers/ellipses between prev/next arrows
	// Includes: first page, last page, current page, siblings on each side, potentially 2 ellipses
	const totalPageNumbers = 2 * siblingCount + 5; // e.g., 1 ... 4 5 6 ... 10 (7 items for siblingCount=1)

	// Case 1: Total pages are less than or equal to the desired visible count, show all pages.
	if (totalPages <= totalPageNumbers) {
		return range(1, totalPages);
	}

	const leftSiblingIndex = Math.max(current - siblingCount, 1);
	const rightSiblingIndex = Math.min(current + siblingCount, totalPages);

	// Determine if ellipses are needed based on sibling positions relative to boundaries
	const shouldShowLeftDots = leftSiblingIndex > 2;
	const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

	const firstPageIndex = 1;
	const lastPageIndex = totalPages;

	// Case 2: Near the start - No left dots, show right dots
	// e.g., 1 2 3 ... 10 (when current is 1, 2, or 3 and siblingCount=1)
	if (!shouldShowLeftDots && shouldShowRightDots) {
		// Show first 3 pages as per design requirement
		const leftRange = range(1, 3);
		return [...leftRange, 'ellipsis', lastPageIndex];
	}

	// Case 3: Near the end - Show left dots, no right dots
	// e.g., 1 ... 8 9 10 (when current is totalPages, totalPages-1, or totalPages-2 and siblingCount=1)
	if (shouldShowLeftDots && !shouldShowRightDots) {
		// Show last 3 pages as per design requirement
		const rightRange = range(totalPages - 2, totalPages);
		return [firstPageIndex, 'ellipsis', ...rightRange];
	}

	// Case 4: In the middle - Show both left and right dots
	// e.g., 1 ... 4 5 6 ... 10 (when current is 4, 5, 6, 7 and siblingCount=1)
	if (shouldShowLeftDots && shouldShowRightDots) {
		const middleRange = range(leftSiblingIndex, rightSiblingIndex);
		return [
			firstPageIndex,
			'ellipsis',
			...middleRange,
			'ellipsis',
			lastPageIndex,
		];
	}

	// Fallback (should not be reached with the above logic if totalPages > totalPageNumbers)
	return range(1, totalPages);
};
