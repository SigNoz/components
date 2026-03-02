import { Search } from '@signozhq/icons';
import { Button, Input } from '@signozhq/ui';
import { useState } from 'react';

interface TokenSearchProps {
	onSearch: (query: string) => void;
	onCategoryFilter?: (category: string | null) => void;
	categories?: string[];
	selectedCategory?: string | null;
}

export function TokenSearch({
	onSearch,
	onCategoryFilter,
	categories,
	selectedCategory,
}: TokenSearchProps) {
	const [query, setQuery] = useState('');

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
		onSearch(value);
	};

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="relative">
				{/* TODO: Update when we have support for prefix icons on Inputs */}
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-l3-foreground" />

				<Input
					type="text"
					value={query}
					onChange={handleSearchChange}
					placeholder="Search tokens..."
					className="px-10"
				/>
			</div>

			{onCategoryFilter && categories && categories.length > 0 && (
				<div className="flex flex-wrap gap-2">
					<Button
						type="button"
						onClick={() => onCategoryFilter(null)}
						variant={selectedCategory === null ? 'solid' : 'outlined'}
						color={selectedCategory === null ? 'primary' : 'secondary'}
						className="rounded-full"
					>
						All
					</Button>
					{categories.map((category) => (
						<Button
							key={category}
							type="button"
							onClick={() => onCategoryFilter(category)}
							variant={selectedCategory === category ? 'solid' : 'outlined'}
							color={selectedCategory === category ? 'primary' : 'secondary'}
							className="rounded-full"
						>
							{category}
						</Button>
					))}
				</div>
			)}
		</div>
	);
}
