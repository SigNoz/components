import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Slider } from './index.js';

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

/**
 * These assertions deliberately target the public contract and ARIA state
 * rather than the underlying primitive's DOM: roles, `aria-value*`, callback
 * payload shape, and the wrapper's own mark/clamp logic. They are meant to
 * stay meaningful if the primitive underneath is replaced.
 */
describe('Slider value semantics', () => {
	it('renders a single thumb for a scalar value', () => {
		render(<Slider defaultValue={40} />);
		expect(screen.getAllByRole('slider')).toHaveLength(1);
		expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '40');
	});

	it('renders one thumb per entry for an array value', () => {
		render(<Slider defaultValue={[20, 80]} range />);
		const thumbs = screen.getAllByRole('slider');
		expect(thumbs).toHaveLength(2);
		expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20');
		expect(thumbs[1]).toHaveAttribute('aria-valuenow', '80');
	});

	it('reflects min and max on the thumb', () => {
		render(<Slider defaultValue={5} min={5} max={25} />);
		const thumb = screen.getByRole('slider');
		// The slider role now sits on a real <input type="range">, which carries
		// the bounds natively rather than via aria-valuemin/aria-valuemax.
		expect(thumb).toHaveAttribute('min', '5');
		expect(thumb).toHaveAttribute('max', '25');
	});

	it('falls back to min when no value is supplied', () => {
		render(<Slider min={10} max={50} />);
		expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '10');
	});
});

describe('Slider onChange payload shape', () => {
	it('reports a scalar when range is not set', () => {
		const onChange = vi.fn();
		render(<Slider defaultValue={40} onChange={onChange} />);

		fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(41);
	});

	it('reports an array when range is set', () => {
		const onChange = vi.fn();
		render(<Slider defaultValue={[20, 80]} range onChange={onChange} />);

		fireEvent.keyDown(screen.getAllByRole('slider')[0], { key: 'ArrowRight' });

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith([21, 80]);
	});

	it('marks a disabled slider as natively disabled', () => {
		// The control is now a real <input type="range">, so `disabled` is native
		// and the browser suppresses input entirely. That suppression is NOT
		// reproducible here: `fireEvent` dispatches straight at the element and
		// bypasses it, so asserting "onChange was not called" would only be
		// testing a jsdom artifact. The contract worth pinning is the native
		// disabled state; the interaction itself belongs in the browser runner.
		const onChange = vi.fn();
		render(<Slider defaultValue={40} disabled onChange={onChange} />);

		expect(screen.getByRole('slider')).toBeDisabled();
	});
});

describe('Slider controlled vs uncontrolled', () => {
	it('moves on its own when uncontrolled', () => {
		render(<Slider defaultValue={40} />);
		const thumb = screen.getByRole('slider');

		fireEvent.keyDown(thumb, { key: 'ArrowRight' });

		expect(thumb).toHaveAttribute('aria-valuenow', '41');
	});

	it('stays pinned to the value prop when controlled and the parent ignores onChange', () => {
		const onChange = vi.fn();
		render(<Slider value={40} onChange={onChange} />);
		const thumb = screen.getByRole('slider');

		fireEvent.keyDown(thumb, { key: 'ArrowRight' });

		expect(onChange).toHaveBeenCalledWith(41);
		expect(thumb).toHaveAttribute('aria-valuenow', '40');
	});

	it('follows the value prop when the parent commits the change', () => {
		function Controlled() {
			const [value, setValue] = useState<number | number[]>(40);
			return <Slider value={value} onChange={setValue} />;
		}
		render(<Controlled />);
		const thumb = screen.getByRole('slider');

		fireEvent.keyDown(thumb, { key: 'ArrowRight' });

		expect(thumb).toHaveAttribute('aria-valuenow', '41');
	});
});

describe('Slider marks', () => {
	const marks = {
		0: '0GB',
		50: '50GB',
		100: { style: { color: 'rgb(255, 0, 0)' }, label: '100GB' },
	};

	it('renders one activatable control per mark, including object marks', () => {
		render(<Slider defaultValue={50} marks={marks} />);

		expect(screen.getByRole('button', { name: '0GB' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '50GB' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '100GB' })).toBeInTheDocument();
	});

	it('applies a per-mark style from the object form', () => {
		render(<Slider defaultValue={50} marks={marks} />);
		expect(screen.getByRole('button', { name: '100GB' })).toHaveStyle({ color: 'rgb(255, 0, 0)' });
	});

	it('jumps to the exact mark value on click and reports it as committed', () => {
		const onChange = vi.fn();
		const onAfterChange = vi.fn();
		render(
			<Slider defaultValue={0} marks={marks} onChange={onChange} onAfterChange={onAfterChange} />,
		);

		fireEvent.click(screen.getByRole('button', { name: '50GB' }));

		expect(onChange).toHaveBeenCalledWith(50);
		expect(onAfterChange).toHaveBeenCalledWith(50);
		expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50');
	});

	it('activates a mark from the keyboard', () => {
		const onChange = vi.fn();
		render(<Slider defaultValue={0} marks={marks} onChange={onChange} />);

		fireEvent.keyDown(screen.getByRole('button', { name: '50GB' }), { key: 'Enter' });
		expect(onChange).toHaveBeenLastCalledWith(50);

		fireEvent.keyDown(screen.getByRole('button', { name: '100GB' }), { key: ' ' });
		expect(onChange).toHaveBeenLastCalledWith(100);
	});

	it('moves the nearer thumb when a mark is clicked on a range slider', () => {
		const onChange = vi.fn();
		render(<Slider defaultValue={[10, 90]} range marks={marks} onChange={onChange} />);

		fireEvent.click(screen.getByRole('button', { name: '0GB' }));

		expect(onChange).toHaveBeenCalledWith([0, 90]);
	});

	it('keeps the reported range sorted when a mark crosses the other thumb', () => {
		const onChange = vi.fn();
		render(<Slider defaultValue={[10, 20]} range marks={marks} onChange={onChange} />);

		fireEvent.click(screen.getByRole('button', { name: '100GB' }));

		const { calls } = onChange.mock;
		const [reported] = calls[calls.length - 1] as [number[]];
		expect(reported).toEqual([...reported].sort((a, b) => a - b));
	});
});

describe('Slider prop forwarding', () => {
	it('puts testId, id and style on the root, not on a thumb', () => {
		render(
			<Slider defaultValue={40} testId="storage-slider" id="storage" style={{ width: '300px' }} />,
		);

		const root = screen.getByTestId('storage-slider');
		expect(root).toHaveAttribute('id', 'storage');
		expect(root).toHaveStyle({ width: '300px' });
		expect(root).not.toHaveAttribute('role', 'slider');
		expect(root).toContainElement(screen.getByRole('slider'));
	});

	it('propagates the disabled state to the whole slider for styling', () => {
		render(<Slider defaultValue={40} disabled testId="s" />);

		// Base UI marks every part, which is what the stylesheet keys off.
		expect(screen.getByTestId('s')).toHaveAttribute('data-disabled');
		expect(screen.getByRole('slider')).toBeDisabled();
	});
});

describe('Slider tooltip', () => {
	it('formats the thumb value through the tooltip formatter on hover', () => {
		render(<Slider defaultValue={42} tooltip={{ formatter: (value) => `${value}%` }} />);

		fireEvent.pointerEnter(screen.getByRole('slider'));

		expect(screen.getAllByText('42%').length).toBeGreaterThan(0);
	});
});
