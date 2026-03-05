import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import type React from 'react';
import { Group, Panel, Separator, useDefaultLayout } from 'react-resizable-panels';
import { cn } from '../lib/utils.js';
import './index.css';
import styles from './resizable.module.css';

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof Group>) => (
	<Group className={cn(styles['resizable-group'], className)} {...props} />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
	withHandle,
	className,
	...props
}: React.ComponentProps<typeof Separator> & {
	withHandle?: boolean;
}) => (
	<Separator className={cn(styles['resizable-handle'], className)} {...props}>
		{withHandle && (
			<div className={styles['resizable-handle__icon-wrapper']}>
				<DragHandleDots2Icon className={styles['resizable-handle__icon']} />
			</div>
		)}
	</Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle, useDefaultLayout };
