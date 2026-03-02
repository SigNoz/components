import { CheckCheck, Copy } from '@signozhq/icons';
import { useState } from 'react';

interface CopyButtonProps {
	text: string;
	className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs transition-colors hover:bg-l2-background ${className}`}
			title={`Copy ${text}`}
		>
			{copied ? (
				<CheckCheck className="text-l2-foreground" />
			) : (
				<Copy className="text-l2-foreground" />
			)}
		</button>
	);
}
