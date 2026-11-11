import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { Card } from '../card.js';
import { CARD_EMPTY_TITLE } from '../constants.js';
import { slotsOf } from './card.test-utils.js';

let warn: MockInstance<typeof console.warn>;

beforeEach(() => {
	warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Card with an empty title', () => {
	it.each([
		['an empty string', ''],
		['spaces', '   '],
		['undefined', undefined],
	])('renders <No title> for %s next to a description', (_name, title) => {
		render(<Card testId="card" title={title} description="Description" />);

		expect(screen.getByTestId('card-title')).toHaveTextContent('<No title>');
		expect(CARD_EMPTY_TITLE).toBe('<No title>');
	});

	it('warns once about it', () => {
		render(<Card title="" headerSuffix={<button type="button">Go</button>} />);

		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('`title` is empty'));
	});

	it('keeps the header actions', () => {
		render(<Card title="" headerSuffix={<button type="button">Go</button>} />);

		expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
	});

	it('names the header suffix control <No title>', () => {
		render(<Card title="" headerSuffix={(field) => <input type="text" {...field} />} />);

		expect(screen.getByRole('textbox', { name: '<No title>' })).toBeInTheDocument();
	});

	it('does not warn when the title is set', () => {
		render(<Card title="Title" description="Description" />);

		expect(warn).not.toHaveBeenCalled();
	});

	it('does not warn for a card that has no header at all', () => {
		render(<Card title="">Body</Card>);

		expect(warn).not.toHaveBeenCalled();
		expect(screen.queryByText('<No title>')).toBeNull();
	});
});

describe('Card with an empty description', () => {
	it.each([
		['an empty string', ''],
		['spaces', '  '],
		['null', null],
		['false', false],
	])('renders no description for %s', (_name, description) => {
		render(<Card testId="card" title="Title" description={description} />);

		expect(screen.queryByTestId('card-description')).toBeNull();
	});
});

describe('Card with an empty header suffix', () => {
	it.each([
		['null', null],
		['an empty string', ''],
		['false', false],
	])('renders no suffix slot for %s, and the text takes the whole width', (_name, headerSuffix) => {
		render(<Card testId="card" title="Title" headerSuffix={headerSuffix} />);

		expect(screen.queryByTestId('card-header-suffix')).toBeNull();
	});
});

describe('Card with nothing in it', () => {
	it('renders the empty shell and warns', () => {
		render(<Card testId="card" />);

		expect(slotsOf(screen.getByTestId('card'))).toEqual([]);
		expect(warn).toHaveBeenCalledTimes(1);
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('no header, no children and no footer'),
		);
	});

	it.each([
		[
			'empty children',
			<Card key="a" testId="card">
				{null}
			</Card>,
		],
		['an empty title and nothing else', <Card key="b" testId="card" title="" />],
	])('warns for %s', (_name, element) => {
		render(element);

		expect(screen.getByTestId('card')).toBeInTheDocument();
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('no header, no children and no footer'),
		);
	});

	it.each([
		['a header', <Card key="a" title="Title" />],
		['children', <Card key="b">Body</Card>],
		['a footer', <Card key="c" footerSuffix="Save" />],
		['loading', <Card key="d" loading />],
	])('does not warn for a card with %s', (_name, element) => {
		render(element);

		expect(warn).not.toHaveBeenCalled();
	});
});
