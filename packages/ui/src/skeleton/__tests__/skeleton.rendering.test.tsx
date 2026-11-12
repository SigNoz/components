import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it, onTestFinished } from 'vitest';
import { Skeleton } from '../skeleton.js';

const WIDTH_VAR = '--skeleton-internal-width';
const MAX_WIDTH_VAR = '--skeleton-internal-max-width';
const TITLE_WIDTH_VAR = '--skeleton-internal-title-width';
const ROW_WIDTH_VAR = '--skeleton-internal-row-width';

interface PartCase {
	name: string;
	slot: string;
	ui: (extra?: object) => ReactElement;
}

const root: PartCase = {
	name: 'Skeleton',
	slot: 'skeleton',
	ui: (extra) => <Skeleton testId="part" {...extra} />,
};
const input: PartCase = {
	name: 'Skeleton.Input',
	slot: 'skeleton-input',
	ui: (extra) => <Skeleton.Input size="md" testId="part" {...extra} />,
};
const button: PartCase = {
	name: 'Skeleton.Button',
	slot: 'skeleton-button',
	ui: (extra) => <Skeleton.Button size="md" testId="part" {...extra} />,
};
const avatar: PartCase = {
	name: 'Skeleton.Avatar',
	slot: 'skeleton-avatar',
	ui: (extra) => <Skeleton.Avatar size="md" testId="part" {...extra} />,
};

const allParts = [root, input, button, avatar];
const widthParts = [root, input, button];
const sizedParts = [
	{ part: input, sizes: ['sm', 'md', 'lg'] },
	{ part: button, sizes: ['sm', 'md'] },
	{ part: avatar, sizes: ['sm', 'md'] },
] as const;

function rowsOf(container: HTMLElement): HTMLElement[] {
	return [...container.querySelectorAll<HTMLElement>('[data-slot="skeleton-row"]')];
}

function rowWidths(container: HTMLElement): string[] {
	return rowsOf(container).map((row) => row.style.getPropertyValue(ROW_WIDTH_VAR));
}

describe('Skeleton slots and test ids', () => {
	it('stamps the slots and the test ids of every part', () => {
		render(<Skeleton testId="card" />);

		expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'skeleton');
		expect(screen.getByTestId('card-title')).toHaveAttribute('data-slot', 'skeleton-title');
		expect(screen.getByTestId('card-paragraph')).toHaveAttribute('data-slot', 'skeleton-paragraph');
		expect(screen.getByTestId('card-row-0')).toHaveAttribute('data-slot', 'skeleton-row');
		expect(screen.getByTestId('card-row-1')).toHaveAttribute('data-slot', 'skeleton-row');
		expect(screen.getByTestId('card-row-2')).toHaveAttribute('data-slot', 'skeleton-row');
	});

	it('stacks the title and the paragraph in the root, in that order', () => {
		render(<Skeleton testId="card" />);
		const slots = [...screen.getByTestId('card').children].map((child) =>
			child.getAttribute('data-slot'),
		);

		expect(slots).toEqual(['skeleton-title', 'skeleton-paragraph']);
	});

	it('nests every row in the paragraph', () => {
		render(<Skeleton testId="card" />);
		const paragraph = screen.getByTestId('card-paragraph');

		expect(paragraph.children).toHaveLength(3);
		expect(paragraph).toContainElement(screen.getByTestId('card-row-0'));
		expect(paragraph).toContainElement(screen.getByTestId('card-row-2'));
	});

	it('renders no test id on any part without testId', () => {
		const { container } = render(<Skeleton />);

		expect(container.querySelectorAll('[data-slot]')).toHaveLength(6);
		expect(container.querySelectorAll('[data-testid]')).toHaveLength(0);
	});

	it.each(allParts)('$name carries testId as data-testid on its element', ({ ui, slot }) => {
		render(ui());

		expect(screen.getByTestId('part')).toHaveAttribute('data-slot', slot);
	});

	it.each(allParts)('$name renders no data-testid without testId', ({ ui, slot }) => {
		const { container } = render(ui({ testId: undefined }));
		const element = container.querySelector(`[data-slot="${slot}"]`);

		expect(element).not.toBeNull();
		expect(element).not.toHaveAttribute('data-testid');
	});

	it.each([input, button, avatar])('$name has no children', ({ ui }) => {
		render(ui());

		expect(screen.getByTestId('part')).toBeEmptyDOMElement();
	});
});

describe('Skeleton default layout', () => {
	it('shows the title and 3 rows', () => {
		const { container } = render(<Skeleton testId="card" />);

		expect(screen.getByTestId('card-title')).toBeInTheDocument();
		expect(screen.getByTestId('card-paragraph')).toBeInTheDocument();
		expect(rowsOf(container)).toHaveLength(3);
		expect(screen.queryByTestId('card-row-3')).toBeNull();
	});

	it('names the rows by their index, from 0', () => {
		const { container } = render(<Skeleton testId="card" />);

		expect(rowsOf(container).map((row) => row.getAttribute('data-testid'))).toEqual([
			'card-row-0',
			'card-row-1',
			'card-row-2',
		]);
	});

	it('draws the same layout for title and paragraph set to true', () => {
		const { container } = render(<Skeleton title paragraph testId="card" />);

		expect(screen.getByTestId('card-title')).toBeInTheDocument();
		expect(rowsOf(container)).toHaveLength(3);
	});

	it('writes no size custom property on any part by default', () => {
		const { container } = render(<Skeleton testId="card" />);

		for (const element of container.querySelectorAll<HTMLElement>('[data-slot]')) {
			expect(element.style.length).toBe(0);
		}
	});
});

describe('Skeleton title', () => {
	it('hides the title with false and keeps the rows', () => {
		const { container } = render(<Skeleton title={false} testId="card" />);

		expect(screen.queryByTestId('card-title')).toBeNull();
		expect(container.querySelector('[data-slot="skeleton-title"]')).toBeNull();
		expect(rowsOf(container)).toHaveLength(3);
	});

	it('hides the title for null, like false', () => {
		const { container } = render(<Skeleton title={null as never} testId="card" />);

		expect(screen.queryByTestId('card-title')).toBeNull();
		expect(rowsOf(container)).toHaveLength(3);
	});

	it('writes a number width as px', () => {
		render(<Skeleton title={{ width: 120 }} testId="card" />);

		expect(screen.getByTestId('card-title').style.getPropertyValue(TITLE_WIDTH_VAR)).toBe('120px');
	});

	it('writes a string width as it is', () => {
		render(<Skeleton title={{ width: '60%' }} testId="card" />);

		expect(screen.getByTestId('card-title').style.getPropertyValue(TITLE_WIDTH_VAR)).toBe('60%');
	});

	it('writes a width of 0 as 0px', () => {
		render(<Skeleton title={{ width: 0 }} testId="card" />);

		expect(screen.getByTestId('card-title').style.getPropertyValue(TITLE_WIDTH_VAR)).toBe('0px');
	});

	it.each([true, {}] as const)('writes no width for title %j', (title) => {
		render(<Skeleton title={title} testId="card" />);
		const bar = screen.getByTestId('card-title');

		expect(bar.style.getPropertyValue(TITLE_WIDTH_VAR)).toBe('');
		expect(bar.style.length).toBe(0);
	});

	it('writes the title width and never a width style', () => {
		render(<Skeleton title={{ width: 120 }} testId="card" />);

		expect(screen.getByTestId('card-title').style.width).toBe('');
	});

	it('takes the title width from title, not from width', () => {
		render(<Skeleton width={300} title={{ width: 80 }} testId="card" />);

		expect(screen.getByTestId('card').style.getPropertyValue(WIDTH_VAR)).toBe('300px');
		expect(screen.getByTestId('card-title').style.getPropertyValue(TITLE_WIDTH_VAR)).toBe('80px');
		expect(screen.getByTestId('card-title').style.getPropertyValue(WIDTH_VAR)).toBe('');
	});
});

describe('Skeleton paragraph', () => {
	it('hides the rows with false and keeps the title', () => {
		const { container } = render(<Skeleton paragraph={false} testId="card" />);

		expect(screen.getByTestId('card-title')).toBeInTheDocument();
		expect(screen.queryByTestId('card-paragraph')).toBeNull();
		expect(container.querySelector('[data-slot="skeleton-paragraph"]')).toBeNull();
		expect(rowsOf(container)).toHaveLength(0);
	});

	it('hides the rows for null, like false', () => {
		const { container } = render(<Skeleton paragraph={null as never} testId="card" />);

		expect(screen.getByTestId('card-title')).toBeInTheDocument();
		expect(screen.queryByTestId('card-paragraph')).toBeNull();
		expect(rowsOf(container)).toHaveLength(0);
	});

	it('keeps the title and renders no paragraph for rows 0', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 0 }} testId="card" />);

		expect(screen.getByTestId('card-title')).toBeInTheDocument();
		expect(screen.queryByTestId('card-paragraph')).toBeNull();
		expect(container.querySelector('[data-slot="skeleton-paragraph"]')).toBeNull();
		expect(rowsOf(container)).toHaveLength(0);
	});

	it('renders an empty root for title and paragraph both false', () => {
		render(<Skeleton title={false} paragraph={false} testId="card" />);

		expect(screen.getByTestId('card')).toBeEmptyDOMElement();
	});

	it('draws the 3 default rows for an empty config', () => {
		const { container } = render(<Skeleton paragraph={{}} testId="card" />);

		expect(rowsOf(container)).toHaveLength(3);
	});

	it('draws the rows it is asked for', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 6 }} testId="card" />);

		expect(rowsOf(container)).toHaveLength(6);
		expect(screen.getByTestId('card-row-0')).toBeInTheDocument();
		expect(screen.getByTestId('card-row-5')).toBeInTheDocument();
		expect(screen.queryByTestId('card-row-6')).toBeNull();
	});

	it('draws one row for rows 1', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 1 }} testId="card" />);

		expect(rowsOf(container)).toHaveLength(1);
		expect(screen.getByTestId('card-row-0')).toBeInTheDocument();
	});

	it('follows rows across renders', () => {
		const { container, rerender } = render(<Skeleton paragraph={{ rows: 2 }} />);

		expect(rowsOf(container)).toHaveLength(2);

		rerender(<Skeleton paragraph={{ rows: 5 }} />);

		expect(rowsOf(container)).toHaveLength(5);

		rerender(<Skeleton paragraph={{ rows: 0 }} />);

		expect(rowsOf(container)).toHaveLength(0);
	});

	it.each([
		[2.7, 2],
		[2.2, 2],
		[0.9, 0],
		[-0.5, 0],
		[-3, 0],
		[Number.NaN, 3],
		[Number.POSITIVE_INFINITY, 3],
		[Number.NEGATIVE_INFINITY, 3],
	])('draws rows %s as %s rows', (rows, count) => {
		const { container } = render(<Skeleton paragraph={{ rows }} testId="card" />);

		expect(rowsOf(container)).toHaveLength(count);
		expect(screen.queryByTestId('card-paragraph') === null).toBe(count === 0);
	});

	it('keeps the title for rows that clamp to 0', () => {
		render(<Skeleton paragraph={{ rows: -3 }} testId="card" />);

		expect(screen.getByTestId('card-title')).toBeInTheDocument();
		expect(screen.queryByTestId('card-paragraph')).toBeNull();
	});
});

describe('Skeleton paragraph width', () => {
	it('writes no row width without paragraph.width', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 3 }} />);

		expect(rowWidths(container)).toEqual(['', '', '']);
		for (const row of rowsOf(container)) {
			expect(row.style.length).toBe(0);
		}
	});

	it('applies a number to every row as px', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 3, width: 80 }} />);

		expect(rowWidths(container)).toEqual(['80px', '80px', '80px']);
	});

	it('applies a string to every row as it is', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 4, width: '50%' }} />);

		expect(rowWidths(container)).toEqual(['50%', '50%', '50%', '50%']);
	});

	it('applies the single value to the 3 default rows', () => {
		const { container } = render(<Skeleton paragraph={{ width: '75%' }} />);

		expect(rowWidths(container)).toEqual(['75%', '75%', '75%']);
	});

	it('applies an array per index, numbers as px', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 3, width: ['100%', 60, '40%'] }} />);

		expect(rowWidths(container)).toEqual(['100%', '60px', '40%']);
	});

	it('leaves the rows past the end of the array with no inline var', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 4, width: ['70%', 50] }} />);
		const rows = rowsOf(container);

		expect(rowWidths(container)).toEqual(['70%', '50px', '', '']);
		expect(rows[2]?.style.length).toBe(0);
		expect(rows[3]?.style.length).toBe(0);
	});

	it('ignores the values of an array past the last row', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 2, width: [10, 20, 30] }} />);

		expect(rowWidths(container)).toEqual(['10px', '20px']);
	});

	it('applies an array to the 3 default rows', () => {
		const { container } = render(<Skeleton paragraph={{ width: ['90%', '60%'] }} />);

		expect(rowWidths(container)).toEqual(['90%', '60%', '']);
	});

	it('writes no row width for an empty array', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 2, width: [] }} />);

		expect(rowWidths(container)).toEqual(['', '']);
	});

	it('writes the row width and never a width style', () => {
		const { container } = render(<Skeleton paragraph={{ rows: 2, width: 80 }} />);

		for (const row of rowsOf(container)) {
			expect(row.style.width).toBe('');
		}
	});

	it('does not write a row width on the paragraph or the root', () => {
		render(<Skeleton paragraph={{ rows: 2, width: 80 }} testId="card" />);

		expect(screen.getByTestId('card').style.getPropertyValue(ROW_WIDTH_VAR)).toBe('');
		expect(screen.getByTestId('card-paragraph').style.getPropertyValue(ROW_WIDTH_VAR)).toBe('');
	});
});

describe.each(widthParts)('$name width and maxWidth', ({ ui }) => {
	it('writes width as an internal custom property, a number as px', () => {
		render(ui({ width: 160 }));

		expect(screen.getByTestId('part').style.getPropertyValue(WIDTH_VAR)).toBe('160px');
	});

	it('writes a string width as it is', () => {
		render(ui({ width: '50%' }));

		expect(screen.getByTestId('part').style.getPropertyValue(WIDTH_VAR)).toBe('50%');
	});

	it('writes a unitless string width as px', () => {
		render(ui({ width: '240' }));

		expect(screen.getByTestId('part').style.getPropertyValue(WIDTH_VAR)).toBe('240px');
	});

	it('writes a width of 0 as 0px', () => {
		render(ui({ width: 0 }));

		expect(screen.getByTestId('part').style.getPropertyValue(WIDTH_VAR)).toBe('0px');
	});

	it('writes maxWidth as an internal custom property, a number as px', () => {
		render(ui({ maxWidth: 320 }));

		expect(screen.getByTestId('part').style.getPropertyValue(MAX_WIDTH_VAR)).toBe('320px');
	});

	it('writes a string maxWidth as it is', () => {
		render(ui({ maxWidth: '24rem' }));

		expect(screen.getByTestId('part').style.getPropertyValue(MAX_WIDTH_VAR)).toBe('24rem');
	});

	it('writes both together', () => {
		render(ui({ width: 200, maxWidth: '80%' }));
		const element = screen.getByTestId('part');

		expect(element.style.getPropertyValue(WIDTH_VAR)).toBe('200px');
		expect(element.style.getPropertyValue(MAX_WIDTH_VAR)).toBe('80%');
	});

	it('writes no inline style without width and maxWidth', () => {
		render(ui());
		const element = screen.getByTestId('part');

		expect(element.style.getPropertyValue(WIDTH_VAR)).toBe('');
		expect(element.style.getPropertyValue(MAX_WIDTH_VAR)).toBe('');
		expect(element.style.length).toBe(0);
	});

	it('writes only the var that is set', () => {
		render(ui({ width: 200 }));

		expect(screen.getByTestId('part').style.getPropertyValue(MAX_WIDTH_VAR)).toBe('');
	});

	it('never writes a width or max-width style', () => {
		render(ui({ width: 200, maxWidth: 300 }));
		const element = screen.getByTestId('part');

		expect(element.style.width).toBe('');
		expect(element.style.maxWidth).toBe('');
	});
});

describe.each(sizedParts)('$part.name size', ({ part, sizes }) => {
	it.each(sizes)('mirrors size %s on the element', (size) => {
		render(part.ui({ size }));

		expect(screen.getByTestId('part')).toHaveAttribute('data-size', size);
	});
});

const renderedSizes = [
	{ part: input, size: 'sm', height: 24 },
	{ part: input, size: 'md', height: 32 },
	{ part: input, size: 'lg', height: 40 },
	{ part: button, size: 'sm', width: 48, height: 24 },
	{ part: button, size: 'md', width: 64, height: 32 },
	{ part: avatar, size: 'sm', width: 24, height: 24 },
	{ part: avatar, size: 'md', width: 32, height: 32 },
];

const mdBoxes = [
	{ part: input, height: 32 },
	{ part: button, width: 64, height: 32 },
	{ part: avatar, width: 32, height: 32 },
];

describe('Skeleton part sizes in the browser', () => {
	it.each(renderedSizes)('draws $part.name at $size', ({ part, size, width, height }) => {
		render(part.ui({ size }));
		const box = screen.getByTestId('part').getBoundingClientRect();

		expect(box.height).toBe(height);
		if (width !== undefined) {
			expect(box.width).toBe(width);
		}
	});

	it.each(mdBoxes)('draws $part.name at md without size', ({ part, width, height }) => {
		render(part.ui({ size: undefined }));
		const box = screen.getByTestId('part').getBoundingClientRect();

		expect(box.height).toBe(height);
		if (width !== undefined) {
			expect(box.width).toBe(width);
		}
	});

	it.each(mdBoxes)(
		'draws $part.name at md for a size it does not know',
		({ part, width, height }) => {
			render(part.ui({ size: 'large' }));
			const box = screen.getByTestId('part').getBoundingClientRect();

			expect(box.height).toBe(height);
			if (width !== undefined) {
				expect(box.width).toBe(width);
			}
		},
	);
});

describe('Skeleton width in the browser', () => {
	it.each(widthParts)('draws $name 240px wide for the string 240', ({ ui }) => {
		render(<div style={{ width: 600 }}>{ui({ width: '240' })}</div>);

		expect(screen.getByTestId('part').getBoundingClientRect().width).toBe(240);
	});
});

describe('Skeleton.Button in a flex row', () => {
	const row = (children: ReactElement) => (
		<div style={{ display: 'flex', gap: 8, width: 300 }}>{children}</div>
	);

	it('shrinks a full-width button to leave room for the one next to it', () => {
		render(
			row(
				<>
					<Skeleton.Button size="md" width="100%" testId="wide" />
					<Skeleton.Button size="md" testId="fixed" />
				</>,
			),
		);

		expect(screen.getByTestId('wide').getBoundingClientRect().width).toBe(228);
		expect(screen.getByTestId('fixed').getBoundingClientRect().width).toBe(64);
	});

	it('never shrinks below the width of its size', () => {
		render(
			row(
				<>
					<div style={{ flex: 'none', width: 280 }} />
					<Skeleton.Button size="md" testId="fixed" />
				</>,
			),
		);

		expect(screen.getByTestId('fixed').getBoundingClientRect().width).toBe(64);
	});

	it('keeps a width smaller than its size', () => {
		render(
			row(
				<>
					<div style={{ flex: 'none', width: 280 }} />
					<Skeleton.Button size="md" width={40} testId="narrow" />
				</>,
			),
		);

		expect(screen.getByTestId('narrow').getBoundingClientRect().width).toBe(40);
	});

	it('keeps a maxWidth smaller than its size', () => {
		render(row(<Skeleton.Button size="md" maxWidth={40} testId="capped" />));

		expect(screen.getByTestId('capped').getBoundingClientRect().width).toBe(40);
	});

	it.each(['none', 'max-content'])('keeps the width of its size with maxWidth="%s"', (maxWidth) => {
		render(
			row(
				<>
					<div style={{ flex: 'none', width: 280 }} />
					<Skeleton.Button size="md" maxWidth={maxWidth} testId="uncapped" />
				</>,
			),
		);

		expect(screen.getByTestId('uncapped').getBoundingClientRect().width).toBe(64);
	});

	it('never spills out of a parent narrower than its size', () => {
		render(
			<div style={{ width: 40 }}>
				<Skeleton.Button size="md" testId="contained" />
			</div>,
		);

		expect(screen.getByTestId('contained').getBoundingClientRect().width).toBe(40);
	});
});

describe('Skeleton.Input in a parent sized by its content', () => {
	it.each([
		{ name: 'an auto grid column', display: 'grid' },
		{ name: 'an inline-flex box', display: 'inline-flex' },
	])('takes the width of an empty Input in $name', ({ display }) => {
		render(
			<div
				style={{
					display,
					...(display === 'grid' && { gridTemplateColumns: 'auto 1fr', width: 600 }),
				}}
			>
				<div>
					<Skeleton.Input size="md" testId="part" />
				</div>
			</div>,
		);

		expect(screen.getByTestId('part').getBoundingClientRect().width).toBe(200);
	});

	it('still fills a parent with a width, and still takes width', () => {
		render(
			<>
				<div style={{ width: 120 }}>
					<Skeleton.Input size="md" testId="fill" />
				</div>
				<div style={{ width: 600 }}>
					<Skeleton.Input size="md" width={80} testId="fixed" />
				</div>
			</>,
		);

		expect(screen.getByTestId('fill').getBoundingClientRect().width).toBe(120);
		expect(screen.getByTestId('fixed').getBoundingClientRect().width).toBe(80);
	});
});

describe('Skeleton has no size', () => {
	it('mirrors no data-size on the root', () => {
		render(<Skeleton testId="card" />);

		expect(screen.getByTestId('card')).not.toHaveAttribute('data-size');
	});
});

describe('Skeleton.Avatar shape', () => {
	it('defaults to a circle', () => {
		render(<Skeleton.Avatar size="md" testId="owner" />);

		expect(screen.getByTestId('owner')).toHaveAttribute('data-shape', 'circle');
	});

	it.each(['circle', 'square'] as const)('mirrors shape %s on the element', (shape) => {
		render(<Skeleton.Avatar size="md" shape={shape} testId="owner" />);

		expect(screen.getByTestId('owner')).toHaveAttribute('data-shape', shape);
	});

	it.each([
		['circle', '50%'],
		['square', '6px'],
	] as const)('rounds a %s like Avatar does', (shape, radius) => {
		const tokens = document.createElement('style');
		tokens.textContent = ':root { --radius-1: 2px; --radius-3: 6px; }';
		document.head.append(tokens);
		onTestFinished(() => tokens.remove());
		render(<Skeleton.Avatar size="md" shape={shape} testId="owner" />);

		expect(getComputedStyle(screen.getByTestId('owner')).borderTopLeftRadius).toBe(radius);
	});

	it('writes no inline style', () => {
		render(<Skeleton.Avatar size="md" testId="owner" />);

		expect(screen.getByTestId('owner').style.length).toBe(0);
	});

	it.each([root, input, button])('$name has no data-shape', ({ ui }) => {
		render(ui());

		expect(screen.getByTestId('part')).not.toHaveAttribute('data-shape');
	});
});

describe.each(allParts)('$name active', ({ ui }) => {
	it('has data-active by default', () => {
		render(ui());

		expect(screen.getByTestId('part')).toHaveAttribute('data-active');
	});

	it('has data-active while active is true', () => {
		render(ui({ active: true }));

		expect(screen.getByTestId('part')).toHaveAttribute('data-active');
	});

	it('has no data-active for active false', () => {
		render(ui({ active: false }));

		expect(screen.getByTestId('part')).not.toHaveAttribute('data-active');
	});

	it('follows active across renders', () => {
		const { rerender } = render(ui());

		expect(screen.getByTestId('part')).toHaveAttribute('data-active');

		rerender(ui({ active: false }));

		expect(screen.getByTestId('part')).not.toHaveAttribute('data-active');

		rerender(ui({ active: true }));

		expect(screen.getByTestId('part')).toHaveAttribute('data-active');
	});
});

describe('Skeleton active on the root only', () => {
	it('puts data-active on the root and on no inner part', () => {
		const { container } = render(<Skeleton testId="card" />);

		expect(screen.getByTestId('card')).toHaveAttribute('data-active');
		expect(screen.getByTestId('card-title')).not.toHaveAttribute('data-active');
		expect(screen.getByTestId('card-paragraph')).not.toHaveAttribute('data-active');
		for (const row of rowsOf(container)) {
			expect(row).not.toHaveAttribute('data-active');
		}
	});
});

describe.each(allParts)('$name className, style, id and data', ({ ui }) => {
	it('drops className and style that get past the types', () => {
		render(
			ui({
				...({
					className: 'cell',
					style: { marginLeft: '4px', width: '99px', height: '99px' },
				} as object),
			}),
		);
		const element = screen.getByTestId('part');

		expect(element).not.toHaveClass('cell');
		expect(element.style.marginLeft).toBe('');
		expect(element.style.width).toBe('');
		expect(element.style.height).toBe('');
	});

	it('forwards the id', () => {
		render(ui({ id: 'loading-card' }));

		expect(screen.getByTestId('part')).toHaveAttribute('id', 'loading-card');
	});

	it('forwards a data attribute', () => {
		render(ui({ 'data-row': 'host-1' }));

		expect(screen.getByTestId('part')).toHaveAttribute('data-row', 'host-1');
	});

	it('forwards several data attributes', () => {
		render(ui({ 'data-row': 'host-1', 'data-region': 'eu' }));
		const element = screen.getByTestId('part');

		expect(element).toHaveAttribute('data-row', 'host-1');
		expect(element).toHaveAttribute('data-region', 'eu');
	});

	it('keeps its own data-slot over a data-slot that gets past the types', () => {
		render(ui({ 'data-slot': 'other' }));

		expect(screen.getByTestId('part')).not.toHaveAttribute('data-slot', 'other');
	});
});

describe.each(widthParts)(
	'$name keeps its width when className and style are dropped',
	({ ui }) => {
		it('writes the width var and drops the style', () => {
			render(ui({ width: 160, ...({ style: { width: '99px' } } as object) }));
			const element = screen.getByTestId('part');

			expect(element.style.getPropertyValue(WIDTH_VAR)).toBe('160px');
			expect(element.style.width).toBe('');
		});
	},
);
