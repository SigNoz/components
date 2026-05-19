import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectSimple,
	SelectTrigger,
} from './index.js';

describe('Select forwardRef', () => {
	it('SelectTrigger forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Select>
				<SelectTrigger ref={ref} placeholder="Select..." />
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('SelectContent forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Select open>
				<SelectTrigger placeholder="Select..." />
				<SelectContent ref={ref}>
					<SelectItem value="a">A</SelectItem>
				</SelectContent>
			</Select>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('SelectItem forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Select open>
				<SelectTrigger placeholder="Select..." />
				<SelectContent>
					<SelectItem ref={ref} value="a">
						A
					</SelectItem>
				</SelectContent>
			</Select>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('SelectGroup forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Select open>
				<SelectTrigger placeholder="Select..." />
				<SelectContent>
					<SelectGroup ref={ref}>
						<SelectLabel>Group</SelectLabel>
						<SelectItem value="a">A</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('SelectLabel forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Select open>
				<SelectTrigger placeholder="Select..." />
				<SelectContent>
					<SelectGroup>
						<SelectLabel ref={ref}>Group</SelectLabel>
						<SelectItem value="a">A</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('SelectSeparator forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Select open>
				<SelectTrigger placeholder="Select..." />
				<SelectContent>
					<SelectItem value="a">A</SelectItem>
					<SelectSeparator ref={ref} />
					<SelectItem value="b">B</SelectItem>
				</SelectContent>
			</Select>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('SelectSimple forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<SelectSimple ref={ref} items={[{ value: 'a', label: 'Option A' }]} placeholder="Select..." />
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});
});
