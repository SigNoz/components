# DataTable Component

A feature-rich React table component built on top of TanStack Table with support for column reordering, resizing, sorting, filtering, and more.

## Column Ordering

The DataTable component uses the order of columns as defined in the `columns` array by default. The `onColumnOrderChange` callback is only called when the user manually reorders columns through drag and drop.

### Default Behavior

The component automatically uses the column order from the `columns` array:

```tsx
import { DataTable } from '@your-org/table';

function MyTable() {
	const columns = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'email', header: 'Email' },
		{ accessorKey: 'role', header: 'Role' },
	];

	const data = [
		{ name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
	];

	return (
		<DataTable
			columns={columns}
			data={data}
			tableId="my-table"
			enableColumnReordering={true}
		/>
	);
}
```

### With Column Order Change Callback

If you want to be notified when the user manually reorders columns:

```tsx
import { DataTable } from '@your-org/table';

function MyTable() {
	const columns = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'email', header: 'Email' },
		{ accessorKey: 'role', header: 'Role' },
	];

	const data = [
		{ name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
	];

	const handleColumnOrderChange = (orderedColumns) => {
		// This will only be called when user manually reorders columns
		console.log('Columns reordered:', orderedColumns);
		// You can save the new order to your state management system
	};

	return (
		<DataTable
			columns={columns}
			data={data}
			tableId="my-table"
			onColumnOrderChange={handleColumnOrderChange}
			enableColumnReordering={true}
		/>
	);
}
```

### Key Features

1. **Automatic column order**: Uses the order of columns as defined in the `columns` array
2. **No unwanted callbacks**: `onColumnOrderChange` is only called when user manually reorders columns
3. **Preference persistence**: Saves user's column order preferences automatically
4. **Simple usage**: No need to manage column order state unless you want to track changes
5. **Smart header layout**: Action buttons are always visible, text shows ellipsis with tooltip when overflowing
6. **Selective reordering**: Disable reordering for specific columns using `disableReorder: true`
7. **Drop control**: Control where columns can be dropped using `disableDropBefore` and `disableDropAfter`

### Props

- `onColumnOrderChange?: (orderedColumns: ColumnDef<TData, TValue>[]) => void` - Callback called only on manual reorder
- `enableColumnReordering?: boolean` - Enable/disable column reordering (default: true)

### Selective Column Reordering

You can disable reordering for specific columns by adding `disableReorder: true` to the column definition:

```tsx
const columns = [
	{
		accessorKey: 'name',
		header: 'Name',
		disableReorder: true, // This column cannot be reordered
	},
	{
		accessorKey: 'email',
		header: 'Email', // This column can be reordered
	},
	{
		accessorKey: 'role',
		header: 'Role',
		disableReorder: true, // This column cannot be reordered
	},
];
```

When `disableReorder: true` is set on a column:

- The drag handle (grip icon) will not be shown
- The column cannot be dragged to reorder
- The column will remain in its original position

### Drop Control

You can control where columns can be dropped by using `disableDropBefore` and `disableDropAfter` properties:

```tsx
const columns = [
	{
		accessorKey: 'name',
		header: 'Name',
		disableReorder: true, // This column cannot be reordered
	},
	{
		accessorKey: 'role',
		header: 'Role',
		disableDropBefore: true, // No columns can be dropped before this
	},
	{
		accessorKey: 'department',
		header: 'Department',
		disableDropAfter: true, // No columns can be dropped after this
	},
	{
		accessorKey: 'status',
		header: 'Status', // This column can be reordered and dropped anywhere
	},
];
```

**Drop Control Properties:**

- `disableDropBefore: true` - Prevents other columns from being dropped before this column
- `disableDropAfter: true` - Prevents other columns from being dropped after this column
- Both properties can be used together for maximum control

**Use Cases:**

- **Fixed position columns**: Use `disableReorder: true` for columns that should never move
- **Boundary columns**: Use `disableDropBefore` for the first column in a logical group
- **End markers**: Use `disableDropAfter` for the last column in a logical group
- **Protected zones**: Combine properties to create protected column ranges

### Behavior Summary

| Scenario             | Column Order Source   | `onColumnOrderChange` Called |
| -------------------- | --------------------- | ---------------------------- |
| Component mounts     | `columns` array order | ❌ No                        |
| User drags and drops | Updated order         | ✅ Yes, with new order       |
| Preferences load     | Saved preferences     | ❌ No                        |
