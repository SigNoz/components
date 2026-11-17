import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Collapse } from '../collapse.js';
import { GROUP_ITEMS, makeItems } from './collapse.test-utils.js';

const icon = <svg data-testid="icon" />;

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Collapse disclosure pattern', () => {
	it('is a native button inside a heading', () => {
		render(
			<Collapse variant="outlined" size="sm" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		const toggle = screen.getByRole('button', { name: 'Advanced' });

		expect(toggle.tagName).toBe('BUTTON');
		expect(toggle.closest('h3')).toBeInTheDocument();
	});

	it('reports collapsed and expanded through aria-expanded', () => {
		const { rerender } = render(
			<Collapse variant="outlined" size="sm" title="Advanced" expanded onExpandedChange={() => {}}>
				Body
			</Collapse>,
		);

		expect(screen.getByRole('button', { name: 'Advanced' })).toHaveAttribute(
			'aria-expanded',
			'true',
		);

		rerender(
			<Collapse
				variant="outlined"
				size="sm"
				title="Advanced"
				expanded={false}
				onExpandedChange={() => {}}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByRole('button', { name: 'Advanced' })).toHaveAttribute(
			'aria-expanded',
			'false',
		);
	});

	it('has no live region, so toggling does not read the content again', () => {
		const { container } = render(
			<Collapse variant="outlined" size="sm" title="Advanced" defaultExpanded>
				Body
			</Collapse>,
		);

		expect(screen.queryByRole('status')).not.toBeInTheDocument();
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		expect(container.querySelector('[aria-live]')).toBeNull();
	});
});

describe('Collapse aria-controls', () => {
	it('is absent while collapsed, since the panel is not in the DOM', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).not.toHaveAttribute('aria-controls');
	});

	it('points at the panel while open', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
				Body
			</Collapse>,
		);

		const panel = screen.getByTestId('c-panel');

		expect(panel.id).not.toBe('');
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-controls', panel.id);
	});

	it('points at the panel while collapsed too, with keepMounted', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				keepMounted
				defaultExpanded={false}
			>
				Body
			</Collapse>,
		);

		const panel = screen.getByTestId('c-panel');

		expect(panel.id).not.toBe('');
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-controls', panel.id);
	});

	it('points at the panel while open, with keepMounted', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				keepMounted
				defaultExpanded
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute(
			'aria-controls',
			screen.getByTestId('c-panel').id,
		);
	});

	it('gives two sections distinct panel ids', () => {
		render(
			<>
				<Collapse variant="outlined" size="sm" testId="a" title="A" defaultExpanded>
					a
				</Collapse>
				<Collapse variant="outlined" size="sm" testId="b" title="B" defaultExpanded>
					b
				</Collapse>
			</>,
		);

		expect(screen.getByTestId('a-panel').id).not.toBe(screen.getByTestId('b-panel').id);
		expect(screen.getByTestId('a-toggle')).toHaveAttribute(
			'aria-controls',
			screen.getByTestId('a-panel').id,
		);
		expect(screen.getByTestId('b-toggle')).toHaveAttribute(
			'aria-controls',
			screen.getByTestId('b-panel').id,
		);
	});
});

describe('Collapse name and description', () => {
	it('names the button by the title through aria-labelledby', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				description="More settings"
				prefix={icon}
				defaultExpanded={false}
			>
				Body
			</Collapse>,
		);

		const toggle = screen.getByTestId('c-toggle');

		expect(toggle).toHaveAttribute('aria-labelledby', screen.getByTestId('c-title').id);
		expect(screen.getByTestId('c-title').id).not.toBe('');
		expect(screen.getByRole('button', { name: 'Advanced' })).toBe(toggle);
	});

	it('keeps the description out of the name', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				title="Advanced"
				description="More settings"
				defaultExpanded={false}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByRole('button', { name: 'Advanced' })).toHaveAccessibleName('Advanced');
		expect(screen.queryByRole('button', { name: /More settings/ })).not.toBeInTheDocument();
	});

	it('describes the button by the description', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				description="More settings"
				defaultExpanded={false}
			>
				Body
			</Collapse>,
		);

		const toggle = screen.getByTestId('c-toggle');

		expect(toggle).toHaveAttribute('aria-describedby', screen.getByTestId('c-description').id);
		expect(toggle).toHaveAccessibleDescription('More settings');
	});

	it('has no aria-describedby without a description or a value of its own', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).not.toHaveAttribute('aria-describedby');
	});

	it('keeps the aria-describedby of the call site when there is no description', () => {
		render(
			<>
				<span id="hint">Needs a restart</span>
				<Collapse
					variant="outlined"
					size="sm"
					testId="c"
					title="Advanced"
					aria-describedby="hint"
					defaultExpanded={false}
				>
					Body
				</Collapse>
			</>,
		);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-describedby', 'hint');
		expect(screen.getByTestId('c-toggle')).toHaveAccessibleDescription('Needs a restart');
	});

	it('joins the description with the aria-describedby of the call site', () => {
		render(
			<>
				<span id="hint">Needs a restart</span>
				<Collapse
					variant="outlined"
					size="sm"
					testId="c"
					title="Advanced"
					description="More settings"
					aria-describedby="hint"
					defaultExpanded={false}
				>
					Body
				</Collapse>
			</>,
		);

		const toggle = screen.getByTestId('c-toggle');
		const descriptionId = screen.getByTestId('c-description').id;

		expect(toggle).toHaveAttribute('aria-describedby', `${descriptionId} hint`);
		expect(toggle).toHaveAccessibleDescription('More settings Needs a restart');
	});

	it('keeps the title as the name when the call site passes an aria-label', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				aria-label="Custom"
				defaultExpanded={false}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-label', 'Custom');
		expect(screen.getByTestId('c-toggle')).toHaveAttribute(
			'aria-labelledby',
			screen.getByTestId('c-title').id,
		);
	});

	it('hides the chevron and the prefix, so only the title names the button', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				prefix={<svg aria-label="gear" />}
				defaultExpanded={false}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-prefix')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByRole('button', { name: 'Advanced' })).toBeInTheDocument();
	});
});

describe('Collapse panel', () => {
	it('is a region named by the title', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
				Body
			</Collapse>,
		);

		const panel = screen.getByRole('region', { name: 'Advanced' });

		expect(panel).toBe(screen.getByTestId('c-panel'));
		expect(panel).toHaveAttribute('aria-labelledby', screen.getByTestId('c-title').id);
	});

	it('names two regions by their own titles', () => {
		render(
			<>
				<Collapse variant="outlined" size="sm" testId="a" title="First" defaultExpanded>
					a
				</Collapse>
				<Collapse variant="outlined" size="sm" testId="b" title="Second" defaultExpanded>
					b
				</Collapse>
			</>,
		);

		expect(screen.getByRole('region', { name: 'First' })).toBe(screen.getByTestId('a-panel'));
		expect(screen.getByRole('region', { name: 'Second' })).toBe(screen.getByTestId('b-panel'));
	});

	it('is named <No title> when the title is empty', () => {
		render(
			<Collapse variant="outlined" size="sm" title={null} defaultExpanded>
				Body
			</Collapse>,
		);

		expect(screen.getByRole('region', { name: '<No title>' })).toBeInTheDocument();
	});
});

describe('Collapse header suffix', () => {
	it('sits outside the heading, so its controls are not part of the section name', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				headerSuffix={<button type="button">Edit</button>}
				defaultExpanded={false}
			>
				Body
			</Collapse>,
		);

		expect(screen.getByRole('heading', { level: 3 })).not.toContainElement(
			screen.getByRole('button', { name: 'Edit' }),
		);
		expect(screen.getByRole('button', { name: 'Advanced' })).toBeInTheDocument();
	});
});

describe('Collapse.Group accordion pattern', () => {
	it('names each toggle by its title and describes it by its description', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				defaultValue={[]}
				items={[
					{ value: 'logs', title: 'Logs', description: 'Everything logged', children: 'a' },
					{ value: 'traces', title: 'Traces', children: 'b' },
				]}
			/>,
		);

		const logs = screen.getByRole('button', { name: 'Logs' });

		expect(logs).toHaveAttribute('aria-labelledby', screen.getByTestId('g-item-logs-title').id);
		expect(logs).toHaveAccessibleDescription('Everything logged');
		expect(screen.getByRole('button', { name: 'Traces' })).not.toHaveAttribute('aria-describedby');
	});

	it('reports each item through aria-expanded', () => {
		render(
			<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={['traces']} />,
		);

		expect(screen.getByRole('button', { name: 'Logs' })).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByRole('button', { name: 'Traces' })).toHaveAttribute('aria-expanded', 'true');
	});

	it('sets aria-controls only while an item is open, without keepMounted', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={['traces']}
			/>,
		);

		expect(screen.getByTestId('g-item-logs-toggle')).not.toHaveAttribute('aria-controls');
		expect(screen.getByTestId('g-item-traces-toggle')).toHaveAttribute(
			'aria-controls',
			screen.getByTestId('g-item-traces-panel').id,
		);
	});

	it('sets aria-controls on every item, with keepMounted', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				keepMounted
				items={GROUP_ITEMS}
				defaultValue={['traces']}
			/>,
		);

		for (const { value } of GROUP_ITEMS) {
			expect(screen.getByTestId(`g-item-${value}-toggle`)).toHaveAttribute(
				'aria-controls',
				screen.getByTestId(`g-item-${value}-panel`).id,
			);
		}
	});

	it('makes each open panel a region named by its title', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={['logs', 'metrics']}
			/>,
		);

		expect(screen.getAllByRole('region')).toHaveLength(2);
		expect(screen.getByRole('region', { name: 'Logs' })).toBe(
			screen.getByTestId('g-item-logs-panel'),
		);
		expect(screen.getByRole('region', { name: 'Metrics' })).toBe(
			screen.getByTestId('g-item-metrics-panel'),
		);
	});

	it('keeps role=region on every panel at 6 items', () => {
		const items = makeItems(6);

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={items}
				defaultValue={items.map((item) => item.value)}
			/>,
		);

		expect(screen.getAllByRole('region')).toHaveLength(6);
	});

	it('drops role=region from every panel past 6 items', () => {
		const items = makeItems(7);

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={items}
				defaultValue={items.map((item) => item.value)}
			/>,
		);

		expect(screen.queryAllByRole('region')).toHaveLength(0);

		for (const { value } of items) {
			expect(screen.getByTestId(`g-item-${value}-panel`)).not.toHaveAttribute('role');
		}
	});

	it('drops role=region while the panels are kept mounted too, past 6 items', () => {
		const items = makeItems(8);

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				keepMounted
				items={items}
				defaultValue={[]}
			/>,
		);

		for (const { value } of items) {
			expect(screen.getByTestId(`g-item-${value}-panel`)).not.toHaveAttribute('role');
		}
	});

	it('counts only the items that render toward the limit of 6', () => {
		const items = [...makeItems(6), { value: 'item-1', title: 'Again', children: 'again' }];

		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				items={items}
				defaultValue={items.map((item) => item.value)}
			/>,
		);

		expect(screen.getAllByRole('region')).toHaveLength(6);
		expect(warn).toHaveBeenCalled();
	});

	it('hides the chevron of every item from assistive tech', () => {
		const { container } = render(
			<Collapse.Group variant="outlined" size="sm" items={GROUP_ITEMS} defaultValue={[]} />,
		);

		for (const chevron of container.querySelectorAll('[data-slot="collapse-chevron"]')) {
			expect(chevron).toHaveAttribute('aria-hidden', 'true');
		}
	});

	it('hides the prefix of an item from assistive tech', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				defaultValue={[]}
				items={[{ value: 'logs', title: 'Logs', prefix: icon, children: 'a' }]}
			/>,
		);

		expect(screen.getByTestId('g-item-logs-prefix')).toHaveAttribute('aria-hidden', 'true');
	});

	it('names the group through aria-label on the root', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				aria-label="FAQ"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={[]}
			/>,
		);

		expect(screen.getByTestId('g')).toHaveAttribute('aria-label', 'FAQ');
	});
});
