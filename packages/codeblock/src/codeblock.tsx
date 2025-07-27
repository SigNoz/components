import './index.css';
import React, { useState, useEffect } from 'react';
import { codeToHtml } from './lib/shiki.bundle';
import { updateCodeHTML } from './lib/utils';
import { Copy, Check } from 'lucide-react';
import { CodeblockProps } from './types';

const CopyCTA = ({
	showText = true,
	isCopied,
	onCopy,
}: {
	showText?: boolean;
	isCopied: boolean;
	onCopy: () => void;
}) => {
	return (
		<button
			onClick={onCopy}
			className={`hover:bg-slate-400 border rounded flex gap-1.5 items-center cursor-pointer text-vanilla-100 ${showText ? 'px-3 py-1.5 bg-ink-300 border-slate-400' : 'w-6 h-6 border-transparent flex items-center justify-center'}`}
		>
			{isCopied ? (
				<>
					<Check size={12} /> {showText && <span className="text-xs">Copied</span>}
				</>
			) : (
				<>
					<Copy size={12} /> {showText && <span className="text-xs">Copy</span>}
				</>
			)}
		</button>
	);
};

const Codeblock = ({
	code,
	lang,
	title,
	icon,
	theme = 'light',
	showLineNumbers = true,
	highlightedLines,
	addedLines,
	removedLines,
	warningLines,
}: CodeblockProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [codeInHTML, setCodeInHTML] = useState<string>('');
	const [isCopied, setIsCopied] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);
		codeToHtml(code, {
			lang: lang,
			theme: theme === 'light' ? 'github-light-default' : 'github-dark-dimmed',
		})
			.then((styledCodeInHTML: string) => {
				const finalHTML = updateCodeHTML({
					codeInHTML: styledCodeInHTML,
					showLineNumbers,
					highlightedLines,
					addedLines,
					removedLines,
					warningLines,
				});
				setCodeInHTML(finalHTML);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [
		code,
		theme,
		lang,
		highlightedLines,
		addedLines,
		removedLines,
		warningLines,
		showLineNumbers,
	]);

	function handleCopy() {
		if (isCopied) {
			return;
		}
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	}

	return (
		<div className={`code-block-container code-block-${theme}`}>
			{isLoading && 'Loading...'}
			{(title || icon) && (
				<div
					className={`w-full px-4 py-2.5 border-b flex items-center justify-between ${theme === 'dark' ? 'border-slate-500' : 'border-vanilla-300'}`}
				>
					<div className="flex items-center gap-2">
						{icon && React.cloneElement(icon)}
						<span
							className={`text-sm font-normal ${theme === 'dark' ? 'text-vanilla-400' : 'text-slate-50'}`}
						>
							{title}
						</span>
					</div>
					<CopyCTA showText={false} isCopied={isCopied} onCopy={handleCopy} />
				</div>
			)}
			<div
				className="code-wrapper"
				data-line-numbers={showLineNumbers}
				dangerouslySetInnerHTML={{
					__html: codeInHTML,
				}}
			/>
			{!(title || icon) && (
				<div className="copy-cta">
					<CopyCTA isCopied={isCopied} onCopy={handleCopy} />
				</div>
			)}
		</div>
	);
};

export { Codeblock };
