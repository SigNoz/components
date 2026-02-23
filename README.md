# Signoz Components Library

React component library powered by Turborepo, React, and Storybook.

## Install & Use

Install the packages you need. You must install and configure `@signozhq/tailwind-config` first, since all components depend on its theme and utilities.

```sh
pnpm add @signozhq/tailwind-config @signozhq/theme
pnpm add @signozhq/button @signozhq/input
```

In your app’s main CSS file (e.g. `index.css` or `global.css`), import Tailwind and the shared config, then the tailwind-config **global.css**. The order matters:

1. `tailwindcss` and `@config` pointing to the tailwind-config.
2. `@signozhq/tailwind-config/global.css` (design tokens, CSS variables, and base styles).

Example (as in the [Storybook app](apps/docs/index.css)):

```css
@import 'tailwindcss';
@config "@signozhq/tailwind-config";
@import '@signozhq/tailwind-config/global.css';
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

Then use the theme provider and components:

```tsx
import { ThemeProvider } from '@signozhq/theme';
import { Button } from '@signozhq/button';
import { Input } from '@signozhq/input';

export default function App() {
  return (
    <ThemeProvider>
      <Button>Click me</Button>
      <Input placeholder="Type here" />
    </ThemeProvider>
  );
}
```

## Available Packages

| Package                     | Description                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| `@signozhq/tailwind-config` | Tailwind config, design tokens, and `global.css` (required first) |
| `@signozhq/theme`           | Theme provider and theme switcher                                 |
| `@signozhq/badge`           | Badge component                                                   |
| `@signozhq/button`          | Button component                                                  |
| `@signozhq/calendar`        | Calendar component                                                |
| `@signozhq/callout`         | Callout component                                                 |
| `@signozhq/checkbox`        | Checkbox component                                                |
| `@signozhq/combobox`        | Combobox component                                                |
| `@signozhq/command`         | Command palette component                                         |
| `@signozhq/date-picker`     | Date picker component                                             |
| `@signozhq/dialog`          | Dialog component                                                  |
| `@signozhq/drawer`          | Drawer component                                                  |
| `@signozhq/dropdown-menu`   | Dropdown menu component                                           |
| `@signozhq/input`           | Input component                                                   |
| `@signozhq/pagination`      | Pagination component                                              |
| `@signozhq/pin-list`        | Pin list component                                                |
| `@signozhq/popover`         | Popover component                                                 |
| `@signozhq/radio-group`     | Radio group component                                             |
| `@signozhq/resizable`       | Resizable panels component                                        |
| `@signozhq/sonner`          | Sonner toast component                                            |
| `@signozhq/switch`          | Switch component                                                  |
| `@signozhq/table`           | Table component                                                   |
| `@signozhq/tabs`            | Tabs component                                                    |
| `@signozhq/tooltip`         | Tooltip component                                                 |
| `@signozhq/toggle-group`    | Toggle group component                                            |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for getting started, useful commands, and how to create a new package.
