import { ExpandedState } from '@tanstack/react-table';

export interface TablePreferences {
	columnOrder?: string[];
	columnVisibility?: Record<string, boolean>;
	columnSizing?: Record<string, number>;
	sortState?: { id: string; desc: boolean }[];
	rowSelection?: Record<string, boolean>;
	expanded?: ExpandedState;
}

const PREFERENCES_KEY_PREFIX = 'table-preferences-';

export const getTablePreferences = (tableId: string): TablePreferences => {
	if (typeof window === 'undefined') return {};

	const stored = localStorage.getItem(`${PREFERENCES_KEY_PREFIX}${tableId}`);
	return stored ? JSON.parse(stored) : {};
};

export const saveTablePreferences = (
	tableId: string,
	preferences: TablePreferences,
) => {
	if (typeof window === 'undefined') return;

	localStorage.setItem(
		`${PREFERENCES_KEY_PREFIX}${tableId}`,
		JSON.stringify(preferences),
	);
};

export const resetTablePreferences = (tableId: string) => {
	if (typeof window === 'undefined') return;

	localStorage.removeItem(`${PREFERENCES_KEY_PREFIX}${tableId}`);
};
