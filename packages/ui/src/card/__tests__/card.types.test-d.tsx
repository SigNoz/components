/**
 * Type-level tests for the props of {@link Card}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Each `@ts-expect-error` suppresses the line directly below it, which is why it sits inside
 * `assertType(...)` right above the opening `<Card` tag. Keep every prop on that opening tag line.
 */
import { createRef } from 'react';
import { assertType, describe, test } from 'vitest';
import { Card } from '../card.js';
import type { CardHeaderSuffixField } from '../types.js';

const cardRef = createRef<HTMLDivElement>();
declare const isLoading: boolean;

// Props held in a variable and spread skip the excess property check a literal attribute gets, so
// these catch a rejected prop that reaches the card through a spread.
const declaredSpread = { title: 'Title', description: 'Description', padding: 0 } as const;
const classNameSpread = { title: 'Title', className: 'placed' } as const;
const styleSpread = { title: 'Title', style: { width: 100 } } as const;

describe('every prop is optional', () => {
	test('accepts a card with no props', () => {
		assertType(<Card />);
	});

	test('accepts every prop it declares, aria and data attributes', () => {
		assertType(
			<Card
				id="card"
				testId="card"
				title="Title"
				titlePrefix={<svg />}
				titleSuffix="Beta"
				description="Description"
				textOverflow="wrap"
				headerSuffix={<button type="button">Go</button>}
				headerDivider
				footerPrefix="Hint"
				footerSuffix="Save"
				loading={<div />}
				width={240}
				maxWidth="50%"
				height="100%"
				minHeight={120}
				padding={8}
				paddingX={0}
				paddingY={4}
				paddingTop={2}
				paddingRight={2}
				paddingBottom={2}
				paddingLeft={2}
				gap={6}
				margin="auto"
				marginX={4}
				marginY={4}
				marginTop={4}
				marginRight="auto"
				marginBottom={0}
				marginLeft="auto"
				aria-label="Card"
				data-row="top"
				ref={cardRef}
			>
				Body
			</Card>,
		);
	});
});

describe('title', () => {
	test('rejects a node, the title is text', () => {
		// @ts-expect-error - the title names the `headerSuffix` control, so it is a string
		assertType(<Card title={<span>Retention</span>} />);
	});

	test('rejects text in titlePrefix', () => {
		// @ts-expect-error - `titlePrefix` takes an element, such as an icon
		assertType(<Card title="Retention" titlePrefix="x" />);
	});
});

describe('textOverflow', () => {
	test('accepts wrap and ellipsis', () => {
		assertType(<Card textOverflow="wrap" />);
		assertType(<Card textOverflow="ellipsis" />);
	});

	test('rejects a value outside the two', () => {
		// @ts-expect-error - `clip` and `visible` are not choices of a card title
		assertType(<Card textOverflow="clip" />);
	});
});

describe('headerSuffix', () => {
	test('accepts a node', () => {
		assertType(<Card headerSuffix="Action" />);
		assertType(<Card headerSuffix={<button type="button">Go</button>} />);
	});

	test('accepts a function of the field', () => {
		assertType(
			<Card
				headerSuffix={(field: CardHeaderSuffixField) => (
					<input id={field.id} aria-labelledby={field['aria-labelledby']} />
				)}
			/>,
		);
	});

	test('spreads the field on a control', () => {
		assertType(<Card headerSuffix={(field) => <input {...field} />} />);
	});

	test('types the field with the three ids', () => {
		assertType(
			<Card
				headerSuffix={(field) => {
					assertType<string>(field.id);
					assertType<string>(field['aria-labelledby']);
					assertType<string | undefined>(field['aria-describedby']);
					return null;
				}}
			/>,
		);
	});
});

describe('spacing', () => {
	test('accepts every step of the scale on padding and margin', () => {
		for (const step of [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64,
		] as const) {
			assertType(<Card padding={step} margin={step} gap={step} />);
		}
	});

	test('rejects a number between two steps on padding', () => {
		// @ts-expect-error - `9` is not a step of the spacing scale
		assertType(<Card padding={9} />);
	});

	test('rejects a length on padding', () => {
		// @ts-expect-error - a length such as "8px" is not a step of the spacing scale
		assertType(<Card padding="8px" />);
	});

	test('rejects auto on padding', () => {
		// @ts-expect-error - only the margin props take `auto`
		assertType(<Card paddingX="auto" />);
	});

	test('rejects a length on margin', () => {
		// @ts-expect-error - a length such as "8px" is not a step of the spacing scale
		assertType(<Card margin="8px" />);
	});

	test('rejects a number between two steps on gap', () => {
		// @ts-expect-error - `9` is not a step of the spacing scale
		assertType(<Card gap={9} />);
	});

	test('rejects auto on gap', () => {
		// @ts-expect-error - only the margin props take `auto`
		assertType(<Card gap="auto" />);
	});
});

describe('rejected props', () => {
	test('rejects className', () => {
		// @ts-expect-error - `Card` takes no `className`
		assertType(<Card className="placed" />);
	});

	test('rejects style', () => {
		// @ts-expect-error - `Card` takes no `style`
		assertType(<Card style={{ width: 100 }} />);
	});

	test('accepts a spread of the props it declares', () => {
		assertType(<Card {...declaredSpread} />);
	});

	test('rejects a className spread', () => {
		// @ts-expect-error - a spread is checked like written props, `className` is not one
		assertType(<Card {...classNameSpread} />);
	});

	test('rejects a style spread', () => {
		// @ts-expect-error - a spread is checked like written props, `style` is not one
		assertType(<Card {...styleSpread} />);
	});

	test('rejects extra, renamed to headerSuffix', () => {
		// @ts-expect-error - `extra` is `headerSuffix`
		assertType(<Card extra={<button type="button">Go</button>} />);
	});

	test('rejects actions, renamed to footerSuffix', () => {
		// @ts-expect-error - `actions` is `footerSuffix`
		assertType(<Card actions={[]} />);
	});

	test('rejects size, replaced by the padding props', () => {
		// @ts-expect-error - `size="small"` is `padding={6}`
		assertType(<Card size="small" />);
	});

	test('rejects bordered, the card always has its border', () => {
		// @ts-expect-error - the border is never removed
		assertType(<Card bordered={false} />);
	});

	test('rejects variant, the card has one surface', () => {
		// @ts-expect-error - the card has one surface
		assertType(<Card variant="outlined" />);
	});

	test('rejects hoverable, the card is not interactive', () => {
		// @ts-expect-error - the card has no hover
		assertType(<Card hoverable />);
	});

	test('rejects onClick, the card is not interactive', () => {
		// @ts-expect-error - put the action in a `Button` or a link inside the card
		assertType(<Card onClick={() => {}} />);
	});

	test('rejects cover, an image goes in the body', () => {
		// @ts-expect-error - put the image in the body with `padding={0}`
		assertType(<Card cover={<img alt="" />} />);
	});

	test('rejects tabList, a Tab goes in the header suffix', () => {
		// @ts-expect-error - put a `Tab` in `headerSuffix` or in the body
		assertType(<Card tabList={[]} />);
	});

	test('rejects activeTabKey, a Tab goes in the header suffix', () => {
		// @ts-expect-error - put a `Tab` in `headerSuffix` or in the body
		assertType(<Card activeTabKey="a" />);
	});

	test('rejects defaultActiveTabKey, a Tab goes in the header suffix', () => {
		// @ts-expect-error - put a `Tab` in `headerSuffix` or in the body
		assertType(<Card defaultActiveTabKey="a" />);
	});

	test('rejects onTabChange, a Tab goes in the header suffix', () => {
		// @ts-expect-error - put a `Tab` in `headerSuffix` or in the body
		assertType(<Card onTabChange={() => {}} />);
	});

	test('rejects tabBarExtraContent, a Tab goes in the header suffix', () => {
		// @ts-expect-error - put a `Tab` in `headerSuffix` or in the body
		assertType(<Card tabBarExtraContent="a" />);
	});

	test('rejects tabProps, a Tab goes in the header suffix', () => {
		// @ts-expect-error - put a `Tab` in `headerSuffix` or in the body
		assertType(<Card tabProps={{}} />);
	});

	test('rejects type, a card in a card is not allowed', () => {
		// @ts-expect-error - `type="inner"` nests a card in a card
		assertType(<Card type="inner" />);
	});

	test('rejects bodyStyle, the padding comes from the padding props', () => {
		// @ts-expect-error - use the padding props
		assertType(<Card bodyStyle={{ padding: 0 }} />);
	});

	test('rejects headStyle, the header takes no styling', () => {
		// @ts-expect-error - the header takes no styling
		assertType(<Card headStyle={{ padding: 0 }} />);
	});

	test('rejects styles, the parts take no styling', () => {
		// @ts-expect-error - the parts take no styling
		assertType(<Card styles={{ body: { padding: 0 } }} />);
	});

	test('rejects classNames, the parts take no class', () => {
		// @ts-expect-error - the parts take no class
		assertType(<Card classNames={{ body: 'body' }} />);
	});
});

describe('rejected parts', () => {
	test('has no Card.Header', () => {
		// @ts-expect-error - `Card.Header` is `title` and `headerSuffix`
		assertType(Card.Header);
	});

	test('has no Card.Content', () => {
		// @ts-expect-error - `Card.Content` is `children`
		assertType(Card.Content);
	});

	test('has no Card.Footer', () => {
		// @ts-expect-error - `Card.Footer` is `footerPrefix` and `footerSuffix`
		assertType(Card.Footer);
	});

	test('has no Card.Section', () => {
		// @ts-expect-error - the section is the body
		assertType(Card.Section);
	});

	test('has no Card.Divider', () => {
		// @ts-expect-error - a divider is a `Divider` in the body
		assertType(Card.Divider);
	});

	test('has no Card.Meta', () => {
		// @ts-expect-error - compose `Avatar` and text in the body
		assertType(Card.Meta);
	});

	test('has no Card.Grid', () => {
		// @ts-expect-error - lay out the blocks with CSS
		assertType(Card.Grid);
	});
});

describe('loading', () => {
	test('accepts a boolean, the parts and a node', () => {
		assertType(<Card loading />);
		assertType(<Card loading={false} />);
		assertType(<Card loading={{ header: true, footer: true }} />);
		assertType(<Card loading={{ footer: true }} />);
		assertType(<Card loading={isLoading && { header: true }} />);
		assertType(<Card loading={<div />} />);
		assertType(<Card loading={null} />);
	});

	test('rejects a part set to false', () => {
		// @ts-expect-error - leave the part out, or pass `false` to `loading` when the data is in
		assertType(<Card loading={{ header: true, footer: false }} />);
	});

	test('rejects a part built from the request state', () => {
		// @ts-expect-error - any object loads the card, so gate the object: `isLoading && { header: true }`
		assertType(<Card loading={{ header: isLoading }} />);
	});

	test('rejects an object with no part', () => {
		// @ts-expect-error - an empty object loads only the body, which is `loading={true}`
		assertType(<Card loading={{}} />);
	});

	test('rejects a part the card does not have', () => {
		// @ts-expect-error - the body always loads, only the header and the footer are parts
		assertType(<Card loading={{ body: true }} />);
	});

	test('rejects loadingContent, which loading replaced', () => {
		// @ts-expect-error - pass the node to `loading`
		assertType(<Card loading loadingContent={<div />} />);
	});
});
