import { Avatar, AvatarColor, AvatarShape, AvatarSize, Button, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './avatar.stories.module.css';

const NAME = 'Alex Example';

const toDataUri = (svg: string): string => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const PORTRAIT_IMAGE = toDataUri(
	'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="144" viewBox="0 0 96 144"><rect width="96" height="144" fill="#4e74f8"/><rect width="96" height="12" fill="#1d2433"/><rect y="132" width="96" height="12" fill="#1d2433"/><circle cx="48" cy="58" r="22" fill="#f2f4f8"/><path d="M8 144c0-28 18-46 40-46s40 18 40 46z" fill="#f2f4f8"/></svg>',
);

const LANDSCAPE_IMAGE = toDataUri(
	'<svg xmlns="http://www.w3.org/2000/svg" width="144" height="96" viewBox="0 0 144 96"><rect width="144" height="96" fill="#25c09a"/><rect width="12" height="96" fill="#1d2433"/><rect x="132" width="12" height="96" fill="#1d2433"/><circle cx="72" cy="38" r="20" fill="#f2f4f8"/><path d="M32 96c0-24 18-40 40-40s40 16 40 40z" fill="#f2f4f8"/></svg>',
);

const BROKEN_IMAGE = 'data:image/png;base64,not-an-image';

const INITIALS_CASES = [
	{ label: 'Two words', name: 'Alex Example', initials: 'AE' },
	{ label: 'Three words', name: 'Mary Jane Watson', initials: 'MW' },
	{ label: 'One word', name: 'alex', initials: 'A' },
	{ label: 'Email', name: 'alex.example@example.com', initials: 'A' },
	{ label: 'Accent', name: 'élodie durand', initials: 'ÉD' },
	{ label: 'Non-latin', name: '李 雷', initials: '李雷' },
] as const;

const LONG_NAME = 'Wolfeschlegelsteinhausenbergerdorff Wolfeschlegelsteinhausenbergerdorff';

const meta: Meta<typeof Avatar> = {
	title: 'Primitive Components/Avatar',
	component: Avatar,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A small picture that stands for a person: their image when there is one, their initials when there is not. It is display only: it has no hover, no focus and no events. A clickable avatar is an `Avatar` inside a `Button` or a menu trigger, which owns the click and the focus.',
			},
		},
	},
	argTypes: {
		name: {
			control: 'text',
			type: { name: 'string', required: true },
			description:
				'The name of the person. The initials come from it, and it is the accessible name of the avatar. A name with two or more words gives the first letter of the first word and of the last one. One word gives its first letter. An email address uses the part before the `@`, and the dots in it do not split words. An empty or blank name shows a generic user icon, and the accessible name is `Unknown user`.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		src: {
			control: 'text',
			description:
				"The URL of the person's image. Without it, or when it fails to load, the avatar shows the initials. The initials stay until the image has loaded, and a new `src` loads again, even after the previous one failed.",
			table: { category: 'Content', type: { summary: 'string' } },
		},
		size: {
			control: 'inline-radio',
			type: { name: 'string', required: true },
			options: Object.values(AvatarSize),
			description:
				'The size of the avatar: `sm` is 24px with an 11px letter, `md` is 32px with a 13px letter. The same sizes as `Skeleton.Avatar`.',
			table: { category: 'Appearance', type: { summary: 'AvatarSizeType' } },
		},
		color: {
			control: 'select',
			type: { name: 'string', required: true },
			options: Object.values(AvatarColor),
			description:
				'Picks the fill behind the initials and the color of the initials. The generic user icon takes the same pair. Same palette as `Badge`. An image covers the fill once it has loaded.',
			table: { category: 'Appearance', type: { summary: 'AvatarColorType' } },
		},
		shape: {
			control: 'inline-radio',
			options: Object.values(AvatarShape),
			description: 'The shape of the avatar. Same union as `Skeleton.Avatar`.',
			table: {
				category: 'Appearance',
				type: { summary: 'AvatarShapeType' },
				defaultValue: { summary: 'circle' },
			},
		},
		'aria-hidden': {
			control: 'boolean',
			description:
				'Hides the avatar from a screen reader. Set it to `true` when the name is printed next to the avatar, so the name is not read twice. Every `aria-*` prop is forwarded to the avatar.',
			table: { category: 'Accessibility', type: { summary: 'boolean' } },
		},
		id: {
			control: 'text',
			description: 'Forwarded to the avatar.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the avatar as `data-testid`. The image takes `${testId}-image` and the initials or the icon take `${testId}-fallback`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		name: NAME,
		size: 'md',
		color: 'primary',
	},
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
	parameters: {
		// Every state it can be driven into is covered by `AvatarShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<div className="story-container">
			<Avatar {...args} />
		</div>
	),
};

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description?: ReactNode;
	children: ReactNode;
}): ReactElement {
	return (
		<section className="story-section" aria-label={title}>
			<Typography size="base" weight="semibold">
				{title}
			</Typography>
			{description === undefined ? null : <Typography size="sm">{description}</Typography>}
			<div className={styles.panel}>{children}</div>
		</section>
	);
}

function Row({ label, children }: { label: string; children: ReactNode }): ReactElement {
	return (
		<div className={styles.row}>
			<div className={styles.rowLabel}>
				<Typography size="sm" color="muted">
					{label}
				</Typography>
			</div>
			<div className="story-row-lg">{children}</div>
		</div>
	);
}

function RetryOnNewSrc(): ReactElement {
	const [src, setSrc] = useState(BROKEN_IMAGE);

	return (
		<div className="story-row-lg">
			<Avatar color="primary" name={NAME} size="md" src={src} testId="retry" />
			<Button
				variant="outlined"
				color="secondary"
				size="sm"
				onClick={() => setSrc(src === BROKEN_IMAGE ? PORTRAIT_IMAGE : BROKEN_IMAGE)}
			>
				Change the image
			</Button>
		</div>
	);
}

/**
 * Every state in one canvas: sizes, shapes, the eight colors, the image, a broken image, a new
 * `src` after a failure, the initials, an empty name, a long name, a narrow parent and an avatar
 * inside a button. The play function waits for every image to settle, checks each section on its
 * own, and blurs the buttons so the snapshot has no focus ring.
 */
export const AvatarShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	argTypes: {
		name: { control: false },
		src: { control: false },
		size: { control: false },
		shape: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section
				title="Sizes"
				description={
					<>
						<code>sm</code> is 24px with an 11px letter, <code>md</code> is 32px with a 13px letter.
						The same sizes as <code>Skeleton.Avatar</code>.
					</>
				}
			>
				{Object.values(AvatarSize).map((size) => (
					<Row key={size} label={size}>
						<Avatar color="primary" name={NAME} size={size} testId={`size-${size}`} />
					</Row>
				))}
			</Section>

			<Section
				title="Shapes"
				description="The avatar is a circle by default, or a square with rounded corners."
			>
				{Object.values(AvatarShape).map((shape) => (
					<Row key={shape} label={shape}>
						{Object.values(AvatarSize).map((size) => (
							<Avatar
								color="primary"
								key={size}
								name={NAME}
								size={size}
								shape={shape}
								testId={`shape-${shape}-${size}`}
							/>
						))}
					</Row>
				))}
			</Section>

			<Section
				title="Colors"
				description={
					<>
						<code>color</code> picks the fill and the color of the initials, the same eight as{' '}
						<code>Badge</code>. The generic user icon takes the same pair.
					</>
				}
			>
				{Object.values(AvatarColor).map((color) => (
					<Row key={color} label={color}>
						<Avatar color={color} name={NAME} size="sm" testId={`color-${color}-sm`} />
						<Avatar color={color} name={NAME} size="md" testId={`color-${color}-md`} />
						<Avatar
							color={color}
							name={NAME}
							size="md"
							shape="square"
							testId={`color-${color}-square`}
						/>
						<Avatar color={color} name="" size="md" testId={`color-${color}-empty`} />
					</Row>
				))}
			</Section>

			<Section
				title="Image"
				description="The image is cropped to fill the shape and centred, so a portrait or a landscape picture never stretches."
			>
				<Row label="portrait">
					<Avatar color="primary" name={NAME} size="sm" src={PORTRAIT_IMAGE} testId="image-sm" />
					<Avatar color="primary" name={NAME} size="md" src={PORTRAIT_IMAGE} testId="image-md" />
					<Avatar
						color="primary"
						name={NAME}
						size="md"
						shape="square"
						src={PORTRAIT_IMAGE}
						testId="image-square"
					/>
				</Row>
				<Row label="landscape">
					<Avatar
						color="primary"
						name={NAME}
						size="md"
						src={LANDSCAPE_IMAGE}
						testId="image-landscape"
					/>
				</Row>
			</Section>

			<Section
				title="Broken image"
				description="When the image fails to load, the initials stay. The image replaces them only once it has loaded, so the avatar is never an empty shape."
			>
				<Row label="broken">
					<Avatar color="primary" name={NAME} size="sm" src={BROKEN_IMAGE} testId="broken-sm" />
					<Avatar color="primary" name={NAME} size="md" src={BROKEN_IMAGE} testId="broken-md" />
					<Avatar
						color="primary"
						name={NAME}
						size="md"
						shape="square"
						src={BROKEN_IMAGE}
						testId="broken-square"
					/>
				</Row>
			</Section>

			<Section
				title="New image after a failure"
				description={
					<>
						A new <code>src</code> loads again, even after the previous one failed. A reused avatar
						in a list or a table never keeps the fallback of the row it showed before.
					</>
				}
			>
				<RetryOnNewSrc />
			</Section>

			<Section
				title="Initials"
				description={
					<>
						Two or more words give the first letter of the first word and of the last one. One word
						gives its first letter. An email address uses the part before the <code>@</code>, and
						the dots in it do not split words. The avatar shows at most two letters, in upper case.
					</>
				}
			>
				{INITIALS_CASES.map(({ label, name }, index) => (
					<Row key={label} label={label}>
						<Avatar color="primary" name={name} size="sm" testId={`initials-sm-${index}`} />
						<Avatar color="primary" name={name} size="md" testId={`initials-md-${index}`} />
						<div className={styles.caseName}>
							<Typography size="sm" color="muted">
								{name}
							</Typography>
						</div>
					</Row>
				))}
			</Section>

			<Section
				title="Empty name"
				description={
					<>
						An empty name, or one with only spaces, shows a generic user icon, and the accessible
						name is <code>Unknown user</code>. The avatar is not hidden, so a list keeps its
						alignment.
					</>
				}
			>
				<Row label="empty">
					<Avatar color="primary" name="" size="sm" testId="empty-sm" />
					<Avatar color="primary" name="" size="md" testId="empty-md" />
					<Avatar color="primary" name="" size="md" shape="square" testId="empty-square" />
				</Row>
				<Row label="spaces">
					<Avatar color="primary" name="   " size="md" testId="empty-spaces" />
				</Row>
				<Row label="broken image">
					<Avatar color="primary" name="" size="md" src={BROKEN_IMAGE} testId="empty-broken" />
				</Row>
			</Section>

			<Section
				title="Long name"
				description="A long name still gives two letters, and the avatar keeps its size."
			>
				<Row label="circle">
					<Avatar color="primary" name={LONG_NAME} size="sm" testId="long-sm" />
					<Avatar color="primary" name={LONG_NAME} size="md" testId="long-md" />
				</Row>
				<Row label="square">
					<Avatar color="primary" name={LONG_NAME} size="md" shape="square" testId="long-square" />
				</Row>
			</Section>

			<Section
				title="Narrow parent"
				description="The avatar keeps its size in a flex row that is too narrow, and clips the image and the initials to its shape."
			>
				<Row label="narrow flex row">
					<div className={styles.narrowRow}>
						<Avatar color="primary" name={NAME} size="md" testId="narrow-first" />
						<Avatar
							color="primary"
							name={NAME}
							size="md"
							src={LANDSCAPE_IMAGE}
							testId="narrow-image"
						/>
						<Avatar color="primary" name={NAME} size="md" shape="square" testId="narrow-square" />
					</div>
				</Row>
			</Section>

			<Section
				title="Inside a button"
				description={
					<>
						A clickable avatar is an <code>Avatar</code> inside a <code>Button</code>, which owns
						the click and the focus. The name is printed on the button, so the avatar is{' '}
						<code>aria-hidden</code> and a screen reader reads it once.
					</>
				}
			>
				<div className={styles.buttonRow}>
					<Button
						variant="ghost"
						color="secondary"
						size="md"
						prefix={
							<Avatar
								color="primary"
								name={NAME}
								size="sm"
								aria-hidden="true"
								testId="button-avatar"
							/>
						}
					>
						{NAME}
					</Button>
					<Button
						variant="outlined"
						color="secondary"
						size="md"
						icon
						aria-label={`Open the profile of ${NAME}`}
					>
						<Avatar
							color="primary"
							name={NAME}
							size="sm"
							src={PORTRAIT_IMAGE}
							aria-hidden="true"
							testId="icon-avatar"
						/>
					</Button>
				</div>
			</Section>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const section = (name: string): HTMLElement => canvas.getByRole('region', { name });

		const sizes = within(section('Sizes'));
		await expect(sizes.getByTestId('size-sm')).toHaveAttribute('data-size', 'sm');
		await expect(sizes.getByTestId('size-sm').getBoundingClientRect().width).toBe(24);
		await expect(sizes.getByTestId('size-md')).toHaveAttribute('data-size', 'md');
		await expect(sizes.getByTestId('size-md').getBoundingClientRect().width).toBe(32);

		const shapes = within(section('Shapes'));
		await expect(shapes.getByTestId('shape-circle-md')).toHaveAttribute('data-shape', 'circle');
		await expect(shapes.getByTestId('shape-square-md')).toHaveAttribute('data-shape', 'square');

		const colors = within(section('Colors'));
		for (const color of Object.values(AvatarColor)) {
			for (const variant of ['sm', 'md', 'square']) {
				const avatar = colors.getByTestId(`color-${color}-${variant}`);

				await expect(avatar).toHaveAttribute('data-color', color);
				await expect(colors.getByTestId(`color-${color}-${variant}-fallback`)).toHaveTextContent(
					'AE',
				);
			}

			await expect(colors.getByTestId(`color-${color}-empty`)).toHaveAttribute('data-color', color);
			await expect(
				colors.getByTestId(`color-${color}-empty-fallback`).querySelector('svg'),
			).not.toBeNull();
		}

		const image = within(section('Image'));
		for (const testId of ['image-sm', 'image-md', 'image-square', 'image-landscape']) {
			await waitFor(() =>
				expect(image.getByTestId(testId)).toHaveAttribute('data-image-status', 'loaded'),
			);
			await expect(image.getByTestId(`${testId}-image`)).toHaveAttribute('alt', '');
			await expect(image.queryByTestId(`${testId}-fallback`)).toBeNull();
		}
		await expect(image.getAllByRole('img', { name: NAME })).toHaveLength(4);

		const broken = within(section('Broken image'));
		for (const testId of ['broken-sm', 'broken-md', 'broken-square']) {
			await waitFor(() =>
				expect(broken.getByTestId(testId)).toHaveAttribute('data-image-status', 'error'),
			);
			await expect(broken.getByTestId(`${testId}-fallback`)).toHaveTextContent('AE');
			await expect(broken.queryByTestId(`${testId}-image`)).toBeNull();
		}

		const retry = within(section('New image after a failure'));
		const retryAvatar = retry.getByTestId('retry');
		await waitFor(() => expect(retryAvatar).toHaveAttribute('data-image-status', 'error'));
		await expect(retry.getByTestId('retry-fallback')).toHaveTextContent('AE');

		const change = retry.getByRole('button', { name: 'Change the image' });
		await userEvent.click(change);
		await waitFor(() => expect(retryAvatar).toHaveAttribute('data-image-status', 'loaded'));
		await expect(retry.queryByTestId('retry-fallback')).toBeNull();
		change.blur();

		const initials = within(section('Initials'));
		for (const [index, { initials: expected }] of INITIALS_CASES.entries()) {
			await expect(initials.getByTestId(`initials-sm-${index}-fallback`)).toHaveTextContent(
				expected,
			);
			await expect(initials.getByTestId(`initials-md-${index}-fallback`)).toHaveTextContent(
				expected,
			);
		}

		const empty = within(section('Empty name'));
		await expect(empty.getAllByRole('img', { name: 'Unknown user' })).toHaveLength(5);
		for (const testId of ['empty-sm', 'empty-md', 'empty-square', 'empty-spaces']) {
			const fallback = empty.getByTestId(`${testId}-fallback`);

			await expect(fallback).toHaveAttribute('aria-hidden', 'true');
			await expect(fallback.querySelector('svg')).not.toBeNull();
			await expect(fallback.textContent).toBe('');
		}
		await waitFor(() =>
			expect(empty.getByTestId('empty-broken')).toHaveAttribute('data-image-status', 'error'),
		);
		await expect(empty.getByTestId('empty-broken-fallback').querySelector('svg')).not.toBeNull();

		const long = within(section('Long name'));
		for (const testId of ['long-sm', 'long-md', 'long-square']) {
			await expect(long.getByTestId(`${testId}-fallback`)).toHaveTextContent('WW');
		}
		await expect(long.getByTestId('long-sm').getBoundingClientRect().width).toBe(24);
		await expect(long.getByTestId('long-md').getBoundingClientRect().width).toBe(32);

		const narrow = within(section('Narrow parent'));
		for (const testId of ['narrow-first', 'narrow-image', 'narrow-square']) {
			await expect(narrow.getByTestId(testId).getBoundingClientRect().width).toBe(32);
		}

		const inButton = within(section('Inside a button'));
		const labelled = inButton.getByRole('button', { name: NAME });
		const iconOnly = inButton.getByRole('button', { name: `Open the profile of ${NAME}` });

		await expect(inButton.queryByRole('img')).toBeNull();
		await expect(inButton.getByTestId('button-avatar')).not.toHaveAttribute('tabindex');
		await expect(inButton.getByTestId('icon-avatar')).not.toHaveAttribute('tabindex');

		labelled.focus();
		await expect(labelled).toHaveFocus();

		await userEvent.tab();
		await expect(iconOnly).toHaveFocus();
		await expect(inButton.getByTestId('icon-avatar')).not.toHaveFocus();

		iconOnly.blur();
	},
};
