import { Button, ButtonColor, ButtonVariant, DrawerWrapper } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof DrawerWrapper> = {
	title: 'Components/Drawer/DrawerWrapper',
	component: DrawerWrapper,
	argTypes: {
		title: {
			control: 'text',
			description: 'The title of the drawer.',
			table: {
				category: 'Content',
				type: { summary: 'string' },
			},
		},
		subTitle: {
			control: 'text',
			description: 'The subtitle of the drawer.',
			table: {
				category: 'Content',
				type: { summary: 'string' },
			},
		},
		children: {
			control: false,
			description: 'The main content of the drawer.',
			table: {
				category: 'Content',
				type: { summary: 'React.ReactNode' },
			},
		},
		footer: {
			control: false,
			description: 'Optional footer content, typically used for actions.',
			table: {
				category: 'Content',
				type: { summary: 'React.ReactNode' },
			},
		},
		trigger: {
			control: false,
			description:
				'The element that opens the drawer. Optional when using controlled mode (open/onOpenChange).',
			table: {
				category: 'Content',
				type: { summary: 'React.ReactNode' },
			},
		},
		direction: {
			control: 'select',
			options: ['left', 'right', 'top', 'bottom'],
			description: 'The direction the drawer opens from.',
			table: {
				category: 'Appearance',
				type: { summary: '"left" | "right" | "top" | "bottom"' },
				defaultValue: { summary: 'right' },
			},
		},
		type: {
			control: 'select',
			options: ['drawer', 'panel'],
			description: 'Visual style of the surface: drawer (auto) or panel (fixed width/height).',
			table: {
				category: 'Appearance',
				type: { summary: '"panel" | "drawer"' },
				defaultValue: { summary: 'drawer' },
			},
		},
		showCloseButton: {
			control: 'boolean',
			description: 'Whether to show the close button in the header bar.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		allowOutsideClick: {
			control: 'boolean',
			description:
				'When true, allows closing the drawer by clicking outside. When false, outside clicks are prevented.',
			table: {
				category: 'Behavior',
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
		className: {
			control: 'text',
			description: 'Optional class name passed to the drawer content container.',
			table: {
				category: 'Styling',
				type: { summary: 'string' },
			},
		},
		open: {
			control: 'boolean',
			description:
				'Controlled open state. Provide together with onOpenChange for programmatic control.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
			},
		},
		onOpenChange: {
			control: false,
			description:
				'Called when the open state changes (close button, outside click, ESC). Required in controlled mode.',
			table: {
				category: 'Events',
				type: { summary: '(open: boolean) => void' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DrawerWrapper>;

export const Default: Story = {
	args: {
		title: 'Drawer header',
		subTitle: 'Use DrawerWrapper for common header / content / footer layouts.',
		children: (
			<p>
				Place your main drawer content here. Use the primitive Drawer components when you need
				lower-level control.
			</p>
		),
		footer: (
			<div className="flex gap-2 justify-end">
				<Button variant={ButtonVariant.Ghost}>Cancel</Button>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Save
				</Button>
			</div>
		),
		direction: 'right',
		showCloseButton: true,
		allowOutsideClick: true,
		showOverlay: true,
	},
	render: (args) => (
		<DrawerWrapper
			{...args}
			trigger={
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open drawer
				</Button>
			}
		/>
	),
};
