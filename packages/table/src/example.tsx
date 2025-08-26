import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';

// Define the type for our data
type Person = {
	id: string;
	name: string;
	email: string;
	role: string;
	department: string;
	status: string;
};

// Sample data with more rows to demonstrate overflow
const data: Person[] = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'Developer',
		department: 'Engineering',
		status: 'Active',
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'Designer',
		department: 'Design',
		status: 'Active',
	},
	{
		id: '3',
		name: 'Bob Johnson',
		email: 'bob@example.com',
		role: 'Manager',
		department: 'Product',
		status: 'Active',
	},
	{
		id: '4',
		name: 'Alice Brown',
		email: 'alice@example.com',
		role: 'Developer',
		department: 'Engineering',
		status: 'Inactive',
	},
	{
		id: '5',
		name: 'Charlie Wilson',
		email: 'charlie@example.com',
		role: 'Designer',
		department: 'Design',
		status: 'Active',
	},
	{
		id: '6',
		name: 'Diana Davis',
		email: 'diana@example.com',
		role: 'Manager',
		department: 'Marketing',
		status: 'Active',
	},
	{
		id: '7',
		name: 'Edward Miller',
		email: 'edward@example.com',
		role: 'Developer',
		department: 'Engineering',
		status: 'Active',
	},
	{
		id: '8',
		name: 'Fiona Garcia',
		email: 'fiona@example.com',
		role: 'Designer',
		department: 'Design',
		status: 'Inactive',
	},
	{
		id: '9',
		name: 'George Martinez',
		email: 'george@example.com',
		role: 'Manager',
		department: 'Sales',
		status: 'Active',
	},
	{
		id: '10',
		name: 'Helen Taylor',
		email: 'helen@example.com',
		role: 'Developer',
		department: 'Engineering',
		status: 'Active',
	},
];

// Generate a large dataset for virtualization demo
const generateLargeDataset = (count: number): Person[] => {
	return Array.from({ length: count }, (_, i) => ({
		id: `large-${i + 1}`,
		name: `User ${i + 1}`,
		email: `user${i + 1}@example.com`,
		role: ['Developer', 'Designer', 'Manager', 'Analyst'][i % 4],
		department: ['Engineering', 'Design', 'Product', 'Marketing'][i % 4],
		status: ['Active', 'Inactive'][i % 2],
	}));
};

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
	{
		accessorKey: 'department',
		header: 'Department',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
];

export function ExampleTable() {
	const scrollToIndexRef = React.useRef<
		| ((
				rowIndex: number,
				options?: { align?: 'start' | 'center' | 'end' },
		  ) => void)
		| undefined
	>();

	const handleScrollToUser = (userId: string) => {
		const userIndex = data.findIndex((user) => user.id === userId);
		if (userIndex !== -1 && scrollToIndexRef.current) {
			scrollToIndexRef.current(userIndex, { align: 'center' });
		}
	};

	return (
		<div className="space-y-8">
			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Table with Fixed Height and Overflow
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					This table has a fixed height of 300px. When the data exceeds this height,
					the content becomes scrollable while keeping the headers sticky. You can
					also scroll to specific users using the buttons below.
				</p>
				<div className="flex gap-2 mb-4">
					<button
						onClick={() => handleScrollToUser('1')}
						className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
					>
						Scroll to John Doe
					</button>
					<button
						onClick={() => handleScrollToUser('5')}
						className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
					>
						Scroll to Charlie Wilson
					</button>
					<button
						onClick={() => handleScrollToUser('10')}
						className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
					>
						Scroll to Helen Taylor
					</button>
				</div>
				<DataTable
					columns={columns}
					data={data}
					tableId="example-table"
					fixedHeight={300}
					enableStickyHeaders={true}
					enableSorting={true}
					enableFiltering={true}
					scrollToIndexRef={scrollToIndexRef}
				/>
			</div>

			<div className="border rounded-lg p-6 bg-background">
				<h3 className="text-lg font-semibold mb-2 text-foreground">
					Table with Fixed Height and Virtualization
				</h3>
				<p className="text-sm text-muted-foreground mb-4">
					This table demonstrates how fixedHeight works with virtualization. It has a
					fixed height of 400px and uses virtualization to efficiently render 1000
					rows. The virtualization works seamlessly with the fixed height container,
					providing smooth scrolling performance. You can also scroll to specific
					rows using the buttons below.
				</p>
				<div className="flex gap-2 mb-4">
					<button
						onClick={() => scrollToIndexRef.current?.(0, { align: 'start' })}
						className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
					>
						Scroll to First Row
					</button>
					<button
						onClick={() => scrollToIndexRef.current?.(500, { align: 'center' })}
						className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
					>
						Scroll to Row 500
					</button>
					<button
						onClick={() => scrollToIndexRef.current?.(999, { align: 'end' })}
						className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
					>
						Scroll to Last Row
					</button>
				</div>
				<DataTable
					columns={columns}
					data={generateLargeDataset(1000)}
					tableId="virtualization-table"
					fixedHeight={400}
					enableStickyHeaders={true}
					enableSorting={true}
					enableFiltering={true}
					enableVirtualization={true}
					estimateRowSize={50}
					overscan={5}
					rowHeight={50}
					scrollToIndexRef={scrollToIndexRef}
				/>
			</div>
		</div>
	);
}
