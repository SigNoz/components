import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Collapse } from '../collapse.js';
import { GROUP_ITEMS } from './collapse.test-utils.js';

function Probe({ onMount, onUnmount }: { onMount: () => void; onUnmount: () => void }) {
	useEffect(() => {
		onMount();

		return onUnmount;
	}, [onMount, onUnmount]);

	return <input aria-label="Name" />;
}

describe('Collapse mounting', () => {
	it('does not mount the content while collapsed', () => {
		const onMount = vi.fn();

		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				<Probe onMount={onMount} onUnmount={vi.fn()} />
			</Collapse>,
		);

		expect(onMount).not.toHaveBeenCalled();
		expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
		expect(screen.queryByTestId('c-panel')).not.toBeInTheDocument();
	});

	it('mounts the content when the section opens and unmounts it when it closes', async () => {
		const user = userEvent.setup();
		const onMount = vi.fn();
		const onUnmount = vi.fn();

		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				<Probe onMount={onMount} onUnmount={onUnmount} />
			</Collapse>,
		);

		await user.click(screen.getByTestId('c-toggle'));

		expect(onMount).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('textbox', { name: 'Name' })).toBeVisible();

		await user.click(screen.getByTestId('c-toggle'));

		await waitFor(() => expect(screen.queryByTestId('c-panel')).not.toBeInTheDocument());
		expect(onUnmount).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
	});

	it('resets the local state of the content on the next open', async () => {
		const user = userEvent.setup();

		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
				<input aria-label="Name" />
			</Collapse>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Name' }), 'abc');
		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('abc');

		await user.click(screen.getByTestId('c-toggle'));
		await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
		await user.click(screen.getByTestId('c-toggle'));

		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
	});

	it('mounts the content at once when it starts open', () => {
		const onMount = vi.fn();

		render(
			<Collapse variant="outlined" size="sm" title="Advanced" defaultExpanded>
				<Probe onMount={onMount} onUnmount={vi.fn()} />
			</Collapse>,
		);

		expect(onMount).toHaveBeenCalledTimes(1);
	});

	it('has no hidden attribute on an open panel', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded>
				Body
			</Collapse>,
		);

		expect(screen.getByTestId('c-panel')).not.toHaveAttribute('hidden');
		expect(screen.getByTestId('c-panel')).toBeVisible();
	});
});

describe('Collapse keepMounted', () => {
	it('mounts the content while collapsed and hides it with hidden=until-found', () => {
		const onMount = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				keepMounted
				defaultExpanded={false}
			>
				<Probe onMount={onMount} onUnmount={vi.fn()} />
			</Collapse>,
		);

		const panel = screen.getByTestId('c-panel');

		expect(onMount).toHaveBeenCalledTimes(1);
		expect(panel).toHaveAttribute('hidden', 'until-found');
		expect(panel).toContainElement(screen.getByLabelText('Name'));
		expect(panel).not.toBeVisible();
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
	});

	it('shows the panel and drops hidden while open', () => {
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

		expect(screen.getByTestId('c-panel')).not.toHaveAttribute('hidden');
		expect(screen.getByTestId('c-panel')).toBeVisible();
	});

	it('keeps the content mounted across a close and an open, with its state', async () => {
		const user = userEvent.setup();
		const onUnmount = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				keepMounted
				defaultExpanded
			>
				<Probe onMount={vi.fn()} onUnmount={onUnmount} />
			</Collapse>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Name' }), 'abc');
		await user.click(screen.getByTestId('c-toggle'));

		await waitFor(() =>
			expect(screen.getByTestId('c-panel')).toHaveAttribute('hidden', 'until-found'),
		);
		expect(screen.getByTestId('c-panel')).not.toBeVisible();
		expect(onUnmount).not.toHaveBeenCalled();

		await user.click(screen.getByTestId('c-toggle'));

		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('abc');
		expect(screen.getByTestId('c-panel')).toBeVisible();
	});

	it('keeps the text in the DOM for find in page', () => {
		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				keepMounted
				defaultExpanded={false}
			>
				Needle in a haystack
			</Collapse>,
		);

		expect(screen.getByTestId('c-panel')).toHaveTextContent('Needle in a haystack');
	});

	it('opens and reports the change when find in page reaches the hidden content', () => {
		const onExpandedChange = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				keepMounted
				defaultExpanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		act(() => {
			screen.getByTestId('c-panel').dispatchEvent(new Event('beforematch'));
		});

		expect(onExpandedChange).toHaveBeenCalledTimes(1);
		expect(onExpandedChange).toHaveBeenCalledWith(true);
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('c')).toHaveAttribute('data-expanded');
		expect(screen.getByTestId('c-panel')).toBeVisible();
	});

	it('reports find in page on a controlled section and waits for the parent to open it', () => {
		const onExpandedChange = vi.fn();

		render(
			<Collapse
				variant="outlined"
				size="sm"
				testId="c"
				title="Advanced"
				keepMounted
				expanded={false}
				onExpandedChange={onExpandedChange}
			>
				Body
			</Collapse>,
		);

		act(() => {
			screen.getByTestId('c-panel').dispatchEvent(new Event('beforematch'));
		});

		expect(onExpandedChange).toHaveBeenCalledWith(true);
		expect(screen.getByTestId('c-toggle')).toHaveAttribute('aria-expanded', 'false');
	});

	it('leaves nothing for find in page to reach without keepMounted', () => {
		render(
			<Collapse variant="outlined" size="sm" testId="c" title="Advanced" defaultExpanded={false}>
				Body
			</Collapse>,
		);

		expect(document.querySelector('[hidden="until-found"]')).toBeNull();
	});
});

describe('Collapse.Group mounting', () => {
	it('mounts only the open items while collapsed items are not kept', () => {
		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				items={GROUP_ITEMS}
				defaultValue={['traces']}
			/>,
		);

		expect(screen.getByTestId('g-item-traces-panel')).toHaveTextContent('Traces body');
		expect(screen.queryByTestId('g-item-logs-panel')).not.toBeInTheDocument();
		expect(screen.queryByText('Logs body')).not.toBeInTheDocument();
		expect(screen.queryByText('Metrics body')).not.toBeInTheDocument();
	});

	it('mounts the content of a closed item and hides it with hidden=until-found, with keepMounted', () => {
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

		expect(screen.getByTestId('g-item-logs-panel')).toHaveAttribute('hidden', 'until-found');
		expect(screen.getByTestId('g-item-logs-panel')).toHaveTextContent('Logs body');
		expect(screen.getByTestId('g-item-logs-panel')).not.toBeVisible();
		expect(screen.getByTestId('g-item-traces-panel')).not.toHaveAttribute('hidden');
		expect(screen.getByTestId('g-item-traces-panel')).toBeVisible();
	});

	it('opens the item and reports the values when find in page reaches it', () => {
		const onChange = vi.fn();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				testId="g"
				keepMounted
				items={GROUP_ITEMS}
				defaultValue={['metrics']}
				onChange={onChange}
			/>,
		);

		act(() => {
			screen.getByTestId('g-item-logs-panel').dispatchEvent(new Event('beforematch'));
		});

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(['logs', 'metrics']);
		expect(screen.getByTestId('g-item-logs-toggle')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByTestId('g-item-logs-panel')).toBeVisible();
	});

	it('keeps the state of a closed item with keepMounted', async () => {
		const user = userEvent.setup();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				keepMounted
				defaultValue={['a']}
				items={[{ value: 'a', title: 'A', children: <input aria-label="Name" /> }]}
			/>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Name' }), 'abc');
		await user.click(screen.getByRole('button', { name: 'A' }));
		await user.click(screen.getByRole('button', { name: 'A' }));

		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('abc');
	});

	it('resets the state of an item without keepMounted on the next open', async () => {
		const user = userEvent.setup();

		render(
			<Collapse.Group
				variant="outlined"
				size="sm"
				defaultValue={['a']}
				items={[{ value: 'a', title: 'A', children: <input aria-label="Name" /> }]}
			/>,
		);

		await user.type(screen.getByRole('textbox', { name: 'Name' }), 'abc');
		await user.click(screen.getByRole('button', { name: 'A' }));
		await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
		await user.click(screen.getByRole('button', { name: 'A' }));

		expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
	});
});
