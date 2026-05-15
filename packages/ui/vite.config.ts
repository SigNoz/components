import getViteLibConfig from '@repo/typescript-config/vite.config.extend';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const entries: Record<string, string> = {
	index: 'src/index.ts',
	'alert-dialog/index': 'src/alert-dialog/index.ts',
	'announcement-banner/index': 'src/announcement-banner/index.ts',
	'badge/index': 'src/badge/index.ts',
	'breadcrumb/index': 'src/breadcrumb/index.ts',
	'button/index': 'src/button/index.ts',
	'calendar/index': 'src/calendar/index.ts',
	'callout/index': 'src/callout/index.ts',
	'checkbox/index': 'src/checkbox/index.ts',
	'combobox/index': 'src/combobox/index.ts',
	'command/index': 'src/command/index.ts',
	'date-picker/index': 'src/date-picker/index.ts',
	'dialog/index': 'src/dialog/index.ts',
	'drawer/index': 'src/drawer/index.ts',
	'dropdown-menu/index': 'src/dropdown-menu/index.ts',
	'input/index': 'src/input/index.ts',
	'kbd/index': 'src/kbd/index.ts',
	'pagination/index': 'src/pagination/index.ts',
	'pin-list/index': 'src/pin-list/index.ts',
	'popover/index': 'src/popover/index.ts',
	'progress/index': 'src/progress/index.ts',
	'radio-group/index': 'src/radio-group/index.ts',
	'resizable/index': 'src/resizable/index.ts',
	'select/index': 'src/select/index.ts',
	'slider/index': 'src/slider/index.ts',
	'sonner/index': 'src/sonner/index.ts',
	'switch/index': 'src/switch/index.ts',
	'table/index': 'src/table/index.ts',
	'tabs/index': 'src/tabs/index.ts',
	'text-ellipsis/index': 'src/text-ellipsis/index.ts',
	'toggle/index': 'src/toggle/index.ts',
	'toggle-group/index': 'src/toggle-group/index.ts',
	'tooltip/index': 'src/tooltip/index.ts',
	'typography/index': 'src/typography/index.ts',
};

export default defineConfig(getViteLibConfig(entries, { plugins: [react()] }));
