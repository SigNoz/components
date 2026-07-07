import { Search } from '@signozhq/icons';
import { Button, Input } from '@signozhq/ui';
import { useState } from 'react';
import styles from './TokenSearch.module.css';

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
		<div className={styles.container}>
			<div className={styles.searchWrapper}>
				{/* TODO: Update when we have support for prefix icons on Inputs */}
				<Search className={styles.searchIcon} />

				<Input
					type="text"
					value={query}
					onChange={handleSearchChange}
					placeholder="Search tokens..."
					className={styles.searchInput}
				/>
			</div>

			{onCategoryFilter && categories && categories.length > 0 && (
				<div className={styles.categoryFilters}>
					<Button
						type="button"
						onClick={() => onCategoryFilter(null)}
						variant={selectedCategory === null ? 'solid' : 'outlined'}
						color={selectedCategory === null ? 'primary' : 'secondary'}
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
						>
							{category}
						</Button>
					))}
				</div>
			)}
		</div>
	);
}
