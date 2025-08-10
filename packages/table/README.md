# Table Component

A comprehensive table component library with advanced features including height management, overflow handling, and sticky headers.

## Features

- **Fixed Height Support**: Set a specific height for table containers
- **Overflow Handling**: Automatic scrolling when content exceeds the container height
- **Sticky Headers**: Headers remain visible while scrolling through data
- **Virtualization Support**: Efficient rendering of large datasets with fixed height
- **Responsive Design**: Works well on different screen sizes
- **TypeScript Support**: Full type safety for all components
- **Accessibility**: Semantic HTML structure and keyboard navigation

## Basic Usage

### Simple Table

```tsx
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@signozhq/table';

function MyTable() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>John Doe</TableCell>
					<TableCell>john@example.com</TableCell>
					<TableCell>Developer</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
```

### Table with Fixed Height and Overflow

```tsx
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@signozhq/table';

function MyTableWithHeight() {
	return (
		<Table fixedHeight={400}>
			<TableHeader sticky>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{/* Your table rows - will scroll if they exceed 400px height */}
			</TableBody>
		</Table>
	);
}
```

## Props

### Table Component

| Prop          | Type                            | Default     | Description                                                                                                |
| ------------- | ------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `fixedHeight` | `string \| number`              | `undefined` | Sets a fixed height for the table container. When provided, enables overflow scrolling and sticky headers. |
| `className`   | `string`                        | `undefined` | Additional CSS classes for the table element                                                               |
| `...props`    | `React.ComponentProps<'table'>` | -           | All standard HTML table props                                                                              |

### TableHeader Component

| Prop        | Type                            | Default     | Description                                                                           |
| ----------- | ------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `sticky`    | `boolean`                       | `false`     | When true, keeps the header visible while scrolling (requires `fixedHeight` on Table) |
| `className` | `string`                        | `undefined` | Additional CSS classes for the header element                                         |
| `...props`  | `React.ComponentProps<'thead'>` | -           | All standard HTML thead props                                                         |

## Height and Overflow Features

### Fixed Height

The `fixedHeight` prop allows you to set a specific height for your table container:

```tsx
// Using a number (pixels)
<Table fixedHeight={400}>

// Using a string (any valid CSS height)
<Table fixedHeight="50vh">
<Table fixedHeight="300px">
<Table fixedHeight="calc(100vh - 200px)">
```

### Overflow Handling

When `fixedHeight` is provided, the table automatically:

1. **Wraps the table in a scrollable container**
2. **Enables vertical scrolling** when content exceeds the height
3. **Maintains horizontal scrolling** for wide tables
4. **Preserves table layout** during scroll

### Sticky Headers

Enable sticky headers by setting `sticky={true}` on the `TableHeader` component:

```tsx
<Table fixedHeight={400}>
	<TableHeader sticky>
		<TableRow>
			<TableHead>Name</TableHead>
			<TableHead>Email</TableHead>
		</TableRow>
	</TableHeader>
	<TableBody>{/* Headers will remain visible while scrolling */}</TableBody>
</Table>
```

## Virtualization with Fixed Height

The `fixedHeight` functionality works seamlessly with virtualization in the DataTable component. When both `fixedHeight` and `enableVirtualization` are enabled:

### How It Works

1. **Container Setup**: The `fixedHeight` creates a scrollable container with the specified height
2. **Virtualization Integration**: The virtualizer uses this container as its scroll element
3. **Performance**: Only visible rows are rendered, maintaining smooth scrolling even with thousands of rows
4. **Sticky Headers**: Headers remain visible while scrolling through virtualized content

### Example with Virtualization

```tsx
import { DataTable } from '@signozhq/table';

function VirtualizedTableWithHeight({ users }) {
	const columns = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'email', header: 'Email' },
		{ accessorKey: 'role', header: 'Role' },
	];

	return (
		<DataTable
			columns={columns}
			data={users}
			tableId="virtualized-table"
			fixedHeight={400}
			enableStickyHeaders={true}
			enableVirtualization={true}
			estimateRowSize={50}
			overscan={5}
			rowHeight={50}
			enableSorting={true}
			enableFiltering={true}
		/>
	);
}
```

### Virtualization Props

| Prop                      | Type      | Default | Description                                                             |
| ------------------------- | --------- | ------- | ----------------------------------------------------------------------- |
| `enableVirtualization`    | `boolean` | `false` | Enables virtual scrolling for large datasets                            |
| `estimateRowSize`         | `number`  | `40`    | Estimated height of each row for virtualization calculations            |
| `overscan`                | `number`  | `5`     | Number of items to render outside the visible area for smooth scrolling |
| `rowHeight`               | `number`  | `40`    | Fixed height of each row (used when `enableDynamicRowHeights` is false) |
| `enableDynamicRowHeights` | `boolean` | `false` | Allows rows to have different heights (experimental)                    |

### Benefits of Virtualization + Fixed Height

- **Memory Efficiency**: Only renders visible rows, even with 100,000+ items
- **Smooth Scrolling**: Consistent performance regardless of dataset size
- **Fixed Layout**: Predictable table height for consistent UI layout
- **Sticky Headers**: Headers remain accessible during virtual scrolling
- **All Features**: Sorting, filtering, and other features work seamlessly

## CSS Classes

The component applies several CSS classes for styling:

### Container Classes

- `.table-scroll-container`: Applied to the scrollable container when `fixedHeight` is set
- `.sticky-header-table-container`: Container with sticky header support

### Table Classes

- `.sticky-header-table`: Applied to the table element when `fixedHeight` is set
- `.sticky-header`: Applied to sticky headers

## Examples

### Basic Table with Height

```tsx
function UserTable({ users }) {
	return (
		<Table fixedHeight={300}>
			<TableHeader sticky>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.name}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.role}</TableCell>
						<TableCell>{user.status}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
```

### Responsive Height

```tsx
function ResponsiveTable({ users }) {
	return (
		<Table fixedHeight="calc(100vh - 200px)">
			<TableHeader sticky>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.name}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.role}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
```

### With DataTable Component

For more advanced features, use the `DataTable` component:

```tsx
import { DataTable } from '@signozhq/table';

function AdvancedTable({ users }) {
	const columns = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'email', header: 'Email' },
		{ accessorKey: 'role', header: 'Role' },
	];

	return (
		<DataTable
			columns={columns}
			data={users}
			tableId="user-table"
			fixedHeight={400}
			enableStickyHeaders={true}
			enableSorting={true}
			enableFiltering={true}
		/>
	);
}
```

### Large Dataset with Virtualization

```tsx
function LargeDatasetTable({ users }) {
	const columns = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'email', header: 'Email' },
		{ accessorKey: 'role', header: 'Role' },
	];

	return (
		<DataTable
			columns={columns}
			data={users} // 10,000+ items
			tableId="large-table"
			fixedHeight={500}
			enableStickyHeaders={true}
			enableVirtualization={true}
			estimateRowSize={50}
			overscan={10}
			enableSorting={true}
			enableFiltering={true}
		/>
	);
}
```

## Accessibility

The table component includes several accessibility features:

- **Semantic HTML**: Proper table structure with `table`, `thead`, `tbody`, `th`, and `td` elements
- **Keyboard Navigation**: Full keyboard support for scrolling and interaction
- **Screen Reader Support**: Proper ARIA labels and semantic structure
- **Focus Management**: Clear focus indicators for keyboard navigation

## Browser Support

The component works in all modern browsers and includes:

- **Cross-browser compatibility**: Works consistently across all modern browsers
- **Mobile browsers**: Touch-friendly scrolling
- **Progressive enhancement**: Graceful degradation for older browsers

## Performance

The table component is optimized for performance:

- **Efficient scrolling**: Smooth scroll performance with CSS transforms
- **Minimal reflows**: Careful CSS to avoid layout thrashing
- **Lightweight**: Minimal JavaScript overhead for basic tables
- **Virtual scrolling**: Available in DataTable component for large datasets
- **Memory efficient**: Virtualization prevents memory issues with large datasets
