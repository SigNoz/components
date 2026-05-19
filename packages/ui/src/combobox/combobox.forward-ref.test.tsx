import { render } from '@testing-library/react';
import { createRef } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
	Combobox,
	ComboboxCommand,
	ComboboxContent,
	ComboboxCreateItem,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxHint,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxLoading,
	ComboboxMultiTrigger,
	ComboboxPill,
	ComboboxSeparator,
	ComboboxSimple,
	ComboboxTrigger,
} from './index.js';

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
	Element.prototype.scrollIntoView = vi.fn();
});

describe('Combobox forwardRef', () => {
	it('ComboboxTrigger forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Combobox>
				<ComboboxTrigger ref={ref} placeholder="Select..." />
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('ComboboxContent forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent ref={ref}>Content</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('ComboboxMultiTrigger forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<ComboboxMultiTrigger
				ref={ref}
				inputValue=""
				onInputChange={() => {}}
				placeholder="Select..."
			/>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-multi-trigger');
	});

	it('ComboboxPill forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(
			<ComboboxPill ref={ref} value="react" onRemove={() => {}}>
				React
			</ComboboxPill>
		);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-pill');
	});

	it('ComboboxSimple forwards ref', () => {
		const ref = createRef<HTMLButtonElement | HTMLDivElement>();
		render(
			<ComboboxSimple
				ref={ref}
				items={[{ value: 'a', label: 'Option A' }]}
				placeholder="Select..."
			/>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('ComboboxCommand forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand ref={ref}>
						<ComboboxList>
							<ComboboxItem value="test">Test</ComboboxItem>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-command');
	});

	it('ComboboxInput forwards ref', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxInput ref={ref} placeholder="Search..." />
						<ComboboxList>
							<ComboboxItem value="test">Test</ComboboxItem>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLInputElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-input');
	});

	it('ComboboxList forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxList ref={ref}>
							<ComboboxItem value="test">Test</ComboboxItem>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-list');
	});

	it('ComboboxEmpty forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxList>
							<ComboboxEmpty ref={ref}>No results</ComboboxEmpty>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-empty');
	});

	it('ComboboxLoading forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxList>
							<ComboboxLoading ref={ref}>Loading...</ComboboxLoading>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-loading');
	});

	it('ComboboxGroup forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxList>
							<ComboboxGroup ref={ref} heading="Options">
								<ComboboxItem value="test">Test</ComboboxItem>
							</ComboboxGroup>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-group');
	});

	it('ComboboxItem forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxList>
							<ComboboxItem ref={ref} value="test">
								Test
							</ComboboxItem>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-item');
	});

	it('ComboboxSeparator forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxList>
							<ComboboxItem value="a">A</ComboboxItem>
							<ComboboxSeparator ref={ref} />
							<ComboboxItem value="b">B</ComboboxItem>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-separator');
	});

	it('ComboboxCreateItem forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxList>
							<ComboboxCreateItem ref={ref} inputValue="new" onSelect={() => {}} />
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-create-item');
	});

	it('ComboboxHint forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Combobox open>
				<ComboboxTrigger placeholder="Select..." />
				<ComboboxContent>
					<ComboboxCommand>
						<ComboboxList>
							<ComboboxHint ref={ref} insertValue="status:" onInsert={() => {}}>
								Filter by status
							</ComboboxHint>
						</ComboboxList>
					</ComboboxCommand>
				</ComboboxContent>
			</Combobox>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'combobox-hint');
	});
});
