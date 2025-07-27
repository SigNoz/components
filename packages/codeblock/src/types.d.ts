import { Languages } from './lib/shiki.bundle';

interface Lines {
	showLineNumbers?: boolean;
	highlightedLines?: number[];
	addedLines?: number[];
	removedLines?: number[];
	warningLines?: number[];
}

export type CodeblockProps = {
	code: string;
	lang: Languages;
	title?: string;
	icon?: React.ReactElement;
	theme?: 'dark' | 'light';
} & Lines;

export type IUpdateCodeHTML = {
	codeInHTML: string;
} & Lines;
