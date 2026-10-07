import { type Callout, CalloutColor, CalloutSize } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const COLORS = Object.values(CalloutColor);
export const SIZES = Object.values(CalloutSize);

export const TITLE = 'What is instrumentation?';
export const DESCRIPTION =
	"Instrumentation means the ability to measure the performance and to diagnose errors in your application code. Instrumenting a piece of software means generating relevant data like logs, metrics, and traces to gauge the software's performance.";

export const calloutParameters: Meta<typeof Callout>['parameters'] = {
	layout: 'fullscreen',
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-749&m=dev',
	},
};

/**
 * The `Callout` props. Its static members take them too, so `callout-components.stories.tsx`
 * shares them with `callout.stories.tsx`.
 */
export const calloutArgTypes: Meta<typeof Callout>['argTypes'] = {
	children: {
		control: 'text',
		description:
			'The description. It wraps, and scrolls once the callout has no height left. `Callout` renders nothing while it is empty.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	icon: {
		control: false,
		description:
			'Required. The icon that carries the severity, sized by the callout and hidden from assistive tech.',
		table: { category: 'Content', type: { summary: 'ReactElement' } },
	},
	color: {
		control: 'select',
		options: COLORS,
		description:
			'The color intent, which sets the tint and the live region role. `danger` and `highlight-danger` are `role="alert"`, every other color is `role="status"`. `Callout.Expandable` has no live role.',
		table: { category: 'Appearance', type: { summary: 'CalloutColorType' } },
	},
	size: {
		control: 'inline-radio',
		options: SIZES,
		description: 'The type scale and the icon size.',
		table: { category: 'Appearance', type: { summary: 'CalloutSizeType' } },
	},
	width: {
		control: 'text',
		description: 'The width of the callout. It fills its parent when omitted.',
		table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
	},
	maxWidth: {
		control: 'text',
		description: 'The max-width of the callout.',
		table: {
			category: 'Appearance',
			type: { summary: 'CSSProperties["maxWidth"]' },
			defaultValue: { summary: '100%' },
		},
	},
	height: {
		control: 'text',
		description: 'The height of the callout. It grows with the content when omitted.',
		table: { category: 'Appearance', type: { summary: 'CSSProperties["height"]' } },
	},
	maxHeight: {
		control: 'text',
		description: 'The max-height of the callout. Past it, the description scrolls.',
		table: {
			category: 'Appearance',
			type: { summary: 'CSSProperties["maxHeight"]' },
			defaultValue: { summary: '100%' },
		},
	},
	testId: {
		control: 'text',
		description:
			'Forwarded as `data-testid`. The parts derive theirs from it: `-icon`, `-title`, `-description`, `-toggle`, `-close` and `-action`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
