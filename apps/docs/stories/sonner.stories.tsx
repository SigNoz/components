import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, toast } from '@signozhq/sonner';
import { Button } from '@signozhq/button';
import { generateDocs } from '../utils/generateDocs';

const SonnerExamples = [
	`import { Toaster, toast } from '@signozhq/sonner';

export default function MyComponent() {
  const showToast = () => {
    toast('Hello World!');
  };

  return (
    <div>
      <button onClick={showToast}>Show Toast</button>
      <Toaster />
    </div>
  );
}`,
	`import { Toaster, toast } from '@signozhq/sonner';

export default function MyComponent() {
  const showSuccessToast = () => {
    toast.success('Success! Your action was completed.');
  };

  const showErrorToast = () => {
    toast.error('Error! Something went wrong.');
  };

  return (
    <div>
      <button onClick={showSuccessToast}>Success Toast</button>
      <button onClick={showErrorToast}>Error Toast</button>
      <Toaster />
    </div>
  );
}`,
];

const SonnerDocs = generateDocs({
	packageName: '@signozhq/sonner',
	description: 'A toast component for displaying notifications and alerts.',
	examples: SonnerExamples,
});

const meta: Meta<typeof Toaster> = {
	title: 'Components/Sonner',
	component: Toaster,
	parameters: {
		docs: {
			description: {
				component: SonnerDocs,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

// Basic toast examples
export const BasicToasts: Story = {
	render: () => (
		<div className="p-8 space-y-4">
			<h2 className="text-lg font-semibold">Basic Toast Examples</h2>
			<div className="flex gap-4 flex-wrap">
				<Button
					onClick={() => toast('Hello World!')}
					variant="solid"
					color="primary"
				>
					Default Toast
				</Button>
				<Button
					onClick={() => toast.success('Success! Your action was completed.')}
					variant="solid"
					color="primary"
				>
					Success Toast
				</Button>
				<Button
					onClick={() => toast.error('Error! Something went wrong.')}
					variant="solid"
					color="destructive"
				>
					Error Toast
				</Button>
				<Button
					onClick={() => toast.warning('Warning! Please check your input.')}
					variant="solid"
					color="warning"
				>
					Warning Toast
				</Button>
				<Button
					onClick={() => toast.info('Info: Here is some information.')}
					variant="solid"
					color="secondary"
				>
					Info Toast
				</Button>
			</div>
			<Toaster />
		</div>
	),
};

// Toast with descriptions
export const ToastWithDescriptions: Story = {
	render: () => (
		<div className="p-8 space-y-4">
			<h2 className="text-lg font-semibold">Toasts with Descriptions</h2>
			<div className="flex gap-4 flex-wrap">
				<Button
					onClick={() =>
						toast('File uploaded', {
							description: 'Your file has been successfully uploaded to the server.',
						})
					}
					variant="solid"
					color="primary"
				>
					With Description
				</Button>
				<Button
					onClick={() =>
						toast.error('Upload failed', {
							description: 'The file could not be uploaded. Please try again.',
						})
					}
					variant="solid"
					color="destructive"
				>
					Error with Description
				</Button>
				<Button
					onClick={() =>
						toast.success('Account created', {
							description: 'Welcome! Your account has been successfully created.',
						})
					}
					variant="solid"
					color="primary"
				>
					Success with Description
				</Button>
			</div>
			<Toaster />
		</div>
	),
};

// Toast with actions
export const ToastWithActions: Story = {
	render: () => (
		<div className="p-8 space-y-4">
			<h2 className="text-lg font-semibold">Toasts with Actions</h2>
			<div className="flex gap-4 flex-wrap">
				<Button
					onClick={() =>
						toast('Undo action', {
							action: {
								label: 'Undo',
								onClick: () => console.log('Undo clicked'),
							},
						})
					}
					variant="solid"
					color="primary"
				>
					With Action Button
				</Button>
				<Button
					onClick={() =>
						toast.error('Delete item', {
							description: 'This action cannot be undone.',
							action: {
								label: 'Undo',
								onClick: () => console.log('Undo delete'),
							},
						})
					}
					variant="solid"
					color="destructive"
				>
					Error with Action
				</Button>
				<Button
					onClick={() =>
						toast('Download complete', {
							description: 'Your file has been downloaded.',
							action: {
								label: 'Open',
								onClick: () => console.log('Open file'),
							},
						})
					}
					variant="solid"
					color="primary"
				>
					Success with Action
				</Button>
			</div>
			<Toaster />
		</div>
	),
};

// Toast positions
export const ToastPositions: Story = {
	render: () => (
		<div className="p-8 space-y-4">
			<h2 className="text-lg font-semibold">Toast Positions</h2>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<h3 className="text-sm font-medium">Top Positions</h3>
					<div className="flex gap-2 flex-wrap">
						<Button
							onClick={() => toast('Top left', { position: 'top-left' })}
							variant="outlined"
							size="sm"
						>
							Top Left
						</Button>
						<Button
							onClick={() => toast('Top center', { position: 'top-center' })}
							variant="outlined"
							size="sm"
						>
							Top Center
						</Button>
						<Button
							onClick={() => toast('Top right', { position: 'top-right' })}
							variant="outlined"
							size="sm"
						>
							Top Right
						</Button>
					</div>
				</div>
				<div className="space-y-2">
					<h3 className="text-sm font-medium">Bottom Positions</h3>
					<div className="flex gap-2 flex-wrap">
						<Button
							onClick={() => toast('Bottom left', { position: 'bottom-left' })}
							variant="outlined"
							size="sm"
						>
							Bottom Left
						</Button>
						<Button
							onClick={() => toast('Bottom center', { position: 'bottom-center' })}
							variant="outlined"
							size="sm"
						>
							Bottom Center
						</Button>
						<Button
							onClick={() => toast('Bottom right', { position: 'bottom-right' })}
							variant="outlined"
							size="sm"
						>
							Bottom Right
						</Button>
					</div>
				</div>
			</div>
			<Toaster />
		</div>
	),
};

// Toast durations
export const ToastDurations: Story = {
	render: () => (
		<div className="p-8 space-y-4">
			<h2 className="text-lg font-semibold">Toast Durations</h2>
			<div className="flex gap-4 flex-wrap">
				<Button
					onClick={() => toast('Quick message', { duration: 1000 })}
					variant="solid"
					color="primary"
				>
					1 Second
				</Button>
				<Button
					onClick={() => toast('Standard message', { duration: 4000 })}
					variant="solid"
					color="primary"
				>
					4 Seconds
				</Button>
				<Button
					onClick={() => toast('Long message', { duration: 8000 })}
					variant="solid"
					color="primary"
				>
					8 Seconds
				</Button>
				<Button
					onClick={() => toast('Persistent message', { duration: Infinity })}
					variant="solid"
					color="warning"
				>
					Persistent
				</Button>
			</div>
			<Toaster />
		</div>
	),
};

// Toast with custom styling
export const CustomStyledToasts: Story = {
	render: () => (
		<div className="p-8 space-y-4">
			<h2 className="text-lg font-semibold">Custom Styled Toasts</h2>
			<div className="flex gap-4 flex-wrap">
				<Button
					onClick={() =>
						toast.custom(() => (
							<div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
								<div className="font-semibold">Custom Toast</div>
								<div className="text-sm opacity-90">This is a custom styled toast</div>
							</div>
						))
					}
					variant="solid"
					color="primary"
				>
					Custom Styled
				</Button>
				<Button
					onClick={() =>
						toast.custom(() => (
							<div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg">
								<div className="font-semibold">Gradient Toast</div>
								<div className="text-sm opacity-90">With gradient background</div>
							</div>
						))
					}
					variant="solid"
					color="primary"
				>
					Gradient Toast
				</Button>
				<Button
					onClick={() =>
						toast.custom(() => (
							<div className="bg-yellow-400 text-black p-4 rounded-lg shadow-lg border-2 border-yellow-600">
								<div className="font-semibold">⚠️ Warning</div>
								<div className="text-sm">Custom warning style</div>
							</div>
						))
					}
					variant="solid"
					color="warning"
				>
					Custom Warning
				</Button>
			</div>
			<Toaster />
		</div>
	),
};

// Toast with promises
export const ToastWithPromises: Story = {
	render: () => (
		<div className="p-8 space-y-4">
			<h2 className="text-lg font-semibold">Toasts with Promises</h2>
			<div className="flex gap-4 flex-wrap">
				<Button
					onClick={() => {
						const promise = new Promise((resolve) => setTimeout(resolve, 2000));
						toast.promise(promise, {
							loading: 'Loading...',
							success: 'Success!',
							error: 'Error!',
						});
					}}
					variant="solid"
					color="primary"
				>
					Promise Toast
				</Button>
				<Button
					onClick={() => {
						const promise = new Promise((resolve, reject) => {
							setTimeout(() => {
								if (Math.random() > 0.5) {
									resolve('Success');
								} else {
									reject(new Error('Failed'));
								}
							}, 2000);
						});
						toast.promise(promise, {
							loading: 'Processing your request...',
							success: 'Request completed successfully!',
							error: 'Request failed. Please try again.',
						});
					}}
					variant="solid"
					color="primary"
				>
					Random Promise
				</Button>
				<Button
					onClick={() => {
						const promise = new Promise((resolve) => setTimeout(resolve, 3000));
						toast.promise(promise, {
							loading: 'Uploading file...',
							success: 'File uploaded successfully!',
							error: 'Upload failed. Please try again.',
						});
					}}
					variant="solid"
					color="primary"
				>
					File Upload
				</Button>
			</div>
			<Toaster />
		</div>
	),
};

// Multiple toasts
export const MultipleToasts: Story = {
	render: () => (
		<div className="p-8 space-y-4">
			<h2 className="text-lg font-semibold">Multiple Toasts</h2>
			<div className="flex gap-4 flex-wrap">
				<Button
					onClick={() => {
						toast('First toast');
						setTimeout(() => toast('Second toast'), 500);
						setTimeout(() => toast('Third toast'), 1000);
						setTimeout(() => toast('Fourth toast'), 1500);
					}}
					variant="solid"
					color="primary"
				>
					Show Multiple
				</Button>
				<Button
					onClick={() => {
						toast.success('Success 1');
						toast.error('Error 1');
						toast.warning('Warning 1');
						toast.info('Info 1');
					}}
					variant="solid"
					color="primary"
				>
					Different Types
				</Button>
				<Button
					onClick={() => {
						toast('Toast 1', { position: 'top-left' });
						toast('Toast 2', { position: 'top-right' });
						toast('Toast 3', { position: 'bottom-left' });
						toast('Toast 4', { position: 'bottom-right' });
					}}
					variant="solid"
					color="primary"
				>
					Different Positions
				</Button>
			</div>
			<Toaster />
		</div>
	),
};

// Default story for component display
export const Default: Story = {
	render: () => (
		<div className="p-8 space-y-4">
			<h2 className="text-lg font-semibold">Sonner Toast Component</h2>
			<p className="text-sm text-muted-foreground">
				Click the buttons below to see different types of toasts in action.
			</p>
			<div className="flex gap-4 flex-wrap">
				<Button
					onClick={() => toast('Hello World!')}
					variant="solid"
					color="primary"
				>
					Show Toast
				</Button>
			</div>
			<Toaster />
		</div>
	),
};
