import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTablePreferences, resetTablePreferences, saveTablePreferences } from './preferences.js';

describe('preferences', () => {
	const tableId = 'test-table';

	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getTablePreferences', () => {
		it('returns empty object when no stored data', () => {
			expect(getTablePreferences(tableId)).toEqual({});
		});

		it('returns parsed preferences when data exists', () => {
			const prefs = { columnOrder: ['a', 'b'] };
			saveTablePreferences(tableId, prefs);
			expect(getTablePreferences(tableId)).toEqual(prefs);
		});

		it('returns empty object when localStorage throws', () => {
			vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
				throw new Error('QuotaExceeded');
			});
			expect(getTablePreferences(tableId)).toEqual({});
		});
	});

	describe('saveTablePreferences', () => {
		it('persists preferences under table-preferences-{tableId}', () => {
			const prefs = { columnOrder: ['a', 'b'] };
			saveTablePreferences(tableId, prefs);
			expect(localStorage.getItem(`table-preferences-${tableId}`)).toBe(JSON.stringify(prefs));
		});

		it('overwrites existing preferences for same tableId', () => {
			saveTablePreferences(tableId, { columnOrder: ['a'] });
			saveTablePreferences(tableId, { columnOrder: ['b', 'c'] });
			expect(getTablePreferences(tableId)).toEqual({ columnOrder: ['b', 'c'] });
		});

		it('does not throw when localStorage throws', () => {
			vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
				throw new Error('QuotaExceeded');
			});
			expect(() => saveTablePreferences(tableId, {})).not.toThrow();
		});
	});

	describe('resetTablePreferences', () => {
		it('removes stored preferences for given tableId', () => {
			saveTablePreferences(tableId, { columnOrder: ['a'] });
			resetTablePreferences(tableId);
			expect(getTablePreferences(tableId)).toEqual({});
		});

		it('does not affect other table IDs', () => {
			saveTablePreferences(tableId, { columnOrder: ['a'] });
			saveTablePreferences('other-table', { columnOrder: ['b'] });
			resetTablePreferences(tableId);
			expect(getTablePreferences('other-table')).toEqual({ columnOrder: ['b'] });
		});

		it('does not throw when localStorage throws', () => {
			vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
				throw new Error('Access denied');
			});
			expect(() => resetTablePreferences(tableId)).not.toThrow();
		});
	});
});
