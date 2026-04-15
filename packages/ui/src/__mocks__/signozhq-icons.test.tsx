import { describe, expect, it } from 'vitest';
import * as icons from './signozhq-icons.js';

const requiredIconExports = [
	'ArrowUpDown',
	'Calendar',
	'Check',
	'ChevronDown',
	'ChevronLeft',
	'ChevronRight',
	'ChevronsLeft',
	'ChevronsRight',
	'ChevronUp',
	'CircleAlert',
	'CircleCheckBig',
	'Ellipsis',
	'Eye',
	'EyeOff',
	'Filter',
	'GripVertical',
	'Info',
	'LoaderCircle',
	'Lock',
	'Minus',
	'MousePointerClick',
	'Pin',
	'PinOff',
	'Search',
	'Slash',
	'SolidAlertTriangle',
	'SolidCheckCircle2',
	'SolidInfoCircle',
	'SolidXCircle',
	'TriangleAlert',
	'X',
] as const;

describe('@signozhq/icons mock coverage', () => {
	it('exports every icon currently used by the UI package', () => {
		const iconModule = icons as Record<string, unknown>;

		for (const iconName of requiredIconExports) {
			expect(iconModule[iconName]).toBeTypeOf('function');
		}
	});
});
