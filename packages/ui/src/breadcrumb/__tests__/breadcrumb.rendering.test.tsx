import { render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Breadcrumb } from '../breadcrumb.js';
import type { BreadcrumbItemType } from '../types.js';
import { noop, RouterLink, TRAIL } from './breadcrumb.test-utils.js';

const THREE: BreadcrumbItemType[] = [
	{ title: 'Dashboards', href: '/dashboards' },
	{ title: 'Payments', href: '/dashboards/payments' },
	{ title: 'checkout-service-prod' },
];

function crumbs(): HTMLElement[] {
	return within(screen.getByRole('list')).getAllByRole('listitem');
}

describe('Breadcrumb rendering', () => {
	it('renders a navigation named Breadcrumb holding an ordered list of crumbs', () => {
		render(<Breadcrumb items={THREE} testId="bc" />);

		const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
		const list = within(nav).getByRole('list');

		expect(nav.tagName).toBe('NAV');
		expect(nav).toBe(screen.getByTestId('bc'));
		expect(list.tagName).toBe('OL');
		expect(crumbs().map((crumb) => crumb.textContent)).toEqual([
			'Dashboards',
			'Payments',
			'checkout-service-prod',
		]);
	});

	it('mirrors its props on the root', () => {
		const { rerender } = render(<Breadcrumb items={THREE} testId="bc" />);

		const nav = screen.getByTestId('bc');
		expect(nav).toHaveAttribute('data-slot', 'breadcrumb');
		expect(nav).toHaveAttribute('data-truncate', 'true');
		expect(nav).toHaveAttribute('data-text-overflow', 'ellipsis');
		expect(nav).toHaveAttribute('data-variant', 'plain');
		expect(within(nav).getByRole('list')).toHaveAttribute('data-slot', 'breadcrumb-list');

		rerender(
			<Breadcrumb
				items={THREE}
				testId="bc"
				truncate={false}
				textOverflow="hidden"
				variant="outlined"
			/>,
		);

		expect(nav).toHaveAttribute('data-truncate', 'false');
		expect(nav).toHaveAttribute('data-text-overflow', 'hidden');
		expect(nav).toHaveAttribute('data-variant', 'outlined');

		rerender(<Breadcrumb items={THREE} testId="bc" variant="plain" />);

		expect(nav).toHaveAttribute('data-variant', 'plain');
	});

	it('marks neither overflowing nor shrinking while every crumb shows', () => {
		render(<Breadcrumb items={THREE} testId="bc" />);

		expect(screen.getByTestId('bc')).not.toHaveAttribute('data-overflowing');
		expect(screen.getByTestId('bc')).not.toHaveAttribute('data-shrinking');
	});

	it('renders a lone crumb as the current page', () => {
		render(<Breadcrumb items={[{ title: 'Home' }]} testId="bc" />);

		expect(crumbs()).toHaveLength(1);
		expect(screen.getByTestId('bc-item-0')).toHaveAttribute('data-position', 'end');
		expect(screen.getByText('Home')).toHaveAttribute('data-slot', 'breadcrumb-item-label');
		expect(screen.queryByTestId('bc-item-separator-0')).not.toBeInTheDocument();
	});

	it('updates when its items change', () => {
		const { rerender } = render(<Breadcrumb items={THREE} testId="bc" />);

		rerender(
			<Breadcrumb items={[{ title: 'Alerts', href: '/alerts' }, { title: 'Rules' }]} testId="bc" />,
		);

		expect(crumbs().map((crumb) => crumb.textContent)).toEqual(['Alerts', 'Rules']);
	});

	it('renders a node title', () => {
		render(<Breadcrumb items={[{ title: <strong>Dashboards</strong> }, { title: 'Payments' }]} />);

		expect(screen.getByText('Dashboards').tagName).toBe('STRONG');
	});

	it('holds a title once, so text queries find the crumb', () => {
		render(<Breadcrumb items={THREE} />);

		expect(screen.getAllByText('Payments')).toHaveLength(1);
		expect(screen.getByText('Payments').closest('a')).toBe(
			screen.getByRole('link', { name: 'Payments' }),
		);
	});

	describe('an empty trail', () => {
		it('renders nothing without items', () => {
			const { container } = render(<Breadcrumb items={[]} />);

			expect(container).toBeEmptyDOMElement();
		});

		it.each<[string, BreadcrumbItemType['title']]>([
			['null', null],
			['an empty string', ''],
			['spaces', '   '],
			['false', false],
			['an empty fragment', <>{null}</>],
		])('renders nothing when the only title is %s', (_, title) => {
			const { container } = render(<Breadcrumb items={[{ title }]} testId="bc" />);

			expect(container).toBeEmptyDOMElement();
			expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
		});

		it('leaves out the crumbs whose title renders nothing', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'A' },
						{ title: null },
						{ title: '' },
						{ title: '  ' },
						{ title: false },
						{ title: 'B' },
					]}
				/>,
			);

			expect(crumbs().map((crumb) => crumb.textContent)).toEqual(['A', 'B']);
		});

		it('renders a crumb whose title is zero', () => {
			render(<Breadcrumb items={[{ title: 0 }, { title: 'B' }]} />);

			expect(crumbs().map((crumb) => crumb.textContent)).toEqual(['0', 'B']);
		});

		it('keeps the position of the last crumb after the others are left out', () => {
			render(<Breadcrumb items={[{ title: 'A' }, { title: 'B' }, { title: null }]} testId="bc" />);

			expect(screen.getByTestId('bc-item-1').querySelector('[aria-current="page"]')).not.toBeNull();
			expect(screen.getByTestId('bc-item-1')).toHaveAttribute('data-position', 'end');
		});
	});

	describe('test ids', () => {
		it('names every crumb and the separator before it after its index in items', () => {
			render(<Breadcrumb items={THREE} testId="bc" />);

			expect(screen.getByTestId('bc-item-0')).toHaveTextContent('Dashboards');
			expect(screen.getByTestId('bc-item-1')).toHaveTextContent('Payments');
			expect(screen.getByTestId('bc-item-2')).toHaveTextContent('checkout-service-prod');
			expect(screen.queryByTestId('bc-item-separator-0')).not.toBeInTheDocument();
			expect(screen.getByTestId('bc-item-separator-1')).toBeInTheDocument();
			expect(screen.getByTestId('bc-item-separator-2')).toBeInTheDocument();
		});

		it('does not renumber the crumbs after one that was left out', () => {
			render(<Breadcrumb items={[{ title: 'A' }, { title: '' }, { title: 'C' }]} testId="bc" />);

			expect(screen.getByTestId('bc-item-0')).toHaveTextContent('A');
			expect(screen.queryByTestId('bc-item-1')).not.toBeInTheDocument();
			expect(screen.getByTestId('bc-item-2')).toHaveTextContent('C');
			expect(screen.getByTestId('bc-item-separator-2')).toBeInTheDocument();
			expect(screen.queryByTestId('bc-item-separator-1')).not.toBeInTheDocument();
		});

		it('names nothing without a testId', () => {
			const { container } = render(<Breadcrumb items={THREE} />);

			expect(container.querySelector('[data-testid]')).toBeNull();
		});
	});

	describe('crumbs', () => {
		it('renders a crumb with an href as a link', () => {
			render(<Breadcrumb items={THREE} />);

			const link = screen.getByRole('link', { name: 'Dashboards' });
			expect(link).toHaveAttribute('href', '/dashboards');
			expect(link).toHaveAttribute('data-kind', 'link');
			expect(link).toHaveAttribute('data-slot', 'breadcrumb-item-content');
			expect(link.closest('li')).toHaveAttribute('data-kind', 'link');
		});

		it('renders a crumb with only an onClick as a button', () => {
			render(<Breadcrumb items={[{ title: 'Reports', onClick: noop }, { title: 'Now' }]} />);

			const button = screen.getByRole('button', { name: 'Reports' });
			expect(button.tagName).toBe('BUTTON');
			expect(button).toHaveAttribute('type', 'button');
			expect(button).toHaveAttribute('data-kind', 'button');
			expect(screen.queryByRole('link')).not.toBeInTheDocument();
		});

		it('renders a crumb with nothing to do as plain text', () => {
			render(<Breadcrumb items={[{ title: 'Reports' }, { title: 'Now' }]} />);

			expect(screen.queryByRole('link')).not.toBeInTheDocument();
			expect(screen.queryByRole('button')).not.toBeInTheDocument();
			const content = screen.getByText('Reports').closest('[data-slot="breadcrumb-item-content"]');
			expect(content?.tagName).toBe('SPAN');
			expect(content).toHaveAttribute('data-kind', 'text');
		});

		it('renders a crumb with a menu as a button that opens it', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Services', menu: [{ title: 'Checkout', href: '/checkout' }] },
						{ title: 'Now' },
					]}
					testId="bc"
				/>,
			);

			const trigger = screen.getByRole('button', { name: 'Services' });
			expect(trigger).toHaveAttribute('data-kind', 'menu');
			expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
			expect(trigger.querySelector('[data-slot="breadcrumb-item-chevron"]')).not.toBeNull();
		});

		it('lets the menu win over an href and an onClick', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Services', href: '/services', onClick: noop, menu: [{ title: 'Checkout' }] },
						{ title: 'Now' },
					]}
				/>,
			);

			expect(screen.getByRole('button', { name: 'Services' })).toHaveAttribute('data-kind', 'menu');
			expect(screen.queryByRole('link')).not.toBeInTheDocument();
		});

		it('ignores an empty menu', () => {
			render(
				<Breadcrumb
					items={[{ title: 'Services', href: '/services', menu: [] }, { title: 'Now' }]}
				/>,
			);

			expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('data-kind', 'link');
			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('names a crumb menu after the crumb', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Services', menu: [{ title: 'Checkout', href: '/checkout' }] },
						{ title: 'Now' },
					]}
					testId="bc"
				/>,
			);

			expect(screen.getByTestId('bc-item-0-menu')).toBe(
				screen.getByRole('button', { name: 'Services' }),
			);
		});

		it('names no menu without a testId', () => {
			const { container } = render(
				<Breadcrumb
					items={[{ title: 'Services', menu: [{ title: 'Checkout' }] }, { title: 'Now' }]}
				/>,
			);

			// The mocked chevron icon carries a test id of its own.
			expect(container.querySelector('[data-testid]:not(svg)')).toBeNull();
		});

		it('marks the position of every crumb', () => {
			render(<Breadcrumb items={THREE} testId="bc" />);

			expect(
				['bc-item-0', 'bc-item-1', 'bc-item-2'].map((id) =>
					screen.getByTestId(id).getAttribute('data-position'),
				),
			).toEqual(['start', 'middle', 'end']);
		});

		it('marks only the last crumb as the current page', () => {
			render(<Breadcrumb items={THREE} testId="bc" />);

			expect(screen.getByTestId('bc-item-2').querySelector('[aria-current="page"]')).not.toBeNull();
			expect(
				screen.getAllByRole('listitem').filter((li) => li.querySelector('[aria-current]')),
			).toHaveLength(1);
			expect(screen.getByRole('link', { name: 'Dashboards' })).not.toHaveAttribute('aria-current');
			expect(screen.getByRole('link', { name: 'Payments' })).not.toHaveAttribute('aria-current');
		});

		it('marks a last crumb that is a link as the current page', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'A', href: '/a' },
						{ title: 'B', href: '/b' },
					]}
				/>,
			);

			expect(screen.getByRole('link', { name: 'B' })).toHaveAttribute('aria-current', 'page');
		});

		it('renders the icon before the title', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Home', href: '/', icon: <svg data-testid="home-icon" /> },
						{ title: 'Now' },
					]}
				/>,
			);

			const link = screen.getByRole('link', { name: 'Home' });
			const icon = screen.getByTestId('home-icon');

			expect(link).toContainElement(icon);
			expect(icon.closest('[data-slot="breadcrumb-item-icon"]')).not.toBeNull();
			expect(link.firstElementChild).toBe(icon.closest('[data-slot="breadcrumb-item-icon"]'));
			expect(link.firstElementChild?.nextElementSibling).toHaveAttribute(
				'data-slot',
				'breadcrumb-item-label',
			);
		});

		it('renders an icon on a text crumb and on a button crumb', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Text', icon: <svg data-testid="text-icon" /> },
						{ title: 'Button', onClick: noop, icon: <svg data-testid="button-icon" /> },
						{ title: 'Now' },
					]}
				/>,
			);

			expect(screen.getByTestId('text-icon')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Button' })).toContainElement(
				screen.getByTestId('button-icon'),
			);
		});

		it('draws no icon slot for a crumb without one', () => {
			render(<Breadcrumb items={THREE} />);

			expect(document.querySelector('[data-slot="breadcrumb-item-icon"]')).toBeNull();
		});
	});

	describe('separators', () => {
		it('draws a slash between two crumbs by default', () => {
			render(<Breadcrumb items={THREE} testId="bc" />);

			expect(screen.getByTestId('bc-item-separator-1')).toHaveTextContent('/');
			expect(screen.getByTestId('bc-item-separator-2')).toHaveTextContent('/');
		});

		it('draws the separator it is given', () => {
			render(<Breadcrumb items={THREE} separator=">" testId="bc" />);

			expect(screen.getByTestId('bc-item-separator-1')).toHaveTextContent('>');
			expect(screen.getByTestId('bc-item-separator-2')).toHaveTextContent('>');
		});

		it('keeps a separator out of the accessibility tree and out of the crumb count', () => {
			render(<Breadcrumb items={THREE} testId="bc" />);

			const separator = screen.getByTestId('bc-item-separator-1');
			expect(separator).toHaveAttribute('role', 'presentation');
			expect(separator).toHaveAttribute('aria-hidden', 'true');
			expect(separator).toHaveAttribute('data-slot', 'breadcrumb-separator');
			expect(crumbs()).toHaveLength(3);
		});

		it('draws one fewer separator than crumbs', () => {
			render(<Breadcrumb items={TRAIL} testId="bc" truncate={false} />);

			expect(document.querySelectorAll('[data-slot="breadcrumb-separator"]')).toHaveLength(4);
		});

		it('puts each separator between its two crumbs', () => {
			render(<Breadcrumb items={THREE} testId="bc" />);

			const order = Array.from(screen.getByRole('list').children).map(
				(child) => child.getAttribute('data-testid') ?? '',
			);

			expect(order).toEqual([
				'bc-item-0',
				'bc-item-separator-1',
				'bc-item-1',
				'bc-item-separator-2',
				'bc-item-2',
			]);
		});
	});

	describe('render', () => {
		const link = (name: string): HTMLElement => screen.getByRole('link', { name });
		const content = (testId: string): Element | null =>
			screen.getByTestId(testId).querySelector('[data-slot="breadcrumb-item-content"]');

		it('draws the element as the crumb, with the title as its label', () => {
			render(
				<Breadcrumb
					items={[{ title: 'Services', render: <RouterLink to="/services" /> }, { title: 'Now' }]}
					testId="bc"
				/>,
			);

			expect(link('Services')).toHaveAttribute('href', '/services');
			expect(link('Services')).toBe(content('bc-item-0'));
			expect(link('Services')).toHaveAttribute('data-slot', 'breadcrumb-item-content');
			expect(
				link('Services').querySelector('[data-slot="breadcrumb-item-label"]'),
			).toHaveTextContent('Services');
		});

		it('is a link kind with no href when the element has its own destination', () => {
			render(
				<Breadcrumb
					items={[{ title: 'Services', render: <RouterLink to="/services" /> }, { title: 'Now' }]}
					testId="bc"
				/>,
			);

			expect(link('Services')).toHaveAttribute('data-kind', 'link');
			expect(screen.getByTestId('bc-item-0')).toHaveAttribute('data-kind', 'link');
			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('replaces the children of the element with the icon and the title', () => {
			render(
				<Breadcrumb
					items={[
						{
							title: 'Services',
							icon: <svg data-testid="icon" />,
							render: <RouterLink to="/services">Not the label</RouterLink>,
						},
						{ title: 'Now' },
					]}
				/>,
			);

			expect(screen.queryByText('Not the label')).not.toBeInTheDocument();
			expect(link('Services')).toContainElement(screen.getByTestId('icon'));
			expect(link('Services').firstElementChild).toHaveAttribute(
				'data-slot',
				'breadcrumb-item-icon',
			);
			expect(link('Services').lastElementChild).toHaveAttribute(
				'data-slot',
				'breadcrumb-item-label',
			);
		});

		it('takes the render of each crumb on its own', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Services', render: <RouterLink to="/services" data-router="first" /> },
						{ title: 'Checkout', render: <RouterLink to="/checkout" data-router="second" /> },
						{ title: 'Now' },
					]}
				/>,
			);

			expect(link('Services')).toHaveAttribute('data-router', 'first');
			expect(link('Checkout')).toHaveAttribute('data-router', 'second');
			expect(link('Checkout')).toHaveAttribute('href', '/checkout');
		});

		it('keeps the data attributes of the element next to the ones of the crumb', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Services', render: <RouterLink to="/services" data-router="link" /> },
						{ title: 'Now' },
					]}
				/>,
			);

			expect(link('Services')).toHaveAttribute('data-router', 'link');
			expect(link('Services')).toHaveAttribute('data-kind', 'link');
		});

		it('keeps its own data-slot and data-kind over the ones the element sets', () => {
			render(
				<Breadcrumb
					items={[
						{
							title: 'Services',
							render: <RouterLink to="/services" data-slot="router-link" data-kind="custom" />,
						},
						{ title: 'Now' },
					]}
				/>,
			);

			expect(link('Services')).toHaveAttribute('data-slot', 'breadcrumb-item-content');
			expect(link('Services')).toHaveAttribute('data-kind', 'link');
		});

		it('keeps the crumb class when the element has a className of its own', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Plain', href: '/plain' },
						{ title: 'Services', render: <RouterLink to="/services" className="track" /> },
						{ title: 'Now' },
					]}
				/>,
			);

			expect(link('Services')).toHaveClass('track', ...Array.from(link('Plain').classList));
		});

		it('points the ref of the element at the anchor', () => {
			const ownRef = createRef<HTMLAnchorElement>();

			render(
				<Breadcrumb
					items={[
						{ title: 'Services', render: <RouterLink ref={ownRef} to="/services" /> },
						{ title: 'Now' },
					]}
				/>,
			);

			expect(ownRef.current).toBe(link('Services'));
		});

		describe('href and target', () => {
			it('takes the href of the crumb when the element leaves it undefined', () => {
				render(
					<Breadcrumb
						items={[
							{
								title: 'Services',
								href: '/from-item',
								render: <RouterLink href={undefined} />,
							},
							{ title: 'Now' },
						]}
					/>,
				);

				expect(link('Services')).toHaveAttribute('href', '/from-item');
			});

			it('keeps the href the element sets over the one of the crumb', () => {
				render(
					<Breadcrumb
						items={[
							{
								title: 'Services',
								href: '/from-item',
								render: <RouterLink href="/from-render" />,
							},
							{ title: 'Now' },
						]}
					/>,
				);

				expect(link('Services')).toHaveAttribute('href', '/from-render');
			});

			it('opens a link with a _blank target safely', () => {
				render(
					<Breadcrumb
						items={[{ title: 'Docs', href: '/docs', target: '_blank' }, { title: 'Now' }]}
					/>,
				);

				expect(link('Docs')).toHaveAttribute('target', '_blank');
				expect(link('Docs')).toHaveAttribute('rel', 'noopener noreferrer');
			});

			it('takes the target of the crumb when the element leaves it undefined', () => {
				render(
					<Breadcrumb
						items={[
							{
								title: 'Docs',
								target: '_blank',
								render: <RouterLink to="/docs" target={undefined} />,
							},
							{ title: 'Now' },
						]}
					/>,
				);

				expect(link('Docs')).toHaveAttribute('target', '_blank');
				expect(link('Docs')).toHaveAttribute('rel', 'noopener noreferrer');
			});

			it('adds the rel for a _blank target the element sets, and keeps its other values', () => {
				render(
					<Breadcrumb
						items={[
							{
								title: 'Docs',
								render: <RouterLink to="/docs" target="_blank" rel="nofollow noopener" />,
							},
							{ title: 'Now' },
						]}
					/>,
				);

				expect(link('Docs')).toHaveAttribute('rel', 'nofollow noopener noreferrer');
			});

			it('keeps the target of the element over the one of the crumb', () => {
				render(
					<Breadcrumb
						items={[
							{
								title: 'Docs',
								target: '_blank',
								render: <RouterLink to="/docs" target="_self" rel="nofollow" />,
							},
							{ title: 'Now' },
						]}
					/>,
				);

				expect(link('Docs')).toHaveAttribute('target', '_self');
				expect(link('Docs')).toHaveAttribute('rel', 'nofollow');
			});

			it('sets no target and no rel when neither side has one', () => {
				render(
					<Breadcrumb
						items={[{ title: 'Services', render: <RouterLink to="/services" /> }, { title: 'Now' }]}
					/>,
				);

				expect(link('Services')).not.toHaveAttribute('target');
				expect(link('Services')).not.toHaveAttribute('rel');
			});
		});

		describe('aria-current', () => {
			const ITEMS: BreadcrumbItemType[] = [
				{ title: 'Dashboards', render: <RouterLink to="/dashboards" /> },
				{ title: 'Payments', render: <RouterLink to="/payments" /> },
				{ title: 'checkout-service-prod', render: <RouterLink to="/checkout" /> },
			];

			it('lands on the anchor of the current crumb', () => {
				render(<Breadcrumb items={ITEMS} testId="bc" />);

				expect(link('checkout-service-prod')).toHaveAttribute('aria-current', 'page');
				expect(link('checkout-service-prod')).toBe(content('bc-item-2'));
			});

			it('stays off the anchors of the other crumbs, one crumb only', () => {
				render(<Breadcrumb items={ITEMS} />);

				expect(link('Dashboards')).not.toHaveAttribute('aria-current');
				expect(link('Payments')).not.toHaveAttribute('aria-current');
				expect(document.querySelectorAll('[aria-current]')).toHaveLength(1);
				expect(document.querySelector('[aria-current]')).toBe(link('checkout-service-prod'));
			});

			it('keeps the aria-current the element sets itself', () => {
				render(
					<Breadcrumb
						items={[
							...ITEMS.slice(0, 2),
							{
								title: 'checkout-service-prod',
								render: <RouterLink to="/checkout" aria-current="location" />,
							},
						]}
					/>,
				);

				expect(link('checkout-service-prod')).toHaveAttribute('aria-current', 'location');
				expect(document.querySelectorAll('[aria-current]')).toHaveLength(1);
			});
		});

		it('keeps the menu of a crumb over its render, as it does over an href', () => {
			render(
				<Breadcrumb
					items={[
						{
							title: 'Services',
							render: <RouterLink to="/services" />,
							menu: [{ title: 'Checkout' }],
						},
						{ title: 'Now' },
					]}
					testId="bc"
				/>,
			);

			expect(screen.getByRole('button', { name: 'Services' })).toHaveAttribute('data-kind', 'menu');
			expect(screen.getByTestId('bc-item-0')).toHaveAttribute('data-kind', 'menu');
			expect(screen.queryByRole('link')).not.toBeInTheDocument();
		});

		it('follows the render of a crumb whose menu is empty', () => {
			render(
				<Breadcrumb
					items={[
						{ title: 'Services', render: <RouterLink to="/services" />, menu: [] },
						{ title: 'Now' },
					]}
				/>,
			);

			expect(link('Services')).toHaveAttribute('data-kind', 'link');
		});
	});

	describe('attributes', () => {
		it('forwards the id, the aria attributes and the data attributes to the root', () => {
			render(
				<Breadcrumb
					items={THREE}
					id="trail"
					aria-describedby="hint"
					data-foo="bar"
					data-track="crumbs"
					testId="bc"
				/>,
			);

			const nav = screen.getByTestId('bc');
			expect(nav).toHaveAttribute('id', 'trail');
			expect(nav).toHaveAttribute('aria-describedby', 'hint');
			expect(nav).toHaveAttribute('data-foo', 'bar');
			expect(nav).toHaveAttribute('data-track', 'crumbs');
		});

		it('keeps its own state attributes over data props of the same name', () => {
			render(
				<Breadcrumb
					items={THREE}
					data-slot="custom"
					data-truncate="nope"
					data-text-overflow="nope"
					data-variant="nope"
					data-overflowing="true"
					data-shrinking="floor"
					testId="bc"
				/>,
			);

			const nav = screen.getByTestId('bc');
			expect(nav).toHaveAttribute('data-slot', 'breadcrumb');
			expect(nav).toHaveAttribute('data-truncate', 'true');
			expect(nav).toHaveAttribute('data-text-overflow', 'ellipsis');
			expect(nav).toHaveAttribute('data-variant', 'plain');
			expect(nav).not.toHaveAttribute('data-overflowing');
		});

		it('names the navigation Breadcrumb unless aria-label says otherwise', () => {
			const { rerender } = render(<Breadcrumb items={THREE} />);
			expect(screen.getByRole('navigation')).toHaveAccessibleName('Breadcrumb');

			rerender(<Breadcrumb items={THREE} aria-label="You are here" />);
			expect(screen.getByRole('navigation')).toHaveAccessibleName('You are here');
			expect(screen.queryByRole('navigation', { name: 'Breadcrumb' })).not.toBeInTheDocument();
		});

		it('can be named by aria-labelledby instead', () => {
			render(
				<>
					<span id="label">Where you are</span>
					<Breadcrumb items={THREE} aria-labelledby="label" aria-label={undefined} />
				</>,
			);

			expect(screen.getByRole('navigation')).toHaveAccessibleName('Where you are');
		});

		it('keeps its own data-slot and data-testid whatever data attributes come in', () => {
			render(
				<Breadcrumb
					items={THREE}
					testId="bc"
					{...({ 'data-slot': 'other', 'data-testid': 'other' } as object)}
				/>,
			);

			expect(screen.getByTestId('bc')).toBeInTheDocument();
			expect(screen.queryByTestId('other')).not.toBeInTheDocument();
		});

		it('ignores a className, a style and children that get past the types', () => {
			const sneaky = { className: 'custom-class', style: { color: 'red' }, children: 'Child text' };

			render(<Breadcrumb items={THREE} testId="bc" {...(sneaky as object)} />);

			const nav = screen.getByTestId('bc');
			expect(nav.className).not.toContain('custom-class');
			expect(nav).not.toHaveAttribute('style');
			expect(screen.queryByText('Child text')).not.toBeInTheDocument();
			expect(crumbs()).toHaveLength(3);
		});
	});

	describe('the measuring row', () => {
		it('is hidden from the accessibility tree, and adds no text a query can find', () => {
			render(<Breadcrumb items={THREE} testId="bc" />);

			const measure = screen.getByTestId('bc').querySelector('[data-slot="breadcrumb-measure"]');
			expect(measure).toHaveAttribute('aria-hidden', 'true');
			expect(screen.queryByRole('button', { name: '...' })).not.toBeInTheDocument();
		});

		it('is there whenever the trail truncates, since two crumbs still shorten', () => {
			const { rerender } = render(<Breadcrumb items={THREE.slice(0, 2)} testId="bc" />);
			expect(document.querySelector('[data-slot="breadcrumb-measure"]')).not.toBeNull();

			rerender(<Breadcrumb items={THREE} testId="bc" truncate={false} />);
			expect(document.querySelector('[data-slot="breadcrumb-measure"]')).toBeNull();

			rerender(<Breadcrumb items={THREE} testId="bc" />);
			expect(document.querySelector('[data-slot="breadcrumb-measure"]')).not.toBeNull();
		});
	});
});
