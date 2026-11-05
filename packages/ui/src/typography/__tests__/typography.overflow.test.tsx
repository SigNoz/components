import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
	mockLabelMeasurement,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';
import { Typography } from '../typography.js';

const LONG = 'checkout-service-production-east-us-2-deployment';

let heights = { scroll: 0, client: 0 };
const scrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
const clientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');

beforeAll(() => {
	mockLabelMeasurement('typography');
	Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
		configurable: true,
		get: () => heights.scroll,
	});
	Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
		configurable: true,
		get: () => heights.client,
	});
});

afterEach(() => {
	resetLabelMeasurement();
	vi.restoreAllMocks();
	heights = { scroll: 0, client: 0 };
});

afterAll(() => {
	if (scrollHeight) {
		Object.defineProperty(HTMLElement.prototype, 'scrollHeight', scrollHeight);
	}
	if (clientHeight) {
		Object.defineProperty(HTMLElement.prototype, 'clientHeight', clientHeight);
	}
});

describe('Typography textOverflow', () => {
	it.each(['visible', 'hidden', 'wrap'] as const)(
		'has no line count with textOverflow="%s"',
		(textOverflow) => {
			render(
				<Typography
					variant="label"
					size="base"
					weight="regular"
					color="main"
					as="p"
					textOverflow={textOverflow}
					testId="text"
				>
					{LONG}
				</Typography>,
			);

			const text = screen.getByTestId('text');
			expect(text).toHaveAttribute('data-text-overflow', textOverflow);
			expect(text).not.toHaveAttribute('data-max-lines');
		},
	);

	it('cuts after one line by default', () => {
		render(
			<Typography
				variant="label"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="ellipsis"
				testId="text"
			>
				{LONG}
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(text).toHaveAttribute('data-max-lines', '1');
		expect(text.style.getPropertyValue('--typography-internal-max-lines')).toBe('1');
	});

	it('cuts after maxLines lines', () => {
		render(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="ellipsis"
				maxLines={3}
				testId="text"
			>
				{LONG}
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(text).toHaveAttribute('data-max-lines', '3');
		expect(text.style.getPropertyValue('--typography-internal-max-lines')).toBe('3');
	});

	it.each([
		[2.5, '2'],
		[0, '1'],
		[Number.NaN, '1'],
	])('rounds maxLines=%s down to a whole line count of at least 1', (maxLines, expected) => {
		render(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="ellipsis"
				maxLines={maxLines}
				testId="text"
			>
				{LONG}
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(text).toHaveAttribute('data-max-lines', expected);
		expect(text.style.getPropertyValue('--typography-internal-max-lines')).toBe(expected);
	});

	it.each(['label', 'uppercase', 'code'] as const)(
		'shows one line on %s text, whatever maxLines says',
		(variant) => {
			const loose = { maxLines: 3 } as { maxLines?: 1 };

			render(
				<Typography
					variant={variant}
					size="base"
					weight="regular"
					color="main"
					as="p"
					textOverflow="ellipsis"
					{...loose}
					testId="text"
				>
					{LONG}
				</Typography>,
			);

			const text = screen.getByTestId('text');
			expect(text).toHaveAttribute('data-max-lines', '1');
			expect(text.style.getPropertyValue('--typography-internal-max-lines')).toBe('1');
		},
	);
});

describe('Typography truncation', () => {
	it('flags a text that does not fit and shows the full text on hover', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Typography
				variant="label"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="ellipsis"
				testId="text"
			>
				{LONG}
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(text).toHaveAttribute('data-truncated');

		await user.hover(text);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG);
	});

	it('opens no tooltip for a text that fits', async () => {
		const user = userEvent.setup();
		render(
			<Typography
				variant="label"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="ellipsis"
				testId="text"
			>
				Short
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(text).not.toHaveAttribute('data-truncated');

		await user.hover(text);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('neither measures nor opens a tooltip with textOverflow="hidden"', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Typography
				variant="label"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="hidden"
				testId="text"
			>
				{LONG}
			</Typography>,
		);

		const text = screen.getByTestId('text');
		expect(text).not.toHaveAttribute('data-truncated');

		await user.hover(text);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('picks the flag up when the text is resized down', () => {
		render(
			<Typography
				variant="label"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="ellipsis"
				testId="text"
			>
				{LONG}
			</Typography>,
		);

		expect(screen.getByTestId('text')).not.toHaveAttribute('data-truncated');

		resize(300, 100);

		expect(screen.getByTestId('text')).toHaveAttribute('data-truncated');
	});

	it('measures the height past one line', () => {
		heights = { scroll: 60, client: 40 };
		render(
			<Typography
				variant="paragraph"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="ellipsis"
				maxLines={2}
				testId="text"
			>
				{LONG}
			</Typography>,
		);

		expect(screen.getByTestId('text')).toHaveAttribute('data-truncated');
	});

	it('ignores the height of a one line text, which an icon taller than the line can raise', () => {
		heights = { scroll: 16, client: 13 };
		render(
			<Typography
				variant="label"
				size="base"
				weight="regular"
				color="main"
				as="p"
				textOverflow="ellipsis"
				testId="text"
			>
				{LONG}
			</Typography>,
		);

		expect(screen.getByTestId('text')).not.toHaveAttribute('data-truncated');
	});
});

describe('Typography flex truncation', () => {
	beforeAll(() => mockLabelMeasurement('typography-text'));
	afterAll(() => mockLabelMeasurement('typography'));

	it('measures the run of text, so the icon is never what is cut', () => {
		truncate();
		render(
			<Typography
				variant="label"
				size="base"
				weight="regular"
				color="main"
				as="div"
				display="flex"
				textOverflow="ellipsis"
				testId="text"
			>
				<svg />
				{LONG}
			</Typography>,
		);

		expect(screen.getByTestId('text')).toHaveAttribute('data-truncated');
	});

	it('measures a run of text inside a fragment', () => {
		truncate();
		render(
			<Typography
				variant="label"
				size="base"
				weight="regular"
				color="main"
				as="div"
				display="flex"
				textOverflow="ellipsis"
				testId="text"
			>
				<svg />
				<>{LONG}</>
			</Typography>,
		);

		expect(screen.getByTestId('text')).toHaveAttribute('data-truncated');
	});
});

describe('Typography.Link truncation', () => {
	beforeAll(() => mockLabelMeasurement('typography-link'));
	afterAll(() => mockLabelMeasurement('typography'));

	it('measures a link with no destination, so its ellipsis is still flagged', () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		truncate();
		render(
			<Typography.Link
				variant="label"
				size="base"
				weight="medium"
				display="block"
				textOverflow="ellipsis"
				testId="link"
			>
				{LONG}
			</Typography.Link>,
		);

		expect(screen.getByTestId('link')).toHaveAttribute('data-truncated');
	});
});
