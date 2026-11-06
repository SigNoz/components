import type {
	ConfirmDrawer,
	ConfirmDrawerUrl,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerSubtitle,
	DrawerTitle,
	DrawerTrigger,
	DrawerWrapper,
} from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const overlayArgTypes: Meta<typeof Drawer>['argTypes'] = {
	open: {
		control: 'boolean',
		description: 'The controlled open state. Must be used together with onOpenChange.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	defaultOpen: {
		control: 'boolean',
		description:
			'The open state when initially rendered. Use when you do not need to control its open state.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	modal: {
		control: 'boolean',
		description:
			'The modality. When true, interaction with outside elements is disabled and focus is trapped.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'true' },
		},
	},
	onOpenChange: {
		control: false,
		description: 'Event handler called when the open state changes.',
		table: {
			category: 'Events',
			type: { summary: '(open: boolean) => void' },
		},
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const overlayComponentArgTypes: Meta<typeof DrawerOverlay>['argTypes'] = {
	id: {
		control: 'text',
		description: 'A unique identifier for the drawer overlay element.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the overlay.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the drawer overlay.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	forceMount: {
		control: 'boolean',
		description:
			'When true, keeps the overlay mounted even when the drawer is closed. Useful for controlling animations.',
		table: { category: 'Behavior', type: { summary: 'true | undefined' } },
	},
	style: {
		control: false,
		description: 'Inline styles applied to the overlay element.',
		table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
	},
};

export const contentArgTypes: Meta<typeof DrawerContent>['argTypes'] = {
	width: {
		control: 'select',
		options: ['narrow', 'base', 'wide', 'extra-wide'],
		description: 'The maximum width of the drawer when it slides in from the left or the right.',
		table: {
			category: 'Appearance',
			type: { summary: '"narrow" | "base" | "wide" | "extra-wide"' },
			defaultValue: { summary: 'base' },
		},
	},
	animation: {
		control: 'select',
		options: ['slide', 'fade', 'zoom'],
		description:
			'How the drawer enters and leaves. `slide` moves it in from its direction, `fade` and `zoom` scale it up from a lower opacity, `zoom` starting smaller.',
		table: {
			category: 'Appearance',
			type: { summary: '"slide" | "fade" | "zoom"' },
			defaultValue: { summary: 'slide' },
		},
	},
	offset: {
		control: false,
		description:
			'Has no effect: a drawer always sits against its edge of the viewport. Kept so existing call sites keep compiling.',
		table: { category: 'Layout', type: { summary: 'number' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the drawer content.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	onEscapeKeyDown: {
		control: false,
		description: 'Handler called when the escape key is pressed while the drawer is open.',
		table: { category: 'Events' },
	},
	onPointerDownOutside: {
		control: false,
		description: 'Handler called when a pointer event happens outside the drawer.',
		table: { category: 'Events' },
	},
	onFocusOutside: {
		control: false,
		description: 'Handler called when focus moves outside of the drawer.',
		table: { category: 'Events' },
	},
	onInteractOutside: {
		control: false,
		description:
			'Handler called when an interaction happens outside of the drawer (pointer down or focus).',
		table: { category: 'Events' },
	},
	onOpenAutoFocus: {
		control: false,
		description: 'Handler called when the drawer is about to receive focus on open.',
		table: { category: 'Events' },
	},
	onCloseAutoFocus: {
		control: false,
		description: 'Handler called when focus is moving after the drawer closes.',
		table: { category: 'Events' },
	},
	forceMount: {
		control: 'boolean',
		description:
			'When true, keeps the content mounted even when the drawer is closed. Useful for controlling animations.',
		table: { category: 'Behavior', type: { summary: 'true | undefined' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the drawer content.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	style: {
		control: false,
		description: 'Inline styles applied to the drawer content surface.',
		table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const portalArgTypes: Meta<typeof DrawerPortal>['argTypes'] = {
	testId: {
		control: 'text',
		description: 'Test ID for the drawer portal.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	container: {
		control: false,
		description:
			'Optional DOM element to portal the drawer into. Defaults to document.body when not provided.',
		table: { category: 'Behavior', type: { summary: 'HTMLElement | null | undefined' } },
	},
	forceMount: {
		control: 'boolean',
		description:
			'When true, keeps the portal mounted even when the drawer is closed. Useful for controlling animations.',
		table: { category: 'Behavior', type: { summary: 'true | undefined' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const headerArgTypes: Meta<typeof DrawerHeader>['argTypes'] = {
	id: {
		control: 'text',
		description: 'A unique identifier for the drawer header element.',
		table: { category: 'Accessibility' },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the header container.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the drawer header.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const titleArgTypes: Meta<typeof DrawerTitle>['argTypes'] = {
	id: {
		control: 'text',
		description: 'A unique identifier for the drawer title element.',
		table: { category: 'Accessibility' },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the title.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the drawer title.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	icon: {
		control: false,
		description: 'Optional icon element to render before the title text.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	children: {
		control: 'text',
		description: 'The text content of the drawer title.',
		table: { category: 'Content' },
	},
};

export const subtitleArgTypes: Meta<typeof DrawerSubtitle>['argTypes'] = {
	id: {
		control: 'text',
		description: 'A unique identifier for the drawer subtitle element.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the subtitle.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the drawer subtitle.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	children: {
		control: 'text',
		description: 'The text content of the subtitle.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const descriptionArgTypes: Meta<typeof DrawerDescription>['argTypes'] = {
	id: {
		control: 'text',
		description: 'A unique identifier for the drawer description element.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the description container.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the drawer description.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	children: {
		control: 'text',
		description: 'The descriptive text or content of the drawer.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const footerArgTypes: Meta<typeof DrawerFooter>['argTypes'] = {
	id: {
		control: 'text',
		description: 'A unique identifier for the drawer footer element.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the footer container.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the drawer footer.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const closeArgTypes: Meta<typeof DrawerClose>['argTypes'] = {
	id: {
		control: 'text',
		description: 'A unique identifier for the drawer close element.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the close element.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the drawer close.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	asChild: {
		control: 'boolean',
		description:
			'When true, the child element will be treated as the close control (no extra DOM wrapper).',
		table: { category: 'Behavior', type: { summary: 'boolean' } },
	},
	onClick: {
		control: false,
		description: 'Click handler invoked when the close element is activated.',
		table: { category: 'Events', type: { summary: '(event: MouseEvent) => void' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const triggerArgTypes: Meta<typeof DrawerTrigger>['argTypes'] = {
	id: {
		control: 'text',
		description: 'A unique identifier for the trigger element.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the trigger.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	asChild: {
		control: 'boolean',
		description:
			'When true, the child element will be treated as the trigger (no extra DOM wrapper).',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	testId: {
		control: 'text',
		description: 'Test ID for the drawer trigger.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	onClick: {
		control: false,
		description: 'Click handler for the trigger element.',
		table: { category: 'Events', type: { summary: '(event: MouseEvent) => void' } },
	},
	children: {
		control: false,
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
};

export const wrapperArgTypes: Meta<typeof DrawerWrapper>['argTypes'] = {
	testId: {
		control: 'text',
		description: 'Test ID for the drawer wrapper.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'A unique identifier for the drawer wrapper.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	title: {
		control: 'text',
		description: 'The title of the drawer.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	subTitle: {
		control: 'text',
		description: 'The subtitle of the drawer.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	width: {
		control: 'select',
		options: ['narrow', 'base', 'wide', 'extra-wide'],
		description: 'The maximum width of the drawer when it slides in from the left or the right.',
		table: {
			category: 'Appearance',
			type: { summary: '"narrow" | "base" | "wide" | "extra-wide"' },
			defaultValue: { summary: 'base' },
		},
	},
	open: {
		control: 'boolean',
		description: 'Controlled open state of the drawer. Use together with onOpenChange.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	disableOutsideClick: {
		control: 'boolean',
		description:
			'When true, prevents closing the drawer when clicking outside (pointer down outside is prevented).',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	showCloseButton: {
		control: 'boolean',
		description: 'When true, shows the built-in close (X) button in the drawer content.',
		table: {
			category: 'Appearance',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'true' },
		},
	},
	showOverlay: {
		control: 'boolean',
		description: 'Whether to render the overlay behind the drawer.',
		table: {
			category: 'Appearance',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'true' },
		},
	},
	trigger: {
		control: false,
		description: 'The element that opens the drawer when clicked.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	children: {
		control: false,
		description: 'The content of the drawer.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	footer: {
		control: false,
		description: 'Optional footer area, typically used for action buttons.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	className: {
		control: 'text',
		description: 'Optional class name passed to the underlying drawer content for custom styling.',
		table: { category: 'Appearance', type: { summary: 'string' } },
	},
	style: {
		control: false,
		description: 'Inline styles applied to the drawer content surface.',
		table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
	},
	onOpenChange: {
		control: false,
		description: 'Callback when the open state changes.',
		table: {
			category: 'Events',
			type: { summary: '(open: boolean) => void' },
		},
	},
};

export const confirmArgTypes: Meta<typeof ConfirmDrawer>['argTypes'] = {
	open: {
		control: 'boolean',
		description: 'Controlled open state of the confirm drawer.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	testId: {
		control: 'text',
		description: 'Test ID for the confirm drawer.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'A unique identifier for the confirm drawer.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	title: {
		control: 'text',
		description: 'The title of the drawer.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	titleIcon: {
		control: false,
		description: 'Optional icon element to display next to the title.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	children: {
		control: 'text',
		description: 'The descriptive content rendered inside the drawer.',
		table: { category: 'Content' },
	},
	className: {
		control: 'text',
		description: 'Optional class name passed to the underlying drawer content for custom styling.',
		table: { category: 'Appearance', type: { summary: 'string' } },
	},
	style: {
		control: false,
		description: 'Inline styles applied to the drawer content surface.',
		table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
	},
	cancelText: {
		control: 'text',
		description: 'Label of the cancel button.',
		table: {
			category: 'Content',
			type: { summary: 'string' },
			defaultValue: { summary: 'Cancel' },
		},
	},
	cancelIcon: {
		control: false,
		description: 'Optional icon element for the cancel button.',
		table: { category: 'Content', type: { summary: 'React.ReactElement' } },
	},
	confirmText: {
		control: 'text',
		description: 'Label of the confirm button.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	confirmColor: {
		control: 'select',
		options: [
			'primary',
			'secondary',
			'danger',
			'warning',
			'success',
			'info',
			'archive',
			'highlight-danger',
		],
		description: 'The color of the confirm button.',
		table: {
			category: 'Appearance',
			type: { summary: "ButtonProps['color']" },
			defaultValue: { summary: 'danger' },
		},
	},
	confirmIcon: {
		control: false,
		description: 'Optional icon element for the confirm button.',
		table: { category: 'Content', type: { summary: 'React.ReactElement' } },
	},
	disableOutsideClick: {
		control: 'boolean',
		description:
			'When true, prevents closing the drawer when clicking outside (pointer down outside is prevented).',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	width: {
		control: 'select',
		options: ['narrow', 'base', 'wide', 'extra-wide'],
		description: 'The maximum width of the drawer when it slides in from the left or the right.',
		table: {
			category: 'Appearance',
			type: { summary: '"narrow" | "base" | "wide" | "extra-wide"' },
			defaultValue: { summary: 'base' },
		},
	},
	onOpenChange: {
		control: false,
		description: 'Event handler called when the open state of the drawer changes.',
		table: { category: 'Events', type: { summary: '(open: boolean) => void' } },
	},
	onCancel: {
		control: false,
		description: 'Event handler called when the cancel button is clicked.',
		table: { category: 'Events', type: { summary: '() => void' } },
	},
	onConfirm: {
		control: false,
		description:
			'Event handler called when the confirm button is clicked. Can return a boolean or promise to decide whether the drawer should close. If it throws or rejects, the drawer stays open and the error is rethrown.',
		table: {
			category: 'Events',
			type: { summary: '() => boolean | void | Promise<boolean | void>' },
		},
	},
};

export const confirmUrlArgTypes: Meta<typeof ConfirmDrawerUrl>['argTypes'] = {
	urlKey: {
		control: 'text',
		description: 'The URL query parameter key used to control the open state.',
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	title: {
		control: 'text',
		description: 'The title of the drawer.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	titleIcon: {
		control: false,
		description: 'Optional icon element to display next to the title.',
		table: { category: 'Content', type: { summary: 'React.ReactNode' } },
	},
	children: {
		control: 'text',
		description: 'The descriptive content rendered inside the drawer.',
		table: { category: 'Content' },
	},
	className: {
		control: 'text',
		description: 'Optional class name passed to the underlying drawer content for custom styling.',
		table: { category: 'Appearance', type: { summary: 'string' } },
	},
	cancelText: {
		control: 'text',
		description: 'Label of the cancel button.',
		table: {
			category: 'Content',
			type: { summary: 'string' },
			defaultValue: { summary: 'Cancel' },
		},
	},
	confirmText: {
		control: 'text',
		description: 'Label of the confirm button.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	confirmColor: {
		control: 'select',
		options: [
			'primary',
			'secondary',
			'danger',
			'warning',
			'success',
			'info',
			'archive',
			'highlight-danger',
		],
		description: 'The color of the confirm button.',
		table: {
			category: 'Appearance',
			type: { summary: "ButtonProps['color']" },
			defaultValue: { summary: 'danger' },
		},
	},
	disableOutsideClick: {
		control: 'boolean',
		description:
			'When true, prevents closing the drawer when clicking outside (pointer down outside is prevented).',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	width: {
		control: 'select',
		options: ['narrow', 'base', 'wide', 'extra-wide'],
		description: 'The maximum width of the drawer when it slides in from the left or the right.',
		table: {
			category: 'Appearance',
			type: { summary: '"narrow" | "base" | "wide" | "extra-wide"' },
			defaultValue: { summary: 'base' },
		},
	},
	onCancel: {
		control: false,
		description: 'Event handler called when the cancel button is clicked.',
		table: { category: 'Events', type: { summary: '() => void' } },
	},
	onConfirm: {
		control: false,
		description:
			'Event handler called when the confirm button is clicked. Can return a boolean or promise to decide whether the drawer should close. If it throws or rejects, the drawer stays open and the error is rethrown.',
		table: {
			category: 'Events',
			type: { summary: '() => boolean | void | Promise<boolean | void>' },
		},
	},
};
