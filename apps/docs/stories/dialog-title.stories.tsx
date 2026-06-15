import { Code } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonVariant,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { titleArgTypes } from './shared/dialog-drawer-arg-types.js';

const meta: Meta<typeof DialogTitle> = {
	title: 'Primitive Components/Dialog/DialogTitle',
	component: DialogTitle,
	argTypes: titleArgTypes,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DialogTitle>;

export const Default: Story = {
	args: {
		children: 'Dialog title',
	},
	render: (args) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
					Open dialog
				</Button>
			</DialogTrigger>
			<DialogContent width="base">
				<DialogHeader>
					<DialogTitle {...args} />
				</DialogHeader>
				<DialogDescription>
					<p
						style={{
							fontSize: '0.875rem',
							fontWeight: 400,
							lineHeight: '1.25rem',
							fontFamily: 'Inter, sans-serif',
						}}
					>
						The title labels the dialog content for assistive technologies.
					</p>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	),
};

export const Preview: Story = {
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
					With Icon
				</h3>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant={ButtonVariant.Solid} color={ButtonColor.Primary}>
							Open dialog
						</Button>
					</DialogTrigger>
					<DialogContent width="base">
						<DialogHeader>
							<DialogTitle icon={<Code size={16} />}>Dialog with icon</DialogTitle>
						</DialogHeader>
						<DialogDescription>
							<p
								style={{
									fontSize: '0.875rem',
									fontWeight: 400,
									lineHeight: '1.25rem',
									fontFamily: 'Inter, sans-serif',
								}}
							>
								Use the icon prop to visually differentiate dialog types.
							</p>
						</DialogDescription>
					</DialogContent>
				</Dialog>
			</section>
		</div>
	),
};
