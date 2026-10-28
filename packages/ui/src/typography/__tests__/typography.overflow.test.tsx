import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
	mockLabelMeasurement,
	queryOpenTooltip,
	resetLabelMeasurement,
	resize,
	truncate,
} from '../../__tests__/test-utils.js';
import { Tooltip } from '../../tooltip/presets/tooltip.js';
import { TooltipProvider } from '../../tooltip/subcomponents/tooltip-provider.js';
import { Typography } from '../typography.js';

const LONG = 'checkout-service-production-east-us-2-deployment';
const OTHER = 'payment-service-production-west-eu-1-deployment';

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

function CutText({ children = LONG, testId = 'text' }: { children?: string; testId?: string }) {
	return (
		<Typography
			variant="label"
			size="base"
			weight="regular"
			color="main"
			as="p"
			textOverflow="ellipsis"
			testId={testId}
		>
			{children}
		</Typography>
	);
}

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe('Typography truncation tooltip', () => {
	it('carries no tooltip trigger until the pointer is over it', async () => {
		const user = userEvent.setup();
		truncate();
		render(<CutText />);

		const text = screen.getByTestId('text');
		expect(text).toHaveAttribute('data-truncated');
		expect(text).not.toHaveAttribute('data-base-ui-tooltip-trigger');

		await user.hover(text);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG);
	});

	it('opens from the mouse events alone, as fireEvent sends them', async () => {
		truncate();
		render(<CutText />);

		fireEvent.mouseEnter(screen.getByTestId('text'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG);
	});

	it('opens no tooltip on a tap', async () => {
		truncate();
		render(<CutText />);
		const text = screen.getByTestId('text');

		fireEvent.pointerDown(text, { pointerType: 'touch' });
		fireEvent.mouseEnter(text);
		fireEvent.mouseMove(text);
		await wait(400);

		expect(queryOpenTooltip()).not.toBeInTheDocument();
	});

	it('opens for a mouse that moves on the text after a tap', async () => {
		truncate();
		render(<CutText />);
		const text = screen.getByTestId('text');

		fireEvent.pointerDown(text, { pointerType: 'touch' });
		fireEvent.mouseEnter(text);
		fireEvent.pointerMove(text, { pointerType: 'mouse' });
		fireEvent.mouseMove(text);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG);
	});

	it('describes the text with the tooltip only while it is open', async () => {
		const user = userEvent.setup();
		truncate();
		render(<CutText />);
		const text = screen.getByTestId('text');

		expect(text).not.toHaveAttribute('aria-describedby');

		await user.hover(text);
		const tooltip = await screen.findByRole('tooltip');

		expect(text).toHaveAttribute('aria-describedby', tooltip.id);

		await user.unhover(text);

		await waitFor(() => expect(text).not.toHaveAttribute('aria-describedby'));
	});

	it('drops the tooltip and the description once the text is no longer cut', async () => {
		const user = userEvent.setup();
		truncate();
		render(<CutText />);
		const text = screen.getByTestId('text');

		await user.hover(text);
		await screen.findByRole('tooltip');
		resize(100, 100);

		expect(text).not.toHaveAttribute('data-truncated');
		expect(text).not.toHaveAttribute('aria-describedby');
		expect(queryOpenTooltip()).not.toBeInTheDocument();
	});

	it('closes when the pointer leaves the text', async () => {
		const user = userEvent.setup();
		truncate();
		render(<CutText />);
		const text = screen.getByTestId('text');

		await user.hover(text);
		await screen.findByRole('tooltip');
		await user.unhover(text);

		await waitFor(() => expect(queryOpenTooltip()).not.toBeInTheDocument());
	});

	it('stays open while the pointer is on the tooltip', async () => {
		const user = userEvent.setup();
		truncate();
		render(<CutText />);

		await user.hover(screen.getByTestId('text'));
		const tooltip = await screen.findByRole('tooltip');
		await user.hover(tooltip);
		await wait(300);

		expect(queryOpenTooltip()).toBeInTheDocument();

		await user.unhover(tooltip);

		await waitFor(() => expect(queryOpenTooltip()).not.toBeInTheDocument());
	});

	it('closes on a press and stays closed while the pointer stays', async () => {
		const user = userEvent.setup();
		truncate();
		render(<CutText />);
		const text = screen.getByTestId('text');

		await user.hover(text);
		await screen.findByRole('tooltip');
		await user.click(text);

		await waitFor(() => expect(queryOpenTooltip()).not.toBeInTheDocument());
		await wait(400);
		expect(queryOpenTooltip()).not.toBeInTheDocument();
	});

	it('closes on Escape and opens again once the pointer comes back', async () => {
		const user = userEvent.setup();
		truncate();
		render(<CutText />);
		const text = screen.getByTestId('text');

		await user.hover(text);
		await screen.findByRole('tooltip');
		await user.keyboard('{Escape}');

		await waitFor(() => expect(queryOpenTooltip()).not.toBeInTheDocument());

		await user.unhover(text);
		await user.hover(text);

		expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG);
	});

	it('adds the full text to the tooltip of a trigger around it', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<Tooltip title="Outer title">
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
				</Typography>
			</Tooltip>,
		);

		await user.hover(screen.getByTestId('text'));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent(`Outer title${LONG}`);
	});

	it('shows a tooltip nested in a text that fits as its own', async () => {
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
				Short{' '}
				<Tooltip title="Inner title">
					<span>info</span>
				</Tooltip>
			</Typography>,
		);

		await user.hover(screen.getByText('info'));

		const tooltips = await screen.findAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]).toHaveTextContent('Inner title');
	});
});

describe('Typography truncation tooltip delay', () => {
	it('opens the next cut text at once after one was open', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<TooltipProvider delay={600}>
				<CutText testId="first" />
				<CutText testId="second">{OTHER}</CutText>
			</TooltipProvider>,
		);

		await user.hover(screen.getByTestId('first'));
		await screen.findByRole('tooltip');
		await user.unhover(screen.getByTestId('first'));
		await user.hover(screen.getByTestId('second'));

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(OTHER), { timeout: 300 });
	});

	it('opens a cut text at once after another tooltip of the provider was open', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<TooltipProvider delay={600}>
				<Tooltip title="Button title">
					<button type="button">Hover</button>
				</Tooltip>
				<CutText />
			</TooltipProvider>,
		);

		await user.hover(screen.getByRole('button'));
		await screen.findByRole('tooltip');
		await user.unhover(screen.getByRole('button'));
		await user.hover(screen.getByTestId('text'));

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent(LONG), { timeout: 300 });
	});

	it('waits for the delay of its own provider after a cut text outside it closed', async () => {
		const user = userEvent.setup();
		truncate();
		render(
			<>
				<CutText testId="first" />
				<TooltipProvider delay={1000}>
					<CutText testId="second">{OTHER}</CutText>
				</TooltipProvider>
			</>,
		);

		await user.hover(screen.getByTestId('first'));
		await screen.findByRole('tooltip');
		await user.unhover(screen.getByTestId('first'));
		await waitFor(() => expect(queryOpenTooltip()).not.toBeInTheDocument());
		await user.hover(screen.getByTestId('second'));
		await wait(500);

		expect(queryOpenTooltip()).not.toBeInTheDocument();
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
