import { Check, ChevronLeft, ChevronRight, Code, Star, Trash } from '@signozhq/icons';
import { Button, ButtonBackground, ButtonColor, ButtonSize, ButtonVariant } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { buttonArgTypes, COLORS, VARIANTS } from './shared/button-arg-types.js';

const meta: Meta<typeof Button> = {
	title: 'Primitive Components/Button',
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
	argTypes: buttonArgTypes,
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
			source: {
				type: 'code',
			},
		},
		test: { dangerouslyIgnoreUnhandledErrors: true },
	},
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

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => (
		<div
			style={{
				padding: '2rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2.5rem',
				backgroundColor: 'var(--background)',
			}}
		>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Button Showcase
				</h3>
				<div
					style={{ padding: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--background)' }}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
						{COLORS.map((color) => (
							<div key={color} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
								<h2
									style={{
										fontSize: '1rem',
										fontWeight: 600,
										textTransform: 'capitalize',
										color: 'var(--foreground)',
									}}
								>
									{color}
								</h2>
								<div style={{ display: 'flex', gap: '1rem' }}>
									{/* Filter variants based on color */}
									{VARIANTS.filter(
										(variant) =>
											// Only show outlined and dashed for secondary
											color === 'secondary' || !(variant === 'outlined' || variant === 'dashed')
									).map((variant) => (
										<div
											key={variant}
											style={{
												display: 'grid',
												gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
												gap: '1rem',
											}}
										>
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
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Sizes
				</h3>
				<div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Size Variations</h2>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
							{[ButtonSize.SM, ButtonSize.MD].map((size) => (
								<div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
									<h3
										style={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize' }}
									>
										{size}
									</h3>
									<Button
										variant={ButtonVariant.Solid}
										color={ButtonColor.Primary}
										size={size}
										prefix={<ChevronLeft />}
										suffix={<ChevronRight />}
									>
										{size} Button
									</Button>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Icon Buttons
				</h3>
				<div
					style={{
						padding: '2rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '2rem',
						borderRadius: '0.5rem',
						backgroundColor: 'var(--background)',
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>
							Icon Only Buttons
						</h2>
						<p>
							Icon only buttons are buttons that only have an icon as their content. These buttons
							are useful when you need to display an icon in a button without any text. You can just
							specify the button as:
							<pre>&lt;Button suffix=&#123;&lt;Code /&gt;&#125; size=&quot;icon&quot;/&gt;</pre>
						</p>
						<div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
							{VARIANTS.map((variant) => (
								<Button
									key={variant}
									variant={variant}
									color={ButtonColor.Primary}
									suffix={<Code size={32} />}
									size="icon"
								/>
							))}
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>
							Icon Button Sizes
						</h2>
						<p>
							By default, the icon will be displayed at the size of the button. You can also specify
							the size of the icon by passing the "size" prop to the icon.
						</p>
						<div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
							{[ButtonSize.SM, ButtonSize.MD, ButtonSize.Icon].map((size) => (
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Primary}
									key={size}
									size={size}
									prefix={<Code />}
								/>
							))}
						</div>
					</div>
				</div>
			</section>
			<section>
				<h3
					style={{
						fontSize: '0.875rem',
						fontWeight: 500,
						marginBottom: '0.75rem',
						color: 'var(--muted-foreground)',
					}}
				>
					Action Buttons
				</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
					<div>
						<h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
							Action Buttons
						</h2>
						<p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
							Action buttons adapt their style based on the background they`re placed on.
						</p>

						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gap: '2rem',
							}}
						>
							{/* ink-500 background */}
							<div
								style={{
									padding: '1.5rem',
									backgroundColor: 'var(--bg-ink-500)',
									borderRadius: '0.5rem',
								}}
							>
								<p style={{ color: 'var(--text-vanilla-100)', marginBottom: '1rem' }}>
									On ink-500 background
								</p>
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
							<div
								style={{
									padding: '1.5rem',
									backgroundColor: 'var(--bg-ink-400)',
									borderRadius: '0.5rem',
								}}
							>
								<p style={{ color: 'var(--text-vanilla-100)', marginBottom: '1rem' }}>
									On ink-400 background
								</p>
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
							<div
								style={{
									padding: '1.5rem',
									backgroundColor: 'var(--bg-vanilla-100)',
									borderRadius: '0.5rem',
								}}
							>
								<p style={{ color: 'var(--text-slate-500)', marginBottom: '1rem' }}>
									On vanilla-100 background
								</p>
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
							<div
								style={{
									padding: '1.5rem',
									backgroundColor: 'var(--bg-vanilla-200)',
									borderRadius: '0.5rem',
								}}
							>
								<p style={{ color: 'var(--text-slate-500)', marginBottom: '1rem' }}>
									On vanilla-200 background
								</p>
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
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem' }}>
							Disabled Action Buttons
						</h3>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gap: '2rem',
							}}
						>
							{/* Disabled examples */}
							<div
								style={{
									padding: '1.5rem',
									backgroundColor: 'var(--bg-ink-500)',
									borderRadius: '0.5rem',
								}}
							>
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
							<div
								style={{
									padding: '1.5rem',
									backgroundColor: 'var(--bg-vanilla-100)',
									borderRadius: '0.5rem',
								}}
							>
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
			</section>
		</div>
	),
};
