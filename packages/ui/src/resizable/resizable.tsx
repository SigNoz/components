import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import type React from 'react';
import { Group, Panel, Separator, useDefaultLayout } from 'react-resizable-panels';
import { cn } from '../lib/utils.js';
import './index.css';

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof Group>) => (
	<Group className={cn('resizable-panel-group flex h-full w-full', className)} {...props} />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
	withHandle,
	className,
	...props
}: React.ComponentProps<typeof Separator> & {
	withHandle?: boolean;
}) => (
	<Separator
		className={cn(
			'resizable-handle relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
			className
		)}
		{...props}
	>
		{withHandle && (
			<div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
				<DragHandleDots2Icon className="h-2.5 w-2.5" />
			</div>
		)}
	</Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle, useDefaultLayout };
