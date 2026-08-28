import {
	Button,
	Popover,
	PopoverAnchor,
	PopoverClose,
	PopoverContent,
	PopoverSimple,
	PopoverTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Popover',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Popover.Root / Portal / Positioner / Popup. Positioning props moved to a Positioner layer, and Base UI has no Anchor part so ours registers its element for the positioner.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Popover.Root / Portal / Positioner / Popup / Arrow"
			notes={[
				'Radix took positioning props on Content; Base UI splits them across a Positioner (placement) and a Popup (the styled box). Our PopoverContent keeps every prop name and forwards it internally.',
				'avoidCollisions is translated to Base UI’s per-axis collisionAvoidance, and sticky="always" to a boolean.',
				'forceMount became keepMounted on the portal; withPortal={false} points the portal at an in-place container, because Base UI requires a Portal above the Positioner.',
			]}
		>
			<Demo title="Preset">
				<PopoverSimple trigger={<Button>Open popover</Button>} arrow>
					<Typography.Text>Anchored to the trigger.</Typography.Text>
				</PopoverSimple>
			</Demo>

			<Demo title="Placement">
				<PopoverSimple trigger={<Button>Bottom start</Button>} side="bottom" align="start">
					<Typography.Text>side and align read the same as before.</Typography.Text>
				</PopoverSimple>
				<PopoverSimple trigger={<Button>Right</Button>} side="right" arrow>
					<Typography.Text>Positioned to the right.</Typography.Text>
				</PopoverSimple>
			</Demo>

			<Demo title="Composed with a close button">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outlined">Composed</Button>
					</PopoverTrigger>
					<PopoverContent arrow>
						<Typography.Text>Root / Trigger / Content / Close.</Typography.Text>
						<PopoverClose asChild>
							<Button variant="ghost">Close</Button>
						</PopoverClose>
					</PopoverContent>
				</Popover>
			</Demo>
		</BaseUIPanel>
	),
};

export const Anchor: StoryObj = {
	name: 'Anchor',
	render: () => (
		<BaseUIPanel
			parts="Positioner anchor prop"
			notes={[
				'Base UI ships no Anchor part — the positioner takes an anchor element directly.',
				'PopoverAnchor therefore registers its own element through context, so the public component keeps working unchanged.',
			]}
		>
			<Demo title="Anchored to a row, not the trigger" wide>
				<PopoverAnchor>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<Typography.Text>This whole row is the anchor</Typography.Text>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outlined">Open</Button>
							</PopoverTrigger>
							<PopoverContent arrow>
								<Typography.Text>Positioned against the row.</Typography.Text>
							</PopoverContent>
						</Popover>
					</div>
				</PopoverAnchor>
			</Demo>
		</BaseUIPanel>
	),
};

export const OutsideInteraction: StoryObj = {
	name: 'Outside interaction',
	render: () => (
		<BaseUIPanel
			parts="Popover.Backdrop, root onOpenChange"
			notes={[
				'disableOutsidePointerEvents renders a transparent Popover.Backdrop, which blocks outside interaction the way Radix’s prop did.',
				'Base UI reports escape and outside presses on the root, so onEscapeKeyDown / onPointerDownOutside / onFocusOutside / onInteractOutside are registered upwards from the content and still honour preventDefault().',
			]}
		>
			<Demo title="Blocking outside pointer events">
				<PopoverSimple
					trigger={<Button>Open with backdrop</Button>}
					disableOutsidePointerEvents
					arrow
				>
					<Typography.Text>Clicks outside close this before reaching the page.</Typography.Text>
				</PopoverSimple>
			</Demo>

			<Demo title="Escape is prevented">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outlined">Escape does nothing</Button>
					</PopoverTrigger>
					<PopoverContent onEscapeKeyDown={(event) => event.preventDefault()} arrow>
						<Typography.Text>Press Escape — the callback prevents the dismissal.</Typography.Text>
						<PopoverClose asChild>
							<Button variant="ghost">Close</Button>
						</PopoverClose>
					</PopoverContent>
				</Popover>
			</Demo>
		</BaseUIPanel>
	),
};
