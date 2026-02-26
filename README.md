# Signoz Components Library

React component library powered by Turborepo, React, and Storybook.

## Install & Use

Install the packages you need. You must install and configure `@signozhq/tailwind-config` first, since all components depend on its theme and utilities.

```sh
pnpm add @signozhq/tailwind-config @signozhq/design-tokens @signozhq/ui
```

In your app’s main CSS file (e.g. `index.css` or `global.css`), import Tailwind and the shared config, then the tailwind-config **global.css**. The order matters:

1. `tailwindcss` and `@config` pointing to the tailwind-config.
2. `@signozhq/tailwind-config/global.css` (CSS variables, and base styles).
3. `@signozhq/design-tokens/dist/style.css` (design tokens and base styles).
4. `@signozhq/design-tokens/dist/themes/signoz-tokens.css` (default theme).
5. `@source "./node_modules/@signozhq/*"` to compile the Tailwind at the components.

Example (as in the [Storybook app](apps/docs/index.css)):

```css
@import 'tailwindcss';
@config "@signozhq/tailwind-config";
@import '@signozhq/tailwind-config/global.css';
@import "@signozhq/design-tokens/dist/style.css";
@import '@signozhq/design-tokens/dist/themes/signoz-tokens.css';
@source "./node_modules/@signozhq/*";
```

> It's important to use `@source` with the path to the `node_modules/@signozhq/*` directory to ensure that the components using Tailwind classes are able to resolve the correct Tailwind config.

If you use Vite with the Tailwind plugin, pass the same config (see [Storybook `main.js`](apps/docs/.storybook/main.js)):

```js
import tailwindConfig from '@signozhq/tailwind-config';
import tailwindcss from '@tailwindcss/vite';

export default {
  plugins: [tailwindcss(tailwindConfig)],
};
```

Then you need to add the data attribute in your element `body` or `html` to select the theme:

```html
<html lang="en" data-theme="default">
```

If you want to toggle/change between themes, you just need to update the value of the attribute `data-theme`.

> **tip**: Take a look at [./apps/docs/blue-demo.css](./apps/docs/blue-demo.css) to learn how to create a new theme.

## Storybook

To learn more about the available components, take a look at: https://periscope.signoz.io/

## Available Packages

| Package                     | Description                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| `@signozhq/tailwind-config` | Tailwind config, design tokens, and `global.css` (required first) |
| `@signozhq/ui`              | All UI components (single package with subpath exports)           |

All components live in `@signozhq/ui`. Import by subpath:

```ts
import { Badge } from '@signozhq/ui';
import { Button } from '@signozhq/ui';
import { Calendar } from '@signozhq/ui';
import { Callout } from '@signozhq/ui';
import { Checkbox } from '@signozhq/ui';
import { Combobox } from '@signozhq/ui';
import { Command } from '@signozhq/ui';
import { DatePicker } from '@signozhq/ui';
import { Dialog } from '@signozhq/ui';
import { Drawer } from '@signozhq/ui';
import { Dropdown } from '@signozhq/ui';
import { Input } from '@signozhq/ui';
import { Pagination } from '@signozhq/ui';
import { PinList } from '@signozhq/ui';
import { Popover } from '@signozhq/ui';
import { RadioGroup } from '@signozhq/ui';
import { ResizablePanelGroup } from '@signozhq/ui';
import { Toaster } from '@signozhq/ui';
import { Switch } from '@signozhq/ui';
import { Table } from '@signozhq/ui';
import { Tabs } from '@signozhq/ui';
import { ToggleGroup } from '@signozhq/ui';
import { Tooltip } from '@signozhq/ui';
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for getting started, useful commands, and how to add a new component.
