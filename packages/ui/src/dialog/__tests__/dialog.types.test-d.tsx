/**
 * Type-level tests for the props of {@link Dialog}. Run by
 * `vitest --typecheck` and by `pnpm type-check`. See `dropdown.types.test-d.tsx` for how the
 * cases are written.
 *
 * Every case that is refused names the rule it hits in its `@ts-expect-error`, and
 * `dialog.types.messages.test.ts` snapshots the message the compiler prints for each.
 */
import { createRef, type ReactNode } from 'react';
import { assertType, describe, expectTypeOf, test } from 'vitest';
import { PopupHandle } from '../../lib/popup-handle.js';
import { Dialog } from '../dialog.js';
import { DialogHandle } from '../dialog-handle.js';
import type { DialogCloseReasonType, IsNoHandle, NoHandle, ValidateDialogProps } from '../types.js';
import type { useDialogHandle } from '../use-dialog-handle.js';

interface Row {
	name: string;
}

interface Other {
	id: number;
}

const noop = () => {};
const ref = createRef<HTMLDivElement>();
const icon = <svg />;
const rowHandle = new DialogHandle<Row>();
const plainHandle = new DialogHandle();
const unknownHandle: ReturnType<typeof useDialogHandle<unknown>> = new DialogHandle<unknown>();
const anyHandle: ReturnType<typeof useDialogHandle<any>> = new DialogHandle<any>();
const readsRow = { children: (row: Row) => row.name };
const readsOther = { children: (other: Other) => other.id };

describe('Dialog props', () => {
	test('accepts the required props, a ref, id, aria-* and data-*', () => {
		assertType(
			<Dialog
				open
				onClose={noop}
				title="Rename view"
				id="rename"
				aria-describedby="hint"
				data-area="views"
				ref={ref}
			>
				Body
			</Dialog>,
		);
	});

	test('accepts every optional prop', () => {
		assertType(
			<Dialog
				open={false}
				onClose={(reason) => {
					if (reason === 'outside-press') {
						return;
					}
				}}
				title=""
				titleIcon={icon}
				description={<span>Detail</span>}
				footerPrefix={<button type="button">Delete view</button>}
				footerSuffix={<button type="button">Save</button>}
				width="wide"
				testId="rename"
			>
				{null}
			</Dialog>,
		);
	});

	test('accepts a footerPrefix, a footerSuffix, or both', () => {
		assertType(
			<Dialog open onClose={noop} title="T" footerSuffix={<button type="button">Save</button>}>
				Body
			</Dialog>,
		);
		assertType(
			<Dialog open onClose={noop} title="T" footerPrefix={<button type="button">Delete</button>}>
				Body
			</Dialog>,
		);
		assertType(
			<Dialog
				open
				onClose={noop}
				title="T"
				footerPrefix="Hint"
				footerSuffix={<button type="button">Save</button>}
			>
				Body
			</Dialog>,
		);
		assertType(
			<Dialog
				handle={rowHandle}
				title="T"
				footerPrefix={null}
				footerSuffix={<button type="button">Save</button>}
			>
				Body
			</Dialog>,
		);
	});

	test('accepts every width name', () => {
		assertType(
			<Dialog open onClose={noop} title="T" width="narrow">
				Body
			</Dialog>,
		);
		assertType(
			<Dialog open onClose={noop} title="T" width="base">
				Body
			</Dialog>,
		);
		assertType(
			<Dialog open onClose={noop} title="T" width="wide">
				Body
			</Dialog>,
		);
		assertType(
			<Dialog open onClose={noop} title="T" width="extra-wide">
				Body
			</Dialog>,
		);
		assertType(
			<Dialog open onClose={noop} title="T" width="full">
				Body
			</Dialog>,
		);
	});

	test('accepts an onClose that reads the reason', () => {
		assertType(
			<Dialog
				open
				onClose={(_reason: 'escape-key' | 'outside-press' | 'close-press') => noop()}
				title="T"
			>
				Body
			</Dialog>,
		);
	});
});

describe('Dialog required props', () => {
	test('rejects a dialog with neither open nor a handle', () => {
		assertType(
			// @ts-expect-error - nothing says whether it is shown: pass `open` or a `handle`
			<Dialog onClose={noop} title="T">
				Body
			</Dialog>,
		);
	});

	test('rejects a dialog with open and no onClose', () => {
		assertType(
			// @ts-expect-error - with `open`, `onClose` is required: the dialog never closes itself
			<Dialog open title="T">
				Body
			</Dialog>,
		);
	});

	test('rejects a dialog with no title', () => {
		assertType(
			// @ts-expect-error - `title` is required, it is the accessible name
			<Dialog open onClose={noop}>
				Body
			</Dialog>,
		);
	});

	test('rejects a dialog with no children', () => {
		assertType(
			// @ts-expect-error - `children` is required, it is the body
			<Dialog open onClose={noop} title="T" />,
		);
	});
});

describe('Dialog value types', () => {
	test('rejects a width that is not a name', () => {
		assertType(
			// @ts-expect-error - `width` takes a name, not a pixel size
			<Dialog open onClose={noop} title="T" width="600px">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `width` takes a name, not a number
			<Dialog open onClose={noop} title="T" width={600}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `width` takes a name, not a percentage
			<Dialog open onClose={noop} title="T" width="85%">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `width` has no name called huge
			<Dialog open onClose={noop} title="T" width="huge">
				Body
			</Dialog>,
		);
	});

	test('rejects a title that is not a string', () => {
		assertType(
			// @ts-expect-error - `title` is the accessible name, a string
			<Dialog open onClose={noop} title={<b>Rename view</b>}>
				Body
			</Dialog>,
		);
	});

	test('rejects a title icon that is not an element', () => {
		assertType(
			// @ts-expect-error - `titleIcon` is an element
			<Dialog open onClose={noop} title="T" titleIcon="info">
				Body
			</Dialog>,
		);
	});

	test('rejects an onClose that cannot take every reason', () => {
		assertType(
			// @ts-expect-error - `onClose` is called with three reasons
			<Dialog open onClose={(_reason: 'escape-key') => noop()} title="T">
				Body
			</Dialog>,
		);
	});

	test('rejects an open that is not a boolean', () => {
		assertType(
			// @ts-expect-error - `open` is a boolean
			<Dialog open="yes" onClose={noop} title="T">
				Body
			</Dialog>,
		);
	});
});

describe('Dialog rejected props', () => {
	test('rejects the props that belong to a trigger, to uncontrolled state and to the layer', () => {
		assertType(
			// @ts-expect-error - a `data-testid` is written as `testId`
			<Dialog open onClose={noop} title="T" data-testid="x">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - a dialog has no trigger
			<Dialog open onClose={noop} title="T" trigger={<button type="button">Open</button>}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - a dialog has no uncontrolled mode, no `defaultOpen`
			<Dialog open onClose={noop} title="T" defaultOpen>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `onOpenChange` is `onClose`
			<Dialog open onClose={noop} title="T" onOpenChange={noop}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the backdrop is always there, no `showOverlay`
			<Dialog open onClose={noop} title="T" showOverlay>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - a dialog is always modal, no `modal`
			<Dialog open onClose={noop} title="T" modal={false}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the dialog owns its layer, no `zIndex`
			<Dialog open onClose={noop} title="T" zIndex={1100}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `getContainer` is `container`, and takes the element
			<Dialog open onClose={noop} title="T" getContainer={() => document.body}>
				Body
			</Dialog>,
		);
	});

	test('rejects the props of DialogWrapper and of antd Modal that have a replacement', () => {
		assertType(
			// @ts-expect-error - `subTitle` is `description`
			<Dialog open onClose={noop} title="T" subTitle="Detail">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the close button is always there, no `showCloseButton`
			<Dialog open onClose={noop} title="T" showCloseButton={false}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the close button is always there, no `closable`
			<Dialog open onClose={noop} title="T" closable={false}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the close button is fixed, no `closeIcon`
			<Dialog open onClose={noop} title="T" closeIcon={icon}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - ignore the `outside-press` reason, no `disableOutsideClick`
			<Dialog open onClose={noop} title="T" disableOutsideClick>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - ignore the `outside-press` reason, no `maskClosable`
			<Dialog open onClose={noop} title="T" maskClosable={false}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - ignore the `escape-key` reason, no `keyboard`
			<Dialog open onClose={noop} title="T" keyboard={false}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the panel is centered, no `position`
			<Dialog open onClose={noop} title="T" position="left">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the panel is centered, no `heightMode`
			<Dialog open onClose={noop} title="T" heightMode="full">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the panel fades in, no `animation`
			<Dialog open onClose={noop} title="T" animation="slide">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the panel is centered, no `offset`
			<Dialog open onClose={noop} title="T" offset={8}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the panel is always centered, no `centered`
			<Dialog open onClose={noop} title="T" centered>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - put the buttons in `footerSuffix`, no `onOk`
			<Dialog open onClose={noop} title="T" onOk={noop}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - put the buttons in `footerSuffix`, no `onCancel`
			<Dialog open onClose={noop} title="T" onCancel={noop}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - put the buttons in `footerSuffix`, no `okText`
			<Dialog open onClose={noop} title="T" okText="Save">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - put the buttons in `footerSuffix`, no `cancelText`
			<Dialog open onClose={noop} title="T" cancelText="Back">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - put the buttons in `footerSuffix`, no `okButtonProps`
			<Dialog open onClose={noop} title="T" okButtonProps={{}}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - put the buttons in `footerSuffix`, no `cancelButtonProps`
			<Dialog open onClose={noop} title="T" cancelButtonProps={{}}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `footer` is called `footerSuffix`, the pair of `footerPrefix`
			<Dialog open onClose={noop} title="T" footer={<button type="button">Save</button>}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `Dialog` takes no `style`
			<Dialog open onClose={noop} title="T" style={{}}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `Dialog` takes no `className`, wrap the content in your own element
			<Dialog open onClose={noop} title="T" className="scope">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the content always unmounts on close, no `destroyOnClose`
			<Dialog open onClose={noop} title="T" destroyOnClose>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the content only mounts while open, no `forceRender`
			<Dialog open onClose={noop} title="T" forceRender>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - not a prop, no `rootClassName`
			<Dialog open onClose={noop} title="T" rootClassName="x">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - not a prop, no `wrapClassName`
			<Dialog open onClose={noop} title="T" wrapClassName="x">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - react to `open`, no `afterClose`
			<Dialog open onClose={noop} title="T" afterClose={noop}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - put the button in `footerSuffix`, no `confirmLoading`
			<Dialog open onClose={noop} title="T" confirmLoading>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - put the button in `footerSuffix`, no `okType`
			<Dialog open onClose={noop} title="T" okType="danger">
				Body
			</Dialog>,
		);
	});
});

describe('Dialog footer rules', () => {
	const FOOTER_RULE = '`footer` is called `footerSuffix`, the pair of `footerPrefix`';

	test('names footerSuffix in the rule that rejects footer on a Dialog', () => {
		expectTypeOf<ValidateDialogProps<{ footer: ReactNode }>>().toHaveProperty(FOOTER_RULE);
		expectTypeOf<ValidateDialogProps<{ footerSuffix: ReactNode }>>().not.toHaveProperty(
			FOOTER_RULE,
		);
		expectTypeOf<ValidateDialogProps<{ footerPrefix: ReactNode }>>().not.toHaveProperty(
			FOOTER_RULE,
		);
	});
});

describe('Dialog handle rule', () => {
	const NEEDS_OPEN_OR_HANDLE =
		'a dialog is shown by `open` or by `handle.open(...)`: pass one of them';
	const NOT_BOTH = '`open` and `handle` both say whether the dialog is shown: pass one of them';

	test('reads no handle off NoHandle alone', () => {
		expectTypeOf<IsNoHandle<NoHandle>>().toEqualTypeOf<true>();
		expectTypeOf<IsNoHandle<unknown>>().toEqualTypeOf<false>();
		expectTypeOf<IsNoHandle<any>>().toEqualTypeOf<false>();
		expectTypeOf<IsNoHandle<never>>().toEqualTypeOf<false>();
		expectTypeOf<IsNoHandle<void>>().toEqualTypeOf<false>();
		expectTypeOf<IsNoHandle<Row>>().toEqualTypeOf<false>();
		expectTypeOf<IsNoHandle<Row | NoHandle>>().toEqualTypeOf<false>();
	});

	test('asks for open or a handle by default, and for no handle', () => {
		expectTypeOf<ValidateDialogProps<{ title: string }>>().toHaveProperty(NEEDS_OPEN_OR_HANDLE);
		expectTypeOf<ValidateDialogProps<{ title: string }, NoHandle>>().toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateDialogProps<{ open: true; onClose: () => void }>>().not.toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
	});

	test('takes any other payload, unknown and any included, as a handle', () => {
		expectTypeOf<ValidateDialogProps<{ title: string }, unknown>>().not.toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateDialogProps<{ title: string }, any>>().not.toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateDialogProps<{ title: string }, Row>>().not.toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateDialogProps<{ open: true }, unknown>>().toHaveProperty(NOT_BOTH);
		expectTypeOf<ValidateDialogProps<{ open: true }, any>>().toHaveProperty(NOT_BOTH);
	});
});

describe('Dialog focus props', () => {
	test('takes initialFocus and finalFocus as a ref, like Popover', () => {
		const field = createRef<HTMLInputElement>();
		assertType(
			<Dialog open onClose={noop} title="T" initialFocus={field} finalFocus={field}>
				body
			</Dialog>,
		);
	});
});

describe('Dialog container', () => {
	test('accepts an element, a ref to one, or null', () => {
		assertType(
			<Dialog open onClose={noop} title="T" container={document.body}>
				Body
			</Dialog>,
		);
		assertType(
			<Dialog open onClose={noop} title="T" container={createRef<HTMLDivElement>()}>
				Body
			</Dialog>,
		);
		assertType(
			<Dialog open onClose={noop} title="T" container={null}>
				Body
			</Dialog>,
		);
	});

	test('accepts a container with a handle', () => {
		assertType(
			<Dialog handle={rowHandle} title="T" container={document.body}>
				Body
			</Dialog>,
		);
	});

	test('rejects a container that is not an element or a ref', () => {
		assertType(
			// @ts-expect-error - `container` takes the element, not a selector
			<Dialog open onClose={noop} title="T" container="#root">
				Body
			</Dialog>,
		);
	});
});

describe('Dialog handle', () => {
	test('types the hook and the handle after the payload', () => {
		expectTypeOf<ReturnType<typeof useDialogHandle<Row>>>().toEqualTypeOf<DialogHandle<Row>>();
		expectTypeOf<ReturnType<typeof useDialogHandle<void>>>().toEqualTypeOf<DialogHandle<void>>();
		expectTypeOf<Parameters<typeof useDialogHandle<Row>>>().toEqualTypeOf<
			[onOpenChange?: ((open: boolean) => void) | undefined]
		>();
		expectTypeOf(rowHandle.isOpen).toEqualTypeOf<boolean>();
		expectTypeOf(rowHandle.close).parameters.toEqualTypeOf<[]>();
	});

	test('takes no argument to open a handle without a payload', () => {
		expectTypeOf(plainHandle.open).parameters.toEqualTypeOf<[]>();
		plainHandle.open();
		// @ts-expect-error - a handle without a payload opens with nothing
		plainHandle.open('x');
	});

	test('requires the payload to open a handle that has one', () => {
		expectTypeOf(rowHandle.open).parameters.toEqualTypeOf<[payload: Row]>();
		rowHandle.open({ name: 'Latency overview' });
		// @ts-expect-error - a handle with a payload opens with it
		rowHandle.open();
		// @ts-expect-error - the payload is a Row
		rowHandle.open({ id: 1 });
	});

	test('accepts a handle in place of open, with no onClose', () => {
		assertType(
			<Dialog handle={rowHandle} title="T">
				Body
			</Dialog>,
		);
		assertType(
			<Dialog handle={plainHandle} title="T">
				Body
			</Dialog>,
		);
	});

	test('accepts a handle with a ref, id, aria-* and data-*', () => {
		assertType(
			<Dialog handle={rowHandle} title="T" id="x" aria-label="Rename" data-area="views" ref={ref}>
				Body
			</Dialog>,
		);
	});

	test('types the children function after the payload of the handle', () => {
		assertType(
			<Dialog handle={rowHandle} title="T">
				{(row) => {
					expectTypeOf(row).toEqualTypeOf<Row>();

					return row.name;
				}}
			</Dialog>,
		);
		assertType(
			<Dialog handle={rowHandle} title="T">
				{(row: Row) => {
					expectTypeOf(row).toEqualTypeOf<Row>();

					return row.name;
				}}
			</Dialog>,
		);
	});

	test('accepts children as a function for a handle without a payload', () => {
		assertType(
			<Dialog handle={plainHandle} title="T">
				{() => 'Body'}
			</Dialog>,
		);
	});

	test('accepts a handle whose payload is unknown or any', () => {
		assertType(
			<Dialog handle={unknownHandle} title="T">
				Body
			</Dialog>,
		);
		assertType(
			<Dialog handle={anyHandle} title="T">
				Body
			</Dialog>,
		);
		assertType(
			<Dialog handle={unknownHandle} title="T" id="x" container={document.body} ref={ref}>
				<p>Body</p>
			</Dialog>,
		);
		assertType(
			<Dialog handle={anyHandle} title="T" id="x" container={document.body} ref={ref}>
				<p>Body</p>
			</Dialog>,
		);
	});

	test('accepts children as a function for a handle whose payload is unknown or any', () => {
		assertType(
			<Dialog handle={unknownHandle} title="T">
				{() => 'Body'}
			</Dialog>,
		);
		assertType(
			<Dialog handle={anyHandle} title="T">
				{() => 'Body'}
			</Dialog>,
		);
		assertType(
			<Dialog handle={unknownHandle} title="T">
				{(payload) => {
					expectTypeOf(payload).toBeUnknown();

					return String(payload);
				}}
			</Dialog>,
		);
		assertType(
			<Dialog handle={anyHandle} title="T">
				{(payload) => {
					expectTypeOf(payload).toBeAny();

					return String(payload);
				}}
			</Dialog>,
		);
	});

	test('accepts every other node as children with a handle', () => {
		assertType(
			<Dialog handle={rowHandle} title="T">
				{null}
			</Dialog>,
		);
		assertType(
			<Dialog handle={rowHandle} title="T">
				<p>Body</p>
			</Dialog>,
		);
	});

	test('rejects an onClose with a handle', () => {
		assertType(
			// @ts-expect-error - with a handle the dialog closes itself, so `onClose` is not passed
			<Dialog handle={rowHandle} title="T" onClose={noop}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - returning `false` no longer keeps it open, `onClose` is not passed
			<Dialog handle={rowHandle} title="T" onClose={() => false}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - returning `true` changes nothing, `onClose` is not passed
			<Dialog handle={rowHandle} title="T" onClose={() => true}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - an annotated reason is still an `onClose`
			<Dialog handle={rowHandle} title="T" onClose={(_reason: DialogCloseReasonType) => noop()}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - an `onClose` that cannot take every reason fails on its type first
			<Dialog handle={rowHandle} title="T" onClose={(_reason: 'escape-key') => noop()}>
				Body
			</Dialog>,
		);
	});

	test('rejects an onClose that does not annotate the reason with a handle', () => {
		assertType(
			// @ts-expect-error - an unannotated `onClose` with a handle on a payload
			<Dialog handle={rowHandle} title="T" onClose={(reason) => reason !== 'outside-press'}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - an unannotated `onClose` with a handle without a payload
			<Dialog handle={plainHandle} title="T" onClose={(reason) => void reason}>
				{() => 'Body'}
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - an unannotated `onClose` next to a children function
			<Dialog handle={rowHandle} title="T" onClose={(reason) => void reason}>
				{(row: Row) => row.name}
			</Dialog>,
		);
	});

	test('infers the reason of an onClose that does not annotate it with open', () => {
		assertType(
			<Dialog
				open
				title="T"
				onClose={(reason) => {
					expectTypeOf(reason).toEqualTypeOf<DialogCloseReasonType>();
				}}
			>
				Body
			</Dialog>,
		);
	});

	test('rejects an onClose with a handle whose payload is unknown or any', () => {
		assertType(
			// @ts-expect-error - a handle of `unknown` still closes the dialog itself, no `onClose`
			<Dialog handle={unknownHandle} title="T" onClose={noop}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - a handle of `any` still closes the dialog itself, no `onClose`
			<Dialog handle={anyHandle} title="T" onClose={noop}>
				Body
			</Dialog>,
		);
	});

	test('rejects open together with a handle', () => {
		assertType(
			// @ts-expect-error - `open` and `handle` both say whether it is shown: pass one
			<Dialog open handle={rowHandle} onClose={noop} title="T">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `open={false}` with a handle is still both
			<Dialog open={false} handle={plainHandle} title="T">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `open` and `handle` with an unannotated `onClose`
			<Dialog open handle={rowHandle} title="T" onClose={(reason) => void reason}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `open` and `handle` with an unannotated `onClose` and a children function
			<Dialog open handle={plainHandle} title="T" onClose={(reason) => void reason}>
				{() => 'Body'}
			</Dialog>,
		);
	});

	test('rejects open together with a handle whose payload is unknown or any', () => {
		assertType(
			// @ts-expect-error - `open` and a handle of `unknown` both say whether it is shown
			<Dialog open handle={unknownHandle} title="T">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `open` and a handle of `any` both say whether it is shown
			<Dialog open handle={anyHandle} title="T">
				Body
			</Dialog>,
		);
	});

	test('rejects a handle that is not a DialogHandle', () => {
		assertType(
			// @ts-expect-error - a PopupHandle shows a popover, not a dialog
			<Dialog handle={new PopupHandle<Row>()} title="T">
				Body
			</Dialog>,
		);
	});

	test('rejects children as a function with no handle', () => {
		assertType(
			// @ts-expect-error - a function of the payload needs the `handle` that opens it
			<Dialog open onClose={noop} title="T">
				{() => 'Body'}
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `Row` is not what the dialog passes without a handle
			<Dialog open onClose={noop} title="T" {...readsRow} />,
		);
	});

	test('rejects children as a function that does not take the payload of the handle', () => {
		assertType(
			// @ts-expect-error - the handle opens with a Row, not an Other
			<Dialog handle={rowHandle} title="T" {...readsOther} />,
		);
	});

	test('rejects the props that belong to a trigger, to uncontrolled state and to the layer with a handle', () => {
		assertType(
			// @ts-expect-error - a dialog has no uncontrolled mode, no `defaultOpen`
			<Dialog handle={rowHandle} title="T" defaultOpen>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - a dialog has no trigger
			<Dialog handle={rowHandle} title="T" trigger={<button type="button">Open</button>}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `onOpenChange` is on the hook, `useDialogHandle(onOpenChange)`
			<Dialog handle={rowHandle} title="T" onOpenChange={noop}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `getContainer` is `container`, and takes the element
			<Dialog handle={rowHandle} title="T" getContainer={() => document.body}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - the dialog owns its layer, no `zIndex`
			<Dialog handle={rowHandle} title="T" zIndex={1100}>
				Body
			</Dialog>,
		);
	});

	test('rejects what Dialog rejects with open, with a handle too', () => {
		assertType(
			// @ts-expect-error - `title` is required, it is the accessible name
			<Dialog handle={rowHandle}>Body</Dialog>,
		);
		assertType(
			// @ts-expect-error - `children` is required, it is the body
			<Dialog handle={rowHandle} title="T" />,
		);
		assertType(
			// @ts-expect-error - `subTitle` is `description`
			<Dialog handle={rowHandle} title="T" subTitle="Detail">
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `footer` is called `footerSuffix`, the pair of `footerPrefix`
			<Dialog handle={rowHandle} title="T" footer={<button type="button">Save</button>}>
				Body
			</Dialog>,
		);
		assertType(
			// @ts-expect-error - `destroyOnClose` is not a prop
			<Dialog handle={rowHandle} title="T" destroyOnClose>
				Body
			</Dialog>,
		);
	});
});
