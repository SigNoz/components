import { Kbd, KbdMode } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { kbdArgTypes, kbdParameters } from './shared/kbd-arg-types.js';

/**
 * The static members of `Kbd`, grouped under `Kbd/Components` in the sidebar. They are documented
 * on the `Kbd` page, `kbd.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof Kbd> = {
	title: 'Primitive Components/Kbd/Components',
	component: Kbd,
	tags: ['!autodocs'],
	parameters: kbdParameters,
	argTypes: kbdArgTypes,
};

export default meta;

/**
 * `Kbd.Shortcut` draws more than one key: a chord, keys held together (`⌘ K`), or a sequence, keys
 * pressed one after the other (`G` then `D`). It renders one `kbd` holding a `kbd` per key.
 */
export const Shortcut: StoryObj<typeof Kbd.Shortcut> = {
	parameters: {
		// Every state of `Kbd.Shortcut` is covered by `KbdShowcase`.
		chromatic: { disableSnapshot: true },
		// The `Kbd` props are declared on the parent `Meta`; `Kbd.Shortcut` takes no `value`.
		controls: { exclude: ['value'] },
	},
	args: {
		keys: ['Mod', 'K'],
		mode: 'chord',
		disabled: false,
		pressed: false,
	},
	argTypes: {
		keys: {
			control: 'object',
			description:
				"Required. The keys of the shortcut, each one a `value` as `Kbd` takes it. Modifiers (`Shift`, `Meta`, `Alt`, `Control` and `Mod`) are drawn first, in the order given, so `['K', 'Mod']` draws `⌘ K`. An empty list renders nothing.",
			table: { category: 'Content', type: { summary: 'ReadonlyArray<KbdKey>' } },
		},
		mode: {
			control: 'inline-radio',
			options: Object.values(KbdMode),
			description:
				'`chord` for keys held together (`⌘ K`), `sequence` for keys pressed one after the other (`G` then `D`). A sequence sits wider apart, keeps the keys in the order given and is read with "then" between the keys; a chord draws its modifiers first.',
			table: {
				category: 'Behavior',
				type: { summary: 'KbdModeType' },
				defaultValue: { summary: 'chord' },
			},
		},
		disabled: {
			control: 'boolean',
			description: 'Disables every key of the shortcut.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		pressed: {
			control: 'boolean',
			description:
				'Presses every key of the shortcut. The shortcut never listens to the keyboard, so set it while your own handler runs. A disabled shortcut stays at rest.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the outer `kbd` element as `data-testid`. Each key gets `{testId}-key-{index}`, counted in the order the keys are drawn, modifiers first.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description:
				'The id of the outer element, for the `aria-describedby` of the control that owns the shortcut.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
	},
	// Only the shortcut props reach `Kbd.Shortcut`, the `value` of the parent `Meta` stays out.
	render: ({ keys, mode, disabled, pressed, testId, id, display, ...rest }) => (
		<div className="story-container-full">
			<Kbd.Shortcut
				keys={keys}
				mode={mode}
				disabled={disabled}
				pressed={pressed}
				testId={testId}
				id={id}
				display={display}
				margin={rest.margin}
				marginX={rest.marginX}
				marginY={rest.marginY}
				marginTop={rest.marginTop}
				marginRight={rest.marginRight}
				marginBottom={rest.marginBottom}
				marginLeft={rest.marginLeft}
			/>
		</div>
	),
};
