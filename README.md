# Signoz Components Library

React component library powered by Turborepo, React, and Storybook.

## Install & Use

To use the Signoz components library, you need to install the following packages:

```sh
pnpm add @signozhq/design-tokens @signozhq/ui
```

In your app’s main CSS file (e.g. `index.css` or `global.css`), import the following css:

```css
@import "@signozhq/design-tokens/dist/style.css";
@import '@signozhq/design-tokens/dist/themes/signoz-tokens.css';
```

Then you need to add the data attribute in your element `body` or `html` to select the theme:

```html
<html lang="en" data-theme="default">
```

If you want to toggle/change between themes, you just need to update the value of the attribute `data-theme`.

> **tip**: Take a look at [./apps/docs/blue-demo.css](./apps/docs/blue-demo.css) to learn how to create a new theme.

### How to use with Tailwind

In case you want to have our design tokens exposed directly to Tailwind, you can install the following package:

```sh
pnpm add @signozhq/tailwind-config
```

And then import the following css:

```css
@import 'tailwindcss';
@config "@signozhq/tailwind-config";
@import '@signozhq/tailwind-config/global.css';
```

## Storybook

To learn more about the available components, take a look at: https://periscope.signoz.io/

## Available Packages

| Package                     | Description                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| `@signozhq/tailwind-config` | Tailwind config, design tokens, and `global.css` (required first) |
| `@signozhq/ui`              | All UI components (single package with subpath exports)           |

All components live in `@signozhq/ui`. Import from the barrel or from the component's own
subpath — both are published, and both tree-shake:

```ts
import { Badge } from '@signozhq/ui';         // barrel
import { Badge } from '@signozhq/ui/badge';   // subpath
```

The full set:

```ts
import { AlertDialog } from '@signozhq/ui';
import { AnnouncementBanner } from '@signozhq/ui';
import { Avatar } from '@signozhq/ui';
import { Badge } from '@signozhq/ui';
import { Breadcrumb } from '@signozhq/ui';
import { Button } from '@signozhq/ui';
import { ButtonGroup } from '@signozhq/ui';
import { Calendar } from '@signozhq/ui';
import { Callout } from '@signozhq/ui';
import { Checkbox } from '@signozhq/ui';
import { Combobox } from '@signozhq/ui';
import { Command } from '@signozhq/ui';
import { DatePicker } from '@signozhq/ui';
import { Dialog } from '@signozhq/ui';
import { Divider } from '@signozhq/ui';
import { Drawer } from '@signozhq/ui';
import { DropdownMenu } from '@signozhq/ui';
import { Input } from '@signozhq/ui';
import { InputNumber } from '@signozhq/ui';
import { Kbd } from '@signozhq/ui';
import { Pagination } from '@signozhq/ui';
import { Progress } from '@signozhq/ui';
import { PinList } from '@signozhq/ui';
import { Popover } from '@signozhq/ui';
import { RadioGroup } from '@signozhq/ui';
import { ResizablePanelGroup } from '@signozhq/ui';
import { Select } from '@signozhq/ui';
import { Skeleton } from '@signozhq/ui';
import { Slider } from '@signozhq/ui';
import { Switch } from '@signozhq/ui';
import { Table } from '@signozhq/ui';
import { Tabs } from '@signozhq/ui';
import { TextEllipsis } from '@signozhq/ui';
import { Toaster } from '@signozhq/ui';
import { Toggle } from '@signozhq/ui';
import { ToggleGroup } from '@signozhq/ui';
import { Tooltip } from '@signozhq/ui';
import { Typography } from '@signozhq/ui';
```

## Contributing

Start with [CONTRIBUTING.md](./CONTRIBUTING.md): setup, commands, and how to add a component.

| Doc | Read it for |
| --- | --- |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Setup, commands, adding a component |
| [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md) | The standard every component is held to |
| [BUILD.md](./BUILD.md) | Why the packaging, build and CSS work this way |
| [COMPONENT_AUDIT_RUBRIC.md](./COMPONENT_AUDIT_RUBRIC.md) | Scoring an existing component |
| [VISUAL_TESTING.md](./VISUAL_TESTING.md) | Chromatic and the `run-visual-testing` label |
| [RELEASE.md](./RELEASE.md) | How a version ships, and how to cut a hotfix |
