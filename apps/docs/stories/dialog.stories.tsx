import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@signozhq/dialog';
import { Button } from '@signozhq/button';

type DialogStoryProps = {
	openTrigger: string;
};

const meta: Meta<DialogStoryProps> = {
	title: 'Components/Dialog',
	component: Dialog,
	tags: ['autodocs'],
	argTypes: {},
};

export default meta;
type Story = StoryObj<DialogStoryProps>;

export const Default: Story = {
	args: {},
	render: () => (
		<Dialog>
			<DialogTrigger>
				<Button variant="primary">Open Dialog</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit report details</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your account
						and remove your data from our servers.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
