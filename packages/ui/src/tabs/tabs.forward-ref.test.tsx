import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsRoot, TabsTrigger } from './index.js';

describe('Tabs forwardRef', () => {
	it('Tabs forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Tabs ref={ref} items={[{ key: 'a', label: 'Tab A', children: 'Content A' }]} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('TabsRoot forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<TabsRoot ref={ref} defaultValue="a">
				<TabsList>
					<TabsTrigger value="a">Tab A</TabsTrigger>
				</TabsList>
				<TabsContent value="a">Content A</TabsContent>
			</TabsRoot>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('TabsList forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<TabsRoot defaultValue="a">
				<TabsList ref={ref}>
					<TabsTrigger value="a">Tab A</TabsTrigger>
				</TabsList>
				<TabsContent value="a">Content A</TabsContent>
			</TabsRoot>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('TabsTrigger forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<TabsRoot defaultValue="a">
				<TabsList>
					<TabsTrigger ref={ref} value="a">
						Tab A
					</TabsTrigger>
				</TabsList>
				<TabsContent value="a">Content A</TabsContent>
			</TabsRoot>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('TabsContent forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<TabsRoot defaultValue="a">
				<TabsList>
					<TabsTrigger value="a">Tab A</TabsTrigger>
				</TabsList>
				<TabsContent ref={ref} value="a">
					Content A
				</TabsContent>
			</TabsRoot>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
