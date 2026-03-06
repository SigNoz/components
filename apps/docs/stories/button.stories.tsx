import { Check, ChevronLeft, ChevronRight, Code, Star, Trash } from '@signozhq/icons';
import { Button, ButtonBackground, ButtonColor, ButtonSize, ButtonVariant } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { generateDocs } from '../utils/generateDocs.js';

const VARIANTS = [
	ButtonVariant.Solid,
	ButtonVariant.Outlined,
	ButtonVariant.Dashed,
	ButtonVariant.Ghost,
	ButtonVariant.Link,
	ButtonVariant.Action,
] as const;
const COLORS = [
	ButtonColor.Primary,
	ButtonColor.Destructive,
	ButtonColor.Warning,
	ButtonColor.Secondary,
	ButtonColor.None,
] as const;

const buttonExamples = [
	`import { Button } from '@signozhq/ui';
import { ChevronLeft, ChevronRight } from '@signozhq/icons';

export default function MyComponent() {
return (
	<Button 
		variant="solid" 
		color="primary" 
		size="md"
		prefix={<ChevronLeft />}
		suffix={<ChevronRight />}
	>
		Click Me
	</Button>
);
}`,
];

const buttonDocs = generateDocs({
	packageName: '@signozhq/ui',
	description: 'A versatile button component with multiple variants, colors, and sizes.',
	examples: buttonExamples,
});

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	decorators: [],
	args: {
		onClick: fn(),
		onDoubleClick: fn(),
		variant: ButtonVariant.Solid,
		size: ButtonSize.MD,
		loading: false,
		disabled: false,
		type: 'button',
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
			description: 'The visual style of the button',
			table: {
				defaultValue: { summary: 'solid' },
			},
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'icon'],
			description: 'The size of the button',
			table: {
				defaultValue: { summary: 'md' },
			},
		},
		color: {
			control: 'select',
			options: COLORS,
			description: 'The color scheme of the button',
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the button is disabled',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' },
			},
		},
		asChild: {
			control: 'boolean',
			description: 'Whether to render as a child component',
			table: {
				type: { summary: 'boolean' },
			},
		},
		background: {
			control: 'select',
			options: ['ink-500', 'ink-400', 'vanilla-100', 'vanilla-200'],
			description:
				'The background context for the action button. Only applicable to *Action* buttons.',
			table: {
				type: { summary: 'string' },
			},
		},
		loading: {
			control: 'boolean',
			description: 'Whether the button is loading',
			table: {
				defaultValue: { summary: 'false' },
				type: { summary: 'boolean' },
			},
		},
		type: {
			control: 'select',
			options: ['button', 'submit'],
			description: 'The type of the button',
			table: {
				defaultValue: { summary: 'submit' },
			},
		},
		onClick: {
			action: 'onClick',
			description: 'The function to call when the button is clicked',
			table: {
				type: { summary: 'function' },
			},
		},
		onDoubleClick: {
			action: 'onDoubleClick',
			description: 'The function to call when the button is double clicked',
			table: {
				type: { summary: 'function' },
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
		design: {
			type: 'figma',
			url: 'https://www.figma.com/file/...',
		},
		backgrounds: {
			disable: true,
		},
		controls: { disable: false },
		docs: {
			description: {
				component: buttonDocs,
			},
			source: {
				type: 'code',
			},
		},
		test: { dangerouslyIgnoreUnhandledErrors: true },
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	parameters: {
		docs: { story: { autoplay: true } },
	},
	argTypes: {
		prefix: {
			control: 'select',
			options: ['chevron-left', 'chevron-right', 'star', 'code'],
			description:
				'The prefix for the button, will be displayed before the button text, can be anything such as an icon or a text. For this playground, the only options are icons.',
			table: {
				type: { summary: 'React.ReactElement' },
			},
		},
		suffix: {
			control: 'select',
			options: ['trash', 'check', 'star', 'code'],
			description:
				'The suffix for the button, will be displayed after the button text, can be anything such as an icon or a text. For this playground, the only options are icons.',
			table: {
				type: { summary: 'React.ReactElement' },
			},
		},
	},
	render: ({ prefix, suffix, ...args }) => {
		if (args.asChild) {
			return (
				<div>
					<Button asChild {...args}>
						<a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
							Go to Google
						</a>
					</Button>
				</div>
			);
		}

		switch (prefix?.toString()) {
			case 'chevron-left':
				prefix = <ChevronLeft />;
				break;
			case 'chevron-right':
				prefix = <ChevronRight />;
				break;
			case 'star':
				prefix = <Star />;
				break;
			case 'code':
				prefix = <Code />;
				break;
			default:
				prefix = undefined;
				break;
		}

		switch (suffix?.toString()) {
			case 'trash':
				suffix = <Trash />;
				break;
			case 'check':
				suffix = <Check />;
				break;
			case 'star':
				suffix = <Star />;
				break;
			case 'code':
				suffix = <Code />;
				break;
			default:
				suffix = undefined;
				break;
		}

		return (
			<Button testId="default-button" prefix={prefix} suffix={suffix} {...args}>
				Click Me
			</Button>
		);
	},
};

// Main showcase of all button styles
export const ButtonShowcase: Story = {
	parameters: {
		docs: { story: { autoplay: true } },
	},
	render: () => (
		<div className="p-8 rounded-lg bg-vanilla-100 dark:bg-background ">
			<div className="space-y-12">
				{COLORS.map((color) => (
					<div key={color} className="space-y-4">
						<h2 className="text-base font-semibold capitalize text-foreground">{color}</h2>
						<div className="flex gap-4">
							{/* Filter variants based on color */}
							{VARIANTS.filter(
								(variant) =>
									// Only show outlined and dashed for secondary
									color === 'secondary' || !(variant === 'outlined' || variant === 'dashed')
							).map((variant) => (
								<div key={variant} className="grid grid-cols-1 gap-4">
									<Button
										variant={variant}
										color={color}
										prefix={<Star />}
										suffix={<Star />}
										title={`${variant} ${color}`}
									>
										{variant}
									</Button>
									<Button
										variant={variant}
										color={color}
										prefix={<Star />}
										suffix={<Star />}
										disabled
										title={`${variant} disabled`}
									>
										{variant} disabled
									</Button>
									<Button
										variant={variant}
										color={color}
										prefix={<Star />}
										suffix={<Star />}
										loading
										title={`${variant} loading`}
									>
										{variant} loading
									</Button>
									<Button
										variant={variant}
										color={color}
										size="icon"
										title={`${variant} icon only`}
									>
										{<Star />}
									</Button>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	),
};

// Size Variations
export const Sizes: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		variant: ButtonVariant.Solid,
		color: ButtonColor.Primary,
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
		},
		color: {
			control: 'select',
			options: COLORS,
		},
	},
	render: (args) => (
		<div className="p-8 space-y-8">
			<div className="space-y-4">
				<h2 className="text-base font-semibold">Size Variations</h2>
				<div className="space-y-8">
					{[ButtonSize.SM, ButtonSize.MD].map((size) => (
						<div key={size} className="space-y-4">
							<h3 className="text-sm font-medium capitalize">{size}</h3>
							<Button {...args} size={size} prefix={<ChevronLeft />} suffix={<ChevronRight />}>
								{size} Button
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	),
};

// Icon Only Buttons
export const IconButtons: Story = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		variant: ButtonVariant.Solid,
		color: ButtonColor.Primary,
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
		},
		color: {
			control: 'select',
			options: COLORS,
		},
	},
	render: (args) => (
		<div className="p-8 space-y-8 rounded-lg bg-background">
			<div className="space-y-4">
				<h2 className="text-base font-semibold text-foreground">Icon Only Buttons</h2>
				<p>
					Icon only buttons are buttons that only have an icon as their content. These buttons are
					useful when you need to display an icon in a button without any text. You can just specify
					the button as:
					<pre>&lt;Button suffix=&#123;&lt;Code /&gt;&#125; size=&quot;icon&quot;/&gt;</pre>
				</p>
				<div className="flex gap-4 mt-4">
					{VARIANTS.map((variant) => (
						<Button
							{...args}
							key={variant}
							variant={variant}
							suffix={<Code size={32} />}
							size="icon"
						/>
					))}
				</div>
			</div>
			<div className="space-y-4">
				<h2 className="text-base font-semibold text-foreground">Icon Button Sizes</h2>
				<p>
					By default, the icon will be displayed at the size of the button. You can also specify the
					size of the icon by passing the "size" prop to the icon.
				</p>
				<div className="flex gap-4 mt-4">
					{[ButtonSize.SM, ButtonSize.MD, ButtonSize.Icon].map((size) => (
						<Button {...args} key={size} size={size} prefix={<Code />} />
					))}
				</div>
			</div>
		</div>
	),
};

// Add Action Button Story
export const ActionButtons: Story = {
	parameters: {
		controls: { disable: false },
	},
	argTypes: {
		background: {
			control: 'select',
			options: [
				ButtonBackground.Ink500,
				ButtonBackground.Ink400,
				ButtonBackground.Vanilla100,
				ButtonBackground.Vanilla200,
			],
			description: 'The background context for the action button',
		},
	},
	args: {
		variant: ButtonVariant.Action,
		background: ButtonBackground.Ink500,
	},
	render: () => (
		<div className="space-y-8">
			<div>
				<h2 className="text-base font-semibold mb-4">Action Buttons</h2>
				<p className="text-sm mb-4">
					Action buttons adapt their style based on the background they`re placed on.
				</p>

				<div className="grid grid-cols-2 gap-8">
					{/* ink-500 background */}
					<div className="p-6 bg-ink-500 rounded-lg">
						<p className="text-vanilla-100 mb-4">On ink-500 background</p>
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Ink500}
							prefix={<ChevronLeft />}
							suffix={<ChevronRight />}
						>
							Action Button
						</Button>
					</div>

					{/* ink-400 background */}
					<div className="p-6 bg-ink-400 rounded-lg">
						<p className="text-vanilla-100 mb-4">On ink-400 background</p>
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Ink400}
							prefix={<ChevronLeft />}
							suffix={<ChevronRight />}
						>
							Action Button
						</Button>
					</div>

					{/* vanilla-100 background */}
					<div className="p-6 bg-vanilla-100 rounded-lg">
						<p className="text-slate-500 mb-4">On vanilla-100 background</p>
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Vanilla100}
							prefix={<ChevronLeft />}
							suffix={<ChevronRight />}
						>
							Action Button
						</Button>
					</div>

					{/* vanilla-200 background */}
					<div className="p-6 bg-vanilla-200 rounded-lg">
						<p className="text-slate-500 mb-4">On vanilla-200 background</p>
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Vanilla200}
							prefix={<ChevronLeft />}
							suffix={<ChevronRight />}
						>
							Action Button
						</Button>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-medium mb-3">Disabled Action Buttons</h3>
				<div className="grid grid-cols-2 gap-8">
					{/* Disabled examples */}
					<div className="p-6 bg-ink-500 rounded-lg">
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Ink500}
							disabled
							prefix={<ChevronLeft />}
							suffix={<ChevronRight />}
						>
							Disabled Action Button
						</Button>
					</div>
					<div className="p-6 bg-vanilla-100 rounded-lg">
						<Button
							variant={ButtonVariant.Action}
							background={ButtonBackground.Vanilla100}
							disabled
							prefix={<ChevronLeft />}
							suffix={<ChevronRight />}
						>
							Disabled Action Button
						</Button>
					</div>
				</div>
			</div>
		</div>
	),
};
