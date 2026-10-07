import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cdp } from 'vitest/browser';
import { RadioCards } from '../radio-cards.js';
import type { RadioCardsItemType } from '../types.js';
import { installTokens, ITEMS } from './radio-cards.test-utils.js';

installTokens();

afterEach(() => {
	vi.restoreAllMocks();
});

const LONG_LABEL = 'Grafana, Prometheus and every exporter that feeds them';

function rects(): DOMRect[] {
	return screen.getAllByRole('radio').map((card) => card.getBoundingClientRect());
}

function renderIn(width: number, element: JSX.Element): void {
	render(<div style={{ width }}>{element}</div>);
}

function checkOf(name: string): { slot: DOMRect; label: DOMRect; opacity: string } {
	const card = screen.getByRole('radio', { name });
	const slot = card.querySelector('[data-slot="radio-cards-item-indicator"]') as HTMLElement;
	return {
		slot: slot.getBoundingClientRect(),
		label: (
			card.querySelector('[data-slot="radio-cards-item-label"]') as HTMLElement
		).getBoundingClientRect(),
		opacity: getComputedStyle(slot.querySelector('svg') as SVGElement).opacity,
	};
}

describe('RadioCards layout', () => {
	it('draws a 32px card for one line of label', () => {
		renderIn(600, <RadioCards aria-label="Signal" items={ITEMS} columns={3} />);

		for (const rect of rects()) {
			expect(rect.height).toBe(32);
		}
	});

	it('shares a row equally between columns cards, and wraps the rest', () => {
		renderIn(600, <RadioCards aria-label="Signal" items={ITEMS} columns={2} />);
		const [logs, traces, metrics] = rects();

		expect(logs.width).toBe(294);
		expect(traces.width).toBe(294);
		expect(traces.top).toBe(logs.top);
		expect(traces.left - logs.right).toBe(12);
		expect(metrics.top - logs.bottom).toBe(12);
		expect(metrics.left).toBe(logs.left);
	});

	it('puts every card in one row when columns is the number of items', () => {
		renderIn(564, <RadioCards aria-label="Signal" items={ITEMS} columns={3} />);
		const [logs, traces, metrics] = rects();

		expect(logs.width).toBe(180);
		expect(metrics.top).toBe(logs.top);
		expect(traces.top).toBe(logs.top);
	});

	it('holds fewer cards than columns when a card would go under 160px', () => {
		renderIn(300, <RadioCards aria-label="Signal" items={ITEMS} columns={2} />);
		const [logs, traces] = rects();

		expect(logs.width).toBe(300);
		expect(traces.top - logs.bottom).toBe(12);
	});

	it('holds as many cards as fit at 160px without columns', () => {
		renderIn(
			600,
			<RadioCards
				aria-label="Signal"
				items={[...ITEMS, { label: 'Profiles', value: 'profiles' }]}
			/>,
		);
		const [logs, traces, metrics, profiles] = rects();

		expect(logs.width).toBe(192);
		expect(metrics.top).toBe(logs.top);
		expect(traces.top).toBe(logs.top);
		expect(profiles.top).toBeGreaterThan(logs.bottom);
	});

	it('fills a parent that sizes to its content', () => {
		render(
			<div
				style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 600 }}
			>
				<RadioCards aria-label="Signal" items={ITEMS} columns={3} />
			</div>,
		);
		const [logs, traces, metrics] = rects();

		expect(logs.width).toBe(192);
		expect(metrics.top).toBe(logs.top);
		expect(traces.top).toBe(logs.top);
	});

	it.each([0, -2, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
		'lays out columns={%s} as if it was not passed',
		(columns) => {
			vi.spyOn(console, 'warn').mockImplementation(() => {});
			renderIn(
				600,
				<RadioCards
					aria-label="Signal"
					items={[...ITEMS, { label: 'Profiles', value: 'profiles' }]}
					columns={columns}
				/>,
			);
			const [logs, traces, metrics, profiles] = rects();

			expect(logs.width).toBe(192);
			expect(metrics.top).toBe(logs.top);
			expect(traces.top).toBe(logs.top);
			expect(profiles.top).toBeGreaterThan(logs.bottom);
		},
	);

	it('stacks the cards with columns={1}', () => {
		renderIn(600, <RadioCards aria-label="Signal" items={ITEMS} columns={1} />);
		const [logs, traces] = rects();

		expect(logs.width).toBe(600);
		expect(traces.top - logs.bottom).toBe(12);
	});

	it('shrinks a card to a parent narrower than 160px instead of painting outside it', () => {
		renderIn(120, <RadioCards aria-label="Signal" items={ITEMS} columns={2} />);

		expect(rects()[0].width).toBe(120);
	});

	it('keeps the icon and the check at 12px while the label truncates', () => {
		renderIn(
			200,
			<RadioCards
				aria-label="Tool"
				defaultValue="grafana"
				items={[{ label: LONG_LABEL, value: 'grafana', prefix: <svg data-testid="prefix-icon" /> }]}
			/>,
		);

		const check = document.querySelector('[data-slot="radio-cards-item-indicator"] svg');
		for (const icon of [screen.getByTestId('prefix-icon'), check]) {
			const rect = icon?.getBoundingClientRect();
			expect(rect?.width).toBe(12);
			expect(rect?.height).toBe(12);
		}
		expect(screen.getByText(LONG_LABEL).getBoundingClientRect().height).toBe(20);
		expect(rects()[0].width).toBe(200);
	});
});

async function emulateReducedMotion(reduce: boolean): Promise<void> {
	await cdp().send('Emulation.setEmulatedMedia', {
		features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }],
	});
}

describe('RadioCards check', () => {
	afterEach(async () => {
		await emulateReducedMotion(false);
	});

	it('opens the slot of the checked card only, and gives the label the room of a closed one', () => {
		renderIn(400, <RadioCards aria-label="Signal" items={ITEMS} columns={2} defaultValue="logs" />);
		const logs = checkOf('Logs');
		const traces = checkOf('Traces');
		const [logsCard, tracesCard] = rects();

		// 12px from the outer edge to the content: 11px of padding and the 1px border.
		expect(logs.slot.width).toBe(12);
		expect(logs.slot.right).toBe(logsCard.right - 12);
		expect(logs.slot.left - logs.label.right).toBe(8);
		expect(logs.opacity).toBe('1');

		expect(traces.slot.width).toBe(0);
		expect(traces.label.right).toBe(tracesCard.right - 12);
		expect(traces.opacity).toBe('0');
	});

	it('opens the slot on the new card and closes it on the old one', async () => {
		const user = userEvent.setup();
		renderIn(400, <RadioCards aria-label="Signal" items={ITEMS} columns={2} defaultValue="logs" />);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		await waitFor(() => {
			expect(checkOf('Traces').slot.width).toBe(12);
			expect(checkOf('Traces').opacity).toBe('1');
			expect(checkOf('Logs').slot.width).toBe(0);
			expect(checkOf('Logs').opacity).toBe('0');
		});
	});

	it('opens the slot before the check arrives, and closes it after the check leaves', async () => {
		const user = userEvent.setup();
		renderIn(400, <RadioCards aria-label="Signal" items={ITEMS} columns={2} defaultValue="logs" />);
		const slotOf = (name: string): Element =>
			screen
				.getByRole('radio', { name })
				.querySelector('[data-slot="radio-cards-item-indicator"]') as Element;

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		const timings = (element: Element): Record<string, [number, number]> =>
			Object.fromEntries(
				element.getAnimations().map((animation) => {
					const { delay = 0, duration } = animation.effect?.getTiming() ?? {};
					return [(animation as CSSTransition).transitionProperty, [delay, Number(duration)]];
				}),
			);

		// The new slot starts at once, and its check waits for it to finish opening.
		expect(timings(slotOf('Traces'))).toEqual({ width: [0, 120], 'margin-left': [0, 120] });
		expect(timings(slotOf('Traces').querySelector('svg') as Element)).toEqual({
			opacity: [120, 120],
			transform: [120, 120],
		});
		// The old check leaves at once, and its slot waits for it before closing.
		expect(timings(slotOf('Logs'))).toEqual({ width: [120, 120], 'margin-left': [120, 120] });
		expect(timings(slotOf('Logs').querySelector('svg') as Element)).toEqual({
			opacity: [0, 120],
			transform: [0, 120],
		});
	});

	it('moves the check at once under prefers-reduced-motion', async () => {
		await emulateReducedMotion(true);
		const user = userEvent.setup();
		renderIn(400, <RadioCards aria-label="Signal" items={ITEMS} columns={2} defaultValue="logs" />);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(checkOf('Traces').slot.width).toBe(12);
		expect(checkOf('Traces').opacity).toBe('1');
		expect(checkOf('Logs').slot.width).toBe(0);
		expect(checkOf('Logs').opacity).toBe('0');
	});
});

describe('RadioCards layout with textOverflow="wrap"', () => {
	const WRAP_ITEMS: RadioCardsItemType[] = [
		{ label: LONG_LABEL, value: 'grafana', prefix: <svg data-testid="prefix-icon" /> },
		{ label: 'Datadog', value: 'datadog' },
	];

	it('gives the cards of a row the height of the tallest one', () => {
		renderIn(
			400,
			<RadioCards aria-label="Tool" items={WRAP_ITEMS} columns={2} textOverflow="wrap" />,
		);
		const [grafana, datadog] = rects();

		expect(grafana.height).toBeGreaterThan(32);
		expect(datadog.height).toBe(grafana.height);
	});

	it('keeps the icon and the check on the first line of the label', () => {
		renderIn(
			400,
			<RadioCards
				aria-label="Tool"
				items={WRAP_ITEMS}
				columns={2}
				textOverflow="wrap"
				defaultValue="grafana"
			/>,
		);
		const card = rects()[0];
		const check = document.querySelector('[data-slot="radio-cards-item-indicator"] svg');

		// 6px from the outer edge to the line, then the 12px icon centred on the 20px line.
		for (const icon of [screen.getByTestId('prefix-icon'), check]) {
			expect((icon?.getBoundingClientRect().top ?? 0) - card.top).toBe(6 + 4);
		}
	});

	it('breaks a word longer than the card instead of painting outside it', () => {
		const word = 'ObservabilityPlatformWithAVeryLongName';
		renderIn(
			200,
			<RadioCards aria-label="Tool" items={[{ label: word, value: 'long' }]} textOverflow="wrap" />,
		);
		const label = screen.getByText(word);

		expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
	});
});
