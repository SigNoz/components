import type { ComponentProps } from 'react';
import type { GroupProps, PanelProps, SeparatorProps } from 'react-resizable-panels';
import { describe, expectTypeOf, it } from 'vitest';

import type {
	Layout,
	LayoutChangedMeta,
	LayoutStorage,
	ResizableHandleProps,
	ResizablePanelGroupProps,
	ResizablePanelProps,
} from './index.js';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, useDefaultLayout } from './index.js';

type UseDefaultLayoutResult = ReturnType<typeof useDefaultLayout>;

describe('useDefaultLayout wiring', () => {
	it('returns a defaultLayout that ResizablePanelGroup accepts', () => {
		expectTypeOf<UseDefaultLayoutResult['defaultLayout']>().toExtend<
			ResizablePanelGroupProps['defaultLayout']
		>();
	});

	it('returns an onLayoutChanged that ResizablePanelGroup accepts', () => {
		expectTypeOf<UseDefaultLayoutResult['onLayoutChanged']>().toExtend<
			NonNullable<ResizablePanelGroupProps['onLayoutChanged']>
		>();
	});

	it('returns an onLayoutChange that ResizablePanelGroup accepts', () => {
		expectTypeOf<UseDefaultLayoutResult['onLayoutChange']>().toExtend<
			NonNullable<ResizablePanelGroupProps['onLayoutChange']>
		>();
	});

	it('type checks the documented persisted-layout usage', () => {
		function PanelEditor({ layoutStorage }: { layoutStorage: LayoutStorage }) {
			const { defaultLayout, onLayoutChanged } = useDefaultLayout({
				id: 'panel-editor-v2',
				storage: layoutStorage,
			});

			return (
				<ResizablePanelGroup
					defaultLayout={defaultLayout}
					onLayoutChanged={onLayoutChanged}
					orientation="horizontal"
				>
					<ResizablePanel defaultSize="25%">Sidebar</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel defaultSize="75%">Main</ResizablePanel>
				</ResizablePanelGroup>
			);
		}

		expectTypeOf(PanelEditor).toBeFunction();
	});
});

describe('ResizablePanelGroupProps mirror GroupProps', () => {
	/** Props declared by us and spread verbatim onto `<Group>`; they must stay byte-identical. */
	type ForwardedGroupProps =
		| 'defaultLayout'
		| 'disableCursor'
		| 'disabled'
		| 'groupRef'
		| 'id'
		| 'onLayoutChange'
		| 'onLayoutChanged'
		| 'orientation'
		| 'resizeTargetMinimumSize';

	it('declares every forwarded prop exactly as the library does', () => {
		expectTypeOf<Pick<ResizablePanelGroupProps, ForwardedGroupProps>>().toEqualTypeOf<
			Pick<GroupProps, ForwardedGroupProps>
		>();
	});

	it('calls onLayoutChanged with the layout and the change metadata', () => {
		expectTypeOf<
			NonNullable<ResizablePanelGroupProps['onLayoutChanged']>
		>().parameters.toEqualTypeOf<[Layout, LayoutChangedMeta]>();
	});

	it('keeps the component props tied to the exported props type', () => {
		expectTypeOf<ComponentProps<typeof ResizablePanelGroup>>().toExtend<ResizablePanelGroupProps>();
	});
});

describe('ResizablePanelProps mirror PanelProps', () => {
	/** Props declared by us and spread verbatim onto `<Panel>`; they must stay byte-identical. */
	type ForwardedPanelProps =
		| 'collapsedSize'
		| 'collapsible'
		| 'defaultSize'
		| 'disabled'
		| 'groupResizeBehavior'
		| 'id'
		| 'maxSize'
		| 'minSize'
		| 'onResize'
		| 'panelRef';

	it('declares every forwarded prop exactly as the library does', () => {
		expectTypeOf<Pick<ResizablePanelProps, ForwardedPanelProps>>().toEqualTypeOf<
			Pick<PanelProps, ForwardedPanelProps>
		>();
	});

	it('keeps the component props tied to the exported props type', () => {
		expectTypeOf<ComponentProps<typeof ResizablePanel>>().toExtend<ResizablePanelProps>();
	});
});

describe('ResizableHandleProps mirror SeparatorProps', () => {
	/** Props declared by us and spread verbatim onto `<Separator>`; they must stay byte-identical. */
	type ForwardedHandleProps = 'disabled' | 'id';

	it('declares every forwarded prop exactly as the library does', () => {
		expectTypeOf<Pick<ResizableHandleProps, ForwardedHandleProps>>().toEqualTypeOf<
			Pick<SeparatorProps, ForwardedHandleProps>
		>();
	});

	it('keeps the component props tied to the exported props type', () => {
		expectTypeOf<ComponentProps<typeof ResizableHandle>>().toExtend<ResizableHandleProps>();
	});
});
