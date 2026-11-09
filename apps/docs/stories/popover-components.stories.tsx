import {
	Button,
	ButtonColor,
	ButtonVariant,
	Popover,
	Typography,
	usePopoverHandle,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import styles from './popover.stories.module.css';

/**
 * The static members of `Popover`, grouped under `Popover/Components` in the sidebar. They are
 * documented on the `Popover` page, `popover.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof Popover> = {
	title: 'Composed Components/Popover/Components',
	component: Popover,
	tags: ['!autodocs'],
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
};

export default meta;

type Service = { id: string; name: string; owner: string; latency: string };

const SERVICES: Service[] = [
	{ id: 'frontend', name: 'frontend', owner: 'web team', latency: '84ms p99' },
	{ id: 'checkout', name: 'checkout', owner: 'payments team', latency: '212ms p99' },
	{ id: 'cart', name: 'cart', owner: 'payments team', latency: '47ms p99' },
];

type TriggerArgs = Pick<ComponentProps<typeof Popover.Trigger>, 'preview' | 'delay' | 'closeDelay'>;

/**
 * `Popover.Trigger` connects any element to the popover its `handle` is passed to. Every trigger of
 * one handle opens the same popup, which moves to the trigger and swaps its content for the
 * trigger's `payload`. With `preview` it is a hover card: it opens on hover and on the keyboard
 * focus, and the element keeps its own role and click.
 */
export const Trigger: StoryObj<TriggerArgs> = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	args: {
		preview: true,
		delay: 300,
		closeDelay: 150,
	},
	argTypes: {
		preview: {
			control: 'boolean',
			description:
				'Opens a card about the element instead of a dialog: on hover and on the keyboard focus, never on a press. The popup has no role and no name and takes no focus.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		delay: {
			control: 'number',
			description:
				'Milliseconds the pointer, or the keyboard focus of a `preview`, rests on the trigger before the popover opens. Only with `openOnHover` or `preview`.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '300' },
			},
		},
		closeDelay: {
			control: 'number',
			description:
				'Milliseconds after the pointer leaves before the popover closes: the time it has to cross onto the popup, or onto the next trigger.',
			table: { category: 'Behavior', type: { summary: 'number' }, defaultValue: { summary: '0' } },
		},
	},
	render: function TriggerStory(args) {
		const card = usePopoverHandle<Service>();

		return (
			<div className={styles.roomBelow}>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					Move the pointer, or the focus, along the services. One popup follows it and swaps its
					content.
				</Typography>
				<div className={styles.serviceRow}>
					{SERVICES.map((service) =>
						args.preview ? (
							<Popover.Trigger
								key={service.id}
								handle={card}
								payload={service}
								nativeButton={false}
								preview
								delay={args.delay}
								closeDelay={args.closeDelay}
							>
								<Typography.Link
									variant="label"
									size="base"
									weight="medium"
									textOverflow="visible"
									href={`#${service.id}`}
								>
									{service.name}
								</Typography.Link>
							</Popover.Trigger>
						) : (
							<Popover.Trigger key={service.id} handle={card} payload={service} nativeButton>
								<Button variant={ButtonVariant.Outlined} color={ButtonColor.Secondary} size="md">
									{service.name}
								</Button>
							</Popover.Trigger>
						),
					)}
				</div>
				<Popover handle={card} side="bottom" align="start" aria-label="Service">
					{(service) =>
						service === undefined ? null : (
							<div className={styles.serviceCard}>
								<Typography
									variant="label"
									size="base"
									weight="medium"
									color="main"
									as="p"
									textOverflow="wrap"
								>
									{service.name}
								</Typography>
								<Typography
									variant="paragraph"
									size="small"
									weight="regular"
									color="secondary"
									as="p"
									textOverflow="wrap"
								>
									{service.owner} · {service.latency}
								</Typography>
							</div>
						)
					}
				</Popover>
			</div>
		);
	},
};
