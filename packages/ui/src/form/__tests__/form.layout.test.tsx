import { render, screen } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../button/index.js';
import { InputField } from '../../input/presets/input-field.js';
import { Form } from '../form.js';

const noop = (): void => {};
const LONG_LABEL =
	'The name of the organisation as it appears on every invoice, including the legal form';

describe('Form layout', () => {
	it('stacks the children in a column for the vertical layout', () => {
		render(
			<div style={{ inlineSize: 640 }}>
				<Form onSubmit={noop} testId="form">
					<InputField label="First" testId="first" />
					<InputField label="Second" testId="second" />
				</Form>
			</div>,
		);

		const form = screen.getByTestId('form');
		const first = screen.getByTestId('first-label').closest('[data-slot="field"]') as HTMLElement;
		const second = screen.getByTestId('second-label').closest('[data-slot="field"]') as HTMLElement;

		expect(getComputedStyle(form).display).toBe('flex');
		expect(getComputedStyle(form).flexDirection).toBe('column');
		expect(second.getBoundingClientRect().top).toBeGreaterThanOrEqual(
			first.getBoundingClientRect().bottom,
		);
	});

	it('puts the children in one row for the inline layout', () => {
		render(
			<div style={{ inlineSize: 640 }}>
				<Form onSubmit={noop} layout="inline" testId="form">
					<InputField label="First" testId="first" width={120} />
					<InputField label="Second" testId="second" width={120} />
				</Form>
			</div>,
		);

		const form = screen.getByTestId('form');
		const first = screen.getByTestId('first-label').closest('[data-slot="field"]') as HTMLElement;
		const second = screen.getByTestId('second-label').closest('[data-slot="field"]') as HTMLElement;

		expect(getComputedStyle(form).flexDirection).toBe('row');
		expect(getComputedStyle(form).flexWrap).toBe('wrap');
		expect(second.getBoundingClientRect().left).toBeGreaterThanOrEqual(
			first.getBoundingClientRect().right,
		);
		expect(second.getBoundingClientRect().top).toBeLessThan(first.getBoundingClientRect().bottom);
	});

	it('wraps the inline layout to a new row when the width runs out', () => {
		render(
			<div style={{ inlineSize: 200 }}>
				<Form onSubmit={noop} layout="inline" testId="form">
					<InputField label="First" testId="first" width={120} />
					<InputField label="Second" testId="second" width={120} />
				</Form>
			</div>,
		);

		const first = screen.getByTestId('first-label').closest('[data-slot="field"]') as HTMLElement;
		const second = screen.getByTestId('second-label').closest('[data-slot="field"]') as HTMLElement;

		expect(second.getBoundingClientRect().top).toBeGreaterThanOrEqual(
			first.getBoundingClientRect().bottom,
		);
	});

	it('lines the inline fields up on their controls when a label wraps', () => {
		render(
			<div style={{ inlineSize: 960 }}>
				<Form onSubmit={noop} layout="inline" testId="form">
					<InputField label={LONG_LABEL} testId="long" width={160} />
					<InputField label="Short" testId="short" width={160} />
				</Form>
			</div>,
		);

		const long = screen.getByTestId('long');
		const short = screen.getByTestId('short');
		const longLabel = screen.getByTestId('long-label');
		const shortLabel = screen.getByTestId('short-label');

		expect(longLabel.getBoundingClientRect().height).toBeGreaterThan(
			shortLabel.getBoundingClientRect().height,
		);
		expect(long.getBoundingClientRect().bottom).toBe(short.getBoundingClientRect().bottom);
	});

	it('keeps the inline controls and buttons in line while one field shows a message', () => {
		render(
			<div style={{ inlineSize: 960 }}>
				<Form onSubmit={noop} layout="inline" testId="form">
					<InputField label="Service" testId="service" width={160} />
					<InputField label="Min duration" testId="duration" width={160} error="Too long." />
					<Button type="submit" testId="apply">
						Apply
					</Button>
				</Form>
			</div>,
		);

		const bottom = screen.getByTestId('service').getBoundingClientRect().bottom;

		expect(screen.getByTestId('duration').getBoundingClientRect().bottom).toBe(bottom);
		expect(screen.getByTestId('apply').getBoundingClientRect().bottom).toBe(bottom);
	});

	it('keeps the inline controls in line while one field shows a description', () => {
		render(
			<div style={{ inlineSize: 960 }}>
				<Form onSubmit={noop} layout="inline" testId="form">
					<InputField label="Service" testId="service" width={160} description="Supports *." />
					<InputField label="Environment" testId="environment" width={160} />
				</Form>
			</div>,
		);

		expect(screen.getByTestId('environment').getBoundingClientRect().bottom).toBe(
			screen.getByTestId('service').getBoundingClientRect().bottom,
		);
	});

	it('makes room under the inline row for one line of message', () => {
		// The room is built from these two tokens, which the unit tests do not load.
		const tokens = {
			inlineSize: 960,
			'--spacing-4': '8px',
			'--paragraph-small-400-line-height': '18px',
		} as CSSProperties;
		render(
			<div style={tokens}>
				<Form onSubmit={noop} layout="inline" testId="form">
					<InputField label="Min duration" testId="duration" width={160} error="Too long." />
				</Form>
			</div>,
		);

		const message = screen.getByTestId('duration-message');

		expect(Math.round(message.getBoundingClientRect().bottom)).toBeLessThanOrEqual(
			Math.round(screen.getByTestId('form').getBoundingClientRect().bottom),
		);
	});

	it('adds no padding of its own', () => {
		render(
			<Form onSubmit={noop} testId="form">
				<InputField label="First" />
			</Form>,
		);

		const style = getComputedStyle(screen.getByTestId('form'));

		expect(style.paddingTop).toBe('0px');
		expect(style.paddingLeft).toBe('0px');
		expect(style.marginTop).toBe('0px');
	});
});
