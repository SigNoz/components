/**
 * Type-level tests for the props of {@link Steps}, and `Steps.List`.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it
 * either compiles, or it is marked `@ts-expect-error` because we refuse that combination.
 * TypeScript reports an unused `@ts-expect-error` as an error of its own, so loosening a
 * constraint by accident fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it, so it sits inside the `assertType(...)` call,
 * right above its argument, with every prop on that line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Steps } from '../steps.js';

const ref = createRef<HTMLOListElement>();
const divRef = createRef<HTMLDivElement>();
const noop = (): void => {};
const items = [{ label: 'Select data source' }, { label: 'Configure' }];
const listItems = [{ label: 'Service', children: 'content' }];

describe('Steps props', () => {
	test('accepts items and current alone', () => {
		assertType(<Steps current={1} items={items} />);
	});

	test('accepts every prop', () => {
		assertType(
			<Steps
				ref={ref}
				id="setup"
				testId="setup-steps"
				current={2}
				items={[
					{ label: 'Select data source', description: 'Kubernetes' },
					{ label: 'Configure', description: 'my-cluster' },
					{ label: 'Send data' },
				]}
				aria-label="Setup progress"
				aria-describedby="hint"
				data-foo="bar"
			/>,
		);
	});

	test('accepts a label and a description that are empty', () => {
		assertType(<Steps current={1} items={[{ label: '', description: '' }]} />);
	});

	test('accepts an empty items', () => {
		assertType(<Steps current={1} items={[]} />);
	});

	test('accepts items that are readonly, such as a constant of the flow', () => {
		const flow = [
			{ label: 'Select data source' },
			{ label: 'Configure', description: 'x' },
		] as const;

		assertType(<Steps current={1} items={flow} />);
	});

	test('accepts any number as current, since the component falls back at runtime', () => {
		assertType(<Steps current={0} items={items} />);
		assertType(<Steps current={2.5} items={items} />);
		assertType(<Steps current={99} items={items} />);
	});

	test('accepts a callback ref', () => {
		assertType(<Steps current={1} items={items} ref={(element) => void element?.tagName} />);
	});

	test('accepts the aria and data props, and nothing else of the DOM', () => {
		assertType(<Steps current={1} items={items} aria-labelledby="title" aria-hidden />);
		assertType(<Steps current={1} items={items} data-analytics="setup" data-state={1} />);
	});

	test('requires current', () => {
		assertType(
			// @ts-expect-error - a progress row with no current step is `Steps.List`
			<Steps items={items} />,
		);
	});

	test('requires items', () => {
		assertType(
			// @ts-expect-error - the steps come from `items`
			<Steps current={1} />,
		);
	});

	test('rejects a current that is not a number', () => {
		assertType(
			// @ts-expect-error - `current` is the step number, not its label
			<Steps current="2" items={items} />,
		);
		assertType(
			// @ts-expect-error - `current` is required, `undefined` is not a step
			<Steps current={undefined} items={items} />,
		);
	});

	test('rejects className and style, the look comes from the tokens', () => {
		assertType(
			// @ts-expect-error - `className` is not a prop
			<Steps current={1} items={items} className="x" />,
		);
		assertType(
			// @ts-expect-error - `style` is not a prop
			<Steps current={1} items={items} style={{}} />,
		);
	});

	test('rejects className and style that come in a spread', () => {
		const withClassName = { current: 1, items, className: 'x' };
		const withStyle = { current: 1, items, style: {} };

		assertType(
			// @ts-expect-error - a spread does not get past the props
			<Steps {...withClassName} />,
		);
		assertType(
			// @ts-expect-error - a spread does not get past the props
			<Steps {...withStyle} />,
		);
	});

	test('rejects a step with extra keys that comes in a variable', () => {
		const steps = [{ label: 'One' }, { label: 'Two', className: 'x' }];

		assertType(
			// @ts-expect-error - a step takes only `label` and `description`
			<Steps current={1} items={steps} />,
		);
	});

	test('rejects data-testid, the prop is testId', () => {
		assertType(
			// @ts-expect-error - `data-testid` is written `testId`
			<Steps current={1} items={items} data-testid="steps" />,
		);
	});

	test('rejects className and style on a step', () => {
		assertType(
			// @ts-expect-error - a step takes no `className`
			<Steps current={1} items={[{ label: 'One', className: 'x' }]} />,
		);
		assertType(
			// @ts-expect-error - a step takes no `style`
			<Steps current={1} items={[{ label: 'One', style: {} }]} />,
		);
	});

	test('rejects children, the steps come from items', () => {
		assertType(
			// @ts-expect-error - `Steps.Step` children are replaced by `items`
			<Steps current={1} items={items}>
				<li>One</li>
			</Steps>,
		);
	});

	test('rejects the props of a flow the user can click through', () => {
		assertType(
			// @ts-expect-error - the steps cannot be clicked
			<Steps current={1} items={items} onChange={noop} />,
		);
		assertType(
			// @ts-expect-error - `current` is controlled by the page
			<Steps current={1} items={items} defaultCurrent={1} />,
		);
	});

	test('rejects the props that set the state of a step', () => {
		assertType(
			// @ts-expect-error - the state comes from `current`, there is no error state
			<Steps current={1} items={items} status="error" />,
		);
		assertType(
			// @ts-expect-error - the state of a step is its position against `current`
			<Steps current={1} items={[{ label: 'One', status: 'finish' }]} />,
		);
	});

	test('rejects the props that change the look of the row', () => {
		assertType(
			// @ts-expect-error - `Steps` is a row, the vertical list is `Steps.List`
			<Steps current={1} items={items} direction="vertical" />,
		);
		assertType(
			// @ts-expect-error - the steps do not turn into a column
			<Steps current={1} items={items} responsive />,
		);
		assertType(
			// @ts-expect-error - the steps have one size
			<Steps current={1} items={items} size="small" />,
		);
		assertType(
			// @ts-expect-error - no use-case today
			<Steps current={1} items={items} progressDot />,
		);
		assertType(
			// @ts-expect-error - no use-case today
			<Steps current={1} items={items} type="navigation" />,
		);
		assertType(
			// @ts-expect-error - no use-case today
			<Steps current={1} items={items} labelPlacement="vertical" />,
		);
		assertType(
			// @ts-expect-error - no use-case today
			<Steps current={1} items={items} percent={50} />,
		);
		assertType(
			// @ts-expect-error - `current` counts from 1, there is no second way to number
			<Steps current={1} items={items} initial={1} />,
		);
	});

	test('rejects the item props that antd had and no call site uses', () => {
		assertType(
			// @ts-expect-error - `title` is `label`
			<Steps current={1} items={[{ title: 'One' }]} />,
		);
		assertType(
			// @ts-expect-error - the marker shows the number or the done mark
			<Steps current={1} items={[{ label: 'One', icon: <svg /> }]} />,
		);
		assertType(
			// @ts-expect-error - no use-case today
			<Steps current={1} items={[{ label: 'One', subTitle: 'x' }]} />,
		);
		assertType(
			// @ts-expect-error - the steps cannot be clicked
			<Steps current={1} items={[{ label: 'One', disabled: true }]} />,
		);
		assertType(
			// @ts-expect-error - the steps cannot be clicked
			<Steps current={1} items={[{ label: 'One', onClick: noop }]} />,
		);
	});

	test('requires a label on every step', () => {
		assertType(
			// @ts-expect-error - a step with no label shows `<No label>`, so it is not left out
			<Steps current={1} items={[{ description: 'x' }]} />,
		);
	});

	test('rejects a label and a description that are not strings', () => {
		assertType(
			// @ts-expect-error - the label is a string, it is cut and shown in a tooltip
			<Steps current={1} items={[{ label: <b>One</b> }]} />,
		);
		assertType(
			// @ts-expect-error - the label is a string, not a number
			<Steps current={1} items={[{ label: 1 }]} />,
		);
		assertType(
			// @ts-expect-error - the description is a string, it is cut and shown in a tooltip
			<Steps current={1} items={[{ label: 'One', description: <b>x</b> }]} />,
		);
		assertType(
			// @ts-expect-error - the description is a string, not a number
			<Steps current={1} items={[{ label: 'One', description: 1 }]} />,
		);
	});

	test('rejects items that are not an array of steps', () => {
		assertType(
			// @ts-expect-error - a step is an object with a label
			<Steps current={1} items={['One', 'Two']} />,
		);
		assertType(
			// @ts-expect-error - `items` is an array
			<Steps current={1} items="One" />,
		);
	});

	test('rejects any other HTML attribute', () => {
		assertType(
			// @ts-expect-error - the steps cannot be clicked
			<Steps current={1} items={items} onClick={noop} />,
		);
		assertType(
			// @ts-expect-error - `title` is not a prop
			<Steps current={1} items={items} title="x" />,
		);
		assertType(
			// @ts-expect-error - `role` is set by the component
			<Steps current={1} items={items} role="tablist" />,
		);
		assertType(
			// @ts-expect-error - the steps are not focusable
			<Steps current={1} items={items} tabIndex={0} />,
		);
		assertType(
			// @ts-expect-error - `hidden` is not a prop
			<Steps current={1} items={items} hidden />,
		);
	});

	test('rejects a ref to anything but an ol', () => {
		assertType(
			// @ts-expect-error - the ref is the ol
			<Steps current={1} items={items} ref={createRef<HTMLDivElement>()} />,
		);
	});
});

describe('Steps.List props', () => {
	test('accepts items alone', () => {
		assertType(<Steps.List items={listItems} />);
	});

	test('accepts every prop', () => {
		assertType(
			<Steps.List
				ref={divRef}
				id="funnel"
				testId="funnel-steps"
				items={[
					{ label: 'Service', children: <form>content</form> },
					{ children: 'no label' },
					{ label: 'Latency', children: null },
				]}
				aria-label="Funnel steps"
				aria-describedby="hint"
				data-foo="bar"
			/>,
		);
	});

	test('accepts any content as the children of a step', () => {
		assertType(<Steps.List items={[{ children: 'text' }]} />);
		assertType(<Steps.List items={[{ children: 1 }]} />);
		assertType(<Steps.List items={[{ children: <div /> }]} />);
		assertType(<Steps.List items={[{ children: [<div key="a" />, <p key="b" />] }]} />);
		assertType(<Steps.List items={[{ children: null }]} />);
		assertType(<Steps.List items={[{ children: false }]} />);
		assertType(<Steps.List items={[{ children: undefined }]} />);
	});

	test('accepts a step with no label', () => {
		assertType(<Steps.List items={[{ children: 'content' }]} />);
	});

	test('accepts an empty items', () => {
		assertType(<Steps.List items={[]} />);
	});

	test('accepts items that are readonly', () => {
		const funnel = [{ label: 'Service', children: 'content' }, { children: null }] as const;

		assertType(<Steps.List items={funnel} />);
	});

	test('accepts any node as the footer', () => {
		assertType(<Steps.List items={listItems} footer={<button type="button">Add step</button>} />);
		assertType(<Steps.List items={listItems} footer="Add a step from the trace" />);
		assertType(<Steps.List items={listItems} footer={false} />);
		assertType(<Steps.List items={listItems} footer={null} />);
	});

	test('accepts a callback ref', () => {
		assertType(<Steps.List items={listItems} ref={(element) => void element?.tagName} />);
	});

	test('requires items', () => {
		assertType(
			// @ts-expect-error - the steps come from `items`
			<Steps.List />,
		);
	});

	test('requires children on every step', () => {
		assertType(
			// @ts-expect-error - a step with no `children` has nothing to hold, pass `null`
			<Steps.List items={[{ label: 'Service' }]} />,
		);
	});

	test('rejects current, the list has no progress', () => {
		assertType(
			// @ts-expect-error - `current` belongs to `Steps`, the list has no current step
			<Steps.List items={listItems} current={1} />,
		);
	});

	test('rejects className and style, the look comes from the tokens', () => {
		assertType(
			// @ts-expect-error - `className` is not a prop
			<Steps.List items={listItems} className="x" />,
		);
		assertType(
			// @ts-expect-error - `style` is not a prop
			<Steps.List items={listItems} style={{}} />,
		);
	});

	test('rejects className and style that come in a spread', () => {
		const withClassName = { items: listItems, className: 'x' };
		const withStyle = { items: listItems, style: {} };

		assertType(
			// @ts-expect-error - a spread does not get past the props
			<Steps.List {...withClassName} />,
		);
		assertType(
			// @ts-expect-error - a spread does not get past the props
			<Steps.List {...withStyle} />,
		);
	});

	test('rejects a step with extra keys that comes in a variable', () => {
		const steps = [{ children: 'a' }, { children: 'b', className: 'x' }];

		assertType(
			// @ts-expect-error - a step takes only `label` and `children`
			<Steps.List items={steps} />,
		);
	});

	test('rejects data-testid, the prop is testId', () => {
		assertType(
			// @ts-expect-error - `data-testid` is written `testId`
			<Steps.List items={listItems} data-testid="list" />,
		);
	});

	test('rejects className and style on a step', () => {
		assertType(
			// @ts-expect-error - a step takes no `className`
			<Steps.List items={[{ children: 'a', className: 'x' }]} />,
		);
		assertType(
			// @ts-expect-error - a step takes no `style`
			<Steps.List items={[{ children: 'a', style: {} }]} />,
		);
	});

	test('rejects the props of Steps', () => {
		assertType(
			// @ts-expect-error - the list has no state, so `status` goes nowhere
			<Steps.List items={listItems} status="error" />,
		);
		assertType(
			// @ts-expect-error - the list has no clicks
			<Steps.List items={listItems} onChange={noop} />,
		);
		assertType(
			// @ts-expect-error - `defaultCurrent` belongs to a flow with a current step
			<Steps.List items={listItems} defaultCurrent={1} />,
		);
		assertType(
			// @ts-expect-error - `Steps.List` is a column already
			<Steps.List items={listItems} direction="vertical" />,
		);
		assertType(
			// @ts-expect-error - the steps have one size
			<Steps.List items={listItems} size="small" />,
		);
	});

	test('rejects description, the content goes in children', () => {
		assertType(
			// @ts-expect-error - the antd `description` held the content, use `children`
			<Steps.List items={[{ label: 'Service', description: 'x', children: 'a' }]} />,
		);
	});

	test('rejects the item props that antd had', () => {
		assertType(
			// @ts-expect-error - `title` is `label`
			<Steps.List items={[{ title: 'Service', children: 'a' }]} />,
		);
		assertType(
			// @ts-expect-error - the marker shows the number
			<Steps.List items={[{ icon: <svg />, children: 'a' }]} />,
		);
		assertType(
			// @ts-expect-error - the list has no state to set
			<Steps.List items={[{ status: 'wait', children: 'a' }]} />,
		);
		assertType(
			// @ts-expect-error - the steps cannot be clicked
			<Steps.List items={[{ onClick: noop, children: 'a' }]} />,
		);
	});

	test('rejects a label that is not a string', () => {
		assertType(
			// @ts-expect-error - the label is a string, any element goes in `children`
			<Steps.List items={[{ label: <b>Service</b>, children: 'a' }]} />,
		);
		assertType(
			// @ts-expect-error - the label is a string, not a number
			<Steps.List items={[{ label: 1, children: 'a' }]} />,
		);
	});

	test('rejects the children of the list itself', () => {
		assertType(
			// @ts-expect-error - the steps come from `items`
			<Steps.List items={listItems}>
				<li>One</li>
			</Steps.List>,
		);
	});

	test('rejects any other HTML attribute', () => {
		assertType(
			// @ts-expect-error - the list has no clicks
			<Steps.List items={listItems} onClick={noop} />,
		);
		assertType(
			// @ts-expect-error - `title` is not a prop
			<Steps.List items={listItems} title="x" />,
		);
		assertType(
			// @ts-expect-error - `role` is set by the component
			<Steps.List items={listItems} role="tablist" />,
		);
	});

	test('rejects a ref to anything but a div', () => {
		assertType(
			// @ts-expect-error - the ref is the root div, not the ol
			<Steps.List items={listItems} ref={createRef<HTMLOListElement>()} />,
		);
	});
});
