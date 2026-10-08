import { type AlertStrip, AlertStripColor, AlertStripSide } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const COLORS = Object.values(AlertStripColor);

export const SIDES = Object.values(AlertStripSide);

export const MESSAGE = 'Need help with setup? Upgrade now and get expert assistance.';

export const alertStripParameters: Meta<typeof AlertStrip>['parameters'] = {
	layout: 'fullscreen',
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=1884-7447&m=dev',
	},
};

/**
 * The `AlertStrip` props. Its static members take them too, so
 * `alert-strip-components.stories.tsx` shares them with `alert-strip.stories.tsx`.
 */
export const alertStripArgTypes: Meta<typeof AlertStrip>['argTypes'] = {
	children: {
		control: 'text',
		description:
			'Required. The message, with any `AlertStrip.Link` inside the sentence. It wraps to a second line and the strip grows. The strip renders nothing while it is empty.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	prefix: {
		control: false,
		description:
			'Rendered before the message, such as an icon. It never shrinks or wraps. The strip sets the size of the icon and paints it in its text color. An icon does not name the severity for a screen reader, the message still does.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	suffix: {
		control: false,
		description:
			'The `AlertStrip.Button` or `AlertStrip.Link` the user acts on, at the end of the region and before the close button. It never shrinks or wraps, so the message wraps first.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	color: {
		control: 'select',
		options: COLORS,
		description:
			'Required. The color intent, which sets the fill and the live region role. `danger` and `highlight-danger` are `role="alert"`, every other color is `role="status"`.',
		table: { category: 'Appearance', type: { summary: 'AlertStripColorType' } },
	},
	side: {
		control: 'inline-radio',
		options: SIDES,
		description:
			'Required. The edge of the page the strip sits on. The bar runs along that edge and the region rises from it. The strip does not move there, render it at that edge.',
		table: { category: 'Appearance', type: { summary: 'AlertStripSideType' } },
	},
	id: {
		control: 'text',
		description: 'Forwarded to the strip.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the strip as `data-testid`. The parts take `{testId}-prefix`, `{testId}-content`, `{testId}-suffix` and `{testId}-close`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
