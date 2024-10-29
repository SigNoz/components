import { type VariantProps } from 'class-variance-authority';
import {
	type paginationWrapperVariants,
	type paginationItemVariants,
} from './variants';
import { PaginationLink } from './pagination';

export type PaginationAlign = 'start' | 'center' | 'end';

export interface PaginationWrapperProps
	extends React.ComponentProps<'nav'>,
		VariantProps<typeof paginationWrapperVariants> {
	className?: string;
}

export interface PaginationContentProps extends React.ComponentProps<'ul'> {
	className?: string;
}

export interface PaginationItemProps extends React.ComponentProps<'li'> {
	className?: string;
}

export interface PaginationLinkProps
	extends React.ComponentProps<'a'>,
		VariantProps<typeof paginationItemVariants> {
	isActive?: boolean;
}

export interface PaginationPreviousProps
	extends React.ComponentProps<typeof PaginationLink> {
	className?: string;
	isDisabled?: boolean;
}

export interface PaginationNextProps
	extends React.ComponentProps<typeof PaginationLink> {
	className?: string;
	isDisabled?: boolean;
}

export interface PaginationEllipsisProps extends React.ComponentProps<'span'> {
	className?: string;
}

export interface PaginationProps extends PaginationWrapperProps {
	current?: number;
	total: number;
	pageSize?: number;
	defaultCurrent?: number;
	onPageChange?: (page: number) => void;
}
