import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from '../divider.js';

describe('Divider rendering', () => {
	it('stamps the slots and the test ids of every part', () => {
		render(<Divider testId="alerts">OR</Divider>);

		expect(screen.getByTestId('alerts')).toHaveAttribute('data-slot', 'divider');
		expect(screen.getByTestId('alerts-label')).toHaveAttribute('data-slot', 'divider-label');
		expect(screen.getByTestId('alerts')).toContainElement(screen.getByTestId('alerts-label'));
	});

	it('renders the line alone without children', () => {
		render(<Divider testId="divider" />);

		expect(screen.getByTestId('divider')).toBeEmptyDOMElement();
		expect(screen.queryByTestId('divider-label')).toBeNull();
	});

	it.each([
		['false', false],
		['null', null],
		['an empty string', ''],
		['an empty fragment', <></>],
		[
			'a fragment of empty nodes',
			<>
				{false}
				{null}
			</>,
		],
	])('renders the line alone when children is %s', (_, children) => {
		render(<Divider testId="divider">{children}</Divider>);

		expect(screen.getByTestId('divider')).toBeEmptyDOMElement();
		expect(screen.getByTestId('divider')).not.toHaveAttribute('data-has-label');
	});

	it('marks the root while the label renders', () => {
		render(<Divider testId="divider">OR</Divider>);

		expect(screen.getByTestId('divider')).toHaveAttribute('data-has-label');
	});

	it('renders as a span, so it can sit inside a paragraph', () => {
		render(
			<p>
				Back
				<Divider orientation="vertical" testId="divider" />
				metric
			</p>,
		);

		expect(screen.getByTestId('divider').tagName).toBe('SPAN');
	});

	it('mirrors orientation on the root, horizontal by default', () => {
		const { rerender } = render(<Divider testId="divider" />);

		expect(screen.getByTestId('divider')).toHaveAttribute('data-orientation', 'horizontal');

		rerender(<Divider orientation="vertical" testId="divider" />);

		expect(screen.getByTestId('divider')).toHaveAttribute('data-orientation', 'vertical');
	});

	it('marks dashed only while it is set', () => {
		const { rerender } = render(<Divider testId="divider" />);

		expect(screen.getByTestId('divider')).not.toHaveAttribute('data-dashed');

		rerender(<Divider dashed testId="divider" />);

		expect(screen.getByTestId('divider')).toHaveAttribute('data-dashed');
	});

	it('renders no label on a vertical divider that gets children past the types', () => {
		const props = { orientation: 'vertical', children: 'OR' } as object;
		render(<Divider testId="divider" {...props} />);

		expect(screen.getByTestId('divider')).toBeEmptyDOMElement();
		expect(screen.getByTestId('divider')).toHaveAttribute('role', 'separator');
	});

	it('drops className and style that get past the types', () => {
		render(
			<Divider
				testId="divider"
				spacing={16}
				{...({ className: 'spaced', style: { marginLeft: '4px' } } as object)}
			/>,
		);
		const divider = screen.getByTestId('divider');

		expect(divider).not.toHaveClass('spaced');
		expect(divider.style.marginLeft).toBe('');
		expect(divider.style.getPropertyValue('--divider-internal-spacing')).toBe('16px');
	});

	it('drops type and plain, the props of the old Divider, that get past the types', () => {
		const props = { type: 'vertical', plain: true } as object;
		render(<Divider testId="divider" {...props} />);
		const divider = screen.getByTestId('divider');

		expect(divider).not.toHaveAttribute('type');
		expect(divider).not.toHaveAttribute('plain');
	});

	it('writes width, maxWidth and spacing as internal custom properties, numbers as px', () => {
		render(<Divider testId="divider" width={240} maxWidth="50%" spacing="10px 16px" />);
		const divider = screen.getByTestId('divider');

		expect(divider.style.getPropertyValue('--divider-internal-width')).toBe('240px');
		expect(divider.style.getPropertyValue('--divider-internal-max-width')).toBe('50%');
		expect(divider.style.getPropertyValue('--divider-internal-spacing')).toBe('10px 16px');
	});

	it('writes height and maxHeight on a vertical divider, and drops a width that gets past the types', () => {
		const props = { width: 40, maxWidth: 40 } as object;
		render(
			<Divider orientation="vertical" height={16} maxHeight="50%" testId="divider" {...props} />,
		);
		const divider = screen.getByTestId('divider');

		expect(divider.style.getPropertyValue('--divider-internal-height')).toBe('16px');
		expect(divider.style.getPropertyValue('--divider-internal-max-height')).toBe('50%');
		expect(divider.style.getPropertyValue('--divider-internal-width')).toBe('');
		expect(divider.style.getPropertyValue('--divider-internal-max-width')).toBe('');
		expect(divider).not.toHaveAttribute('width');
	});

	it('drops a height or maxHeight on a horizontal divider that gets past the types', () => {
		const props = { height: 16, maxHeight: 16 } as object;
		render(<Divider testId="divider" {...props} />);
		const divider = screen.getByTestId('divider');

		expect(divider.style.getPropertyValue('--divider-internal-height')).toBe('');
		expect(divider.style.getPropertyValue('--divider-internal-max-height')).toBe('');
		expect(divider).not.toHaveAttribute('height');
	});

	it('writes no custom property without the length and spacing props', () => {
		render(<Divider testId="divider" />);

		expect(screen.getByTestId('divider').getAttribute('style')).toBeFalsy();
	});

	it('forwards id and any data-* to the root', () => {
		render(<Divider testId="divider" id="steps" data-row="funnel" />);
		const divider = screen.getByTestId('divider');

		expect(divider).toHaveAttribute('id', 'steps');
		expect(divider).toHaveAttribute('data-row', 'funnel');
	});

	it('keeps a data-testid passed as a data-* prop when testId is not set', () => {
		render(<Divider data-testid="raw" />);

		expect(screen.getByTestId('raw')).toHaveAttribute('data-slot', 'divider');
	});

	it('writes its own data-slot and data-orientation over the caller ones', () => {
		render(<Divider testId="divider" data-slot="other" data-orientation="vertical" />);
		const divider = screen.getByTestId('divider');

		expect(divider).toHaveAttribute('data-slot', 'divider');
		expect(divider).toHaveAttribute('data-orientation', 'horizontal');
	});
});
