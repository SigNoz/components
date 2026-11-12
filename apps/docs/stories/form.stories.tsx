import {
	Button,
	Dialog,
	Field,
	Form,
	InputField,
	Select,
	type SelectOptionItemType,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './form.stories.module.css';
import { formArgTypes, formParameters } from './shared/form-arg-types.js';
import { waitForEffects } from './shared/play.js';
import { useTouchedForm } from './shared/use-touched-form.js';

const meta: Meta<typeof Form> = {
	title: 'Composed Components/Form',
	component: Form,
	parameters: formParameters,
	argTypes: formArgTypes,
	args: {
		layout: 'vertical',
		onSubmit: fn(),
		onReset: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	parameters: {
		// Every layout it can be driven into is covered by `Showcase`.
		chromatic: { disableSnapshot: true },
	},
	render: ({ children: _children, ...args }) => (
		<Form {...args}>
			<InputField label="Service name" name="service" placeholder="checkout-service" />
			<InputField label="Owner email" name="email" type="email" placeholder="oncall@example.com" />
			<Button type="submit" variant="solid" color="primary" size="md">
				Save
			</Button>
		</Form>
	),
};

type SignUpValues = { name: string; email: string; password: string };

const SIGN_UP_INITIAL: SignUpValues = { name: '', email: '', password: '' };

function validateSignUp(values: SignUpValues): Partial<Record<keyof SignUpValues, string>> {
	return {
		name: values.name.trim() === '' ? 'Enter your full name.' : undefined,
		email:
			values.email.trim() === ''
				? 'Enter your email.'
				: /^\S+@\S+\.\S+$/.test(values.email)
					? undefined
					: 'Enter an email like name@company.com.',
		password: values.password.length >= 8 ? undefined : 'Use at least 8 characters.',
	};
}

type SignUpFormProps = { onSave: (values: SignUpValues) => void };

function SignUpForm({ onSave }: SignUpFormProps): ReactElement {
	const { bind, handleSubmit } = useTouchedForm(SIGN_UP_INITIAL, validateSignUp);

	return (
		<Form onSubmit={handleSubmit(onSave)} testId="signup">
			<InputField label="Full name" required testId="signup-name" {...bind('name')} />
			<InputField
				label="Email"
				required
				type="email"
				description="We send the invite here."
				testId="signup-email"
				{...bind('email')}
			/>
			<InputField.Password
				label="Password"
				required
				description="At least 8 characters."
				testId="signup-password"
				{...bind('password')}
			/>
			<Button type="submit" variant="solid" color="primary" size="md">
				Create account
			</Button>
		</Form>
	);
}

/**
 * Plain React state, the validation timing the page documents: a field validates when it loses
 * focus, again on every change once it has been left, and all of them on submit. A submit with
 * errors moves focus to the first invalid control.
 */
export const Validated: StoryObj<SignUpFormProps> = {
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: {
		onSave: fn(),
	},
	render: (args) => <SignUpForm {...args} />,
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);
		const name = canvas.getByRole('textbox', { name: 'Full name' });
		const email = canvas.getByRole('textbox', { name: 'Email' });
		const password = canvas.getByTestId('signup-password-field');

		await waitForEffects();

		await step('Typing does not validate, leaving the field does', async () => {
			await userEvent.type(email, 'ada');

			await expect(canvas.queryByTestId('signup-email-message')).toBeNull();
			await expect(email).not.toHaveAttribute('aria-invalid');

			await userEvent.tab();

			await expect(canvas.getByTestId('signup-email-message')).toHaveTextContent(
				'Enter an email like name@company.com.',
			);
			await expect(email).toHaveAttribute('aria-invalid', 'true');
		});

		await step('Fixing the value clears the message', async () => {
			await userEvent.type(email, '@example.com');

			await waitFor(() => expect(canvas.queryByTestId('signup-email-message')).toBeNull());
			await expect(email).not.toHaveAttribute('aria-invalid');
		});

		await step('A submit with errors focuses the first invalid control', async () => {
			await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));

			await expect(name).toHaveFocus();
			await expect(canvas.getByTestId('signup-name-message')).toHaveTextContent(
				'Enter your full name.',
			);
			await expect(canvas.getByTestId('signup-password-message')).toHaveTextContent(
				'Use at least 8 characters.',
			);
			await expect(args.onSave).not.toHaveBeenCalled();
		});

		await step('Enter in a field submits once every value is valid', async () => {
			await userEvent.type(name, 'Ada Lovelace');
			await userEvent.type(password, 'correct horse{Enter}');

			await waitFor(() => expect(args.onSave).toHaveBeenCalledTimes(1));
			await expect(args.onSave).toHaveBeenCalledWith({
				name: 'Ada Lovelace',
				email: 'ada@example.com',
				password: 'correct horse',
			});
		});
	},
};

const ENVIRONMENTS = [
	{ type: 'item', value: 'production', label: 'Production' },
	{ type: 'item', value: 'staging', label: 'Staging' },
	{ type: 'item', value: 'development', label: 'Development' },
] as SelectOptionItemType[];

/**
 * A filter row: the fields sit in one line, 16px apart, and line up on their bottom edge with the
 * button.
 */
export const Inline: Story = {
	decorators: [
		(Story) => (
			<div className="story-container-full">
				<Story />
			</div>
		),
	],
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	args: {
		layout: 'inline',
		testId: 'filters',
	},
	render: ({ children: _children, ...args }) => (
		<Form {...args}>
			<InputField label="Service" name="service" placeholder="checkout-service" width={220} />
			<Field label="Environment">
				<Select
					items={ENVIRONMENTS}
					placeholder="Environment"
					defaultValue="production"
					width={180}
				/>
			</Field>
			<InputField.Number label="Min duration (ms)" name="duration" min={0} width={160} />
			<Button type="submit" variant="solid" color="primary" size="md">
				Apply filters
			</Button>
		</Form>
	),
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);

		await expect(canvas.getByTestId('filters')).toHaveAttribute('data-layout', 'inline');

		await userEvent.type(canvas.getByRole('textbox', { name: 'Service' }), 'checkout{Enter}');

		await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1));
	},
};

type RenameValues = { name: string };

const RENAME_INITIAL: RenameValues = { name: 'Checkout latency' };

function validateRename(values: RenameValues): Partial<Record<keyof RenameValues, string>> {
	return { name: values.name.trim() === '' ? 'Enter a name for the view.' : undefined };
}

type RenameDialogProps = { onSave: (values: RenameValues) => void };

function RenameDialog({ onSave }: RenameDialogProps): ReactElement {
	const [open, setOpen] = useState(false);
	const { bind, handleSubmit, reset } = useTouchedForm(RENAME_INITIAL, validateRename);

	return (
		<div className="story-container">
			<Button variant="solid" color="primary" size="md" onClick={() => setOpen(true)}>
				Rename view
			</Button>
			<Dialog
				open={open}
				onClose={() => {
					setOpen(false);
					reset();
				}}
				title="Rename view"
				description="Dashboards that link to this view keep working under the new name."
				testId="rename"
				footerSuffix={
					<>
						<Button
							variant="outlined"
							color="secondary"
							size="md"
							onClick={() => {
								setOpen(false);
								reset();
							}}
						>
							Cancel
						</Button>
						<Button type="submit" form="rename-view" variant="solid" color="primary" size="md">
							Save
						</Button>
					</>
				}
			>
				<Form
					id="rename-view"
					onSubmit={handleSubmit((values) => {
						onSave(values);
						setOpen(false);
					})}
				>
					<InputField label="View name" required testId="rename-name" {...bind('name')} />
				</Form>
			</Dialog>
		</div>
	);
}

/**
 * The buttons sit in the footer of the dialog, outside the `<form>`. The submit button names the
 * form with `form`, so it submits it, and a submit with errors still focuses the first invalid
 * control.
 */
export const InDialog: StoryObj<RenameDialogProps> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: {
		onSave: fn(),
	},
	render: (args) => <RenameDialog {...args} />,
	play: async ({ args, canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);

		await waitForEffects();

		await userEvent.click(canvas.getByRole('button', { name: 'Rename view' }));

		const dialog = await body.findByRole('dialog', { name: 'Rename view' });
		const name = within(dialog).getByRole('textbox', { name: 'View name' });

		await step('A submit from the footer with errors focuses the control', async () => {
			await userEvent.clear(name);
			await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

			await expect(name).toHaveFocus();
			await expect(within(dialog).getByTestId('rename-name-message')).toHaveTextContent(
				'Enter a name for the view.',
			);
			await expect(args.onSave).not.toHaveBeenCalled();
		});

		await step('Fixing the value clears the message and the footer submits', async () => {
			await userEvent.type(name, 'Payments latency');

			await waitFor(() => expect(within(dialog).queryByTestId('rename-name-message')).toBeNull());

			await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

			await waitFor(() => expect(args.onSave).toHaveBeenCalledWith({ name: 'Payments latency' }));
			await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
		});
	},
};

type ViewValues = { name: string; owner: string };

const VIEW_INITIAL: ViewValues = { name: 'Checkout latency', owner: 'oncall@example.com' };

function validateView(values: ViewValues): Partial<Record<keyof ViewValues, string>> {
	return {
		name: values.name.trim() === '' ? 'Enter a name for the view.' : undefined,
		owner: /^\S+@\S+\.\S+$/.test(values.owner)
			? undefined
			: 'Enter an email like name@company.com.',
	};
}

type ResetFormProps = {
	onSave: (values: ViewValues) => void;
	onReset: () => void;
};

function ResetForm({ onSave, onReset }: ResetFormProps): ReactElement {
	const { bind, handleSubmit, reset } = useTouchedForm(VIEW_INITIAL, validateView);

	return (
		<Form
			onSubmit={handleSubmit(onSave)}
			onReset={() => {
				reset();
				onReset();
			}}
			testId="view"
		>
			<InputField label="View name" required testId="view-name" {...bind('name')} />
			<InputField label="Owner" required type="email" testId="view-owner" {...bind('owner')} />
			<div className={styles.actions}>
				<Button type="reset" variant="outlined" color="secondary" size="md">
					Reset
				</Button>
				<Button type="submit" variant="solid" color="primary" size="md">
					Save
				</Button>
			</div>
		</Form>
	);
}

/**
 * A `type="reset"` button fires `onReset`. The native reset only clears uncontrolled inputs, so
 * the handler sets the state back, and the errors go with it.
 */
export const Reset: StoryObj<ResetFormProps> = {
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	args: {
		onSave: fn(),
		onReset: fn(),
	},
	render: (args) => <ResetForm {...args} />,
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const name = canvas.getByRole('textbox', { name: 'View name' });

		await userEvent.clear(name);
		await userEvent.tab();

		await expect(canvas.getByTestId('view-name-message')).toHaveTextContent(
			'Enter a name for the view.',
		);

		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));

		await waitFor(() => expect(name).toHaveValue('Checkout latency'));
		await expect(canvas.queryByTestId('view-name-message')).toBeNull();
		await expect(args.onReset).toHaveBeenCalledTimes(1);
		await expect(args.onSave).not.toHaveBeenCalled();
	},
};

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description: ReactNode;
	children: ReactNode;
}): ReactElement {
	return (
		<div className="story-section">
			<Typography
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{description}
			</Typography>
			{children}
		</div>
	);
}

function submitNothing(): void {}

export const Showcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={styles.showcase}>
			<Section
				title="Vertical"
				description="The default. The fields stack 16px apart and the form adds no padding: the Dialog, Drawer or Card around it owns that."
			>
				<div className={styles.column}>
					<Form onSubmit={submitNothing}>
						<InputField label="Full name" required defaultValue="Ada Lovelace" />
						<InputField
							label="Email"
							required
							type="email"
							defaultValue="ada@"
							error="Enter an email like name@company.com."
						/>
						<InputField.Password
							label="Password"
							required
							description="At least 8 characters."
							defaultValue="correct horse"
						/>
						<div className={styles.actions}>
							<Button type="reset" variant="outlined" color="secondary" size="md">
								Reset
							</Button>
							<Button type="submit" variant="solid" color="primary" size="md">
								Create account
							</Button>
						</div>
					</Form>
				</div>
			</Section>

			<div className={styles.fullRow}>
				<Section
					title="Inline"
					description="The fields sit in one row, 16px apart, and wrap to a new row 16px below when the width runs out. They line up on their bottom edge with the button."
				>
					<Form layout="inline" onSubmit={submitNothing}>
						<InputField label="Service" placeholder="checkout-service" width={220} />
						<Field label="Environment">
							<Select
								items={ENVIRONMENTS}
								placeholder="Environment"
								defaultValue="production"
								width={180}
							/>
						</Field>
						<InputField.Number label="Min duration (ms)" min={0} width={160} />
						<Button type="submit" variant="solid" color="primary" size="md">
							Apply filters
						</Button>
					</Form>
				</Section>
			</div>
		</div>
	),
};
