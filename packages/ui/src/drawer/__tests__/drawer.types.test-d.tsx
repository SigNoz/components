/**
 * Type-level tests for the props of {@link Drawer}. Run by
 * `vitest --typecheck` and by `pnpm type-check`. See `dropdown.types.test-d.tsx` for how the
 * cases are written.
 *
 * Every case that is refused names the rule it hits in its `@ts-expect-error`, and
 * `drawer.types.messages.test.ts` snapshots the message the compiler prints for each.
 */
import { createRef, type ReactElement, type ReactNode } from 'react';
import { assertType, describe, expectTypeOf, test } from 'vitest';
import { DialogHandle } from '../../dialog/dialog-handle.js';
import type { DialogCloseReasonType, NoHandle } from '../../dialog/types.js';
import { PopupHandle } from '../../lib/popup-handle.js';
import { Drawer } from '../drawer.js';
import type {
	DrawerCloseReasonType,
	DrawerHandleType,
	DrawerProps,
	DrawerStackType,
	DrawerTypeType,
	DrawerWidthType,
	ValidateDrawerProps,
} from '../types.js';
import type { useDrawerHandle } from '../use-drawer-handle.js';

interface Row {
	name: string;
}

interface Other {
	id: number;
}

type Task = { type: 'task'; open: true; onClose: () => void; title: string };
type Inspector = { type: 'inspector'; open: true; onClose: () => void; title: string };

const noop = () => {};
const ref = createRef<HTMLDivElement>();
const icon = <svg />;
const button = <button type="button">Save</button>;
const rowHandle: DrawerHandleType<Row> = new DialogHandle<Row>();
const plainHandle: DrawerHandleType = new DialogHandle();
const unknownHandle: ReturnType<typeof useDrawerHandle<unknown>> = new DialogHandle<unknown>();
const anyHandle: ReturnType<typeof useDrawerHandle<any>> = new DialogHandle<any>();
const neverHandle: ReturnType<typeof useDrawerHandle<never>> = new DialogHandle<never>();
const maybeRowHandle: ReturnType<typeof useDrawerHandle<Row | undefined>> = new DialogHandle<
	Row | undefined
>();
const readsRow = { children: (row: Row) => row.name };
const readsOther = { children: (other: Other) => other.id };
const runtimeType = 'inspector' as DrawerTypeType;
const runtimeStack = 'breadcrumb' as DrawerStackType;

describe('Drawer props', () => {
	test('accepts the required props, a ref, id, aria-* and data-*', () => {
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={noop}
				title="Edit member"
				id="edit-member"
				aria-describedby="hint"
				data-area="members"
				ref={ref}
			>
				Body
			</Drawer>,
		);
		assertType(
			<Drawer
				type="inspector"
				stack="overlay"
				open
				onClose={noop}
				title="checkout-7d9f"
				id="pod"
				aria-describedby="hint"
				data-area="pods"
				ref={ref}
			>
				Body
			</Drawer>,
		);
	});

	test('types a callback ref after the panel', () => {
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={noop}
				title="T"
				ref={(node) => {
					expectTypeOf(node).toEqualTypeOf<HTMLDivElement | null>();
				}}
			>
				Body
			</Drawer>,
		);
	});

	test('accepts every slot of a task', () => {
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				open={false}
				onClose={(reason) => {
					if (reason === 'outside-press') {
						return;
					}
				}}
				title=""
				headerPrefix={<button type="button" aria-label="Back" />}
				titlePrefix={icon}
				titleSuffix={<button type="button" aria-label="Copy name" />}
				headerSuffix={<button type="button" aria-label="More" />}
				description={<span>Detail</span>}
				footerPrefix={<button type="button">Delete member</button>}
				footerSuffix={<button type="button">Save</button>}
				initialFocus={createRef<HTMLInputElement>()}
				finalFocus={createRef<HTMLButtonElement>()}
				loading={false}
				loadingContent={<p>Loading</p>}
				width="wide"
				testId="edit-member"
			>
				{null}
			</Drawer>,
		);
	});

	test('accepts every header slot of an inspector', () => {
		assertType(
			<Drawer
				type="inspector"
				stack="overlay"
				open
				onClose={noop}
				title="checkout-7d9f"
				headerPrefix={<button type="button" aria-label="Previous" />}
				titlePrefix={icon}
				titleSuffix={<button type="button" aria-label="Copy name" />}
				headerSuffix={<button type="button" aria-label="More" />}
				initialFocus={false}
				finalFocus={() => true}
				loading
				loadingContent={<p>Loading</p>}
				width="extra-wide"
				testId="pod"
			>
				<p>Body</p>
			</Drawer>,
		);
	});

	test('accepts every width name', () => {
		expectTypeOf<DrawerWidthType>().toEqualTypeOf<
			'narrow' | 'base' | 'wide' | 'extra-wide' | 'entity'
		>();
		assertType(
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T" width="narrow">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T" width="base">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T" width="wide">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T" width="extra-wide">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T" width="entity">
				Body
			</Drawer>,
		);
	});

	test('accepts an onClose that reads the reason', () => {
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={(
					_reason: 'escape-key' | 'outside-press' | 'close-press' | 'swipe' | 'crumb-press',
				) => noop()}
				title="T"
			>
				Body
			</Drawer>,
		);
	});

	test('accepts every stack name', () => {
		expectTypeOf<DrawerStackType>().toEqualTypeOf<'overlay' | 'breadcrumb'>();
		assertType(
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="breadcrumb" open onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});

	test('accepts a stack known only at runtime', () => {
		assertType(
			<Drawer type="inspector" stack={runtimeStack} open onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});

	test('accepts a crumb with a title and an icon', () => {
		assertType(
			<Drawer
				type="inspector"
				stack="breadcrumb"
				crumb={{ title: 'payments', icon: <svg /> }}
				open
				onClose={noop}
				title="Pod details"
			>
				Body
			</Drawer>,
		);
	});

	test('accepts a crumb with an icon alone', () => {
		assertType(
			<Drawer
				type="inspector"
				stack="breadcrumb"
				crumb={{ icon: <svg /> }}
				open
				onClose={noop}
				title="Pod details"
			>
				Body
			</Drawer>,
		);
	});
});

describe('Drawer controlled trail', () => {
	test('accepts a trail with onTrailSelect, the reason typed', () => {
		assertType(
			<Drawer
				type="inspector"
				stack="breadcrumb"
				trail={[{ title: 'cluster', icon, href: '/c', preview: 'Cluster' }]}
				onTrailSelect={(index, reason) => {
					expectTypeOf(index).toEqualTypeOf<number>();
					expectTypeOf(reason).toEqualTypeOf<'crumb-press' | 'escape-key'>();
				}}
				open
				onClose={noop}
				title="Node"
			>
				Body
			</Drawer>,
		);
	});

	test('rejects a step with no title', () => {
		assertType(
			<Drawer
				type="inspector"
				stack="breadcrumb"
				// @ts-expect-error - a step of `trail` names its own `title`
				trail={[{ icon }]}
				onTrailSelect={noop}
				open
				onClose={noop}
				title="Node"
			>
				Body
			</Drawer>,
		);
	});

	test('rejects a trail with no onTrailSelect', () => {
		assertType(
			// @ts-expect-error - a press on an earlier step of `trail` asks you to show it
			<Drawer
				type="inspector"
				stack="breadcrumb"
				trail={[{ title: 'cluster' }]}
				open
				onClose={noop}
				title="Node"
			>
				Body
			</Drawer>,
		);
	});

	test('rejects onTrailSelect with no trail', () => {
		assertType(
			// @ts-expect-error - `onTrailSelect` reports a press on a step of `trail`
			<Drawer
				type="inspector"
				stack="breadcrumb"
				onTrailSelect={noop}
				open
				onClose={noop}
				title="Node"
			>
				Body
			</Drawer>,
		);
	});
});

describe('Drawer required props', () => {
	test('rejects a drawer with no type', () => {
		assertType(
			// @ts-expect-error - every drawer names its `type`
			<Drawer stack="overlay" open onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects a drawer with no stack', () => {
		assertType(
			// @ts-expect-error - every drawer names its `stack`
			<Drawer type="task" open onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects a stack that is not overlay or breadcrumb', () => {
		assertType(
			// @ts-expect-error - `stack` is `overlay` or `breadcrumb`
			<Drawer type="task" stack="stacked" open onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects a type that may be undefined', () => {
		const maybeType = undefined as DrawerTypeType | undefined;

		assertType(
			// @ts-expect-error - `type` is never left to chance, not even `undefined`
			<Drawer type={undefined} stack="overlay" open onClose={noop} title="T">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - a type that may be missing is a missing type
			<Drawer type={maybeType} stack="overlay" open onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects a wrapper typed with DrawerProps that leaves the type out', () => {
		function Wrapper(props: DrawerProps): ReactElement {
			return <Drawer {...props} />;
		}

		assertType(
			// @ts-expect-error - a wrapper that spreads `DrawerProps` asks for a `type` too
			<Wrapper stack="overlay" open onClose={noop} title="T">
				Body
			</Wrapper>,
		);
	});

	test('rejects a stack that may be undefined', () => {
		const maybeStack = undefined as DrawerStackType | undefined;

		assertType(
			// @ts-expect-error - `stack` is never left to chance, not even `undefined`
			<Drawer type="task" stack={undefined} open onClose={noop} title="T">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - a stack that may be missing is a missing stack
			<Drawer type="task" stack={maybeStack} open onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects a wrapper typed with DrawerProps that leaves the stack out', () => {
		function Wrapper(props: DrawerProps): ReactElement {
			return <Drawer {...props} />;
		}

		assertType(
			// @ts-expect-error - a wrapper that spreads `DrawerProps` asks for a `stack` too
			<Wrapper type="task" open onClose={noop} title="T">
				Body
			</Wrapper>,
		);
	});

	test('rejects a drawer with neither open nor a handle', () => {
		assertType(
			// @ts-expect-error - nothing says whether it is shown: pass `open` or a `handle`
			<Drawer type="task" stack="overlay" onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects a drawer with open and no onClose', () => {
		assertType(
			// @ts-expect-error - with `open`, `onClose` is required: the drawer never closes itself
			<Drawer type="inspector" stack="overlay" open title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects a drawer with no title', () => {
		assertType(
			// @ts-expect-error - `title` is required, it is the accessible name
			<Drawer type="task" stack="overlay" open onClose={noop}>
				Body
			</Drawer>,
		);
	});

	test('rejects a drawer with no children', () => {
		assertType(
			// @ts-expect-error - `children` is required, it is the body
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" />,
		);
	});
});

describe('Drawer type rules', () => {
	test('accepts a description, a footerPrefix and a footerSuffix on a task', () => {
		assertType(
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" description="Detail">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" footerSuffix={button}>
				Body
			</Drawer>,
		);
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={noop}
				title="T"
				footerPrefix="2 unsaved changes"
			>
				Body
			</Drawer>,
		);
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				handle={rowHandle}
				title="T"
				description="Detail"
				footerPrefix={null}
				footerSuffix={<button type="button">Save</button>}
			>
				Body
			</Drawer>,
		);
	});

	test('accepts the task slots when the type is only known at runtime', () => {
		assertType(
			<Drawer
				type={runtimeType}
				stack="overlay"
				open
				onClose={noop}
				title="T"
				description="Detail"
				footerSuffix={<button type="button">Save</button>}
			>
				Body
			</Drawer>,
		);
	});

	test('rejects a footer on an inspector', () => {
		assertType(
			// @ts-expect-error - an `inspector` has no footer, no `footerSuffix`
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T" footerSuffix="Save">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - an `inspector` has no footer, no `footerPrefix`
			<Drawer
				type="inspector"
				stack="overlay"
				open
				onClose={noop}
				title="T"
				footerPrefix="2 unsaved changes"
			>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - an `inspector` has no footer, with both slots
			<Drawer
				type="inspector"
				stack="overlay"
				open
				onClose={noop}
				title="T"
				footerPrefix="x"
				footerSuffix="y"
			>
				Body
			</Drawer>,
		);
	});

	test('rejects a description on an inspector', () => {
		assertType(
			// @ts-expect-error - an `inspector` has no `description`
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T" description="Detail">
				Body
			</Drawer>,
		);
	});

	test('rejects a description and a footer on an inspector together', () => {
		assertType(
			// @ts-expect-error - an `inspector` has no `description` and no footer
			<Drawer
				type="inspector"
				stack="overlay"
				open
				onClose={noop}
				title="T"
				description="x"
				footerSuffix="y"
			>
				Body
			</Drawer>,
		);
	});
});

describe('Drawer value types', () => {
	test('rejects a type that is not inspector or task', () => {
		assertType(
			// @ts-expect-error - `type` is `inspector` or `task`
			<Drawer type="modal" stack="overlay" open onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects a width that is not a name', () => {
		assertType(
			// @ts-expect-error - `full` is a Dialog width, a drawer has none
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" width="full">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `width` takes a name, not a percentage
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" width="50%">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `width` takes a name, not a number
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" width={600}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `width` takes a name, not a pixel size
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" width="600px">
				Body
			</Drawer>,
		);
	});

	test('rejects a title that is not a string', () => {
		assertType(
			// @ts-expect-error - `title` is the accessible name, a string
			<Drawer type="task" stack="overlay" open onClose={noop} title={<b>Edit member</b>}>
				Body
			</Drawer>,
		);
	});

	test('rejects an onClose that cannot take every reason', () => {
		const readsEscape = (_reason: 'escape-key') => noop();
		const readsDialogReasons = (_reason: DialogCloseReasonType) => noop();

		assertType(
			// @ts-expect-error - `onClose` is called with five reasons
			<Drawer type="task" stack="overlay" open onClose={readsEscape} title="T">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the reasons of a Dialog miss `swipe` and `crumb-press`
			<Drawer type="task" stack="overlay" open onClose={readsDialogReasons} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects an open that is not a boolean', () => {
		assertType(
			// @ts-expect-error - `open` is a boolean
			<Drawer type="task" stack="overlay" open="yes" onClose={noop} title="T">
				Body
			</Drawer>,
		);
	});
});

describe('Drawer rejected props', () => {
	test('rejects the props that belong to a trigger, to uncontrolled state and to the layer', () => {
		assertType(
			// @ts-expect-error - a `data-testid` is written as `testId`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" data-testid="x">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - a drawer has no trigger
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" trigger={button}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - a drawer has no uncontrolled mode, no `defaultOpen`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" defaultOpen>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `onOpenChange` is `onClose`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" onOpenChange={noop}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the `type` sets the backdrop, no `showOverlay`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" showOverlay>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the `type` sets whether it is modal, no `modal`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" modal={false}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer owns its layer, no `zIndex`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" zIndex={1100}>
				Body
			</Drawer>,
		);
		const getBody = () => document.body;

		assertType(
			// @ts-expect-error - `getContainer` is `container`, and takes the element
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" getContainer={getBody}>
				Body
			</Drawer>,
		);
	});

	test('rejects the props of DrawerWrapper and of antd Drawer that have a replacement', () => {
		assertType(
			// @ts-expect-error - `subTitle` is `description`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" subTitle="Detail">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `footer` is called `footerSuffix`, the pair of `footerPrefix`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" footer={button}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the close button is always there, no `showCloseButton`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" showCloseButton={false}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the close button is always there, no `closable`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" closable={false}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the close button is fixed, no `closeIcon`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" closeIcon={icon}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - ignore the `outside-press` reason, no `disableOutsideClick`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" disableOutsideClick>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - ignore the `outside-press` reason, no `maskClosable`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" maskClosable={false}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the `type` sets the backdrop, no `mask`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" mask={false}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - ignore the `escape-key` reason, no `keyboard`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" keyboard={false}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer opens from the right, no `direction`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" direction="left">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer opens from the right, no `placement`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" placement="left">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer has one animation, no `animation`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" animation="fade">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer is inset by the viewport, no `offset`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" offset={8}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer is always full height, no `heightMode`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" heightMode="auto">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - a nested drawer does not push its parent, no `push`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" push={false}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - antd `extra` is `headerSuffix`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" extra={button}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the content always unmounts on close, no `destroyOnClose`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" destroyOnClose>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the content only mounts while open, no `forceMount`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" forceMount>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `Drawer` takes no `className`, wrap the content in your own element
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" className="scope">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `Drawer` takes no `style`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" style={{}}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `Drawer` takes no `rootClassName`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" rootClassName="x">
				Body
			</Drawer>,
		);
	});

	test('rejects the part props of DrawerWrapper', () => {
		assertType(
			// @ts-expect-error - the drawer has no part props, no `drawerContentProps`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" drawerContentProps={{}}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer has no part props, no `drawerHeaderProps`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" drawerHeaderProps={{}}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer has no part props, no `drawerTitleProps`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" drawerTitleProps={{}}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer has no part props, no `drawerSubtitleProps`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" drawerSubtitleProps={{}}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer has no part props, no `drawerDescriptionProps`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" drawerDescriptionProps={{}}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer has no part props, no `drawerFooterProps`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" drawerFooterProps={{}}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - the drawer has no part props, no `closeButtonProps`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" closeButtonProps={{}}>
				Body
			</Drawer>,
		);
	});

	test('rejects a prop the drawer does not know', () => {
		assertType(
			// @ts-expect-error - not a prop, no `size`
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" size="large">
				Body
			</Drawer>,
		);
	});
});

describe('Drawer rules', () => {
	const NO_FOOTER =
		'an `inspector` has no footer: a footer means a job to submit, which is `type="task"`';
	const NO_DESCRIPTION =
		'an `inspector` has no `description`: the title names the record, and its facts go in the body';
	const SUBTITLE =
		'`subTitle` is called `description`: one line of guidance under the title of a `task`';
	const FOOTER = '`footer` is called `footerSuffix`, the pair of `footerPrefix`';
	const CLOSE_BUTTON = 'a `Drawer` always renders its close button, last in the header';
	const OUTSIDE_PRESS =
		'a press on the backdrop of a `task` calls `onClose("outside-press")`: ignore that reason to keep the drawer open';
	const FROM_THE_RIGHT =
		'a drawer always opens from the right edge, with one animation: drop `direction`, `placement`, `push`, `animation`, `offset` and `heightMode`';
	const ESC = '`Esc` calls `onClose("escape-key")`: ignore that reason to keep the drawer open';
	const EXTRA = 'antd `extra` is called `headerSuffix`: the actions before the close button';
	const UNMOUNTS =
		'a closed drawer always unmounts its content: drop `destroyOnClose` and `forceMount`';
	const PART_PROPS =
		'the drawer has no part props: put content in `headerPrefix`, `titlePrefix`, `titleSuffix`, `headerSuffix`, `footerPrefix` or `footerSuffix`, and test it through `testId`';
	const CLASS_NAME =
		'`Drawer` takes no `className` or `style`: wrap your content in your own element, and reach the panel with a `data-*` attribute';
	const TEST_ID =
		'`data-testid` is written as the `testId` prop, which lands on the panel and names every part';
	const CONTROLLED =
		'a drawer has no trigger and no uncontrolled mode: pass `open`, or a `handle` from `useDrawerHandle()`';
	const ON_CLOSE =
		'a drawer only ever asks to close: use `onClose(reason)`, and ignore a reason to keep it open';
	const BACKDROP =
		'`type` sets the backdrop: a `task` is modal behind one, an `inspector` has none and leaves the page usable';
	const LAYER = 'a drawer stacks above the layer it opens from on its own: drop `zIndex`';
	const CONTAINER = '`getContainer` is called `container`, and takes the element, not a function';

	test('words the rules it shares with Dialog for a drawer', () => {
		expectTypeOf<ValidateDrawerProps<Task & { 'data-testid': string }>>().toHaveProperty(TEST_ID);
		expectTypeOf<ValidateDrawerProps<Task & { trigger: ReactNode }>>().toHaveProperty(CONTROLLED);
		expectTypeOf<ValidateDrawerProps<Task & { defaultOpen: true }>>().toHaveProperty(CONTROLLED);
		expectTypeOf<ValidateDrawerProps<Task & { onOpenChange: () => void }>>().toHaveProperty(
			ON_CLOSE,
		);
		expectTypeOf<ValidateDrawerProps<Task & { showOverlay: false }>>().toHaveProperty(BACKDROP);
		expectTypeOf<ValidateDrawerProps<Task & { modal: false }>>().toHaveProperty(BACKDROP);
		expectTypeOf<ValidateDrawerProps<Task & { zIndex: number }>>().toHaveProperty(LAYER);
		expectTypeOf<ValidateDrawerProps<Task & { getContainer: () => HTMLElement }>>().toHaveProperty(
			CONTAINER,
		);
	});

	test('resolves to unknown while the props are valid', () => {
		expectTypeOf<ValidateDrawerProps<Task>>().toEqualTypeOf<unknown>();
		expectTypeOf<ValidateDrawerProps<Inspector>>().toEqualTypeOf<unknown>();
		expectTypeOf<
			ValidateDrawerProps<
				Task & { description: ReactNode; footerPrefix: ReactNode; footerSuffix: ReactNode }
			>
		>().toEqualTypeOf<unknown>();
	});

	test('names the footer and the description in the rules of an inspector', () => {
		expectTypeOf<ValidateDrawerProps<Inspector & { footerSuffix: ReactNode }>>().toHaveProperty(
			NO_FOOTER,
		);
		expectTypeOf<ValidateDrawerProps<Inspector & { footerPrefix: ReactNode }>>().toHaveProperty(
			NO_FOOTER,
		);
		expectTypeOf<ValidateDrawerProps<Inspector & { description: ReactNode }>>().toHaveProperty(
			NO_DESCRIPTION,
		);
		expectTypeOf<ValidateDrawerProps<Task & { footerSuffix: ReactNode }>>().not.toHaveProperty(
			NO_FOOTER,
		);
		expectTypeOf<ValidateDrawerProps<Task & { description: ReactNode }>>().not.toHaveProperty(
			NO_DESCRIPTION,
		);
	});

	test('names the replacement of every prop of DrawerWrapper and of antd Drawer', () => {
		expectTypeOf<ValidateDrawerProps<Task & { subTitle: string }>>().toHaveProperty(SUBTITLE);
		expectTypeOf<ValidateDrawerProps<Task & { footer: ReactNode }>>().toHaveProperty(FOOTER);
		expectTypeOf<ValidateDrawerProps<Task & { showCloseButton: false }>>().toHaveProperty(
			CLOSE_BUTTON,
		);
		expectTypeOf<ValidateDrawerProps<Task & { closable: false }>>().toHaveProperty(CLOSE_BUTTON);
		expectTypeOf<ValidateDrawerProps<Task & { closeIcon: ReactNode }>>().toHaveProperty(
			CLOSE_BUTTON,
		);
		expectTypeOf<ValidateDrawerProps<Task & { disableOutsideClick: true }>>().toHaveProperty(
			OUTSIDE_PRESS,
		);
		expectTypeOf<ValidateDrawerProps<Task & { maskClosable: false }>>().toHaveProperty(
			OUTSIDE_PRESS,
		);
		expectTypeOf<ValidateDrawerProps<Task & { mask: false }>>().toHaveProperty(BACKDROP);
		expectTypeOf<ValidateDrawerProps<Task & { keyboard: false }>>().toHaveProperty(ESC);
		expectTypeOf<ValidateDrawerProps<Task & { direction: 'left' }>>().toHaveProperty(
			FROM_THE_RIGHT,
		);
		expectTypeOf<ValidateDrawerProps<Task & { placement: 'left' }>>().toHaveProperty(
			FROM_THE_RIGHT,
		);
		expectTypeOf<ValidateDrawerProps<Task & { animation: 'fade' }>>().toHaveProperty(
			FROM_THE_RIGHT,
		);
		expectTypeOf<ValidateDrawerProps<Task & { offset: 8 }>>().toHaveProperty(FROM_THE_RIGHT);
		expectTypeOf<ValidateDrawerProps<Task & { heightMode: 'auto' }>>().toHaveProperty(
			FROM_THE_RIGHT,
		);
		expectTypeOf<ValidateDrawerProps<Task & { push: false }>>().toHaveProperty(FROM_THE_RIGHT);
		expectTypeOf<ValidateDrawerProps<Task & { extra: ReactNode }>>().toHaveProperty(EXTRA);
		expectTypeOf<ValidateDrawerProps<Task & { destroyOnClose: true }>>().toHaveProperty(UNMOUNTS);
		expectTypeOf<ValidateDrawerProps<Task & { forceMount: true }>>().toHaveProperty(UNMOUNTS);
		expectTypeOf<ValidateDrawerProps<Task & { drawerContentProps: object }>>().toHaveProperty(
			PART_PROPS,
		);
		expectTypeOf<ValidateDrawerProps<Task & { drawerHeaderProps: object }>>().toHaveProperty(
			PART_PROPS,
		);
		expectTypeOf<ValidateDrawerProps<Task & { drawerTitleProps: object }>>().toHaveProperty(
			PART_PROPS,
		);
		expectTypeOf<ValidateDrawerProps<Task & { drawerSubtitleProps: object }>>().toHaveProperty(
			PART_PROPS,
		);
		expectTypeOf<ValidateDrawerProps<Task & { drawerDescriptionProps: object }>>().toHaveProperty(
			PART_PROPS,
		);
		expectTypeOf<ValidateDrawerProps<Task & { drawerFooterProps: object }>>().toHaveProperty(
			PART_PROPS,
		);
		expectTypeOf<ValidateDrawerProps<Task & { closeButtonProps: object }>>().toHaveProperty(
			PART_PROPS,
		);
		expectTypeOf<ValidateDrawerProps<Task & { className: string }>>().toHaveProperty(CLASS_NAME);
		expectTypeOf<ValidateDrawerProps<Task & { style: object }>>().toHaveProperty(CLASS_NAME);
		expectTypeOf<ValidateDrawerProps<Task & { rootClassName: string }>>().toHaveProperty(
			CLASS_NAME,
		);
	});
});

describe('Drawer handle rule', () => {
	const NEEDS_OPEN_OR_HANDLE =
		'a drawer is shown by `open` or by `handle.open(...)`: pass one of them';
	const NOT_BOTH = '`open` and `handle` both say whether the drawer is shown: pass one of them';
	const NEEDS_ON_CLOSE =
		'with `open`, only you close the drawer: pass `onClose` and set `open` to `false` in it';
	const NO_ON_CLOSE =
		'with a `handle`, the drawer closes itself and the handle reports it: drop `onClose`, and read the close from `useDrawerHandle(onOpenChange)`';

	test('asks for open or a handle by default, and for no handle', () => {
		expectTypeOf<ValidateDrawerProps<{ type: 'task'; title: string }>>().toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateDrawerProps<{ type: 'task'; title: string }, NoHandle>>().toHaveProperty(
			NEEDS_OPEN_OR_HANDLE,
		);
		expectTypeOf<ValidateDrawerProps<Task>>().not.toHaveProperty(NEEDS_OPEN_OR_HANDLE);
	});

	test('takes any other payload, unknown, any and never included, as a handle', () => {
		expectTypeOf<
			ValidateDrawerProps<{ type: 'task'; title: string }, unknown>
		>().toEqualTypeOf<unknown>();
		expectTypeOf<
			ValidateDrawerProps<{ type: 'task'; title: string }, any>
		>().toEqualTypeOf<unknown>();
		expectTypeOf<
			ValidateDrawerProps<{ type: 'task'; title: string }, never>
		>().toEqualTypeOf<unknown>();
		expectTypeOf<
			ValidateDrawerProps<{ type: 'task'; title: string }, Row>
		>().toEqualTypeOf<unknown>();
		expectTypeOf<ValidateDrawerProps<{ type: 'task'; open: true }, unknown>>().toHaveProperty(
			NOT_BOTH,
		);
		expectTypeOf<ValidateDrawerProps<{ type: 'task'; open: true }, any>>().toHaveProperty(NOT_BOTH);
		expectTypeOf<ValidateDrawerProps<{ type: 'task'; open: true }, never>>().toHaveProperty(
			NOT_BOTH,
		);
	});

	test('asks for onClose with open, and rejects it with a handle', () => {
		expectTypeOf<ValidateDrawerProps<{ type: 'task'; open: true }>>().toHaveProperty(
			NEEDS_ON_CLOSE,
		);
		expectTypeOf<ValidateDrawerProps<Task>>().not.toHaveProperty(NEEDS_ON_CLOSE);
		expectTypeOf<ValidateDrawerProps<{ type: 'task'; onClose: () => void }, Row>>().toHaveProperty(
			NO_ON_CLOSE,
		);
		expectTypeOf<
			ValidateDrawerProps<{ type: 'task'; onClose: () => void }, unknown>
		>().toHaveProperty(NO_ON_CLOSE);
	});
});

describe('Drawer focus props', () => {
	test('takes initialFocus and finalFocus as a ref, a boolean or a function', () => {
		const field = createRef<HTMLInputElement>();
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={noop}
				title="T"
				initialFocus={field}
				finalFocus={field}
			>
				Body
			</Drawer>,
		);
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={noop}
				title="T"
				initialFocus={false}
				finalFocus={false}
			>
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" initialFocus={() => true}>
				Body
			</Drawer>,
		);
	});
});

describe('Drawer container', () => {
	test('accepts an element, a ref to one, or null', () => {
		assertType(
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" container={document.body}>
				Body
			</Drawer>,
		);
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				open
				onClose={noop}
				title="T"
				container={createRef<HTMLDivElement>()}
			>
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" container={null}>
				Body
			</Drawer>,
		);
	});

	test('accepts a container with a handle', () => {
		assertType(
			<Drawer
				type="inspector"
				stack="overlay"
				handle={rowHandle}
				title="T"
				container={document.body}
			>
				Body
			</Drawer>,
		);
	});

	test('rejects a container that is not an element or a ref', () => {
		assertType(
			// @ts-expect-error - `container` takes the element, not a selector
			<Drawer type="task" stack="overlay" open onClose={noop} title="T" container="#root">
				Body
			</Drawer>,
		);
	});
});

describe('Drawer handle', () => {
	test('types the hook and the handle after the payload', () => {
		expectTypeOf<ReturnType<typeof useDrawerHandle<Row>>>().toEqualTypeOf<DrawerHandleType<Row>>();
		expectTypeOf<DrawerHandleType<Row>>().toEqualTypeOf<DialogHandle<Row>>();
		expectTypeOf<ReturnType<typeof useDrawerHandle<void>>>().toEqualTypeOf<
			DrawerHandleType<void>
		>();
		expectTypeOf(plainHandle).toEqualTypeOf<DrawerHandleType<void>>();
		expectTypeOf<Parameters<typeof useDrawerHandle<Row>>>().toEqualTypeOf<
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
		rowHandle.open({ name: 'checkout-7d9f' });
		expectTypeOf(maybeRowHandle.open).parameters.toEqualTypeOf<[payload: Row | undefined]>();
		maybeRowHandle.open(undefined);
		// @ts-expect-error - a handle with a payload opens with it
		rowHandle.open();
		// @ts-expect-error - the payload is a Row
		rowHandle.open({ id: 1 });
	});

	test('accepts a handle in place of open, with no onClose', () => {
		assertType(
			<Drawer type="inspector" stack="overlay" handle={rowHandle} title="T">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="task" stack="overlay" handle={plainHandle} title="T">
				Body
			</Drawer>,
		);
	});

	test('accepts a handle with a ref, id, aria-* and data-*', () => {
		assertType(
			<Drawer
				type="inspector"
				stack="overlay"
				handle={rowHandle}
				title="T"
				id="x"
				aria-label="Pod"
				data-area="pods"
				ref={ref}
			>
				Body
			</Drawer>,
		);
	});

	test('types the children function after the payload of the handle', () => {
		assertType(
			<Drawer type="inspector" stack="overlay" handle={rowHandle} title="T">
				{(row) => {
					expectTypeOf(row).toEqualTypeOf<Row>();

					return row.name;
				}}
			</Drawer>,
		);
		assertType(
			<Drawer type="task" stack="overlay" handle={rowHandle} title="T">
				{(row: Row) => {
					expectTypeOf(row).toEqualTypeOf<Row>();

					return row.name;
				}}
			</Drawer>,
		);
	});

	test('accepts children as a function for a handle without a payload', () => {
		assertType(
			<Drawer type="inspector" stack="overlay" handle={plainHandle} title="T">
				{() => 'Body'}
			</Drawer>,
		);
	});

	test('accepts a handle whose payload is unknown, any, never or optional', () => {
		assertType(
			<Drawer type="inspector" stack="overlay" handle={unknownHandle} title="T">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" handle={anyHandle} title="T">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" handle={neverHandle} title="T">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" handle={maybeRowHandle} title="T">
				Body
			</Drawer>,
		);
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				handle={unknownHandle}
				title="T"
				container={document.body}
				ref={ref}
			>
				<p>Body</p>
			</Drawer>,
		);
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				handle={anyHandle}
				title="T"
				container={document.body}
				ref={ref}
			>
				<p>Body</p>
			</Drawer>,
		);
	});

	test('types the children function for a handle whose payload is unknown, any, never or optional', () => {
		assertType(
			<Drawer type="inspector" stack="overlay" handle={unknownHandle} title="T">
				{(payload) => {
					expectTypeOf(payload).toBeUnknown();

					return String(payload);
				}}
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" handle={anyHandle} title="T">
				{(payload) => {
					expectTypeOf(payload).toBeAny();

					return String(payload);
				}}
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" handle={neverHandle} title="T">
				{(payload) => {
					expectTypeOf(payload).toBeNever();

					return 'Body';
				}}
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" handle={maybeRowHandle} title="T">
				{(row) => {
					expectTypeOf(row).toEqualTypeOf<Row | undefined>();

					return row?.name;
				}}
			</Drawer>,
		);
	});

	test('accepts every other node as children with a handle', () => {
		assertType(
			<Drawer type="inspector" stack="overlay" handle={rowHandle} title="T">
				{null}
			</Drawer>,
		);
		assertType(
			<Drawer type="inspector" stack="overlay" handle={rowHandle} title="T">
				<p>Body</p>
			</Drawer>,
		);
	});

	test('infers the reason of an onClose that does not annotate it with open', () => {
		assertType(
			<Drawer
				type="task"
				stack="overlay"
				open
				title="T"
				onClose={(reason) => {
					expectTypeOf(reason).toEqualTypeOf<DrawerCloseReasonType>();
				}}
			>
				Body
			</Drawer>,
		);
	});

	test('rejects an onClose with a handle', () => {
		assertType(
			// @ts-expect-error - with a handle the drawer closes itself, so `onClose` is not passed
			<Drawer type="inspector" stack="overlay" handle={rowHandle} title="T" onClose={noop}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - a handle without a payload closes the drawer itself too
			<Drawer type="task" stack="overlay" handle={plainHandle} title="T" onClose={noop}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - an annotated reason is still an `onClose`
			<Drawer
				type="task"
				stack="overlay"
				handle={rowHandle}
				title="T"
				onClose={(_reason: DrawerCloseReasonType) => noop()}
			>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - an unannotated `onClose` with a handle on a payload
			<Drawer
				type="task"
				stack="overlay"
				handle={rowHandle}
				title="T"
				onClose={(reason) => void reason}
			>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - an unannotated `onClose` next to a children function
			<Drawer
				type="task"
				stack="overlay"
				handle={rowHandle}
				title="T"
				onClose={(reason) => void reason}
			>
				{(row: Row) => row.name}
			</Drawer>,
		);
	});

	test('rejects an onClose with a handle whose payload is unknown, any or never', () => {
		assertType(
			// @ts-expect-error - a handle of `unknown` still closes the drawer itself, no `onClose`
			<Drawer type="task" stack="overlay" handle={unknownHandle} title="T" onClose={noop}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - a handle of `any` still closes the drawer itself, no `onClose`
			<Drawer type="task" stack="overlay" handle={anyHandle} title="T" onClose={noop}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - a handle of `never` still closes the drawer itself, no `onClose`
			<Drawer type="task" stack="overlay" handle={neverHandle} title="T" onClose={noop}>
				Body
			</Drawer>,
		);
	});

	test('rejects open together with a handle', () => {
		assertType(
			// @ts-expect-error - `open` and `handle` both say whether it is shown: pass one
			<Drawer type="task" stack="overlay" open handle={rowHandle} onClose={noop} title="T">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `open={false}` with a handle is still both
			<Drawer type="inspector" stack="overlay" open={false} handle={plainHandle} title="T">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `open` and `handle` with an unannotated `onClose`
			<Drawer
				type="task"
				stack="overlay"
				open
				handle={rowHandle}
				title="T"
				onClose={(reason) => void reason}
			>
				Body
			</Drawer>,
		);
	});

	test('rejects open together with a handle whose payload is unknown or any', () => {
		assertType(
			// @ts-expect-error - `open` and a handle of `unknown` both say whether it is shown
			<Drawer type="task" stack="overlay" open handle={unknownHandle} title="T">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `open` and a handle of `any` both say whether it is shown
			<Drawer type="task" stack="overlay" open handle={anyHandle} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects a handle that is not a DialogHandle', () => {
		assertType(
			// @ts-expect-error - a PopupHandle shows a popover, not a drawer
			<Drawer type="inspector" stack="overlay" handle={new PopupHandle<Row>()} title="T">
				Body
			</Drawer>,
		);
	});

	test('rejects children as a function with no handle', () => {
		assertType(
			// @ts-expect-error - a function of the payload needs the `handle` that opens it
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T">
				{() => 'Body'}
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `Row` is not what the drawer passes without a handle
			<Drawer type="inspector" stack="overlay" open onClose={noop} title="T" {...readsRow} />,
		);
	});

	test('rejects children as a function that does not take the payload of the handle', () => {
		assertType(
			// @ts-expect-error - the handle opens with a Row, not an Other
			<Drawer type="inspector" stack="overlay" handle={rowHandle} title="T" {...readsOther} />,
		);
	});

	test('rejects what an inspector rejects with open, with a handle too', () => {
		assertType(
			// @ts-expect-error - an `inspector` on a handle has no `description`
			<Drawer type="inspector" stack="overlay" handle={rowHandle} title="T" description="Detail">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - an `inspector` on a handle has no footer
			<Drawer type="inspector" stack="overlay" handle={rowHandle} title="T" footerSuffix="Save">
				Body
			</Drawer>,
		);
	});

	test('rejects what Drawer rejects with open, with a handle too', () => {
		assertType(
			// @ts-expect-error - a drawer on a handle names its `type` too
			<Drawer stack="overlay" handle={rowHandle} title="T">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `title` is required, it is the accessible name
			<Drawer type="task" stack="overlay" handle={rowHandle}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `children` is required, it is the body
			<Drawer type="task" stack="overlay" handle={rowHandle} title="T" />,
		);
		assertType(
			// @ts-expect-error - a drawer has no uncontrolled mode, no `defaultOpen`
			<Drawer type="task" stack="overlay" handle={rowHandle} title="T" defaultOpen>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `onOpenChange` is on the hook, `useDrawerHandle(onOpenChange)`
			<Drawer type="task" stack="overlay" handle={rowHandle} title="T" onOpenChange={noop}>
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `subTitle` is `description`
			<Drawer type="task" stack="overlay" handle={rowHandle} title="T" subTitle="Detail">
				Body
			</Drawer>,
		);
		assertType(
			// @ts-expect-error - `Drawer` takes no `className`
			<Drawer type="task" stack="overlay" handle={rowHandle} title="T" className="x">
				Body
			</Drawer>,
		);
	});
});
