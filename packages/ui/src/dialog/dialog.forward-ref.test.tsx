import { render } from '@testing-library/react';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import {
	ConfirmDialog,
	ConfirmDialogUrl,
	Dialog,
	DialogClose,
	DialogCloseButton,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogSubtitle,
	DialogTitle,
	DialogTrigger,
	DialogWrapper,
} from './index.js';

describe('Dialog forwardRef', () => {
	it('DialogTrigger forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Dialog>
				<DialogTrigger ref={ref}>Open</DialogTrigger>
			</Dialog>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('DialogHeader forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DialogHeader ref={ref}>Header</DialogHeader>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'dialog-header');
	});

	it('DialogFooter forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DialogFooter ref={ref}>Footer</DialogFooter>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'dialog-footer');
	});

	it('DialogDescription forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DialogDescription ref={ref}>Description</DialogDescription>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DialogSubtitle forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<DialogSubtitle ref={ref}>Subtitle</DialogSubtitle>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DialogClose forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Dialog>
				<DialogClose ref={ref}>Close</DialogClose>
			</Dialog>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('DialogCloseButton forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Dialog open>
				<DialogContent>
					<DialogCloseButton ref={ref} />
				</DialogContent>
			</Dialog>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('DialogContent forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Dialog open>
				<DialogContent ref={ref}>Content</DialogContent>
			</Dialog>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('DialogOverlay forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Dialog open>
				<DialogOverlay ref={ref} />
			</Dialog>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toHaveAttribute('data-slot', 'dialog-overlay');
	});

	it('DialogTitle forwards ref', () => {
		const ref = createRef<HTMLHeadingElement>();
		render(
			<Dialog open>
				<DialogContent>
					<DialogTitle ref={ref}>Title</DialogTitle>
				</DialogContent>
			</Dialog>
		);
		expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
		expect(ref.current).toHaveAttribute('data-slot', 'dialog-title');
	});

	it('DialogWrapper forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<DialogWrapper ref={ref} open onOpenChange={() => {}} title="Test">
				Content
			</DialogWrapper>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('ConfirmDialog forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<ConfirmDialog
				ref={ref}
				open
				onOpenChange={() => {}}
				onConfirm={() => {}}
				title="Confirm"
				confirmText="Confirm"
			>
				Content
			</ConfirmDialog>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('ConfirmDialogUrl forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<NuqsTestingAdapter searchParams="?test=true">
				<ConfirmDialogUrl
					ref={ref}
					urlKey="test"
					onConfirm={() => {}}
					title="Confirm"
					confirmText="Confirm"
				>
					Content
				</ConfirmDialogUrl>
			</NuqsTestingAdapter>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
