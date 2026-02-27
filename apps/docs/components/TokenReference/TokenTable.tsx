import type { TokenData } from './TokenRow.js';
import { TokenRow } from './TokenRow.js';

interface TokenTableProps {
	tokens: TokenData[];
	title?: string;
}

export function TokenTable({ tokens, title }: TokenTableProps) {
	if (tokens.length === 0) {
		return <div className="text-center py-8 text-l3-foreground">No tokens found</div>;
	}

	return (
		<div className="rounded-lg border border-l2-border bg-l1-background overflow-hidden">
			{title && (
				<div className="px-4 py-3 border-b border-l2-border bg-l2-background">
					<h3 className="text-sm font-semibold text-l1-foreground capitalize">{title}</h3>
				</div>
			)}

			<div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2 border-b border-l2-border bg-l2-background text-xs font-medium text-l3-foreground uppercase tracking-wider">
				<span className="w-12">Preview</span>
				<span>Token</span>
				<span className="hidden sm:block">CSS Variable</span>
				<span className="hidden md:block">Tailwind</span>
				<span className="hidden lg:block">Category</span>
			</div>

			<div>
				{tokens.map((token) => (
					<TokenRow key={token.name} token={token} showDetails={true} />
				))}
			</div>
		</div>
	);
}
