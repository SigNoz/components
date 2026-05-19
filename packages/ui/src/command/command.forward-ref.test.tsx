import { render } from '@testing-library/react';
import { createRef } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandLoading,
	CommandSeparator,
	CommandShortcut,
} from './index.js';

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
	Element.prototype.scrollIntoView = vi.fn();
});

describe('Command forwardRef', () => {
	it('Command forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Command ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('CommandInput forwards ref', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<Command>
				<CommandInput ref={ref} />
			</Command>
		);
		expect(ref.current).toBeInstanceOf(HTMLInputElement);
	});

	it('CommandShortcut forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(<CommandShortcut ref={ref}>⌘K</CommandShortcut>);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
	});

	it('CommandList forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Command>
				<CommandList ref={ref}>
					<CommandItem>Test</CommandItem>
				</CommandList>
			</Command>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('CommandEmpty forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Command>
				<CommandList>
					<CommandEmpty ref={ref}>No results</CommandEmpty>
				</CommandList>
			</Command>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('CommandLoading forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Command>
				<CommandList>
					<CommandLoading ref={ref}>Loading...</CommandLoading>
				</CommandList>
			</Command>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('CommandGroup forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Command>
				<CommandList>
					<CommandGroup ref={ref} heading="Options">
						<CommandItem>Test</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('CommandSeparator forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Command>
				<CommandList>
					<CommandItem>A</CommandItem>
					<CommandSeparator ref={ref} />
					<CommandItem>B</CommandItem>
				</CommandList>
			</Command>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('CommandItem forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Command>
				<CommandList>
					<CommandItem ref={ref}>Test</CommandItem>
				</CommandList>
			</Command>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
