import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';

// Define the type for our data
type Person = {
	id: string;
	name: string;
	email: string;
	role: string;
};

// Sample data
const data: Person[] = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'Developer',
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'Designer',
	},
];

// Define the columns
const columns: ColumnDef<Person>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'role',
		header: 'Role',
	},
];

export function ExampleTable() {
	return <DataTable columns={columns} data={data} tableId="example-table" />;
}
