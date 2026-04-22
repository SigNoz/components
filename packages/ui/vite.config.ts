import getViteLibConfig from '@repo/typescript-config/vite.config.extend';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const entries: Record<string, string> = {
	index: 'src/index.ts',
	'badge/index': 'src/badge/index.ts',
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
	'radio-group/index': 'src/radio-group/index.ts',
	'resizable/index': 'src/resizable/index.ts',
	'sonner/index': 'src/sonner/index.ts',
	'switch/index': 'src/switch/index.ts',
	'table/index': 'src/table/index.ts',
	'tabs/index': 'src/tabs/index.ts',
	'toggle-group/index': 'src/toggle-group/index.ts',
	'tooltip/index': 'src/tooltip/index.ts',
};

export default defineConfig(getViteLibConfig(entries, { plugins: [react()] }));
