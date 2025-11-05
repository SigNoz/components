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
			secondary: 'w-full pl-4',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

const tabsListVariants = cva('', {
	variants: {
		variant: {
			primary: ['inline-flex items-center gap-6 relative'],
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
				'whitespace-nowrap inline-flex items-center gap-2 rounded px-1.5 py-1',
				'text-sm font-normal leading-5',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
				'disabled:text-opacity-50 disabled:cursor-not-allowed',
				'disabled:text-slate-50/40 dark:disabled:text-vanilla-100/40',
				'text-[var(--tab-text-color)]',
				'hover:text-[var(--tab-hover-text-color)]',
				'data-[state=active]:text-[var(--tab-active-text-color)]',
				'relative z-10',
			],
			secondary: [
				// Layout & Sizing
				'inline-flex h-full flex-0 items-center justify-center gap-1 whitespace-nowrap px-5 py-1 text-sm',
				'cursor-pointer transition-[color]',

				// Borders & Shape
				'border  border-[var(--tab-border-color)] border-r-0 last-of-type:border-r-[1px]',
				'data-[state=active]:border-b-transparent',
				'first-of-type:rounded-tl-md last-of-type:rounded-tr-md',

				// Disabled States
				'disabled:relative disabled:z-0 disabled:cursor-not-allowed',

				// Left side stripes
				'disabled:before:content-[""] disabled:before:absolute disabled:before:inset-y-0 disabled:before:left-0',
				'disabled:before:w-[25px] disabled:before:h-full',
				'disabled:before:bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,var(--tab-border-color)_2px,var(--tab-border-color)_4px)]',
				'disabled:before:opacity-70  disabled:before:z-[1]',
				'disabled:before:[mask-image:linear-gradient(to_left,transparent_0%,black_100%)]',

				// Right side stripes
				'disabled:after:content-[""] disabled:after:absolute disabled:after:inset-y-0 disabled:after:right-0',
				'disabled:after:w-[25px] disabled:after:h-full',
				'disabled:after:bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,var(--tab-border-color)_2px,var(--tab-border-color)_4px)]',
				'disabled:after:opacity-70  disabled:after:z-[1]',
				'disabled:after:[mask-image:linear-gradient(to_right,transparent_0%,black_100%)]',

				// Ensure text and icons are above the stripes
				'disabled:[&>*]:relative disabled:[&>*]:z-[2]',

				// Icon Styles
				'[&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',

				// Colors & Background
				'text-[var(--tab-text-color)]',
				'bg-[var(--tab-background)]',

				// Hover & Active States
				'hover:text-[var(--tab-hover-text-color)]',
				'data-[state=active]:text-[var(--tab-active-text-color)]',
				'data-[state=active]:bg-[var(--tab-active-background)]',
				'disabled:text-slate-50/40 dark:disabled:text-vanilla-100/40 disabled:pointer-events-none',
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
