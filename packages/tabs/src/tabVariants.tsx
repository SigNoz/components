import { cva } from 'class-variance-authority';

const tabsVariants = cva('flex flex-col gap-2', {
	variants: {
		variant: {
			primary: 'flex flex-col items-start text-left',
			secondary: '',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

const tabsListWrapperVariants = cva('', {
	variants: {
		variant: {
			primary: '',
			secondary: 'w-full  rounded-none pl-4',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

const tabsListVariants = cva('', {
	variants: {
		variant: {
			primary: [
				'group inline-flex items-center gap-6 p-1 rounded-md relative',
				'before:absolute before:content-[""] before:h-[calc(100%-8px)] before:top-1',
				'before:bg-[#3E44631A] dark:before:bg-[#ABBDFF1A]',
				'before:rounded ',
				'before:transition-[width,transform,opacity] before:duration-200 before:ease-in-out',
				'before:opacity-0 hover:before:opacity-100',
				'[--tab-width:0px] [--tab-left:0px]',
				'before:w-[var(--tab-width)] before:transform before:translate-x-[var(--tab-left)]',
				'after:absolute after:content-[""] after:bottom-[-8px] after:left-0 after:h-0.5',
				'after:bg-primary',
				'after:rounded-full after:transition-[width,transform]',
				'after:duration-200 after:ease-in-out',
				'[--active-width:0px] [--active-left:0px]',
				'after:w-[var(--active-width)] after:transform after:translate-x-[var(--active-left)]',
			],
			secondary: 'flex ',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

const tabsTriggerVariants = cva('cursor-pointer', {
	variants: {
		variant: {
			primary: [
				'whitespace-nowrap inline-flex items-center gap-2 rounded px-1.5 py-1 text-sm font-normal',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
				'disabled:pointer-events-none disabled:bg-opacity-50',
				'data-[state=active]:text-foreground text-muted-foreground',
				'relative z-10',
			],
			secondary: [
				// 'inline-flex h-full flex-0 items-center justify-center gap-1.5 bg-background disabled:bg-vanilla-200 dark:disabled:bg-ink-300 disabled:text-vanilla-400   whitespace-nowrap px-5 py-1 text-sm transition-[color] border-t border-l border-b border-r first:rounded-tl-[1px] last:rounded-tr-[1px] data-[state=active]:border-b-transparent focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4  cursor-pointer',

				// Layout & Sizing
				'inline-flex h-full flex-0 items-center justify-center gap-1.5 whitespace-nowrap px-5 py-1 text-sm',
				'cursor-pointer transition-[color]',

				// Borders & Shape
				'border  border-[var(--tab-border-color)] [&:not(:last-of-type)]:border-r-transparent',
				'first:rounded-tl-[1px] last:rounded-tr-[1px]',
				'data-[state=active]:border-b-transparent',

				// Focus & Disabled States
				'focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1',
				'disabled:pointer-events-none disabled:text-opacity-50 disabled:bg-opacity-50',

				// Icon Styles
				'[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',

				// Colors & Background
				'text-[var(--tab-text-color)]',
				'bg-[var(--tab-background)]',

				// Hover & Active States
				'hover:text-[var(--tab-hover-text-color)]',
				'data-[state=active]:text-[var(--tab-active-text-color)]',
				'data-[state=active]:bg-[var(--tab-active-background)]',
			],
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

export {
	tabsVariants,
	tabsListWrapperVariants,
	tabsListVariants,
	tabsTriggerVariants,
};
