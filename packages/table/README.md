# @signozhq/table

A comprehensive table component library with both basic and advanced table implementations.

## Components

### Basic Table Components

The basic table components provide a simple, lightweight table implementation for straightforward data display:

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@signozhq/table';

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
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Available Components:**
- `Table` - Main table container
- `TableHeader` - Table header section
- `TableBody` - Table body section
- `TableFooter` - Table footer section
- `TableRow` - Table row
- `TableHead` - Table header cell
- `TableCell` - Table data cell
- `TableCaption` - Table caption

### Advanced DataTable Component

The DataTable component is a feature-rich table implementation built on top of TanStack Table, providing advanced functionality:

```tsx
import { DataTable } from '@signozhq/table';

<DataTable
  columns={columns}
  data={data}
  tableId="my-table"
  enableSorting={true}
  enableFiltering={true}
  enablePagination={true}
  enableRowSelection={true}
/>
```

**Key Features:**
- ✅ Sorting (single/multi-column)
- ✅ Filtering (column-specific and global)
- ✅ Pagination (client-side and server-side)
- ✅ Row selection (single/multiple)
- ✅ Column resizing
- ✅ Column reordering
- ✅ Column pinning (left/right)
- ✅ Row expansion
- ✅ Virtualization for large datasets
- ✅ Infinite scroll
- ✅ State persistence
- ✅ Keyboard navigation
- ✅ Accessibility features

## When to Use Which?

### Use Basic Table Components When:
- You need a simple, static table
- You want full control over the table structure
- You're displaying a small amount of data
- You don't need advanced features like sorting or filtering
- You want minimal bundle size

### Use DataTable Component When:
- You need interactive features (sorting, filtering, pagination)
- You're working with large datasets
- You need advanced table functionality
- You want built-in accessibility features
- You need state management for table interactions

## Installation

```bash
npm install @signozhq/table
# or
yarn add @signozhq/table
# or
pnpm add @signozhq/table
```

## Dependencies

The DataTable component requires:
- `@tanstack/react-table` - For table functionality
- `@tanstack/react-virtual` - For virtualization (optional)
- `lodash-es` - For utility functions
- `lucide-react` - For icons

## Examples

See the Storybook documentation for comprehensive examples of both basic tables and advanced DataTable usage. 