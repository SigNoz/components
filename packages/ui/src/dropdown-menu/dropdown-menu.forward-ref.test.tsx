import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import {
	DropdownMenu,
	DropdownMenuBack,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuLoading,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSearch,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from './index.js';

describe('DropdownMenu forwardRef', () => {
	it('DropdownMenuTrigger forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<DropdownMenu>
				<DropdownMenuTrigger ref={ref}>Open</DropdownMenuTrigger>
			</DropdownMenu>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
	});

	it('DropdownMenuContent forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent ref={ref}>
					<DropdownMenuItem>Item</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuItem forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem ref={ref}>Item</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuShortcut forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<DropdownMenuShortcut ref={ref}>⌘K</DropdownMenuShortcut>);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
		expect(ref.current).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
	});

	it('DropdownMenuLoading forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DropdownMenuLoading ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'dropdown-menu-loading');
	});

	it('DropdownMenuSeparator forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DropdownMenuSeparator ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuLabel forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DropdownMenuLabel ref={ref}>Label</DropdownMenuLabel>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuGroup forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DropdownMenuGroup ref={ref}>Group</DropdownMenuGroup>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuRadioGroup forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DropdownMenuRadioGroup ref={ref} value="a" />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuCheckboxItem forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuCheckboxItem ref={ref} checked>
						Checkbox
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuRadioItem forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuRadioGroup value="a">
						<DropdownMenuRadioItem ref={ref} value="a">
							Radio
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuBack forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuBack ref={ref} onBack={() => {}} label="Back">
						Back
					</DropdownMenuBack>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuSearch forwards ref', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSearch ref={ref} placeholder="Search..." />
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(ref.current).toBeInstanceOf(HTMLInputElement);
	});

	it('DropdownMenuSubTrigger forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger ref={ref}>More</DropdownMenuSubTrigger>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DropdownMenuSubContent forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<DropdownMenu open>
				<DropdownMenuTrigger>Open</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSub open>
						<DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
						<DropdownMenuSubContent ref={ref}>
							<DropdownMenuItem>Sub Item</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
