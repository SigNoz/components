/**
 * Type-level tests for the props of {@link AlertDialog}. Run by
 * `vitest --typecheck` and by `pnpm type-check`. See `dropdown.types.test-d.tsx` for how the
 * cases are written.
 *
 * Every case that is refused names the rule it hits in its `@ts-expect-error`, and
 * `alert-dialog.types.messages.test.ts` snapshots the message the compiler prints for each.
 */
import { createRef, type ReactNode } from 'react';
import { assertType, describe, expectTypeOf, test } from 'vitest';
import { DialogHandle } from '../../dialog/dialog-handle.js';
import type { NoHandle } from '../../dialog/types.js';
import type { useDialogHandle } from '../../dialog/use-dialog-handle.js';
import { AlertDialog } from '../index.js';
import type { ValidateAlertDialogProps } from '../types.js';

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
const alert = {
	open: true,
	title: 'Delete this view?',
	color: 'danger',
	confirmText: 'Delete view',
	onConfirm: noop,
	onCancel: noop,
} as const;

const rowAlert = {
	handle: rowHandle,
	title: 'Delete this view?',
	color: 'danger',
	confirmText: 'Delete view',
	onConfirm: noop,
} as const;
const plainAlert = { ...rowAlert, handle: plainHandle } as const;
const unknownAlert = { ...rowAlert, handle: unknownHandle } as const;
const anyAlert = { ...rowAlert, handle: anyHandle } as const;

function withoutAlertProp<Key extends keyof typeof alert>(key: Key): Omit<typeof alert, Key> {
	const { [key]: _omitted, ...rest } = alert;

	return rest;
}

describe('AlertDialog props', () => {
	test('accepts the required props, a ref, id, aria-* and data-*', () => {
		assertType(
			<AlertDialog
				open
				title="Delete this view?"
				color="danger"
				confirmText="Delete view"
				onConfirm={noop}
				onCancel={noop}
				id="delete"
				aria-describedby="hint"
				data-area="views"
				ref={ref}
			>
				Body
			</AlertDialog>,
		);
	});

	test('accepts every optional prop', () => {
		assertType(
			<AlertDialog
				{...alert}
				titleIcon={icon}
				confirmIcon={icon}
				cancelText="Keep it"
				cancelIcon={icon}
				initialFocus={createRef<HTMLInputElement>()}
				finalFocus={createRef<HTMLDivElement>()}
				testId="delete"
			>
				<p>The consequence</p>
			</AlertDialog>,
		);
	});

	test('accepts initialFocus and finalFocus as a boolean or a function', () => {
		assertType(
			<AlertDialog {...alert} initialFocus={false} finalFocus={() => true}>
				Body
			</AlertDialog>,
		);
	});

	test('accepts both colors', () => {
		assertType(
			<AlertDialog {...alert} color="primary">
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...alert} color="danger">
				Body
			</AlertDialog>,
		);
	});

	test('accepts an onConfirm that returns nothing or a promise of nothing', () => {
		assertType(
			<AlertDialog {...alert} onConfirm={() => {}}>
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...alert} onConfirm={async () => {}}>
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...alert} onConfirm={() => Promise.resolve()}>
				Body
			</AlertDialog>,
		);
	});

	test('accepts an onConfirm that answers a boolean or a promise of one', () => {
		assertType(
			<AlertDialog {...alert} onConfirm={() => false}>
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...alert} onConfirm={async () => true}>
				Body
			</AlertDialog>,
		);
	});
});

describe('AlertDialog required props', () => {
	test('rejects an alert with neither open nor a handle', () => {
		assertType(
			// @ts-expect-error - nothing says whether it is shown: pass `open` or a `handle`
			<AlertDialog {...withoutAlertProp('open')}>Body</AlertDialog>,
		);
	});

	test('rejects an alert with no title', () => {
		assertType(
			// @ts-expect-error - `title` is required, it is the question
			<AlertDialog {...withoutAlertProp('title')}>Body</AlertDialog>,
		);
	});

	test('rejects an alert with no color', () => {
		assertType(
			// @ts-expect-error - `color` is required, it is the intent of the confirm button
			<AlertDialog {...withoutAlertProp('color')}>Body</AlertDialog>,
		);
	});

	test('rejects an alert with no confirmText', () => {
		assertType(
			// @ts-expect-error - `confirmText` is required, it names the action
			<AlertDialog {...withoutAlertProp('confirmText')}>Body</AlertDialog>,
		);
	});

	test('rejects an alert with no onConfirm', () => {
		assertType(
			// @ts-expect-error - `onConfirm` is required, it runs the action
			<AlertDialog {...withoutAlertProp('onConfirm')}>Body</AlertDialog>,
		);
	});

	test('rejects an alert with open and no onCancel', () => {
		assertType(
			// @ts-expect-error - with `open`, `onCancel` is required: the alert never closes itself
			<AlertDialog {...withoutAlertProp('onCancel')}>Body</AlertDialog>,
		);
	});

	test('rejects an alert with no children', () => {
		assertType(
			// @ts-expect-error - `children` is required, it states the consequence
			<AlertDialog {...alert} />,
		);
	});
});

describe('AlertDialog value types', () => {
	test('rejects a color that is not an intent', () => {
		assertType(
			// @ts-expect-error - `color` is primary or danger
			<AlertDialog {...alert} color="secondary">
				Body
			</AlertDialog>,
		);
	});

	test('rejects an onConfirm that resolves to a value other than a boolean', () => {
		assertType(
			// @ts-expect-error - `onConfirm` answers nothing or a boolean, not a string
			<AlertDialog {...alert} onConfirm={async () => 'deleted'}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `onConfirm` answers nothing or a boolean, not a number
			<AlertDialog {...alert} onConfirm={() => 1}>
				Body
			</AlertDialog>,
		);
	});

	test('rejects icons that are not elements', () => {
		assertType(
			// @ts-expect-error - `confirmIcon` is an element
			<AlertDialog {...alert} confirmIcon="trash">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `cancelIcon` is an element
			<AlertDialog {...alert} cancelIcon="x">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `titleIcon` is an element
			<AlertDialog {...alert} titleIcon="info">
				Body
			</AlertDialog>,
		);
	});

	test('rejects an onCancel that takes an argument', () => {
		assertType(
			// @ts-expect-error - `onCancel` is called with nothing
			<AlertDialog {...alert} onCancel={(_reason: string) => noop()}>
				Body
			</AlertDialog>,
		);
	});
});

describe('AlertDialog rejected props', () => {
	test('rejects the props that belong to a trigger, to uncontrolled state and to the layer', () => {
		assertType(
			// @ts-expect-error - a `data-testid` is written as `testId`
			<AlertDialog {...alert} data-testid="x">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - a dialog has no trigger
			<AlertDialog {...alert} trigger={<button type="button">Open</button>}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - a dialog has no uncontrolled mode, no `defaultOpen`
			<AlertDialog {...alert} defaultOpen>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `onOpenChange` is `onCancel` and `onConfirm`
			<AlertDialog {...alert} onOpenChange={noop}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the backdrop is always there, no `showOverlay`
			<AlertDialog {...alert} showOverlay>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - a dialog is always modal, no `modal`
			<AlertDialog {...alert} modal={false}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the dialog owns its layer, no `zIndex`
			<AlertDialog {...alert} zIndex={1100}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `getContainer` is `container`, and takes the element
			<AlertDialog {...alert} getContainer={() => document.body}>
				Body
			</AlertDialog>,
		);
	});

	test('rejects the props that AlertDialog does not take', () => {
		assertType(
			// @ts-expect-error - an alert has one width, no `width`
			<AlertDialog {...alert} width="wide">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the footer of an alert is fixed, no `footer`
			<AlertDialog {...alert} footer={<button type="button">Save</button>}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the footer of an alert is fixed, no `footerPrefix`
			<AlertDialog {...alert} footerPrefix={<button type="button">Delete</button>}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the footer of an alert is fixed, no `footerSuffix`
			<AlertDialog {...alert} footerSuffix={<button type="button">Save</button>}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - loading comes from `onConfirm`, no `loading`
			<AlertDialog {...alert} loading>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - loading comes from `onConfirm`, no `confirmLoading`
			<AlertDialog {...alert} confirmLoading>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - an alert is answered with `onCancel`, no `onClose`
			<AlertDialog {...alert} onClose={noop}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - an alert has no close button, no `showCloseButton`
			<AlertDialog {...alert} showCloseButton>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the backdrop never closes an alert, no `disableOutsideClick`
			<AlertDialog {...alert} disableOutsideClick>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the body carries the detail, no `subTitle`
			<AlertDialog {...alert} subTitle="Detail">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the body carries the detail, no `description`
			<AlertDialog {...alert} description="Detail">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the consumer renders the checkbox, no `checkboxLabel`
			<AlertDialog {...alert} checkboxLabel="Do not ask again">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the consumer renders the checkbox, no `checkboxChecked`
			<AlertDialog {...alert} checkboxChecked>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the consumer renders the checkbox, no `onCheckboxChange`
			<AlertDialog {...alert} onCheckboxChange={noop}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the consumer renders the checkbox, no `checkboxColor`
			<AlertDialog {...alert} checkboxColor="danger">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `AlertDialog` takes no `className`
			<AlertDialog {...alert} className="x">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `AlertDialog` takes no `style`
			<AlertDialog {...alert} style={{}}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the panel is centered, no `position`
			<AlertDialog {...alert} position="left">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - answer with `onConfirm`, no `onOk`
			<AlertDialog {...alert} onOk={noop}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - name the action with `confirmText`, no `okText`
			<AlertDialog {...alert} okText="Delete">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - an alert has no close button, no `closable`
			<AlertDialog {...alert} closable={false}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - an alert is answered with `onCancel`, no `keyboard`
			<AlertDialog {...alert} keyboard={false}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - the backdrop never closes an alert, no `maskClosable`
			<AlertDialog {...alert} maskClosable={false}>
				Body
			</AlertDialog>,
		);
	});
});

describe('AlertDialog footer rules', () => {
	const FOOTER_RULE = 'the footer of `AlertDialog` is always the cancel and confirm buttons';

	test('applies the fixed footer rule of AlertDialog to footer, footerPrefix and footerSuffix', () => {
		expectTypeOf<ValidateAlertDialogProps<{ footer: ReactNode }>>().toHaveProperty(FOOTER_RULE);
		expectTypeOf<ValidateAlertDialogProps<{ footerPrefix: ReactNode }>>().toHaveProperty(
			FOOTER_RULE,
		);
		expectTypeOf<ValidateAlertDialogProps<{ footerSuffix: ReactNode }>>().toHaveProperty(
			FOOTER_RULE,
		);
		expectTypeOf<ValidateAlertDialogProps<{ title: string }>>().not.toHaveProperty(FOOTER_RULE);
	});
});

describe('AlertDialog handle rule', () => {
	const NEEDS_OPEN_OR_HANDLE =
		'a dialog is shown by `open` or by `handle.open(...)`: pass one of them';
	const NOT_BOTH = '`open` and `handle` both say whether the dialog is shown: pass one of them';

	test('asks for open or a handle by default, and for no handle', () => {
		expectTypeOf<ValidateAlertDialogProps<{ title: string }>>().toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateAlertDialogProps<{ title: string }, NoHandle>>().toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<
			ValidateAlertDialogProps<{ open: true; onCancel: () => void }>
		>().not.toHaveProperty(NEEDS_OPEN_OR_HANDLE);
	});

	test('takes any other payload, unknown and any included, as a handle', () => {
		expectTypeOf<ValidateAlertDialogProps<{ title: string }, unknown>>().not.toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateAlertDialogProps<{ title: string }, any>>().not.toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateAlertDialogProps<{ title: string }, Row>>().not.toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateAlertDialogProps<{ open: true }, unknown>>().toHaveProperty(NOT_BOTH);
		expectTypeOf<ValidateAlertDialogProps<{ open: true }, any>>().toHaveProperty(NOT_BOTH);
	});
});

describe('AlertDialog container', () => {
	test('accepts an element, a ref to one, or null', () => {
		assertType(
			<AlertDialog {...alert} container={document.body}>
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...alert} container={createRef<HTMLDivElement>()}>
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...alert} container={null}>
				Body
			</AlertDialog>,
		);
	});

	test('accepts a container with a handle', () => {
		assertType(
			<AlertDialog {...rowAlert} container={document.body}>
				Body
			</AlertDialog>,
		);
	});

	test('rejects a container that is not an element or a ref', () => {
		assertType(
			// @ts-expect-error - `container` takes the element, not a selector
			<AlertDialog {...alert} container="#root">
				Body
			</AlertDialog>,
		);
	});
});

describe('AlertDialog handle', () => {
	test('accepts a handle in place of open, with no onCancel', () => {
		assertType(<AlertDialog {...rowAlert}>Body</AlertDialog>);
		assertType(<AlertDialog {...plainAlert}>Body</AlertDialog>);
	});

	test('accepts a handle with a ref, id, aria-* and data-*', () => {
		assertType(
			<AlertDialog {...rowAlert} id="delete" aria-label="Delete" data-area="views" ref={ref}>
				Body
			</AlertDialog>,
		);
	});

	test('types the onConfirm and the children function after the payload of the handle', () => {
		assertType(
			<AlertDialog
				{...rowAlert}
				onConfirm={(row) => {
					expectTypeOf(row).toEqualTypeOf<Row>();
				}}
			>
				{(row) => {
					expectTypeOf(row).toEqualTypeOf<Row>();

					return row.name;
				}}
			</AlertDialog>,
		);
		assertType(
			<AlertDialog
				{...rowAlert}
				onConfirm={(row) => {
					expectTypeOf(row).toEqualTypeOf<Row>();
				}}
			>
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...rowAlert}>
				{(row) => {
					expectTypeOf(row).toEqualTypeOf<Row>();

					return row.name;
				}}
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...rowAlert} onConfirm={async (row: Row) => void row.name}>
				{(row: Row) => row.name}
			</AlertDialog>,
		);
	});

	test('accepts an onConfirm that returns nothing or a promise of nothing with a handle', () => {
		assertType(
			<AlertDialog {...rowAlert} onConfirm={() => {}}>
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...rowAlert} onConfirm={() => Promise.resolve()}>
				Body
			</AlertDialog>,
		);
	});

	test('accepts an onConfirm that answers false to keep the alert open with a handle', () => {
		assertType(
			<AlertDialog {...rowAlert} onConfirm={(row) => row.name === ''}>
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog
				{...rowAlert}
				onConfirm={async (row) => {
					if (row.name === '') {
						return false;
					}
					return undefined;
				}}
			>
				Body
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...rowAlert} onConfirm={async (row: Row) => row.name !== ''}>
				Body
			</AlertDialog>,
		);
	});

	test('accepts children as a function for a handle without a payload', () => {
		assertType(<AlertDialog {...plainAlert}>{() => 'Body'}</AlertDialog>);
	});

	test('accepts a handle whose payload is unknown or any', () => {
		assertType(<AlertDialog {...unknownAlert}>Body</AlertDialog>);
		assertType(<AlertDialog {...anyAlert}>Body</AlertDialog>);
		assertType(
			<AlertDialog {...unknownAlert} id="delete" container={document.body} ref={ref}>
				<p>Body</p>
			</AlertDialog>,
		);
		assertType(
			<AlertDialog {...anyAlert} id="delete" container={document.body} ref={ref}>
				<p>Body</p>
			</AlertDialog>,
		);
	});

	test('accepts children as a function for a handle whose payload is unknown or any', () => {
		assertType(<AlertDialog {...unknownAlert}>{() => 'Body'}</AlertDialog>);
		assertType(<AlertDialog {...anyAlert}>{() => 'Body'}</AlertDialog>);
		assertType(
			<AlertDialog
				{...unknownAlert}
				onConfirm={(payload) => {
					expectTypeOf(payload).toBeUnknown();
				}}
			>
				{(payload) => {
					expectTypeOf(payload).toBeUnknown();

					return String(payload);
				}}
			</AlertDialog>,
		);
		assertType(
			<AlertDialog
				{...anyAlert}
				onConfirm={(payload) => {
					expectTypeOf(payload).toBeAny();
				}}
			>
				{(payload) => {
					expectTypeOf(payload).toBeAny();

					return String(payload);
				}}
			</AlertDialog>,
		);
	});

	test('rejects open together with a handle', () => {
		assertType(
			// @ts-expect-error - `open` and `handle` both say whether it is shown: pass one
			<AlertDialog {...alert} handle={rowHandle}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `open` and `handle` with an unannotated `onConfirm`
			<AlertDialog {...alert} handle={rowHandle} onConfirm={(row) => void row.name}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `open` and `handle` with an `onCancel` and an unannotated `onConfirm`
			<AlertDialog
				{...alert}
				handle={rowHandle}
				onCancel={() => noop()}
				onConfirm={(row) => void row}
			>
				Body
			</AlertDialog>,
		);
	});

	test('rejects open together with a handle whose payload is unknown or any', () => {
		assertType(
			// @ts-expect-error - `open` and a handle of `unknown` both say whether it is shown
			<AlertDialog {...alert} handle={unknownHandle}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `open` and a handle of `any` both say whether it is shown
			<AlertDialog {...alert} handle={anyHandle}>
				Body
			</AlertDialog>,
		);
	});

	test('rejects children as a function with no handle', () => {
		assertType(
			// @ts-expect-error - a function of the payload needs the `handle` that opens it
			<AlertDialog {...alert}>{() => 'Body'}</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - a function that reads a `Row` needs the `handle` that opens it too
			<AlertDialog {...alert}>{(row: Row) => row.name}</AlertDialog>,
		);
	});

	test('rejects an onConfirm that reads a payload with no handle', () => {
		assertType(
			// @ts-expect-error - with `open` there is no payload to read
			<AlertDialog {...alert} onConfirm={(_row: Row) => noop()}>
				Body
			</AlertDialog>,
		);
	});

	test('rejects an onConfirm that does not take the payload of the handle', () => {
		assertType(
			// @ts-expect-error - the handle opens with a Row, not an Other
			<AlertDialog {...rowAlert} onConfirm={(_other: Other) => noop()}>
				Body
			</AlertDialog>,
		);
	});

	test('rejects children as a function that does not take the payload of the handle', () => {
		assertType(
			// @ts-expect-error - the handle opens with a Row, not an Other
			<AlertDialog {...rowAlert}>{(other: Other) => other.id}</AlertDialog>,
		);
	});

	test('rejects an onConfirm that resolves to a value other than a boolean with a handle', () => {
		assertType(
			// @ts-expect-error - only `false` keeps the alert open, a string is not an answer
			<AlertDialog {...rowAlert} onConfirm={async () => 'deleted'}>
				Body
			</AlertDialog>,
		);
	});

	test('rejects an onCancel with a handle', () => {
		assertType(
			// @ts-expect-error - with a handle the alert closes itself on cancel, so `onCancel` is not passed
			<AlertDialog {...rowAlert} onCancel={noop}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - an arrow function is still an `onCancel`
			<AlertDialog {...rowAlert} onCancel={() => noop()}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - a handle without a payload closes itself on cancel too
			<AlertDialog {...plainAlert} onCancel={noop}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - an `onCancel` that takes an argument fails on its type first
			<AlertDialog {...rowAlert} onCancel={(_reason: string) => noop()}>
				Body
			</AlertDialog>,
		);
	});

	test('rejects an onCancel with a handle whose payload is unknown or any', () => {
		assertType(
			// @ts-expect-error - a handle of `unknown` still closes the alert itself on cancel
			<AlertDialog {...unknownAlert} onCancel={noop}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - a handle of `any` still closes the alert itself on cancel
			<AlertDialog {...anyAlert} onCancel={noop}>
				Body
			</AlertDialog>,
		);
	});

	test('rejects an onCancel next to a callback that does not annotate the payload', () => {
		assertType(
			// @ts-expect-error - an `onCancel` with an unannotated `onConfirm`
			<AlertDialog {...rowAlert} onCancel={noop} onConfirm={(row) => void row.name}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - an `onCancel` with an unannotated children function
			<AlertDialog {...rowAlert} onCancel={noop}>
				{(row) => row.name}
			</AlertDialog>,
		);
	});

	test('rejects the props that AlertDialog does not take with a handle', () => {
		assertType(
			// @ts-expect-error - an alert is answered with `onCancel`, no `onClose`
			<AlertDialog {...rowAlert} onClose={noop}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - an alert has one width, no `width`
			<AlertDialog {...rowAlert} width="wide">
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - a dialog has no uncontrolled mode, no `defaultOpen`
			<AlertDialog {...rowAlert} defaultOpen>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `getContainer` is `container`, and takes the element
			<AlertDialog {...rowAlert} getContainer={() => document.body}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `onOpenChange` is on the hook, `useDialogHandle(onOpenChange)`
			<AlertDialog {...rowAlert} onOpenChange={noop}>
				Body
			</AlertDialog>,
		);
		assertType(
			// @ts-expect-error - `AlertDialog` takes no `className`
			<AlertDialog {...rowAlert} className="x">
				Body
			</AlertDialog>,
		);
	});
});
