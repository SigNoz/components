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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="absolute left-3 top-1/2 -translate-y-1/2 text-l3-foreground"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
				<input
					type="text"
					value={query}
					onChange={handleSearchChange}
					placeholder="Search tokens..."
					className="w-full sm:w-80 rounded-md border border-l2-border bg-l1-background px-10 py-2 text-sm text-l1-foreground placeholder:text-l3-foreground focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
				/>
			</div>

			{onCategoryFilter && categories && categories.length > 0 && (
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={() => onCategoryFilter(null)}
						className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
							selectedCategory === null
								? 'bg-accent-primary text-accent-primary-foreground'
								: 'bg-l2-background text-l2-foreground hover:bg-l3-background'
						}`}
					>
						All
					</button>
					{categories.map((category) => (
						<button
							key={category}
							type="button"
							onClick={() => onCategoryFilter(category)}
							className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
								selectedCategory === category
									? 'bg-accent-primary text-accent-primary-foreground'
									: 'bg-l2-background text-l2-foreground hover:bg-l3-background'
							}`}
						>
							{category}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
