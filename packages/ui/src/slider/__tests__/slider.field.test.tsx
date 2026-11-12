import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { SliderField } from '../presets/slider-field.js';
import { Slider } from '../slider.js';
import { getThumbInput, renderSlider } from './slider.test-utils.js';

const DESCRIPTION = 'Share of requests that are traced.';

/**
 * Base UI keeps a thumb hidden until it has measured it, so `getByRole('slider')` finds nothing
 * right after render. Waits for both thumbs of a range.
 */
async function renderRange(ui: ReactElement): Promise<void> {
	render(<div style={{ width: 300 }}>{ui}</div>);
	await screen.findByRole('slider', { name: 'Maximum' });
}

async function renderToHtml(ui: ReactElement, thumbName: string): Promise<string> {
	const { container, unmount } = render(<div style={{ width: 300 }}>{ui}</div>);
	await screen.findByRole('slider', { name: thumbName });
	const html = container.innerHTML.replace(/:r[0-9a-z]+:/g, ':id:');

	unmount();

	return html;
}

function getFieldRoot(): HTMLElement {
	const root = document.querySelector<HTMLElement>('[data-slot="field"]');

	if (root === null) {
		throw new Error('no field root');
	}

	return root;
}

describe('SliderField name and description', () => {
	it('names the thumb with the label', async () => {
		await renderSlider(<SliderField label="Sampling rate" color="primary" />);

		expect(screen.getByRole('slider', { name: 'Sampling rate' })).toBe(getThumbInput());
	});

	it('describes the thumb with the description', async () => {
		await renderSlider(
			<SliderField label="Sampling rate" color="primary" description={DESCRIPTION} />,
		);

		expect(getThumbInput()).toHaveAccessibleDescription(DESCRIPTION);
	});

	it('adds the label tooltip text after the description', async () => {
		await renderSlider(
			<SliderField
				label="Sampling rate"
				color="primary"
				description={DESCRIPTION}
				labelTooltip="Applied at the collector"
			/>,
		);

		expect(getThumbInput()).toHaveAccessibleDescription(`${DESCRIPTION} Applied at the collector`);
	});

	it('swaps the description for the message while there is one', async () => {
		await renderSlider(
			<SliderField
				label="Sampling rate"
				color="primary"
				description={DESCRIPTION}
				error="Use a rate of 100 or less"
			/>,
		);

		expect(getThumbInput()).toHaveAccessibleDescription('Use a rate of 100 or less');
	});

	it('keeps its own aria-describedby next to the field ones', async () => {
		await renderSlider(
			<>
				<span id="hint">Applies to new traces</span>
				<SliderField
					label="Sampling rate"
					color="primary"
					description={DESCRIPTION}
					aria-describedby="hint"
				/>
			</>,
		);

		expect(getThumbInput()).toHaveAccessibleDescription(`Applies to new traces ${DESCRIPTION}`);
	});
});

describe('SliderField status and required', () => {
	it('sets aria-invalid on the thumb with an error', async () => {
		await renderSlider(<SliderField label="Sampling rate" color="primary" error="Too high" />);

		expect(getThumbInput()).toHaveAttribute('aria-invalid', 'true');
		expect(getFieldRoot()).toHaveAttribute('data-status', 'danger');
	});

	it('sets aria-invalid for status danger and for no other status', async () => {
		const { rerender } = await renderSlider(
			<SliderField label="Sampling rate" color="primary" status="danger" message="Too high" />,
		);

		expect(getThumbInput()).toHaveAttribute('aria-invalid', 'true');

		rerender(
			<SliderField label="Sampling rate" color="primary" status="warning" message="Almost high" />,
		);

		expect(getThumbInput()).not.toHaveAttribute('aria-invalid', 'true');
		expect(getFieldRoot()).toHaveAttribute('data-status', 'warning');

		rerender(
			<SliderField
				label="Sampling rate"
				color="primary"
				status="success"
				message="Within budget"
			/>,
		);

		expect(getThumbInput()).not.toHaveAttribute('aria-invalid', 'true');
	});

	it('clears aria-invalid once the error goes away', async () => {
		const { rerender } = await renderSlider(
			<SliderField label="Sampling rate" color="primary" error="Too high" />,
		);

		rerender(<SliderField label="Sampling rate" color="primary" error={undefined} />);

		expect(getThumbInput()).not.toHaveAttribute('aria-invalid', 'true');
		expect(getFieldRoot()).not.toHaveAttribute('data-status');
	});

	it('draws the asterisk and nothing else, since aria-required is not allowed on a slider', async () => {
		await renderSlider(<SliderField label="Sampling rate" color="primary" required />);

		const marker = document.querySelector('[data-slot="field-required-marker"]');

		expect(marker).toBeInTheDocument();
		expect(marker).toHaveAttribute('aria-hidden', 'true');
		expect(getFieldRoot()).toHaveAttribute('data-required', 'true');
		expect(getThumbInput()).not.toBeRequired();
		expect(getThumbInput()).not.toHaveAttribute('aria-required');
		expect(getThumbInput()).not.toHaveAttribute('required');
		expect(screen.getByRole('slider', { name: 'Sampling rate' })).toBeInTheDocument();
	});
});

describe('SliderField test ids', () => {
	it('prefixes the field parts with the testId and leaves the field root bare', async () => {
		await renderSlider(
			<SliderField
				label="Sampling rate"
				color="primary"
				description={DESCRIPTION}
				labelTooltip="Applied at the collector"
				testId="rate"
			/>,
		);

		expect(screen.getByTestId('rate-label')).toBeInTheDocument();
		expect(screen.getByTestId('rate-label-tooltip')).toBeInTheDocument();
		expect(screen.getByTestId('rate-description')).toHaveTextContent(DESCRIPTION);
		expect(getFieldRoot()).not.toHaveAttribute('data-testid');
	});

	it('names the message part while a message shows', async () => {
		await renderSlider(
			<SliderField label="Sampling rate" color="primary" error="Too high" testId="rate" />,
		);

		expect(screen.getByTestId('rate-message')).toHaveTextContent('Too high');
		expect(screen.queryByTestId('rate-description')).not.toBeInTheDocument();
	});

	it('hands the testId to the slider, which keeps naming its own parts', async () => {
		await renderSlider(<SliderField label="Sampling rate" color="primary" testId="rate" />);

		expect(screen.getByTestId('rate')).toHaveAttribute('data-slot', 'slider');
		expect(screen.getByTestId('rate-thumb-0')).toBeInTheDocument();
		expect(screen.getByTestId('rate-track')).toBeInTheDocument();
	});

	it('gives no part a test id without a testId', async () => {
		await renderSlider(
			<SliderField label="Sampling rate" color="primary" description={DESCRIPTION} />,
		);

		expect(document.querySelectorAll('[data-testid]')).toHaveLength(0);
	});
});

describe('SliderField props split', () => {
	it('sends the field props to the field and every other prop to the slider', async () => {
		await renderSlider(
			<SliderField
				label="Sampling rate"
				color="primary"
				description={DESCRIPTION}
				id="rate-slider"
				min={10}
				max={90}
				step={5}
				defaultValue={30}
				formatValue={(value) => `${value}%`}
				marks={{ 10: 'Low', 90: 'High' }}
				data-extra="yes"
				testId="rate"
			/>,
		);

		const root = screen.getByTestId('rate');
		const thumb = getThumbInput();

		expect(root).toHaveAttribute('id', 'rate-slider');
		expect(root).toHaveAttribute('data-extra', 'yes');
		expect(root).toHaveAttribute('data-color', 'primary');
		expect(root).not.toHaveAttribute('label');
		expect(root).not.toHaveAttribute('description');
		expect(thumb).toHaveAttribute('min', '10');
		expect(thumb).toHaveAttribute('max', '90');
		expect(thumb).toHaveAttribute('step', '5');
		expect(thumb).toHaveAttribute('aria-valuenow', '30');
		expect(thumb).toHaveAttribute('aria-valuetext', '30%');
		expect(screen.getByTestId('rate-mark-10')).toHaveTextContent('Low');
		expect(screen.getByTestId('rate-mark-90')).toHaveTextContent('High');
	});

	it('hands disabled and its reason to the slider', async () => {
		await renderSlider(
			<SliderField
				label="Sampling rate"
				color="primary"
				disabled
				disabledTooltip="Pick a source first"
				testId="rate"
			/>,
		);

		expect(screen.getByTestId('rate')).toHaveAttribute('data-disabled');
	});

	it('drops htmlFor, the shorthand wires the id itself', async () => {
		await renderSlider(
			// @ts-expect-error - `htmlFor` is not a prop of the shorthand
			<SliderField label="Sampling rate" color="primary" htmlFor="elsewhere" />,
		);

		expect(screen.getByRole('slider', { name: 'Sampling rate' })).toBeInTheDocument();
		expect(document.querySelector('label')).not.toHaveAttribute('for', 'elsewhere');
	});
});

describe('SliderField ref', () => {
	it('forwards the ref to the root div, which does not take focus', async () => {
		const ref = createRef<HTMLDivElement>();
		await renderSlider(
			<SliderField label="Sampling rate" color="primary" testId="rate" ref={ref} />,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('rate'));

		ref.current?.focus();

		expect(getThumbInput()).not.toHaveFocus();
	});
});

describe('SliderField value', () => {
	it('moves a controlled slider by keyboard and reports each value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		function Controlled(): ReactElement {
			const [value, setValue] = useState(40);

			return (
				<SliderField
					label="Sampling rate"
					color="primary"
					value={value}
					onChange={(next) => {
						onChange(next);
						setValue(next);
					}}
				/>
			);
		}

		await renderSlider(<Controlled />);
		getThumbInput().focus();
		await user.keyboard('{ArrowRight}{ArrowRight}{ArrowLeft}');

		expect(onChange).toHaveBeenNthCalledWith(1, 41);
		expect(onChange).toHaveBeenNthCalledWith(2, 42);
		expect(onChange).toHaveBeenNthCalledWith(3, 41);
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '41');
	});

	it('moves an uncontrolled slider by keyboard', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderSlider(
			<SliderField label="Sampling rate" color="primary" defaultValue={10} onChange={onChange} />,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenCalledWith(11);
		expect(getThumbInput()).toHaveAttribute('aria-valuenow', '11');
	});

	it('takes a Controller field spread: value, onChange, ref and name', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const ref = vi.fn();
		const field = { name: 'rate', value: 40, onChange, ref };
		await renderSlider(
			<SliderField label="Sampling rate" color="primary" {...field} error="Too high" />,
		);

		getThumbInput().focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenCalledWith(41);
		expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
		expect(getThumbInput()).toHaveAttribute('name', 'rate');
		expect(getThumbInput()).toHaveAttribute('aria-invalid', 'true');
	});
});

describe('SliderField against a hand-written Field', () => {
	it('renders the same DOM', async () => {
		const shorthand = await renderToHtml(
			<SliderField
				label="Sampling rate"
				color="primary"
				description={DESCRIPTION}
				labelTooltip="Applied at the collector"
				required
				defaultValue={30}
			/>,
			'Sampling rate',
		);
		const handWritten = await renderToHtml(
			<Field
				label="Sampling rate"
				description={DESCRIPTION}
				labelTooltip="Applied at the collector"
				required
			>
				<Slider color="primary" defaultValue={30} />
			</Field>,
			'Sampling rate',
		);

		expect(handWritten).toBe(shorthand);
	});
});

describe('SliderField.Range naming', () => {
	it('names the fieldset and the range with the label', async () => {
		await renderRange(<SliderField.Range label="Duration" color="primary" testId="duration" />);

		const fieldset = document.querySelector('fieldset');
		const range = screen.getByTestId('duration');

		expect(screen.getAllByRole('group', { name: 'Duration' })).toEqual([fieldset, range]);
		expect(range).toHaveAttribute('aria-labelledby', fieldset?.getAttribute('aria-labelledby'));
	});

	it('keeps the Minimum and Maximum names on the thumbs', async () => {
		await renderRange(<SliderField.Range label="Duration" color="primary" />);

		expect(screen.getByRole('slider', { name: 'Minimum' })).toBeInTheDocument();
		expect(screen.getByRole('slider', { name: 'Maximum' })).toBeInTheDocument();
	});

	it('lets its own aria-label win over the legend', async () => {
		await renderRange(
			<SliderField.Range
				label="Duration"
				color="primary"
				aria-label="Request time"
				testId="duration"
			/>,
		);

		const range = screen.getByTestId('duration');

		expect(range).toHaveAttribute('aria-label', 'Request time');
		expect(range).not.toHaveAttribute('aria-labelledby');
		expect(range).toHaveAccessibleName('Request time');
	});

	it('lets its own aria-labelledby win over the legend', async () => {
		await renderRange(
			<>
				<span id="own-label">Own label</span>
				<SliderField.Range
					label="Duration"
					color="primary"
					aria-labelledby="own-label"
					testId="duration"
				/>
			</>,
		);

		expect(screen.getByTestId('duration')).toHaveAccessibleName('Own label');
	});

	it('leaves the description on the fieldset only', async () => {
		await renderRange(
			<SliderField.Range
				label="Duration"
				color="primary"
				description="How long a request ran."
				testId="duration"
			/>,
		);

		expect(document.querySelector('fieldset')).toHaveAccessibleDescription(
			'How long a request ran.',
		);
		expect(screen.getByTestId('duration')).not.toHaveAttribute('aria-describedby');
	});

	it('keeps its own aria-describedby on the range', async () => {
		await renderRange(
			<>
				<span id="hint">In milliseconds</span>
				<SliderField.Range
					label="Duration"
					color="primary"
					aria-describedby="hint"
					testId="duration"
				/>
			</>,
		);

		expect(screen.getByTestId('duration')).toHaveAccessibleDescription('In milliseconds');
	});
});

describe('SliderField.Range status and required', () => {
	// `role="group"` takes no `aria-invalid`, a `slider` does.
	it('sets aria-invalid on both thumbs with an error, not on the group', async () => {
		await renderRange(
			<SliderField.Range label="Duration" color="primary" error="Too long" testId="duration" />,
		);

		expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveAttribute('aria-invalid', 'true');
		expect(screen.getByTestId('duration')).not.toHaveAttribute('aria-invalid');
		expect(document.querySelector('fieldset')).toHaveAttribute('data-status', 'danger');
		expect(document.querySelector('fieldset')).toHaveAccessibleDescription('Too long');
	});

	it('sets no aria-invalid for warning and success', async () => {
		const { rerender } = render(
			<div style={{ width: 300 }}>
				<SliderField.Range
					label="Duration"
					color="primary"
					status="warning"
					message="Slow"
					testId="duration"
				/>
			</div>,
		);
		await screen.findByRole('slider', { name: 'Maximum' });

		expect(screen.getByTestId('duration')).not.toHaveAttribute('aria-invalid');
		expect(screen.getByRole('slider', { name: 'Maximum' })).not.toHaveAttribute('aria-invalid');

		rerender(
			<div style={{ width: 300 }}>
				<SliderField.Range
					label="Duration"
					color="primary"
					status="success"
					message="Fast"
					testId="duration"
				/>
			</div>,
		);

		expect(screen.getByTestId('duration')).not.toHaveAttribute('aria-invalid');
	});

	it('lets its own aria-invalid win over the status', async () => {
		await renderRange(
			<SliderField.Range
				label="Duration"
				color="primary"
				error="Too long"
				aria-invalid={false}
				testId="duration"
			/>,
		);

		expect(screen.getByTestId('duration')).toHaveAttribute('aria-invalid', 'false');
		expect(screen.getByRole('slider', { name: 'Maximum' })).not.toHaveAttribute('aria-invalid');
	});

	it('draws the asterisk on the legend and takes no required attribute', async () => {
		await renderRange(
			<SliderField.Range label="Duration" color="primary" required testId="duration" />,
		);

		expect(document.querySelector('legend [data-slot="field-required-marker"]')).toHaveAttribute(
			'aria-hidden',
			'true',
		);
		expect(screen.getByTestId('duration')).not.toHaveAttribute('aria-required');

		for (const thumb of screen.getAllByRole('slider')) {
			expect(thumb).not.toBeRequired();
			expect(thumb).not.toHaveAttribute('aria-required');
		}
	});
});

describe('SliderField.Range parts and value', () => {
	it('prefixes the field parts with the testId, and the field group takes none', async () => {
		await renderRange(
			<SliderField.Range
				label="Duration"
				color="primary"
				description="How long a request ran."
				testId="duration"
			/>,
		);

		expect(screen.getByTestId('duration-label')).toBeInTheDocument();
		expect(screen.getByTestId('duration-description')).toBeInTheDocument();
		expect(screen.getByTestId('duration')).toHaveAttribute('data-slot', 'slider');
		expect(screen.getByTestId('duration-thumb-0')).toBeInTheDocument();
		expect(screen.getByTestId('duration-thumb-1')).toBeInTheDocument();
		expect(document.querySelector('fieldset')).not.toHaveAttribute('data-testid');
	});

	it('sends name to both thumb inputs', async () => {
		await renderRange(<SliderField.Range label="Duration" color="primary" name="duration" />);

		expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute('name', 'duration');
		expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveAttribute('name', 'duration');
	});

	it('moves each thumb of an uncontrolled range by keyboard and reports the pair', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		await renderRange(
			<SliderField.Range
				label="Duration"
				color="primary"
				defaultValue={[20, 80]}
				onChange={onChange}
			/>,
		);

		screen.getByRole('slider', { name: 'Minimum' }).focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenLastCalledWith([21, 80]);

		screen.getByRole('slider', { name: 'Maximum' }).focus();
		await user.keyboard('{ArrowLeft}');

		expect(onChange).toHaveBeenLastCalledWith([21, 79]);
		expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute('aria-valuenow', '21');
		expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveAttribute('aria-valuenow', '79');
	});

	it('moves a controlled range by keyboard', async () => {
		const user = userEvent.setup();

		function Controlled(): ReactElement {
			const [value, setValue] = useState<[number, number]>([10, 50]);

			return (
				<SliderField.Range label="Duration" color="primary" value={value} onChange={setValue} />
			);
		}

		await renderRange(<Controlled />);
		screen.getByRole('slider', { name: 'Maximum' }).focus();
		await user.keyboard('{ArrowRight}{ArrowRight}');

		expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveAttribute('aria-valuenow', '52');
		expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute('aria-valuenow', '10');
	});

	it('takes a Controller field spread: value, onChange, ref and name', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const ref = vi.fn();
		const field = { name: 'duration', value: [20, 80] as [number, number], onChange, ref };
		await renderRange(<SliderField.Range label="Duration" color="primary" {...field} />);

		screen.getByRole('slider', { name: 'Minimum' }).focus();
		await user.keyboard('{ArrowRight}');

		expect(onChange).toHaveBeenCalledWith([21, 80]);
		expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
		expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute('name', 'duration');
	});

	it('forwards the ref to the root div of the range', async () => {
		const ref = createRef<HTMLDivElement>();
		await renderRange(
			<SliderField.Range label="Duration" color="primary" testId="duration" ref={ref} />,
		);

		expect(ref.current).toBe(screen.getByTestId('duration'));
		expect(ref.current).toHaveAttribute('role', 'group');
	});
});

describe('Slider.Range in a Field', () => {
	it('stays named and described by Base UI, with no group default', async () => {
		await renderRange(
			<Field label="Duration" description="How long a request ran.">
				<Slider.Range color="primary" testId="duration" />
			</Field>,
		);

		const label = document.querySelector('label');

		expect(screen.getByTestId('duration')).toHaveAttribute('aria-labelledby', label?.id);
		expect(screen.getByTestId('duration')).toHaveAccessibleName('Duration');
		expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAccessibleDescription(
			'How long a request ran.',
		);
	});
});

describe('SliderField.Range against a hand-written Field.Group', () => {
	it('renders the same DOM', async () => {
		const shorthand = await renderToHtml(
			<SliderField.Range
				label="Duration"
				color="primary"
				description="How long a request ran."
				required
				defaultValue={[20, 80]}
			/>,
			'Maximum',
		);
		const handWritten = await renderToHtml(
			<Field.Group label="Duration" description="How long a request ran." required>
				<Slider.Range color="primary" defaultValue={[20, 80]} />
			</Field.Group>,
			'Maximum',
		);

		expect(handWritten).toBe(shorthand);
	});
});
