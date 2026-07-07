import { CheckCheck, Copy } from '@signozhq/icons';
import { useState } from 'react';
import styles from './CopyButton.module.css';

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
			className={`${styles.button} ${className}`}
			title={`Copy ${text}`}
		>
			{copied ? <CheckCheck className={styles.icon} /> : <Copy className={styles.icon} />}
		</button>
	);
}
