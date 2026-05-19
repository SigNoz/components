import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import {
	Pagination,
	PaginationContainer,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from './index.js';

describe('Pagination forwardRef', () => {
	it('Pagination forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Pagination ref={ref} total={100} pageSize={10} />);
		expect(ref.current).toBeInstanceOf(HTMLElement);
		expect(ref.current?.tagName).toBe('NAV');
	});

	it('PaginationContainer forwards ref', () => {
		const ref = createRef<HTMLElement>();
		render(<PaginationContainer ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLElement);
		expect(ref.current?.tagName).toBe('NAV');
	});

	it('PaginationContent forwards ref', () => {
		const ref = createRef<HTMLUListElement>();
		render(
			<PaginationContainer>
				<PaginationContent ref={ref} />
			</PaginationContainer>
		);
		expect(ref.current).toBeInstanceOf(HTMLUListElement);
	});

	it('PaginationItem forwards ref', () => {
		const ref = createRef<HTMLLIElement>();
		render(
			<PaginationContainer>
				<PaginationContent>
					<PaginationItem ref={ref} />
				</PaginationContent>
			</PaginationContainer>
		);
		expect(ref.current).toBeInstanceOf(HTMLLIElement);
	});

	it('PaginationLink forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<PaginationContainer>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink ref={ref}>1</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</PaginationContainer>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('PaginationPrevious forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<PaginationContainer>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious ref={ref} />
					</PaginationItem>
				</PaginationContent>
			</PaginationContainer>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('PaginationNext forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<PaginationContainer>
				<PaginationContent>
					<PaginationItem>
						<PaginationNext ref={ref} />
					</PaginationItem>
				</PaginationContent>
			</PaginationContainer>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('PaginationEllipsis forwards ref', () => {
		const ref = createRef<HTMLSpanElement>();
		render(
			<PaginationContainer>
				<PaginationContent>
					<PaginationItem>
						<PaginationEllipsis ref={ref} />
					</PaginationItem>
				</PaginationContent>
			</PaginationContainer>
		);
		expect(ref.current).toBeInstanceOf(HTMLSpanElement);
	});
});
