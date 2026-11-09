/**
 * Type-level tests for the props of {@link Breadcrumb}.
 *
 * Run by `vitest --typecheck` (see `typecheck` in `vitest.config.ts`) and, because the file lives
 * under `src` and is not excluded by `tsconfig.json`, also by `pnpm type-check`.
 *
 * Nothing here executes. Each case is a JSX element written the way a consumer writes it: it
 * either compiles, or it is marked `@ts-expect-error` because we refuse that combination.
 * TypeScript reports an unused `@ts-expect-error` as an error of its own, so loosening a
 * constraint by accident fails the build instead of passing silently.
 *
 * The comment suppresses the line directly below it, so it sits *inside* the `assertType(...)`
 * call, right above its argument. Keep every prop on the opening tag line.
 */
import { createRef, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { assertType, describe, expectTypeOf, test } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import type {
	BreadcrumbCollapsedCrumb,
	BreadcrumbCollapseFromType,
	BreadcrumbDropdownItem,
	BreadcrumbEllipsisOptions,
	BreadcrumbItemType,
	BreadcrumbLinkProps,
	BreadcrumbProps,
	BreadcrumbTextOverflowType,
	BreadcrumbVariantType,
	ValidateBreadcrumbProps,
} from '../index.js';
import { BreadcrumbCollapseFrom, BreadcrumbTextOverflow, BreadcrumbVariant } from '../index.js';
import { RouterLink } from './breadcrumb.test-utils.js';

const noop = (): void => {};

const ITEMS: BreadcrumbItemType[] = [
	{ title: 'Dashboards', href: '/dashboards' },
	{ title: 'Payments' },
];

const navRef = createRef<HTMLElement>();

describe('root props', () => {
	test('accepts the items alone, and a ref to the nav', () => {
		assertType(<Breadcrumb items={ITEMS} />);
		assertType(<Breadcrumb items={ITEMS} ref={navRef} />);
		assertType(<Breadcrumb items={ITEMS} ref={() => {}} />);
	});

	test('accepts every prop it documents', () => {
		assertType(
			<Breadcrumb
				items={ITEMS}
				separator=">"
				truncate={false}
				maxVisible={3}
				collapseFrom="start"
				textOverflow="hidden"
				variant="outlined"
				ellipsis={{ heading: 'Earlier steps' }}
				testId="trail"
				id="trail"
				aria-label="You are here"
				aria-describedby="hint"
				data-track="crumbs"
			/>,
		);
	});

	test('accepts any data attribute and any aria attribute', () => {
		assertType(<Breadcrumb items={ITEMS} data-foo="bar" data-count={3} aria-hidden />);
	});

	test('requires its items', () => {
		// @ts-expect-error - a trail with nothing to show is not allowed
		assertType(<Breadcrumb />);
	});

	test('rejects className and style, the look comes from the props and tokens', () => {
		assertType(
			// @ts-expect-error - `className` is not a prop
			<Breadcrumb items={ITEMS} className="x" />,
		);
		assertType(
			// @ts-expect-error - `style` is not a prop
			<Breadcrumb items={ITEMS} style={{}} />,
		);
	});

	test('rejects children, the crumbs come from `items`', () => {
		assertType(
			// @ts-expect-error - crumbs come from `items`
			<Breadcrumb items={ITEMS} children={<span />} />, // eslint-disable-line react/no-children-prop -- passing `children` is the case under test
		);
		assertType(
			// @ts-expect-error - the composition parts are gone, a crumb is an entry of `items`
			<Breadcrumb items={ITEMS}>
				<span />
			</Breadcrumb>,
		);
	});

	test('rejects a raw data-testid', () => {
		assertType(
			// @ts-expect-error - `data-testid` is written as the `testId` prop, which also names every crumb
			<Breadcrumb items={ITEMS} data-testid="trail" />,
		);
	});

	test('rejects a prop the trail does not forward', () => {
		assertType(
			// @ts-expect-error - an unknown prop does not reach the nav
			<Breadcrumb items={ITEMS} unknown="x" />,
		);
		assertType(
			// @ts-expect-error - the crumbs take their handlers, the nav takes none
			<Breadcrumb items={ITEMS} onClick={noop} />,
		);
		assertType(
			// @ts-expect-error - the nav has no role to set, it is a navigation
			<Breadcrumb items={ITEMS} role="presentation" />,
		);
	});

	test('rejects a wrong textOverflow', () => {
		assertType(
			// @ts-expect-error - a label either ends with an ellipsis or is clipped
			<Breadcrumb items={ITEMS} textOverflow="visible" />,
		);
	});

	test('rejects a separator that is not text', () => {
		assertType(
			// @ts-expect-error - the separator is a string
			<Breadcrumb items={ITEMS} separator={<span />} />,
		);
	});

	test('accepts any separator text', () => {
		const separator: string = 'chevron';

		assertType(<Breadcrumb items={ITEMS} separator="›" />);
		assertType(<Breadcrumb items={ITEMS} separator="chevron-right" />);
		assertType(<Breadcrumb items={ITEMS} separator={separator} />);
		assertType(<Breadcrumb items={ITEMS} separator={undefined} />);
	});

	test('rejects the chevron separator, it would print the word', () => {
		assertType(
			// @ts-expect-error - `chevron` is not a keyword, the separator is the character itself
			<Breadcrumb items={ITEMS} separator="chevron" />,
		);
		assertType(
			// @ts-expect-error - a choice that can be `chevron` prints the word on that branch
			<Breadcrumb items={ITEMS} separator={Math.random() > 0.5 ? 'chevron' : '›'} />,
		);
	});

	test('rejects a maxVisible that is not a number', () => {
		assertType(
			// @ts-expect-error - `maxVisible` counts crumbs
			<Breadcrumb items={ITEMS} maxVisible="3" />,
		);
	});

	test('rejects a truncate that is not a boolean', () => {
		assertType(
			// @ts-expect-error - `truncate` switches the collapse on or off
			<Breadcrumb items={ITEMS} truncate="false" />,
		);
	});
});

describe('items', () => {
	test('accept a title of any node', () => {
		assertType<BreadcrumbItemType>({ title: 'Home' });
		assertType<BreadcrumbItemType>({ title: <strong>Home</strong> });
		assertType<BreadcrumbItemType>({ title: null });
		assertType<BreadcrumbItemType>({ title: 0 });
	});

	test('accept every field they document', () => {
		assertType<BreadcrumbItemType>({
			title: 'Services',
			href: '/services',
			target: '_blank',
			render: <RouterLink to="/services" />,
			icon: <svg />,
			onClick: noop,
			menu: [
				{
					title: 'Checkout',
					href: '/checkout',
					target: '_blank',
					render: <RouterLink to="/services" />,
					onClick: noop,
				},
				{ title: 'Rename', onClick: noop },
			],
		});
	});

	test('accept a router link as the render of a crumb and of a menu entry', () => {
		assertType<BreadcrumbItemType>({ title: 'Services', render: <RouterLink to="/services" /> });
		assertType<BreadcrumbItemType>({
			title: 'Services',
			menu: [{ title: 'Checkout', render: <RouterLink to="/checkout" /> }],
		});
	});

	test('give the onClick of a crumb the mouse event', () => {
		assertType<BreadcrumbItemType>({
			title: 'Home',
			onClick: (event) => {
				expectTypeOf(event.clientX).toBeNumber();
				expectTypeOf(event.preventDefault).toBeFunction();
			},
		});
	});

	test('require a title', () => {
		// @ts-expect-error - a crumb without a title has nothing to draw
		assertType<BreadcrumbItemType>({ href: '/home' });
	});

	test('reject a field they do not have', () => {
		// @ts-expect-error - the label of a crumb is its `title`
		assertType<BreadcrumbItemType>({ title: 'Home', label: 'Home' });
	});

	test('reject an href that is not text', () => {
		// @ts-expect-error - a crumb navigates to a string
		assertType<BreadcrumbItemType>({ title: 'Home', href: 3 });
	});

	test('reject a menu that is not a list of entries', () => {
		// @ts-expect-error - `menu` is a list
		assertType<BreadcrumbItemType>({ title: 'Home', menu: { title: 'Checkout' } });
	});

	test('reject a menu entry without a title', () => {
		// @ts-expect-error - an entry has to say what it is
		assertType<BreadcrumbDropdownItem>({ href: '/checkout' });
	});

	test('reject a menu entry with a field a crumb has', () => {
		// @ts-expect-error - an entry takes no icon
		assertType<BreadcrumbDropdownItem>({ title: 'Checkout', icon: <svg /> });
	});
});

describe('render', () => {
	test('is an element, on a crumb and on a menu entry', () => {
		expectTypeOf<BreadcrumbItemType['render']>().toEqualTypeOf<ReactElement | undefined>();
		expectTypeOf<BreadcrumbDropdownItem['render']>().toEqualTypeOf<ReactElement | undefined>();
	});

	test('rejects a function, the element is the crumb itself', () => {
		// @ts-expect-error - `render` is an element, not a function that draws one
		assertType<BreadcrumbItemType>({ title: 'Home', render: () => <RouterLink to="/services" /> });
	});

	test('rejects text, which is not an element', () => {
		// @ts-expect-error - `render` is an element, not text
		assertType<BreadcrumbItemType>({ title: 'Home', render: 'Home' });
	});

	test('rejects a target that is not text', () => {
		// @ts-expect-error - `target` is a string
		assertType<BreadcrumbItemType>({ title: 'Home', target: true });
	});
});

describe('itemRender and path', () => {
	test('rejects itemRender on the trail', () => {
		assertType(
			// @ts-expect-error - `itemRender` is not a prop, a crumb takes its own `render`
			<Breadcrumb items={ITEMS} itemRender={() => 'Home'} />,
		);
	});

	test('rejects params, which only fed itemRender', () => {
		assertType(
			// @ts-expect-error - `params` went with `itemRender`
			<Breadcrumb items={ITEMS} params={{ serviceId: 'checkout' }} />,
		);
	});

	test('rejects a path on a crumb', () => {
		// @ts-expect-error - a crumb has no path, a link is an `href` or a `render`
		assertType<BreadcrumbItemType>({ title: 'Services', path: 'services' });
	});

	test('rejects a path on a menu entry', () => {
		// @ts-expect-error - an entry has no path either
		assertType<BreadcrumbDropdownItem>({ title: 'Checkout', path: 'checkout' });
	});
});

describe('items written inline', () => {
	test('accept every field they document', () => {
		assertType(
			<Breadcrumb
				items={[
					{ title: 'Home', href: '/', icon: <svg />, onClick: noop },
					{ title: 'Services', render: <RouterLink to="/services" /> },
					{ title: 'checkout', menu: [{ title: 'Cart', href: '/cart', target: '_blank' }] },
					{ title: 'Overview' },
				]}
			/>,
		);
	});

	test('accept spread props and a key', () => {
		const props: BreadcrumbProps = { items: ITEMS, separator: '>' };

		assertType(<Breadcrumb {...props} key="trail" />);
	});

	test('reject a field a crumb does not have', () => {
		assertType(
			// @ts-expect-error - a crumb has no path, a link is an `href` or a `render`
			<Breadcrumb items={[{ title: 'Services', path: 'services' }]} />,
		);
		assertType(
			// @ts-expect-error - a crumb takes no className, the look comes from the tokens
			<Breadcrumb items={[{ title: 'Services', className: 'crumb' }]} />,
		);
		assertType(
			// @ts-expect-error - a misspelt `href` is not a link
			<Breadcrumb items={[{ title: 'Services', herf: '/services' }]} />,
		);
	});

	test('reject a field a menu entry does not have', () => {
		assertType(
			// @ts-expect-error - an entry takes no icon
			<Breadcrumb items={[{ title: 'Services', menu: [{ title: 'Checkout', icon: <svg /> }] }]} />,
		);
	});

	test('require a title', () => {
		assertType(
			// @ts-expect-error - a crumb without a title has nothing to draw
			<Breadcrumb items={[{ href: '/services' }]} />,
		);
	});
});

describe('textOverflow', () => {
	test('is one of the two the component draws', () => {
		expectTypeOf<BreadcrumbTextOverflowType>().toEqualTypeOf<'ellipsis' | 'hidden'>();
		expectTypeOf(BreadcrumbTextOverflow.Ellipsis).toEqualTypeOf<'ellipsis'>();
		expectTypeOf(BreadcrumbTextOverflow.Hidden).toEqualTypeOf<'hidden'>();
	});

	test('accepts the constant as well as the text', () => {
		assertType(<Breadcrumb items={ITEMS} textOverflow={BreadcrumbTextOverflow.Hidden} />);
		assertType(<Breadcrumb items={ITEMS} textOverflow="ellipsis" />);
	});
});

describe('collapseFrom', () => {
	test('is one of the two orders the component collapses in', () => {
		expectTypeOf<BreadcrumbCollapseFromType>().toEqualTypeOf<'center' | 'start'>();
		expectTypeOf(BreadcrumbCollapseFrom.Center).toEqualTypeOf<'center'>();
		expectTypeOf(BreadcrumbCollapseFrom.Start).toEqualTypeOf<'start'>();
	});

	test('accepts the constant as well as the text', () => {
		assertType(<Breadcrumb items={ITEMS} collapseFrom={BreadcrumbCollapseFrom.Start} />);
		assertType(<Breadcrumb items={ITEMS} collapseFrom="center" />);
	});

	test('rejects a wrong order', () => {
		assertType(
			// @ts-expect-error - `collapseFrom` is `center` or `start`
			<Breadcrumb items={ITEMS} collapseFrom="end" />,
		);
	});
});

describe('variant', () => {
	test('is one of the two the component draws', () => {
		expectTypeOf<BreadcrumbVariantType>().toEqualTypeOf<'plain' | 'outlined'>();
		expectTypeOf(BreadcrumbVariant.Plain).toEqualTypeOf<'plain'>();
		expectTypeOf(BreadcrumbVariant.Outlined).toEqualTypeOf<'outlined'>();
	});

	test('accepts the constant as well as the text', () => {
		assertType(<Breadcrumb items={ITEMS} variant={BreadcrumbVariant.Outlined} />);
		assertType(<Breadcrumb items={ITEMS} variant="plain" />);
	});

	test('rejects a wrong variant', () => {
		assertType(
			// @ts-expect-error - `variant` is `plain` or `outlined`
			<Breadcrumb items={ITEMS} variant="solid" />,
		);
	});
});

describe('preview', () => {
	test('takes any node, on a link, a button and a text crumb alike', () => {
		assertType(<Breadcrumb items={[{ title: 'Pod', href: '/pods/1', preview: <p>Summary</p> }]} />);
		assertType(<Breadcrumb items={[{ title: 'Pod', onClick: noop, preview: 'Summary' }]} />);
		assertType(<Breadcrumb items={[{ title: 'Pod', preview: null }]} />);
		assertType(
			<Breadcrumb
				items={[{ title: 'Pod', render: <RouterLink to="/pods/1" />, preview: <p>Summary</p> }]}
			/>,
		);
	});

	test('is a field of the crumb and not of the menu entry', () => {
		expectTypeOf<BreadcrumbItemType>().toHaveProperty('preview');
		expectTypeOf<BreadcrumbItemType['preview']>().toEqualTypeOf<ReactNode | undefined>();
		expectTypeOf<BreadcrumbDropdownItem>().not.toHaveProperty('preview');
		expectTypeOf<BreadcrumbLinkProps>().not.toHaveProperty('preview');
	});

	test('is not a prop of the trail', () => {
		assertType(
			// @ts-expect-error - `preview` belongs to a crumb in `items`
			<Breadcrumb items={ITEMS} preview={<p>Summary</p>} />,
		);
	});

	test('is not a field of an entry of a menu', () => {
		assertType(
			<Breadcrumb
				items={[
					{
						title: 'Payments',
						menu: [
							{
								title: 'Billing',
								href: '/billing',
								// @ts-expect-error - an entry of a menu has no card
								preview: <p>Summary</p>,
							},
						],
					},
				]}
			/>,
		);
	});
});

describe('ellipsis', () => {
	test('is optional, and takes any of its three options', () => {
		assertType(<Breadcrumb items={ITEMS} ellipsis={{}} />);
		assertType(<Breadcrumb items={ITEMS} ellipsis={{ heading: 'Earlier steps' }} />);
		assertType(<Breadcrumb items={ITEMS} ellipsis={{ heading: <b>Earlier steps</b> }} />);
		assertType(
			<Breadcrumb
				items={ITEMS}
				ellipsis={{
					heading: 'Earlier steps',
					rowSuffix: (_item, index) => <span>{index + 1}</span>,
				}}
			/>,
		);
		assertType(
			<Breadcrumb items={ITEMS} ellipsis={{ render: (collapsed) => <p>{collapsed.length}</p> }} />,
		);
	});

	test('types its options', () => {
		expectTypeOf<BreadcrumbProps['ellipsis']>().toEqualTypeOf<
			BreadcrumbEllipsisOptions | undefined
		>();
		expectTypeOf<NonNullable<BreadcrumbEllipsisOptions['rowSuffix']>>().toEqualTypeOf<
			(item: BreadcrumbItemType, index: number) => ReactElement | undefined
		>();
		expectTypeOf<NonNullable<BreadcrumbEllipsisOptions['render']>>().toEqualTypeOf<
			(collapsed: BreadcrumbCollapsedCrumb[]) => ReactNode
		>();
	});

	test('hands the row suffix the crumb and its index, and the render function the collapsed crumbs', () => {
		assertType(
			<Breadcrumb
				items={ITEMS}
				ellipsis={{
					rowSuffix: (item, index) => {
						expectTypeOf(item).toEqualTypeOf<BreadcrumbItemType>();
						expectTypeOf(index).toEqualTypeOf<number>();
						return undefined;
					},
					render: (collapsed) => {
						expectTypeOf(collapsed).toEqualTypeOf<BreadcrumbCollapsedCrumb[]>();
						return null;
					},
				}}
			/>,
		);
	});

	test('names a collapsed crumb by the crumb and its place in items', () => {
		expectTypeOf<BreadcrumbCollapsedCrumb>().toEqualTypeOf<{
			item: BreadcrumbItemType;
			index: number;
		}>();
	});

	test('rejects an option that does not exist', () => {
		assertType(
			// @ts-expect-error - `delay` is not an option of the `...` crumb
			<Breadcrumb items={ITEMS} ellipsis={{ heading: 'Earlier steps', delay: 100 }} />,
		);
	});

	test('rejects opening on hover: the `...` crumb always opens on hover, so there is no such option', () => {
		assertType(
			// @ts-expect-error - `openOnHover` is not an option of the `...` crumb, which always opens on hover
			<Breadcrumb items={ITEMS} ellipsis={{ openOnHover: true }} />,
		);
	});

	test('rejects a row suffix that is not an element', () => {
		assertType(
			// @ts-expect-error - the suffix of a row is an element, such as a `<span>`
			<Breadcrumb items={ITEMS} ellipsis={{ rowSuffix: (_item, index) => String(index) }} />,
		);
	});

	test('rejects a render that is not a function of the collapsed crumbs', () => {
		assertType(
			// @ts-expect-error - `render` is a function that receives the collapsed crumbs
			<Breadcrumb items={ITEMS} ellipsis={{ render: <p>Hidden</p> }} />,
		);
	});
});

describe('exported types', () => {
	test('the link props are what a crumb and a menu entry share', () => {
		expectTypeOf<BreadcrumbLinkProps>().toHaveProperty('href');
		expectTypeOf<BreadcrumbLinkProps>().toHaveProperty('target');
		expectTypeOf<BreadcrumbLinkProps>().toHaveProperty('render');
		expectTypeOf<BreadcrumbLinkProps>().toHaveProperty('onClick');
		expectTypeOf<BreadcrumbLinkProps>().not.toHaveProperty('title');
		expectTypeOf<BreadcrumbItemType>().toExtend<BreadcrumbLinkProps>();
		expectTypeOf<BreadcrumbDropdownItem>().toExtend<BreadcrumbLinkProps>();
	});

	test('the onClick of a link gets the mouse event', () => {
		expectTypeOf<NonNullable<BreadcrumbLinkProps['onClick']>>().toEqualTypeOf<
			(event: MouseEvent) => void
		>();
	});

	test('props leave className, style and children out', () => {
		expectTypeOf<BreadcrumbProps>().not.toHaveProperty('className');
		expectTypeOf<BreadcrumbProps>().not.toHaveProperty('style');
		expectTypeOf<BreadcrumbProps>().not.toHaveProperty('children');
	});

	test('props keep the id, the testId and every aria attribute', () => {
		expectTypeOf<BreadcrumbProps>().toHaveProperty('id');
		expectTypeOf<BreadcrumbProps>().toHaveProperty('testId');
		expectTypeOf<BreadcrumbProps>().toHaveProperty('aria-label');
		expectTypeOf<BreadcrumbProps>().toHaveProperty('aria-describedby');
	});

	test('the validator lets valid props through and names the rule for a raw data-testid, for itemRender, for params, for children and for a chevron separator', () => {
		expectTypeOf<ValidateBreadcrumbProps<{ items: BreadcrumbItemType[] }>>().toBeUnknown();
		expectTypeOf<ValidateBreadcrumbProps<{ 'data-testid': string }>>().not.toBeUnknown();
		expectTypeOf<ValidateBreadcrumbProps<{ itemRender: () => string }>>().not.toBeUnknown();
		expectTypeOf<ValidateBreadcrumbProps<{ params: { id: string } }>>().not.toBeUnknown();
		expectTypeOf<ValidateBreadcrumbProps<{ children: ReactElement }>>().not.toBeUnknown();
		expectTypeOf<
			ValidateBreadcrumbProps<{ items: BreadcrumbItemType[] }, 'chevron'>
		>().not.toBeUnknown();
	});
});
