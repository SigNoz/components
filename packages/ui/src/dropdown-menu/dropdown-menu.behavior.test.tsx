import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { activate } from '../__tests__/interactions.js';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuMultiStep,
	DropdownMenuMultiStepContent,
	DropdownMenuMultiStepTrigger,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSearch,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSimple,
	DropdownMenuTrigger,
} from './index.js';

/**
 * Assertions target the menu ARIA contract, selection callbacks and the public
 * prop surface rather than the primitive's own state attributes, so they remain
 * meaningful if the primitive underneath is replaced.
 */
function renderMenu(items: React.ReactNode, contentProps = {}) {
	return render(
		<DropdownMenu>
			<DropdownMenuTrigger>Open</DropdownMenuTrigger>
			<DropdownMenuContent {...contentProps}>{items}</DropdownMenuContent>
		</DropdownMenu>,
	);
}

function openMenu() {
	// Menu triggers open on pointerdown rather than click, so the full pointer
	// sequence is what a real user generates.
	activate(screen.getByRole('button', { name: 'Open' }));
}

describe('DropdownMenu open state', () => {
	it('opens from the trigger and exposes a menu', () => {
		renderMenu(<DropdownMenuItem>Edit</DropdownMenuItem>);

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		openMenu();

		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
	});

	it('reports open changes through onOpenChange', () => {
		const onOpenChange = vi.fn();
		render(
			<DropdownMenu onOpenChange={onOpenChange}>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Edit</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		openMenu();

		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('honours the controlled open prop', () => {
		function Controlled() {
			const [open, setOpen] = useState(false);
			return (
				<>
					<button type="button" onClick={() => setOpen(true)}>
						Show
					</button>
					<DropdownMenu open={open} onOpenChange={setOpen}>
						<DropdownMenuTrigger>Open</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Edit</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		}
		render(<Controlled />);

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		activate(screen.getByRole('button', { name: 'Show' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('closes on Escape', () => {
		renderMenu(<DropdownMenuItem>Edit</DropdownMenuItem>);
		openMenu();

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});
});

describe('DropdownMenuItem', () => {
	it('fires onSelect and closes the menu', () => {
		const onSelect = vi.fn();
		renderMenu(<DropdownMenuItem onSelect={onSelect}>Edit</DropdownMenuItem>);
		openMenu();

		activate(screen.getByRole('menuitem', { name: 'Edit' }));

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('keeps the menu open when onSelect prevents the default', () => {
		renderMenu(
			<DropdownMenuItem onSelect={(event) => event.preventDefault()}>Edit</DropdownMenuItem>,
		);
		openMenu();

		activate(screen.getByRole('menuitem', { name: 'Edit' }));

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('does not fire a disabled item', () => {
		const onSelect = vi.fn();
		renderMenu(
			<DropdownMenuItem disabled onSelect={onSelect}>
				Edit
			</DropdownMenuItem>,
		);
		openMenu();

		activate(screen.getByRole('menuitem', { name: 'Edit' }));

		expect(onSelect).not.toHaveBeenCalled();
	});

	it('renders icons, a destructive flag and a shortcut', () => {
		renderMenu(
			<DropdownMenuItem
				destructive
				testId="item"
				leftIcon={<span>L</span>}
				rightIcon={<span>R</span>}
			>
				Delete
				<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
			</DropdownMenuItem>,
		);
		openMenu();

		const item = screen.getByTestId('item');
		expect(item).toHaveAttribute('data-destructive');
		expect(item).toHaveTextContent('L');
		expect(item).toHaveTextContent('R');
		expect(screen.getByText('⌘D')).toBeInTheDocument();
	});
});

describe('DropdownMenuCheckboxItem', () => {
	it('exposes the checked state and reports changes', () => {
		const onCheckedChange = vi.fn();
		renderMenu(
			<DropdownMenuCheckboxItem checked onCheckedChange={onCheckedChange}>
				Wrap lines
			</DropdownMenuCheckboxItem>,
		);
		openMenu();

		const item = screen.getByRole('menuitemcheckbox', { name: 'Wrap lines' });
		expect(item).toHaveAttribute('aria-checked', 'true');

		activate(item);
		expect(onCheckedChange).toHaveBeenCalledWith(false);
	});
});

describe('DropdownMenuRadioGroup', () => {
	it('exposes the selected radio item and reports changes', () => {
		const onValueChange = vi.fn();
		renderMenu(
			<DropdownMenuRadioGroup value="logs" onValueChange={onValueChange}>
				<DropdownMenuRadioItem value="logs">Logs</DropdownMenuRadioItem>
				<DropdownMenuRadioItem value="traces">Traces</DropdownMenuRadioItem>
			</DropdownMenuRadioGroup>,
		);
		openMenu();

		expect(screen.getByRole('menuitemradio', { name: 'Logs' })).toHaveAttribute(
			'aria-checked',
			'true',
		);

		activate(screen.getByRole('menuitemradio', { name: 'Traces' }));
		expect(onValueChange).toHaveBeenCalledWith('traces');
	});
});

describe('DropdownMenu structure', () => {
	it('renders labels, groups and separators', () => {
		renderMenu(
			<>
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>Edit</DropdownMenuItem>
				</DropdownMenuGroup>
			</>,
		);
		openMenu();

		expect(screen.getByText('Actions')).toBeInTheDocument();
		expect(screen.getByRole('separator')).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
	});
});

describe('DropdownMenuMultiStep', () => {
	it('moves to the secondary step and back again', () => {
		render(
			<DropdownMenuMultiStep>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuMultiStepContent
					secondaryLabel="Back to actions"
					primaryContent={<DropdownMenuMultiStepTrigger>More</DropdownMenuMultiStepTrigger>}
					secondaryContent={<DropdownMenuItem>Nested action</DropdownMenuItem>}
				/>
			</DropdownMenuMultiStep>,
		);
		openMenu();

		expect(screen.getByText('More')).toBeInTheDocument();

		activate(screen.getByText('More'));
		expect(screen.getByRole('menuitem', { name: 'Nested action' })).toBeInTheDocument();
		expect(screen.queryByText('More')).not.toBeInTheDocument();

		activate(screen.getByText('Back to actions'));
		expect(screen.getByText('More')).toBeInTheDocument();
	});
});

describe('DropdownMenuSearch', () => {
	it('reports typed input and downward navigation', () => {
		const onSearchChange = vi.fn();
		const onNavigateDown = vi.fn();
		renderMenu(
			<DropdownMenuSearch onSearchChange={onSearchChange} onNavigateDown={onNavigateDown} />,
		);
		openMenu();

		const input = screen.getByPlaceholderText('Search...');
		fireEvent.change(input, { target: { value: 'log' } });
		expect(onSearchChange).toHaveBeenCalledWith('log');

		fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(onNavigateDown).toHaveBeenCalledTimes(1);
	});
});

describe('DropdownMenuSimple', () => {
	it('renders items, dividers and groups from the menu prop', () => {
		const onClick = vi.fn();
		render(
			<DropdownMenuSimple
				menu={{
					items: [
						{ key: 'edit', label: 'Edit', onClick },
						{ type: 'divider' },
						{
							type: 'group',
							key: 'danger',
							label: 'Danger zone',
							children: [{ key: 'delete', label: 'Delete', danger: true }],
						},
					],
				}}
			>
				<button type="button">Open</button>
			</DropdownMenuSimple>,
		);
		openMenu();

		expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
		expect(screen.getByText('Danger zone')).toBeInTheDocument();
		expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();

		activate(screen.getByRole('menuitem', { name: 'Edit' }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
