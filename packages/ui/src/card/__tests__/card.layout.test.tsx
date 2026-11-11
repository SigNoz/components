import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from '../../divider/divider.js';
import { Card } from '../card.js';
import { internal, setCardTokens } from './card.test-utils.js';

describe('Card padding props', () => {
	it.each([
		[{}, ['', '', '', '']],
		[{ padding: 0 }, ['0', '0', '0', '0']],
		[
			{ padding: 6 },
			['var(--spacing-6)', 'var(--spacing-6)', 'var(--spacing-6)', 'var(--spacing-6)'],
		],
		[{ padding: 8, paddingX: 0 }, ['var(--spacing-8)', '0', 'var(--spacing-8)', '0']],
		[
			{ padding: 8, paddingY: 2 },
			['var(--spacing-2)', 'var(--spacing-8)', 'var(--spacing-2)', 'var(--spacing-8)'],
		],
		[{ padding: 0, paddingTop: 4 }, ['var(--spacing-4)', '0', '0', '0']],
		[
			{ padding: 8, paddingX: 4, paddingLeft: 12, paddingBottom: 0 },
			['var(--spacing-8)', 'var(--spacing-4)', '0', 'var(--spacing-12)'],
		],
		[
			{ paddingX: 6, paddingY: 4, paddingRight: 0, paddingTop: 10 },
			['var(--spacing-10)', '0', 'var(--spacing-4)', 'var(--spacing-6)'],
		],
	] as const)('resolves %j to the four sides of the body', (props, [top, right, bottom, left]) => {
		render(
			<Card testId="card" {...props}>
				Body
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(internal(root, 'padding-top')).toBe(top);
		expect(internal(root, 'padding-right')).toBe(right);
		expect(internal(root, 'padding-bottom')).toBe(bottom);
		expect(internal(root, 'padding-left')).toBe(left);
	});

	it('pads the body with 16px on every side by default', () => {
		setCardTokens();
		render(<Card testId="card">Body</Card>);

		const style = getComputedStyle(screen.getByTestId('card-body'));

		expect([style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft]).toEqual([
			'16px',
			'16px',
			'16px',
			'16px',
		]);
	});

	it('pads the body with the sides that win', () => {
		setCardTokens();
		render(
			<Card testId="card" padding={0} paddingTop={4} paddingX={6}>
				Body
			</Card>,
		);

		const style = getComputedStyle(screen.getByTestId('card-body'));

		expect([style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft]).toEqual([
			'8px',
			'12px',
			'0px',
			'12px',
		]);
	});

	it('does not change the padding of the header or the footer', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" footerSuffix="Save" padding={0}>
				Body
			</Card>,
		);

		const header = getComputedStyle(screen.getByTestId('card-header'));
		const footer = getComputedStyle(screen.getByTestId('card-footer'));

		expect([
			header.paddingTop,
			header.paddingRight,
			header.paddingBottom,
			header.paddingLeft,
		]).toEqual(['12px', '16px', '0px', '16px']);
		expect([
			footer.paddingTop,
			footer.paddingRight,
			footer.paddingBottom,
			footer.paddingLeft,
		]).toEqual(['12px', '16px', '12px', '16px']);
	});

	it('pads the default loading content like the header and the footer, over the padding props', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" footerSuffix="Save" padding={0} loading>
				Body
			</Card>,
		);

		const body = getComputedStyle(screen.getByTestId('card-body'));
		const header = getComputedStyle(screen.getByTestId('card-header'));

		expect([body.paddingTop, body.paddingRight, body.paddingBottom, body.paddingLeft]).toEqual([
			'16px',
			'16px',
			'16px',
			'16px',
		]);
		expect(body.paddingLeft).toBe(header.paddingLeft);
		expect(body.paddingRight).toBe(header.paddingRight);
	});

	it('keeps the padding props for a node passed to loading', () => {
		setCardTokens();
		render(
			<Card testId="card" padding={0} loading={<div />}>
				Body
			</Card>,
		);

		const style = getComputedStyle(screen.getByTestId('card-body'));

		expect([style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft]).toEqual([
			'0px',
			'0px',
			'0px',
			'0px',
		]);
	});
});

describe('Card gap', () => {
	it.each([
		[undefined, '16px'],
		[0, '0px'],
		[2, '4px'],
		[12, '24px'],
	] as const)('puts %s steps between the blocks of the body: %s', (gap, expected) => {
		setCardTokens();
		render(
			<Card testId="card" gap={gap}>
				<p>One</p>
				<p>Two</p>
			</Card>,
		);

		const style = getComputedStyle(screen.getByTestId('card-body'));

		expect(style.rowGap).toBe(expected);
		expect(style.flexDirection).toBe('column');
	});
});

describe('Card margin props', () => {
	it.each([
		[{}, ['', '', '', '']],
		[{ margin: 0 }, ['0', '0', '0', '0']],
		[
			{ margin: 4 },
			['var(--spacing-4)', 'var(--spacing-4)', 'var(--spacing-4)', 'var(--spacing-4)'],
		],
		[{ margin: 'auto' }, ['auto', 'auto', 'auto', 'auto']],
		[{ marginX: 'auto', marginY: 0 }, ['0', 'auto', '0', 'auto']],
		[
			{ margin: 4, marginBottom: 8 },
			['var(--spacing-4)', 'var(--spacing-4)', 'var(--spacing-8)', 'var(--spacing-4)'],
		],
		[
			{ margin: 2, marginX: 6, marginLeft: 'auto', marginTop: 0 },
			['0', 'var(--spacing-6)', 'var(--spacing-2)', 'auto'],
		],
	] as const)('resolves %j to the four sides of the card', (props, [top, right, bottom, left]) => {
		render(
			<Card testId="card" {...props}>
				Body
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(internal(root, 'margin-top')).toBe(top);
		expect(internal(root, 'margin-right')).toBe(right);
		expect(internal(root, 'margin-bottom')).toBe(bottom);
		expect(internal(root, 'margin-left')).toBe(left);
	});

	it('has no margin by default', () => {
		render(<Card testId="card">Body</Card>);

		const style = getComputedStyle(screen.getByTestId('card'));

		expect([style.marginTop, style.marginRight, style.marginBottom, style.marginLeft]).toEqual([
			'0px',
			'0px',
			'0px',
			'0px',
		]);
	});

	it('writes the margin of the sides that win', () => {
		setCardTokens();
		render(
			<Card testId="card" margin={4} marginBottom={8}>
				Body
			</Card>,
		);

		const style = getComputedStyle(screen.getByTestId('card'));

		expect([style.marginTop, style.marginRight, style.marginBottom, style.marginLeft]).toEqual([
			'8px',
			'8px',
			'16px',
			'8px',
		]);
	});

	it('pushes the card to the end of a flex row with marginLeft="auto"', () => {
		render(
			<div style={{ display: 'flex', width: 600 }} data-testid="row">
				<Card testId="card" width={200} marginLeft="auto">
					Body
				</Card>
			</div>,
		);

		const row = screen.getByTestId('row').getBoundingClientRect();
		const card = screen.getByTestId('card').getBoundingClientRect();

		expect(card.right).toBeCloseTo(row.right, 0);
		expect(card.width).toBeCloseTo(200, 0);
	});
});

describe('Card size props', () => {
	it('writes a number as px and a string as it is', () => {
		render(
			<Card testId="card" width={240} maxWidth="50%" height="100%" minHeight={120}>
				Body
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(internal(root, 'width')).toBe('240px');
		expect(internal(root, 'max-width')).toBe('50%');
		expect(internal(root, 'height')).toBe('100%');
		expect(internal(root, 'min-height')).toBe('120px');
	});

	it('writes nothing for a size that is not set', () => {
		render(<Card testId="card">Body</Card>);

		const root = screen.getByTestId('card');

		for (const name of ['width', 'max-width', 'height', 'min-height', 'gap', 'body-flex']) {
			expect(internal(root, name)).toBe('');
		}
	});

	it('fills a block parent by default', () => {
		render(
			<div style={{ width: 500 }}>
				<Card testId="card">Body</Card>
			</div>,
		);

		expect(screen.getByTestId('card').getBoundingClientRect().width).toBe(500);
	});

	it('is as wide as its content in a flex row', () => {
		render(
			<div style={{ display: 'flex', width: 500 }}>
				<Card testId="card">
					<div style={{ width: 120 }} />
				</Card>
			</div>,
		);

		expect(screen.getByTestId('card').getBoundingClientRect().width).toBeLessThan(500);
	});

	it('takes width, capped by maxWidth, which is 100% by default', () => {
		render(
			<div style={{ width: 300 }}>
				<Card testId="wide" width={800}>
					Body
				</Card>
				<Card testId="narrow" width={200}>
					Body
				</Card>
				<Card testId="capped" width={800} maxWidth={250}>
					Body
				</Card>
			</div>,
		);

		expect(screen.getByTestId('wide').getBoundingClientRect().width).toBe(300);
		expect(screen.getByTestId('narrow').getBoundingClientRect().width).toBe(200);
		expect(screen.getByTestId('capped').getBoundingClientRect().width).toBe(250);
	});

	it('keeps minHeight while the content is shorter', () => {
		render(
			<Card testId="card" minHeight={200}>
				Body
			</Card>,
		);

		expect(screen.getByTestId('card').getBoundingClientRect().height).toBe(200);
	});

	it('grows with its content and never sets overflow on the root', () => {
		setCardTokens();
		render(
			<Card testId="card" padding={0}>
				<div style={{ height: 500 }} />
			</Card>,
		);

		const root = screen.getByTestId('card');

		expect(root.getBoundingClientRect().height).toBe(502);
		expect(getComputedStyle(root).overflow).toBe('visible');
	});
});

describe('Card with a height', () => {
	function renderColumn(props: { height?: number } = { height: 300 }) {
		setCardTokens();
		return render(
			<Card testId="card" title="Title" footerSuffix="Save" {...props}>
				<div data-testid="chart" style={{ height: '100%' }} />
			</Card>,
		);
	}

	it('is a column whose body takes the room the header and the footer leave', () => {
		renderColumn();

		const root = screen.getByTestId('card');
		const header = screen.getByTestId('card-header').getBoundingClientRect();
		const footer = screen.getByTestId('card-footer').getBoundingClientRect();
		const body = screen.getByTestId('card-body');
		const bodyStyle = getComputedStyle(body);

		expect(getComputedStyle(root).flexDirection).toBe('column');
		expect(root.getBoundingClientRect().height).toBe(300);
		expect(bodyStyle.flexGrow).toBe('1');
		expect(bodyStyle.flexShrink).toBe('1');
		expect(bodyStyle.minHeight).toBe('0px');
		expect(body.getBoundingClientRect().height).toBeCloseTo(
			300 - 2 - header.height - footer.height,
			0,
		);
	});

	it('lets a chart with a height of 100% fill the body', () => {
		renderColumn();

		const body = screen.getByTestId('card-body');
		const chart = screen.getByTestId('chart').getBoundingClientRect();

		expect(chart.height).toBeCloseTo(body.getBoundingClientRect().height - 32, 0);
	});

	it('keeps the header and the footer at their height', () => {
		renderColumn({ height: 60 });

		for (const id of ['card-header', 'card-footer']) {
			expect(getComputedStyle(screen.getByTestId(id)).flexShrink).toBe('0');
		}
	});

	it('lets the body take the extra room of a minHeight, so the footer stays at the bottom', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" minHeight={300} footerSuffix="Footer">
				Body
			</Card>,
		);

		const card = screen.getByTestId('card').getBoundingClientRect();
		const body = screen.getByTestId('card-body');
		const footer = screen.getByTestId('card-footer').getBoundingClientRect();

		expect(getComputedStyle(body).flexGrow).toBe('1');
		expect(card.height).toBe(300);
		expect(body.getBoundingClientRect().height).toBeGreaterThan(100);
		expect(card.bottom - footer.bottom).toBeLessThanOrEqual(1);
	});
});

describe('Card header', () => {
	it('has 12px on top, 16px on the sides and none at the bottom, 16px between its columns', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" headerSuffix="Action">
				Body
			</Card>,
		);

		const header = getComputedStyle(screen.getByTestId('card-header'));

		expect([
			header.paddingTop,
			header.paddingRight,
			header.paddingBottom,
			header.paddingLeft,
		]).toEqual(['12px', '16px', '0px', '16px']);
		expect(header.columnGap).toBe('16px');
		expect(header.borderBottomWidth).toBe('0px');
	});

	it('takes 12px at the bottom and a line under it with headerDivider', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" headerDivider>
				Body
			</Card>,
		);

		const header = getComputedStyle(screen.getByTestId('card-header'));

		expect(header.paddingBottom).toBe('12px');
		expect(header.borderBottomWidth).toBe('1px');
	});

	it('takes 16px at the bottom when it is the whole card', () => {
		setCardTokens();
		render(<Card testId="card" title="Title" description="Description" />);

		const header = getComputedStyle(screen.getByTestId('card-header'));

		expect(header.paddingBottom).toBe('16px');
		expect(header.borderBottomWidth).toBe('0px');
	});

	it('draws no line under a header that is the whole card, even with headerDivider', () => {
		setCardTokens();
		render(<Card testId="card" title="Title" headerDivider />);

		expect(getComputedStyle(screen.getByTestId('card-header')).borderBottomWidth).toBe('0px');
	});

	it('draws no line under the header of a card inside a card that has headerDivider', () => {
		setCardTokens();
		render(
			<Card testId="outer" title="Outer" headerDivider>
				<Card testId="inner" title="Inner">
					Body
				</Card>
			</Card>,
		);

		const inner = getComputedStyle(screen.getByTestId('inner-header'));

		expect(getComputedStyle(screen.getByTestId('outer-header')).borderBottomWidth).toBe('1px');
		expect(inner.borderBottomWidth).toBe('0px');
		expect(inner.paddingBottom).toBe('0px');
	});

	it('does not follow the padding of the body', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" padding={0}>
				Body
			</Card>,
		);

		expect(getComputedStyle(screen.getByTestId('card-header')).paddingLeft).toBe('16px');
	});

	it('leaves the space under the title to the top padding of the body', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" padding={0} paddingTop={4}>
				Body
			</Card>,
		);

		const header = screen.getByTestId('card-header');
		const body = screen.getByTestId('card-body');

		expect(getComputedStyle(header).paddingBottom).toBe('0px');
		expect(getComputedStyle(body).paddingTop).toBe('8px');
		expect(body.getBoundingClientRect().top).toBe(header.getBoundingClientRect().bottom);
	});

	it.each([
		['a control taller than the line', 24],
		['a control shorter than the line', 16],
	])('puts %s on the middle of the first title line', (_, height) => {
		setCardTokens();
		render(
			<div style={{ width: 300 }}>
				<Card
					testId="card"
					title="A title that is far too long for the width of this card to show"
					textOverflow="wrap"
					description="Description"
					headerSuffix={<div data-testid="control" style={{ width: 40, height }} />}
				/>
			</div>,
		);

		const title = screen.getByTestId('card-title').getBoundingClientRect();
		const control = screen.getByTestId('control').getBoundingClientRect();

		expect(title.height).toBeGreaterThan(20);
		expect(control.top + control.height / 2).toBe(title.top + 10);
	});

	it('keeps the header suffix at its width and cuts the title first', () => {
		setCardTokens();
		render(
			<div style={{ width: 300 }}>
				<Card
					testId="card"
					title="A title that is far too long for the width of this card to show"
					headerSuffix={<div data-testid="control" style={{ width: 100, height: 24 }} />}
				/>
			</div>,
		);

		const title = screen.getByTestId('card-title');

		expect(screen.getByTestId('control').getBoundingClientRect().width).toBe(100);
		expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
		expect(
			screen.getByTestId('card-header-suffix').getBoundingClientRect().right,
		).toBeLessThanOrEqual(screen.getByTestId('card').getBoundingClientRect().right);
	});

	it('wraps the title with textOverflow="wrap"', () => {
		setCardTokens();
		render(
			<div style={{ width: 300 }}>
				<Card
					testId="card"
					title="A title that is far too long for the width of this card to show"
					textOverflow="wrap"
				/>
			</div>,
		);

		const title = screen.getByTestId('card-title');

		expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth);
		expect(title.getBoundingClientRect().height).toBeGreaterThan(20);
	});

	it('breaks a long word of the description instead of painting outside the card', () => {
		setCardTokens();
		render(
			<div style={{ width: 200 }}>
				<Card testId="card" title="Title" description={'x'.repeat(200)} />
			</div>,
		);

		const description = screen.getByTestId('card-description');

		expect(description.scrollWidth).toBeLessThanOrEqual(description.clientWidth);
	});

	it('keeps the suffix on the middle of the title line when the description grows', () => {
		setCardTokens();
		render(
			<div style={{ width: 200 }}>
				<Card
					testId="card"
					title="Title"
					description={'A long description that wraps onto several lines. '.repeat(4)}
					headerSuffix={<div data-testid="control" style={{ width: 40, height: 40 }} />}
				/>
			</div>,
		);

		const header = screen.getByTestId('card-header').getBoundingClientRect();
		const control = screen.getByTestId('control').getBoundingClientRect();

		expect(control.top + control.height / 2 - header.top).toBe(12 + 10);
	});

	it('keeps a 32px control clear of the body when the header is a single line', () => {
		setCardTokens();
		render(
			<Card
				testId="card"
				title="Title"
				headerSuffix={<div data-testid="control" style={{ width: 40, height: 32 }} />}
			>
				<div data-testid="content">Body</div>
			</Card>,
		);

		const card = screen.getByTestId('card').getBoundingClientRect();
		const control = screen.getByTestId('control').getBoundingClientRect();
		const content = screen.getByTestId('content').getBoundingClientRect();

		expect(control.top).toBeGreaterThan(card.top);
		expect(control.bottom).toBeLessThan(content.top);
	});

	it('centres a control shorter than a line of the title on that line', () => {
		setCardTokens();
		render(
			<Card
				testId="card"
				title="Title"
				headerSuffix={<div data-testid="control" style={{ width: 28, height: 16 }} />}
			>
				Body
			</Card>,
		);

		const title = screen.getByTestId('card-title').getBoundingClientRect();
		const control = screen.getByTestId('control').getBoundingClientRect();

		expect(control.top + control.height / 2).toBeCloseTo(title.top + title.height / 2, 0);
	});
});

describe('Card title line', () => {
	it('sizes the title prefix icon, whatever the element says', () => {
		setCardTokens();
		render(
			<Card
				testId="card"
				title="Title"
				titlePrefix={<svg data-testid="icon" width={40} height={40} />}
			/>,
		);

		const icon = screen.getByTestId('icon').getBoundingClientRect();

		expect([icon.width, icon.height]).toEqual([16, 16]);
	});

	it('keeps the title suffix whole while the title is cut', () => {
		setCardTokens();
		render(
			<div style={{ width: 260 }}>
				<Card
					testId="card"
					title="A title that is far too long for the width of this card to show"
					titleSuffix={<span data-testid="badge">Beta</span>}
				/>
			</div>,
		);

		const title = screen.getByTestId('card-title');
		const suffix = screen.getByTestId('card-title-suffix');

		expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
		expect(getComputedStyle(suffix).flexShrink).toBe('0');
		expect(getComputedStyle(suffix).whiteSpace).toBe('nowrap');
		expect(suffix.getBoundingClientRect().right).toBeLessThanOrEqual(
			screen.getByTestId('card').getBoundingClientRect().right,
		);
	});

	it('puts 8px between two elements of the title suffix and of the header suffix', () => {
		setCardTokens();
		render(
			<Card
				testId="card"
				title="Title"
				titleSuffix={
					<>
						<span data-testid="badge">Beta</span>
						<span data-testid="info">i</span>
					</>
				}
				headerSuffix={
					<>
						<button type="button" data-testid="select">
							Last hour
						</button>
						<button type="button" data-testid="menu">
							More
						</button>
					</>
				}
			/>,
		);

		const between = (start: string, end: string): number =>
			screen.getByTestId(end).getBoundingClientRect().left -
			screen.getByTestId(start).getBoundingClientRect().right;

		expect(between('badge', 'info')).toBeCloseTo(8, 0);
		expect(between('select', 'menu')).toBeCloseTo(8, 0);
	});
});

describe('Card footer', () => {
	it('has 12px on top and bottom, 16px on the sides, and a line above', () => {
		setCardTokens();
		render(
			<Card testId="card" footerPrefix="Hint" footerSuffix="Save">
				Body
			</Card>,
		);

		const footer = getComputedStyle(screen.getByTestId('card-footer'));

		expect([
			footer.paddingTop,
			footer.paddingRight,
			footer.paddingBottom,
			footer.paddingLeft,
		]).toEqual(['12px', '16px', '12px', '16px']);
		expect(footer.borderTopWidth).toBe('1px');
	});

	it('puts the prefix at the start and the suffix at the end', () => {
		setCardTokens();
		render(
			<div style={{ width: 400 }}>
				<Card
					testId="card"
					footerPrefix={<span data-testid="hint">Hint</span>}
					footerSuffix={<span data-testid="save">Save</span>}
				/>
			</div>,
		);

		const footer = screen.getByTestId('card-footer').getBoundingClientRect();
		const hint = screen.getByTestId('hint').getBoundingClientRect();
		const save = screen.getByTestId('save').getBoundingClientRect();

		expect(hint.left - footer.left).toBeCloseTo(16, 0);
		expect(footer.right - save.right).toBeCloseTo(16, 0);
	});

	it('keeps the suffix at the end with no prefix', () => {
		setCardTokens();
		render(
			<div style={{ width: 400 }}>
				<Card testId="card" footerSuffix={<span data-testid="save">Save</span>} />
			</div>,
		);

		const footer = screen.getByTestId('card-footer').getBoundingClientRect();
		const save = screen.getByTestId('save').getBoundingClientRect();

		expect(footer.right - save.right).toBeCloseTo(16, 0);
	});

	it('puts the suffix at the end of a right-to-left footer, with or without a prefix', () => {
		setCardTokens();
		render(
			<div dir="rtl" style={{ width: 400 }}>
				<Card
					testId="with-prefix"
					footerPrefix={<span data-testid="hint">Hint</span>}
					footerSuffix={<span data-testid="save">Save</span>}
				/>
				<Card testId="suffix-only" footerSuffix={<span data-testid="apply">Apply</span>} />
			</div>,
		);

		const footer = screen.getByTestId('with-prefix-footer').getBoundingClientRect();
		const hint = screen.getByTestId('hint').getBoundingClientRect();
		const save = screen.getByTestId('save').getBoundingClientRect();
		const lone = screen.getByTestId('suffix-only-footer').getBoundingClientRect();
		const apply = screen.getByTestId('apply').getBoundingClientRect();

		expect(footer.right - hint.right).toBeCloseTo(16, 0);
		expect(save.left - footer.left).toBeCloseTo(16, 0);
		expect(apply.left - lone.left).toBeCloseTo(16, 0);
	});

	it('keeps the space between a hint and a link in the prefix', () => {
		setCardTokens();
		render(
			<Card
				testId="card"
				footerPrefix={
					<>
						Applies to new data only. <a href="#retention">Learn more</a>
					</>
				}
			/>,
		);

		const prefix = screen.getByTestId('card-footer-prefix');
		const text = document.createRange();
		text.selectNodeContents(prefix.firstChild as Node);
		text.setEnd(prefix.firstChild as Node, 'Applies to new data only.'.length);

		expect(prefix).toHaveTextContent('Applies to new data only. Learn more');
		expect(
			screen.getByRole('link', { name: 'Learn more' }).getBoundingClientRect().left -
				text.getBoundingClientRect().right,
		).toBeGreaterThan(1);
	});
});

describe('Card dividers', () => {
	it('runs a direct Divider from one edge of the card to the other', () => {
		setCardTokens();
		render(
			<div style={{ width: 400 }}>
				<Card testId="card">
					<p>One</p>
					<Divider testId="divider" />
					<p>Two</p>
				</Card>
			</div>,
		);

		const body = screen.getByTestId('card-body').getBoundingClientRect();
		const divider = screen.getByTestId('divider').getBoundingClientRect();

		expect(divider.left).toBeCloseTo(body.left, 0);
		expect(divider.width).toBeCloseTo(body.width, 0);
		expect(body.width).toBeCloseTo(398, 0);
	});

	it('takes the padding it runs over from the padding props of the body', () => {
		setCardTokens();
		render(
			<div style={{ width: 400 }}>
				<Card testId="card" paddingX={12}>
					<Divider testId="divider" />
				</Card>
			</div>,
		);

		const body = screen.getByTestId('card-body').getBoundingClientRect();
		const divider = screen.getByTestId('divider').getBoundingClientRect();

		expect(divider.left).toBeCloseTo(body.left, 0);
		expect(divider.right).toBeCloseTo(body.right, 0);
	});

	it('keeps the width of the wrapper for a Divider inside another element', () => {
		setCardTokens();
		render(
			<div style={{ width: 400 }}>
				<Card testId="card">
					<div data-testid="wrapper">
						<Divider testId="divider" />
					</div>
				</Card>
			</div>,
		);

		const body = screen.getByTestId('card-body').getBoundingClientRect();
		const divider = screen.getByTestId('divider').getBoundingClientRect();

		expect(divider.left).toBeCloseTo(body.left + 16, 0);
		expect(divider.width).toBeCloseTo(body.width - 32, 0);
	});

	it('does not stretch a vertical Divider', () => {
		setCardTokens();
		render(
			<div style={{ width: 400 }}>
				<Card testId="card">
					<Divider testId="divider" orientation="vertical" />
				</Card>
			</div>,
		);

		expect(getComputedStyle(screen.getByTestId('divider')).marginLeft).toBe('8px');
	});
});

describe('Card body that has no padding', () => {
	it('clips to the corners of the card when it is the last part', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" padding={0}>
				Body
			</Card>,
		);

		const body = getComputedStyle(screen.getByTestId('card-body'));

		expect(body.overflow).toBe('clip');
		expect(body.borderBottomLeftRadius).toBe('3px');
		expect(body.borderBottomRightRadius).toBe('3px');
		expect(body.borderTopLeftRadius).toBe('0px');
		expect(body.borderTopRightRadius).toBe('0px');
	});

	it('clips the top corners too when the card has no header', () => {
		setCardTokens();
		render(
			<Card testId="card" padding={0}>
				Body
			</Card>,
		);

		const body = getComputedStyle(screen.getByTestId('card-body'));

		expect(body.overflow).toBe('clip');
		expect(body.borderTopLeftRadius).toBe('3px');
		expect(body.borderTopRightRadius).toBe('3px');
	});

	it('does not clip when a footer follows', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" padding={0} footerSuffix="Save">
				Body
			</Card>,
		);

		expect(getComputedStyle(screen.getByTestId('card-body')).overflow).toBe('visible');
	});

	it.each([
		['with the default padding', {}],
		['with padding only on the sides', { paddingX: 0 }],
		['with one side padded', { padding: 0, paddingBottom: 2 }],
	] as const)('does not clip %s', (_name, props) => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" {...props}>
				Body
			</Card>,
		);

		expect(getComputedStyle(screen.getByTestId('card-body')).overflow).toBe('visible');
	});

	it('never sets overflow on the root', () => {
		setCardTokens();
		render(
			<Card testId="card" title="Title" padding={0}>
				Body
			</Card>,
		);

		expect(getComputedStyle(screen.getByTestId('card')).overflow).toBe('visible');
	});
});

describe('Card surface', () => {
	it('has a border, a radius and no overflow clip', () => {
		setCardTokens();
		render(<Card testId="card">Body</Card>);

		const root = getComputedStyle(screen.getByTestId('card'));

		expect(root.borderTopWidth).toBe('1px');
		expect(root.borderTopStyle).toBe('solid');
		expect(root.borderTopLeftRadius).toBe('4px');
		expect(root.overflow).toBe('visible');
	});

	it('has no hover, no focus and the default cursor', () => {
		render(<Card testId="card">Body</Card>);

		expect(getComputedStyle(screen.getByTestId('card')).cursor).toBe('auto');
	});
});
