import {
	Button,
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipSimple,
	TooltipTrigger,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Tooltip',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Tooltip.Root / Portal / Positioner / Popup. Base UI treats tooltips as visual-only, so the popup carries no role="tooltip" and the trigger gets no aria-describedby.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Tooltip.Root / Portal / Positioner / Popup / Arrow"
			notes={[
				'Positioning props moved to a Positioner layer; our TooltipContent keeps every prop name and forwards them internally.',
				'The hover delay lives on the trigger in Base UI, so delayDuration is passed down from the provider or root through context.',
				'disableHoverableContent maps to Base UI’s disableHoverablePopup on the root.',
			]}
		>
			<Demo title="Preset">
				<TooltipProvider delayDuration={0}>
					<TooltipSimple title="Positioned by Base UI" arrow>
						<Button>Hover me</Button>
					</TooltipSimple>
				</TooltipProvider>
			</Demo>

			<Demo title="Placement">
				<TooltipProvider delayDuration={0}>
					<TooltipSimple title="On the right" side="right">
						<Button variant="outlined">Right</Button>
					</TooltipSimple>
					<TooltipSimple title="Below, aligned start" side="bottom" align="start" arrow>
						<Button variant="outlined">Bottom start</Button>
					</TooltipSimple>
				</TooltipProvider>
			</Demo>

			<Demo title="Composed">
				<TooltipProvider delayDuration={0}>
					<TooltipRoot>
						<TooltipTrigger asChild>
							<Button variant="ghost">Root / Trigger / Content</Button>
						</TooltipTrigger>
						<TooltipContent arrow side="bottom">
							<span>Rich tooltip content</span>
						</TooltipContent>
					</TooltipRoot>
				</TooltipProvider>
			</Demo>
		</BaseUIPanel>
	),
};

export const AccessibilityModel: StoryObj = {
	name: 'Accessibility model',
	render: () => (
		<BaseUIPanel
			parts="Tooltip.Popup, no tooltip role"
			notes={[
				'BREAKING: Base UI treats tooltips as supplementary visual hints. The popup has no role="tooltip" and the trigger is not given an aria-describedby pointing at it, both of which Radix provided.',
				'A trigger whose only accessible name came from its tooltip now has none — give it an aria-label that matches the tooltip text.',
			]}
		>
			<Demo title="Icon-only trigger, labelled">
				<TooltipProvider delayDuration={0}>
					<TooltipSimple title="Delete" arrow>
						<Button aria-label="Delete" variant="outlined">
							⌫
						</Button>
					</TooltipSimple>
				</TooltipProvider>
			</Demo>

			<Demo title="Text trigger">
				<TooltipProvider delayDuration={0}>
					<TooltipSimple title="The label already names the control">
						<Button variant="ghost">Retention settings</Button>
					</TooltipSimple>
				</TooltipProvider>
			</Demo>
		</BaseUIPanel>
	),
};

export const Dismissal: StoryObj = {
	name: 'Dismissal callbacks',
	render: () => (
		<BaseUIPanel
			parts="root onOpenChange, bridged to content callbacks"
			notes={[
				'Base UI reports escape and outside presses on the root rather than the content, so onEscapeKeyDown and onPointerDownOutside are registered upwards and still honour preventDefault().',
				'Browsers with CloseWatcher report Escape under a different reason; both are treated as an escape.',
			]}
		>
			<Demo title="Escape is prevented">
				<TooltipProvider delayDuration={0}>
					<TooltipRoot defaultOpen>
						<TooltipTrigger asChild>
							<Button variant="outlined">Stays open on Escape</Button>
						</TooltipTrigger>
						<TooltipContent onEscapeKeyDown={(event) => event.preventDefault()} arrow>
							<Typography.Text>Escape is cancelled by the callback.</Typography.Text>
						</TooltipContent>
					</TooltipRoot>
				</TooltipProvider>
			</Demo>
		</BaseUIPanel>
	),
};
