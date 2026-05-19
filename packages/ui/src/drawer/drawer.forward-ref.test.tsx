import { render } from '@testing-library/react';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import {
	ConfirmDrawer,
	ConfirmDrawerUrl,
	Drawer,
	DrawerClose,
	DrawerCloseButton,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerSubtitle,
	DrawerTitle,
	DrawerTrigger,
	DrawerWrapper,
} from './index.js';

describe('Drawer forwardRef', () => {
	it('DrawerTrigger forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Drawer>
				<DrawerTrigger ref={ref}>Open</DrawerTrigger>
			</Drawer>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('DrawerHeader forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DrawerHeader ref={ref}>Header</DrawerHeader>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DrawerFooter forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DrawerFooter ref={ref}>Footer</DrawerFooter>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DrawerDescription forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DrawerDescription ref={ref}>Description</DrawerDescription>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DrawerSubtitle forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DrawerSubtitle ref={ref}>Subtitle</DrawerSubtitle>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DrawerClose forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Drawer>
				<DrawerClose ref={ref}>Close</DrawerClose>
			</Drawer>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('DrawerCloseButton forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Drawer open>
				<DrawerContent>
					<DrawerCloseButton ref={ref} />
				</DrawerContent>
			</Drawer>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('DrawerContent forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Drawer open>
				<DrawerContent ref={ref}>Content</DrawerContent>
			</Drawer>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DrawerOverlay forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Drawer open>
				<DrawerOverlay ref={ref} />
			</Drawer>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DrawerTitle forwards ref', () => {
		const ref = createRef<HTMLHeadingElement>();
		render(
			<Drawer open>
				<DrawerContent>
					<DrawerTitle ref={ref}>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>
		);
		expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
	});

	it('DrawerWrapper forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<DrawerWrapper ref={ref} open onOpenChange={() => {}} title="Test">
				Content
			</DrawerWrapper>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('ConfirmDrawer forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<ConfirmDrawer
				ref={ref}
				open
				onOpenChange={() => {}}
				onConfirm={() => {}}
				title="Confirm"
				confirmText="Confirm"
			>
				Content
			</ConfirmDrawer>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('ConfirmDrawerUrl forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<NuqsTestingAdapter searchParams="?test=true">
				<ConfirmDrawerUrl
					ref={ref}
					urlKey="test"
					onConfirm={() => {}}
					title="Confirm"
					confirmText="Confirm"
				>
					Content
				</ConfirmDrawerUrl>
			</NuqsTestingAdapter>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
