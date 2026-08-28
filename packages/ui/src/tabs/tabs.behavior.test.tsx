import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { activate } from '../__tests__/interactions.js';
import { Tabs, TabsContent, TabsList, TabsRoot, TabsTrigger } from './index.js';

const items = [
	{ key: 'logs', label: 'Logs', children: 'Logs panel' },
	{ key: 'traces', label: 'Traces', children: 'Traces panel' },
	{ key: 'metrics', label: 'Metrics', children: 'Metrics panel', disabled: true },
];

/**
 * Assertions target the tab/tabpanel ARIA contract, selection semantics and
 * callback payloads rather than the primitive's own state attributes, so they
 * remain meaningful if the primitive underneath is replaced.
 */
describe('Tabs items API', () => {
	it('renders one tab per item and exposes them as a tablist', () => {
		render(<Tabs items={items} />);

		expect(screen.getByRole('tablist')).toBeInTheDocument();
		expect(screen.getAllByRole('tab')).toHaveLength(3);
		expect(screen.getByRole('tab', { name: 'Logs' })).toBeInTheDocument();
	});

	it('selects the first item when no default is given', () => {
		render(<Tabs items={items} />);

		expect(screen.getByRole('tab', { name: 'Logs' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Logs panel');
	});

	it('honours defaultValue', () => {
		render(<Tabs items={items} defaultValue="traces" />);

		expect(screen.getByRole('tab', { name: 'Traces' })).toHaveAttribute('aria-selected', 'true');
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Traces panel');
	});

	it('switches panel and reports the key on selection', () => {
		const onChange = vi.fn();
		render(<Tabs items={items} onChange={onChange} />);

		activate(screen.getByRole('tab', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith('traces');
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Traces panel');
		expect(screen.getByRole('tab', { name: 'Logs' })).toHaveAttribute('aria-selected', 'false');
	});

	it('renders only the active panel by default', () => {
		render(<Tabs items={items} />);

		expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
		expect(screen.queryByText('Traces panel')).not.toBeInTheDocument();
	});

	it('does not select a disabled item', () => {
		const onChange = vi.fn();
		render(<Tabs items={items} onChange={onChange} />);
		const disabled = screen.getByRole('tab', { name: 'Metrics' });

		// Base UI's Tab is a real <button> but conveys the state with
		// aria-disabled rather than the native attribute, so it stays focusable
		// for screen-reader users while remaining unselectable.
		expect(disabled).toHaveAttribute('aria-disabled', 'true');
		activate(disabled);

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Logs panel');
	});

	it('renders tab bar slot content alongside the tabs', () => {
		render(
			<Tabs
				items={items}
				tabBarLeftContent={<span>left slot</span>}
				tabBarRightContent={<span>right slot</span>}
			/>,
		);

		expect(screen.getByText('left slot')).toBeInTheDocument();
		expect(screen.getByText('right slot')).toBeInTheDocument();
	});

	it('renders prefix and suffix icons inside the tab', () => {
		render(
			<Tabs
				items={[
					{
						key: 'logs',
						label: 'Logs',
						children: 'Logs panel',
						prefixIcon: <span>before</span>,
						suffixIcon: <span>after</span>,
					},
				]}
			/>,
		);

		const tab = screen.getByRole('tab', { name: /Logs/ });
		expect(tab).toContainElement(screen.getByText('before'));
		expect(tab).toContainElement(screen.getByText('after'));
	});

	it('puts testId on the root', () => {
		render(<Tabs items={items} testId="signal-tabs" />);
		expect(screen.getByTestId('signal-tabs')).toContainElement(screen.getByRole('tablist'));
	});
});

describe('Tabs controlled selection', () => {
	it('stays on the value prop when the parent ignores onChange', () => {
		const onChange = vi.fn();
		render(<Tabs items={items} value="logs" onChange={onChange} />);

		activate(screen.getByRole('tab', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith('traces');
		expect(screen.getByRole('tab', { name: 'Logs' })).toHaveAttribute('aria-selected', 'true');
	});

	it('follows the value prop when the parent commits', () => {
		function Controlled() {
			const [value, setValue] = useState('logs');
			return <Tabs items={items} value={value} onChange={setValue} />;
		}
		render(<Controlled />);

		activate(screen.getByRole('tab', { name: 'Traces' }));

		expect(screen.getByRole('tab', { name: 'Traces' })).toHaveAttribute('aria-selected', 'true');
	});
});

describe('Tabs roving focus', () => {
	// Arrow-key navigation is deliberately NOT asserted here. The primitive's
	// roving-focus group filters focus candidates by rendered size, and jsdom
	// reports every element as zero-sized, so no arrow key ever finds a
	// candidate. Verified against keydown on the tab, on the tablist, and
	// after a real activation sequence — none move selection. Keyboard
	// navigation belongs in the browser-mode runner (`pnpm test-storybook`),
	// not here; a jsdom test would only ever assert "nothing happened".
	it('makes the selected tab the single tab stop', () => {
		render(<Tabs items={items} />);
		activate(screen.getByRole('tab', { name: 'Logs' }));

		expect(screen.getByRole('tab', { name: 'Logs' })).toHaveAttribute('tabindex', '0');
		expect(screen.getByRole('tab', { name: 'Traces' })).toHaveAttribute('tabindex', '-1');
	});

	it('exposes orientation on the tablist', () => {
		render(<Tabs items={items} orientation="vertical" />);
		expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
	});
});

describe('Tabs composition API', () => {
	const composed = (extra?: { forceMount?: true }) => (
		<TabsRoot defaultValue="logs">
			<TabsList>
				<TabsTrigger value="logs">Logs</TabsTrigger>
				<TabsTrigger value="traces">Traces</TabsTrigger>
			</TabsList>
			<TabsContent value="logs">Logs panel</TabsContent>
			<TabsContent value="traces" {...extra}>
				Traces panel
			</TabsContent>
		</TabsRoot>
	);

	it('wires triggers to panels by value', () => {
		render(composed());

		expect(screen.getByRole('tabpanel')).toHaveTextContent('Logs panel');
		activate(screen.getByRole('tab', { name: 'Traces' }));
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Traces panel');
	});

	it('reports selection through onValueChange on the root', () => {
		const onValueChange = vi.fn();
		render(
			<TabsRoot defaultValue="logs" onValueChange={onValueChange}>
				<TabsList>
					<TabsTrigger value="logs">Logs</TabsTrigger>
					<TabsTrigger value="traces">Traces</TabsTrigger>
				</TabsList>
				<TabsContent value="logs">Logs panel</TabsContent>
				<TabsContent value="traces">Traces panel</TabsContent>
			</TabsRoot>,
		);

		activate(screen.getByRole('tab', { name: 'Traces' }));

		expect(onValueChange).toHaveBeenCalledWith('traces');
	});

	it('keeps an inactive panel mounted but hidden when forceMount is set', () => {
		render(composed({ forceMount: true }));

		const inactive = screen.getByText('Traces panel');
		expect(inactive).toBeInTheDocument();
		// Kept in the DOM yet properly hidden from layout and the a11y tree,
		// which is why only the active panel answers a `tabpanel` role query.
		expect(inactive).toHaveAttribute('hidden');
		expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Logs panel');
	});

	it('unmounts the inactive panel without forceMount', () => {
		render(composed());

		expect(screen.queryByText('Traces panel')).not.toBeInTheDocument();
	});
});
