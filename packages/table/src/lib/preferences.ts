import { ExpandedState } from '@tanstack/react-table';

export interface TablePreferences {
	columnOrder?: string[];
	columnVisibility?: Record<string, boolean>;
	columnSizing?: Record<string, number>;
	sortState?: { id: string; desc: boolean }[];
	rowSelection?: Record<string, boolean>;
	expanded?: ExpandedState;
	scrollPosition?: { top: number; left: number };
	pagination?: { pageIndex: number; pageSize: number };
}

const PREFERENCES_KEY_PREFIX = 'table-preferences-';

export const getTablePreferences = (tableId: string): TablePreferences => {
	if (typeof window === 'undefined') return {};

	try {
		const stored = localStorage.getItem(`${PREFERENCES_KEY_PREFIX}${tableId}`);
		return stored ? JSON.parse(stored) : {};
	} catch {
		return {};
	}
};

export const saveTablePreferences = (
	tableId: string,
	preferences: TablePreferences,
) => {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(
			`${PREFERENCES_KEY_PREFIX}${tableId}`,
			JSON.stringify(preferences),
		);
	} catch {
		// Silently ignore in environments where storage is unavailable (e.g., Chromatic/CI)
	}
};

export const resetTablePreferences = (tableId: string) => {
	if (typeof window === 'undefined') return;

	try {
		localStorage.removeItem(`${PREFERENCES_KEY_PREFIX}${tableId}`);
	} catch {
		// Silently ignore in environments where storage is unavailable (e.g., Chromatic/CI)
	}
};
