import { ColorSwatch } from './ColorSwatch.js';
import { CopyButton } from './CopyButton.js';

export interface TokenData {
	name: string;
	value: string;
	description?: string;
	usage?: string;
	dontUse?: string;
	category?: string;
	group?: string;
}

interface TokenRowProps {
	token: TokenData;
	showDetails?: boolean;
}

export function TokenRow({ token, showDetails = false }: TokenRowProps) {
	const cssVariable = `--${token.name}`;
	const tailwindClass =
		token.category === 'background'
			? `bg-${token.name}`
			: token.category === 'foreground'
				? `text-${token.name}`
				: token.category === 'border'
					? `border-${token.name}`
					: token.name;

	return (
		<div className="group border-b border-l2-border last:border-b-0">
			<div className="flex items-center gap-4 px-4 py-3">
				<div className="w-12 flex items-center justify-center">
					<ColorSwatch value={token.value} />
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<code className="text-sm font-mono font-medium text-l1-foreground">{token.name}</code>
						<CopyButton text={cssVariable} />
					</div>
					{token.description && (
						<p className="text-xs text-l3-foreground mt-0.5 truncate">{token.description}</p>
					)}
				</div>

				<div className="hidden sm:flex items-center gap-2">
					<code className="text-xs font-mono bg-l2-background px-2 py-1 rounded text-l2-foreground">
						{cssVariable}
					</code>
					<CopyButton text={cssVariable} />
				</div>

				<div className="hidden md:flex items-center gap-2">
					<code className="text-xs font-mono bg-l2-background px-2 py-1 rounded text-l2-foreground">
						{tailwindClass}
					</code>
					<CopyButton text={tailwindClass} />
				</div>

				{token.category && (
					<span className="hidden lg:inline-flex rounded-full bg-l2-background px-2 py-0.5 text-xs text-l2-foreground capitalize">
						{token.category}
					</span>
				)}
			</div>

			{showDetails && (token.usage || token.dontUse) && (
				<div className="px-4 pb-3 pt-0 flex flex-col gap-2">
					{token.usage && (
						<div className="flex items-start gap-2 text-xs">
							<span className="text-accent-forest font-medium shrink-0">Use:</span>
							<span className="text-l2-foreground">{token.usage}</span>
						</div>
					)}
					{token.dontUse && (
						<div className="flex items-start gap-2 text-xs">
							<span className="text-accent-cherry font-medium shrink-0">Avoid:</span>
							<span className="text-l2-foreground">{token.dontUse}</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
