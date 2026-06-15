import { Button, ButtonColor, Toaster, toast } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Toaster> = {
	title: 'Primitive Components/Sonner',
	component: Toaster,
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
	render: () => (
		<div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Sonner Toast Component</h2>
			<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
				Click the buttons below to see different types of toasts in action.
			</p>
			<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
				<Button onClick={() => toast('Hello World!')} variant="solid" color="primary">
					Show Toast
				</Button>
			</div>
			<Toaster />
		</div>
	),
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
					Basic Toasts
				</h3>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
					<Button onClick={() => toast('Hello World!')} variant="solid" color="primary">
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
					Toast With Descriptions
				</h3>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
					Toast With Actions
				</h3>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
					Toast Positions
				</h3>
				<div
					style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
						<h4 style={{ fontSize: '0.875rem', fontWeight: 500 }}>Top Positions</h4>
						<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
							<Button
								onClick={() => toast('Top left', { position: 'top-left' })}
								variant="outlined"
								size="sm"
								color={ButtonColor.None}
							>
								Top Left
							</Button>
							<Button
								onClick={() => toast('Top center', { position: 'top-center' })}
								variant="outlined"
								size="sm"
								color={ButtonColor.None}
							>
								Top Center
							</Button>
							<Button
								onClick={() => toast('Top right', { position: 'top-right' })}
								variant="outlined"
								size="sm"
								color={ButtonColor.None}
							>
								Top Right
							</Button>
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
						<h4 style={{ fontSize: '0.875rem', fontWeight: 500 }}>Bottom Positions</h4>
						<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
							<Button
								onClick={() => toast('Bottom left', { position: 'bottom-left' })}
								variant="outlined"
								size="sm"
								color={ButtonColor.None}
							>
								Bottom Left
							</Button>
							<Button
								onClick={() => toast('Bottom center', { position: 'bottom-center' })}
								variant="outlined"
								size="sm"
								color={ButtonColor.None}
							>
								Bottom Center
							</Button>
							<Button
								onClick={() => toast('Bottom right', { position: 'bottom-right' })}
								variant="outlined"
								size="sm"
								color={ButtonColor.None}
							>
								Bottom Right
							</Button>
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
					Toast Durations
				</h3>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
					Custom Styled Toasts
				</h3>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
					<Button
						onClick={() =>
							toast.custom(() => (
								<div
									style={{
										color: '#ffffff',
										padding: '1rem',
										borderRadius: '0.5rem',
										boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
										backgroundColor: '#3b82f6',
									}}
								>
									<div style={{ fontWeight: 600 }}>Custom Toast</div>
									<div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
										This is a custom styled toast
									</div>
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
								<div
									style={{
										color: '#ffffff',
										padding: '1rem',
										borderRadius: '0.5rem',
										boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
										backgroundImage: 'linear-gradient(to right, #a855f7, #ec4899)',
									}}
								>
									<div style={{ fontWeight: 600 }}>Gradient Toast</div>
									<div style={{ fontSize: '0.875rem', opacity: 0.9 }}>With gradient background</div>
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
								<div
									style={{
										color: '#000000',
										padding: '1rem',
										borderRadius: '0.5rem',
										boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
										backgroundColor: '#facc15',
										borderWidth: '2px',
										borderStyle: 'solid',
										borderColor: '#ca8a04',
									}}
								>
									<div style={{ fontWeight: 600 }}>⚠️ Warning</div>
									<div style={{ fontSize: '0.875rem' }}>Custom warning style</div>
								</div>
							))
						}
						variant="solid"
						color="warning"
					>
						Custom Warning
					</Button>
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
					Toast With Promises
				</h3>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
					Multiple Toasts
				</h3>
				<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
			</section>
			<Toaster />
		</div>
	),
};
