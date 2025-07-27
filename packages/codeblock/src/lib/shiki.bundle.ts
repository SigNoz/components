/* Generate by shiki/codegen */
import type {
	DynamicImportLanguageRegistration,
	DynamicImportThemeRegistration,
	HighlighterGeneric,
} from 'shiki/types';
import {
	createSingletonShorthands,
	createdBundledHighlighter,
} from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs';

type Languages = 'typescript' | 'ts' | 'javascript' | 'js';
type Themes = 'github-dark-dimmed' | 'github-light-default';
type Highlighter = HighlighterGeneric<Languages, Themes>;

const bundledLanguages = {
	typescript: () => import('shiki/langs/typescript.mjs'),
	ts: () => import('shiki/langs/typescript.mjs'),
	javascript: () => import('shiki/langs/javascript.mjs'),
	js: () => import('shiki/langs/javascript.mjs'),
} as Record<Languages, DynamicImportLanguageRegistration>;

const bundledThemes = {
	'github-dark-dimmed': () => import('shiki/themes/github-dark-dimmed.mjs'),
	'github-light-default': () => import('shiki/themes/github-light-default.mjs'),
} as Record<Themes, DynamicImportThemeRegistration>;

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
	Languages,
	Themes
>({
	langs: bundledLanguages,
	themes: bundledThemes,
	engine: () => createJavaScriptRegexEngine(),
});

const {
	codeToHtml,
	codeToTokensBase,
	codeToTokens,
	codeToTokensWithThemes,
	getSingletonHighlighter,
} = /* @__PURE__ */ createSingletonShorthands<Languages, Themes>(
	createHighlighter,
);

export {
	bundledLanguages,
	bundledThemes,
	codeToHtml,
	codeToTokens,
	codeToTokensBase,
	codeToTokensWithThemes,
	createHighlighter,
	getSingletonHighlighter,
};
export type { Languages, Themes, Highlighter };
