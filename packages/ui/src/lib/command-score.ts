/*
 * The search score of cmdk 1.1.1 (https://github.com/pacocoursey/cmdk), MIT, Copyright (c) 2022
 * Paco Coursey. Ported unchanged, so the palette ranks results the way it did on cmdk: keep the
 * constants and the branch order as they are.
 */

const SCORE_CONTINUE_MATCH = 1;
const SCORE_SPACE_WORD_JUMP = 0.9;
const SCORE_NON_SPACE_WORD_JUMP = 0.8;
const SCORE_CHARACTER_JUMP = 0.17;
const SCORE_TRANSPOSITION = 0.1;
const PENALTY_SKIPPED = 0.999;
const PENALTY_CASE_MISMATCH = 0.9999;
const PENALTY_NOT_COMPLETE = 0.99;

const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
const COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
const IS_SPACE_REGEXP = /[\s-]/;
const COUNT_SPACE_REGEXP = /[\s-]/g;

function scoreFrom(
	text: string,
	query: string,
	lowerText: string,
	lowerQuery: string,
	textIndex: number,
	queryIndex: number,
	memo: Map<string, number>,
): number {
	if (queryIndex === query.length) {
		return textIndex === text.length ? SCORE_CONTINUE_MATCH : PENALTY_NOT_COMPLETE;
	}

	const key = `${textIndex},${queryIndex}`;
	const cached = memo.get(key);

	if (cached !== undefined) {
		return cached;
	}

	const queryChar = lowerQuery.charAt(queryIndex);
	let index = lowerText.indexOf(queryChar, textIndex);
	let best = 0;

	while (index >= 0) {
		let score = scoreFrom(text, query, lowerText, lowerQuery, index + 1, queryIndex + 1, memo);

		// cmdk applies the penalties only when the raw score beats the best so far.
		if (score > best) {
			if (index === textIndex) {
				score *= SCORE_CONTINUE_MATCH;
			} else if (IS_GAP_REGEXP.test(text.charAt(index - 1))) {
				score *= SCORE_NON_SPACE_WORD_JUMP;
				const gaps = text.slice(textIndex, index - 1).match(COUNT_GAPS_REGEXP);

				if (gaps && textIndex > 0) {
					score *= PENALTY_SKIPPED ** gaps.length;
				}
			} else if (IS_SPACE_REGEXP.test(text.charAt(index - 1))) {
				score *= SCORE_SPACE_WORD_JUMP;
				const spaces = text.slice(textIndex, index - 1).match(COUNT_SPACE_REGEXP);

				if (spaces && textIndex > 0) {
					score *= PENALTY_SKIPPED ** spaces.length;
				}
			} else {
				score *= SCORE_CHARACTER_JUMP;

				if (textIndex > 0) {
					score *= PENALTY_SKIPPED ** (index - textIndex);
				}
			}

			if (text.charAt(index) !== query.charAt(queryIndex)) {
				score *= PENALTY_CASE_MISMATCH;
			}
		}

		if (
			(score < SCORE_TRANSPOSITION &&
				lowerText.charAt(index - 1) === lowerQuery.charAt(queryIndex + 1)) ||
			(lowerQuery.charAt(queryIndex + 1) === lowerQuery.charAt(queryIndex) &&
				lowerText.charAt(index - 1) !== lowerQuery.charAt(queryIndex))
		) {
			const transposed = scoreFrom(
				text,
				query,
				lowerText,
				lowerQuery,
				index + 1,
				queryIndex + 2,
				memo,
			);

			if (transposed * SCORE_TRANSPOSITION > score) {
				score = transposed * SCORE_TRANSPOSITION;
			}
		}

		if (score > best) {
			best = score;
		}

		index = lowerText.indexOf(queryChar, index + 1);
	}

	memo.set(key, best);
	return best;
}

function toComparable(value: string): string {
	return value.toLowerCase().replace(COUNT_SPACE_REGEXP, ' ');
}

/**
 * How well `query` matches `text` and its `keywords`, from `0` (no match) up to `1`.
 *
 * The query letters must appear in order and may skip characters: `dshb` finds `Dashboards`. A
 * letter right after the previous one scores best, then one that starts a word, then one in the
 * middle of a word. A case mismatch costs a tiny penalty.
 *
 * @access private
 */
export function commandScore(
	text: string,
	query: string,
	keywords: readonly string[] = [],
): number {
	const full = keywords.length > 0 ? `${text} ${keywords.join(' ')}` : text;

	return scoreFrom(full, query, toComparable(full), toComparable(query), 0, 0, new Map());
}
