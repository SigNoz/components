import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from '../avatar.js';
import { getInitials } from '../utils.js';

describe('Avatar initials', () => {
	it.each([
		['two words give the first letter of each', 'Alex Example', 'AE'],
		['one word gives its first letter', 'alex', 'A'],
		['the letters are upper case', 'alex example', 'AE'],
		['three words give the first and the last', 'Mary Jane Watson', 'MW'],
		['a single letter is one initial', 'a', 'A'],
		['extra spaces do not count', '  Alex    Example  ', 'AE'],
		['a hyphen does not split a word', 'Jean-Luc Picard', 'JP'],
		[
			'an email gives the first letter of the part before the at sign',
			'alex.example@example.com',
			'A',
		],
		['the dots of an email do not split words', 'Alex.Example@example.com', 'A'],
		['an email with a plus tag is one word', 'alex+ops@example.com', 'A'],
		['a letter with an accent keeps it', 'élodie durand', 'ÉD'],
		['a letter that upper-cases to two is one initial', 'ßeta Gamma', 'SG'],
		['a word of symbols is skipped between two names', 'Alex - Example', 'AE'],
		['a symbol in front of a name is skipped', '(Alex) [Example]', 'AE'],
		['a number counts as a letter', '42 Example', '4E'],
		['a name with no letter falls back to its first character', '???', '?'],
		['a name beyond the latin alphabet', '李 雷', '李雷'],
		['an emoji beside a name is skipped', '😀 Example', 'E'],
		['an emoji alone is kept whole', '😀', '😀'],
	])('%s', (_, name, initials) => {
		render(<Avatar color="primary" name={name} size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent(initials);
		expect(screen.getByTestId('avatar-fallback').textContent).toBe(initials);
	});

	it('never shows more than two letters', () => {
		render(<Avatar color="primary" name="Anna Maria Louise von Trapp" size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar-fallback').textContent).toBe('AT');
	});

	it('gives the same letters at both sizes', () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="sm" testId="avatar" />,
		);
		const small = screen.getByTestId('avatar-fallback').textContent;

		rerender(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar-fallback').textContent).toBe(small);
	});

	it('follows the name when it changes', () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />,
		);

		rerender(<Avatar color="primary" name="Sam Rivers" size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar-fallback').textContent).toBe('SR');
	});
});

describe('getInitials', () => {
	it('is empty for a blank name', () => {
		expect(getInitials('')).toBe('');
		expect(getInitials('   ')).toBe('');
		expect(getInitials('\n\t')).toBe('');
	});

	it('reads the part before the first at sign of an email', () => {
		expect(getInitials('sam@example.com')).toBe('S');
	});

	it('does not read as an email a name with spaces around the at sign', () => {
		expect(getInitials('Alex @ Example')).toBe('AE');
	});

	it('keeps a leading at sign out of the email rule', () => {
		expect(getInitials('@example.com')).toBe('E');
	});

	it('is empty for a value that is not a string', () => {
		expect(getInitials(undefined as unknown as string)).toBe('');
		expect(getInitials(null as unknown as string)).toBe('');
	});
});
