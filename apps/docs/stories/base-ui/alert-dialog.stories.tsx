import { AlertDialog, Button, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaseUIPanel, Demo } from './panel.js';

const meta: Meta = {
	title: 'Base UI/Alert Dialog',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'A thin composition over our Dialog, so it moved to Base UI with the dialog swap without any change of its own.',
			},
		},
	},
};

export default meta;

export const Overview: StoryObj = {
	name: 'Overview',
	render: () => (
		<BaseUIPanel
			parts="our DialogWrapper → Dialog.Root / Portal / Backdrop / Popup"
			notes={[
				'Nothing in this component changed: it composes our Dialog, so it followed the primitive underneath.',
				'Base UI ships a dedicated AlertDialog whose popup takes role="alertdialog" and ignores outside presses. Adopting it would be an accessibility upgrade and a separate change.',
			]}
		>
			<Demo title="Destructive confirmation">
				<AlertDialog
					trigger={<Button color="destructive">Delete report</Button>}
					title="Delete this report?"
					footer={
						<>
							<Button variant="ghost" color="secondary">
								Cancel
							</Button>
							<Button color="destructive">Delete</Button>
						</>
					}
				>
					<Typography.Text>This cannot be undone.</Typography.Text>
				</AlertDialog>
			</Demo>

			<Demo title="With a confirmation checkbox">
				<AlertDialog
					trigger={<Button variant="outlined">Delete with opt-out</Button>}
					title="Delete this report?"
					checkboxLabel="Do not ask me again"
					footer={<Button color="destructive">Delete</Button>}
				>
					<Typography.Text>The checkbox is part of the preset.</Typography.Text>
				</AlertDialog>
			</Demo>
		</BaseUIPanel>
	),
};
