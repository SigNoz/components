# Signoz Components Library

React component library powered by Turborepo, React, and Storybook.

## Install & Use

Install the packages you need. You must install and configure `@signozhq/tailwind-config` first, since all components depend on its theme and utilities.

```sh
pnpm add @signozhq/tailwind-config @signozhq/design-tokens @signozhq/components
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
| `@signozhq/components`      | All UI components (single package with subpath exports)           |

All components live in `@signozhq/components`. Import by subpath:

```ts
import { Badge } from '@signozhq/components/badge';
import { Button } from '@signozhq/components/button';
import { Calendar } from '@signozhq/components/calendar';
import { Callout } from '@signozhq/components/callout';
import { Checkbox } from '@signozhq/components/checkbox';
import { Combobox } from '@signozhq/components/combobox';
import { Command } from '@signozhq/components/command';
import { DatePicker } from '@signozhq/components/date-picker';
import { Dialog } from '@signozhq/components/dialog';
import { Drawer } from '@signozhq/components/drawer';
import { Dropdown } from '@signozhq/components/dropdown-menu';
import { Input } from '@signozhq/components/input';
import { Pagination } from '@signozhq/components/pagination';
import { PinList } from '@signozhq/components/pin-list';
import { Popover } from '@signozhq/components/popover';
import { RadioGroup } from '@signozhq/components/radio-group';
import { ResizablePanelGroup } from '@signozhq/components/resizable';
import { Toaster } from '@signozhq/components/sonner';
import { Switch } from '@signozhq/components/switch';
import { Table } from '@signozhq/components/table';
import { Tabs } from '@signozhq/components/tabs';
import { ToggleGroup } from '@signozhq/components/toggle-group';
import { Tooltip } from '@signozhq/components/tooltip';
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for getting started, useful commands, and how to add a new component.
