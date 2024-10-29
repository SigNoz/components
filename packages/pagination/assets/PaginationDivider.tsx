import * as React from 'react';
import { cn } from '../src/lib/utils';

interface PaginationDividerProps extends React.ComponentProps<'svg'> {
	className?: string;
}

const PaginationDivider = ({ className, ...props }: PaginationDividerProps) => (
	<svg
		width="32"
		height="1"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={cn('text-vanilla-100', className)}
		{...props}
	>
		<path stroke="currentColor" strokeLinecap="round" d="M.5.5 31.5.5" />
	</svg>
);

export default PaginationDivider;
