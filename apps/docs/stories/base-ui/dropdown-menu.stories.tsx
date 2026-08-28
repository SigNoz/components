import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuMultiStep,
	DropdownMenuMultiStepContent,
	DropdownMenuMultiStepTrigger,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Dropdown Menu',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Backed by Menu.Root / Positioner / Popup / Item. The last component to move, and the one that removed the final Radix package.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="Menu.Root / Portal / Positioner / Popup / Item / Group / GroupLabel / Separator"
			notes={[
				'Positioning props moved to a Positioner layer; every public prop name is unchanged.',
				'Base UI has no onSelect — it reports a plain click and closes itself. Our onSelect is rebuilt on top of onClick, using the event’s preventBaseUIHandler() so that preventDefault() still keeps the menu open.',
				'Base UI’s GroupLabel must sit inside a Group, which Radix’s Label did not require, so a label outside a group falls back to a plain element.',
			]}
		>
			<Demo title="Items, icons and shortcuts">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>Open menu</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem clickable>
							Edit
							<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem clickable>Duplicate</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem clickable destructive>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</Demo>

			<Demo title="Groups">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outlined">Grouped</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuGroup>
							<DropdownMenuLabel>Signals</DropdownMenuLabel>
							<DropdownMenuItem clickable>Logs</DropdownMenuItem>
							<DropdownMenuItem clickable>Traces</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</Demo>

			<Demo title="Submenu">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost">With submenu</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem clickable>Open</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								<DropdownMenuItem clickable>Export</DropdownMenuItem>
								<DropdownMenuItem clickable>Share</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>
			</Demo>
		</BaseUIPanel>
	),
};

export const Selection: StoryObj = {
	name: 'Checkbox and radio items',
	render: () => {
		function Selectable() {
			const [wrap, setWrap] = useState(true);
			const [signal, setSignal] = useState('logs');

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>View options</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
							Wrap lines
						</DropdownMenuCheckboxItem>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup value={signal} onValueChange={setSignal}>
							<DropdownMenuRadioItem value="logs">Logs</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="traces">Traces</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		}

		return (
			<BaseUIPanel
				parts="Menu.CheckboxItem / RadioGroup / RadioItem and their indicators"
				notes={[
					'ItemIndicator split into CheckboxItemIndicator and RadioItemIndicator.',
					'Checkbox items keep the menu open, as they always did — expressed now as closeOnClick={false} rather than by preventing the select event.',
					'Base UI reports (value, eventDetails) to onValueChange; the public callback still takes just the value.',
				]}
			>
				<Demo title="Toggles and a radio group">
					<Selectable />
				</Demo>
			</BaseUIPanel>
		);
	},
};

export const MultiStep: StoryObj = {
	name: 'Multi-step',
	render: () => (
		<BaseUIPanel
			parts="Menu.Item with Base UI's own click handling suppressed"
			notes={[
				'Base UI ships no multi-step menu; the step state stays ours.',
				'Stepping forward and back must not close the menu, so the trigger calls preventBaseUIHandler() and the back item sets closeOnClick={false}.',
			]}
		>
			<Demo title="Two steps in one menu">
				<DropdownMenuMultiStep>
					<DropdownMenuTrigger asChild>
						<Button>Configure</Button>
					</DropdownMenuTrigger>
					<DropdownMenuMultiStepContent
						secondaryLabel="Back to actions"
						primaryContent={
							<DropdownMenuMultiStepTrigger>Notification settings</DropdownMenuMultiStepTrigger>
						}
						secondaryContent={
							<>
								<DropdownMenuItem clickable>Email</DropdownMenuItem>
								<DropdownMenuItem clickable>Slack</DropdownMenuItem>
							</>
						}
					/>
				</DropdownMenuMultiStep>
			</Demo>
		</BaseUIPanel>
	),
};
