import { CreditCard, House } from '@signozhq/icons';
import {
	Breadcrumb,
	type BreadcrumbItemType,
	type BreadcrumbProps,
	BreadcrumbTextOverflow,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	type AnchorHTMLAttributes,
	createContext,
	forwardRef,
	Fragment,
	type ReactElement,
	type ReactNode,
	useContext,
	useState,
} from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './breadcrumb.stories.module.css';
import { breadcrumbArgTypes } from './shared/breadcrumb-arg-types.js';
import { waitForEffects } from './shared/play.js';

const FIGMA_FILE =
	'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2';

const ELLIPSIS_NAME = /^Show \d+ hidden items?$/;

const noop = (): void => {};

const SERVICE_TRAIL: BreadcrumbItemType[] = [
	{ title: 'Services', href: '/services' },
	{ title: 'Payments', href: '/services/payments' },
	{ title: 'checkout-service', href: '/services/payments/checkout-service' },
	{ title: 'Latency' },
];

/**
 * Seven crumbs: 720px holds all of them, 480px and 320px collapse some, 240px keeps only the first
 * and the last.
 */
const LONG_TRAIL: BreadcrumbItemType[] = [
	{ title: 'Home', href: '/', icon: <House /> },
	{ title: 'Services', href: '/services' },
	{ title: 'Payments', href: '/services/payments' },
	{ title: 'checkout-service', href: '/services/payments/checkout-service' },
	{ title: 'Deployments', href: '/services/payments/checkout-service/deployments' },
	{ title: 'production', href: '/services/payments/checkout-service/deployments/production' },
	{ title: 'Latency' },
];

const LONG_TITLE = 'checkout-service-prod-us-east-1b-7f9c';

const LONG_TITLES_TRAIL: BreadcrumbItemType[] = [
	{ title: 'Services', href: '/services' },
	{ title: LONG_TITLE, href: `/services/${LONG_TITLE}` },
	{ title: 'Instances', href: `/services/${LONG_TITLE}/instances` },
	{ title: 'checkout-7f9c5d8b6c-x2kqp-sidecar-envoy-proxy' },
];

const meta: Meta<typeof Breadcrumb> = {
	title: 'Primitive Components/Breadcrumb',
	component: Breadcrumb,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		controls: { disable: false },
		design: { type: 'figma', url: `${FIGMA_FILE}?node-id=12-738&p=f&m=dev` },
	},
	argTypes: breadcrumbArgTypes,
	args: {
		items: SERVICE_TRAIL,
		separator: '/',
		truncate: true,
		textOverflow: BreadcrumbTextOverflow.Ellipsis,
	},
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

function Frame({
	width,
	children,
}: {
	width?: string | undefined;
	children: ReactNode;
}): ReactElement {
	return (
		<div className={styles.frame} style={width === undefined ? undefined : { width }}>
			{children}
		</div>
	);
}

function Case({
	caption,
	width,
	children,
}: {
	caption: string;
	width?: string | undefined;
	children: ReactNode;
}): ReactElement {
	return (
		<div className="story-section-sm">
			<Typography
				variant="label"
				size="small"
				weight="regular"
				color="secondary"
				as="span"
				textOverflow="visible"
			>
				{caption}
			</Typography>
			<Frame width={width}>{children}</Frame>
		</div>
	);
}

function ShowcaseSection({
	title,
	note,
	className,
	children,
}: {
	title: string;
	note: string;
	className?: string | undefined;
	children: ReactNode;
}): ReactElement {
	return (
		<div className={className === undefined ? 'story-section' : `story-section ${className}`}>
			<Typography
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<div className={styles.sectionNote}>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					{note}
				</Typography>
			</div>
			{children}
		</div>
	);
}

function getNav(canvasElement: HTMLElement, testId: string): HTMLElement {
	return within(canvasElement).getByTestId(testId);
}

function getEllipsis(nav: HTMLElement): HTMLElement | null {
	return within(nav).queryByRole('button', { name: ELLIPSIS_NAME });
}

/**
 * The crumbs of a trail that are in the flow, in path order.
 */
function getVisibleCrumbs(nav: HTMLElement): Element[] {
	return Array.from(nav.querySelectorAll('[data-slot="breadcrumb-item"]:not([data-collapsed])'));
}

/**
 * The positions, among the crumbs of the trail, that sit in the menu of the `...` crumb. A
 * collapsed crumb stays mounted but gives up its test id, so its position is the only handle left
 * on it.
 */
function getCollapsedPositions(nav: HTMLElement): number[] {
	return Array.from(nav.querySelectorAll('[data-slot="breadcrumb-item"]')).flatMap(
		(crumb, position) => (crumb.hasAttribute('data-collapsed') ? [position] : []),
	);
}

function getContent(crumb: Element): HTMLElement {
	const content = crumb.querySelector<HTMLElement>('[data-slot="breadcrumb-item-content"]');

	if (content === null) {
		throw new Error('Breadcrumb story: a crumb without content.');
	}

	return content;
}

function getLabel(crumb: Element): HTMLElement {
	const label = crumb.querySelector<HTMLElement>('[data-slot="breadcrumb-item-label"]');

	if (label === null) {
		throw new Error('Breadcrumb story: a crumb without a label.');
	}

	return label;
}

/**
 * The playground the Controls table drives. Drag the corner of the frame to give it less room.
 */
export const Default: Story = {
	args: { testId: 'breadcrumb-default' },
	parameters: {
		// Playground: every state it can be driven into is covered by `BreadcrumbShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<Frame>
			<Breadcrumb {...(args as BreadcrumbProps)} />
		</Frame>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });

		await expect(within(nav).getAllByRole('link')).toHaveLength(3);
		await expect(
			canvas.getByTestId('breadcrumb-default-item-3').querySelector('[aria-current="page"]'),
		).toHaveTextContent('Latency');
	},
};

const KIND_STATES = ['rest', 'hover', 'focus'] as const;

const KIND_ROWS: { name: string; item: BreadcrumbItemType }[] = [
	{ name: 'link', item: { title: 'Payments', href: '/services/payments' } },
	{ name: 'button', item: { title: 'Payments', onClick: noop } },
	{
		name: 'menu',
		item: {
			title: 'Payments',
			menu: [
				{ title: 'Billing', href: '/services/billing' },
				{ title: 'Payments', href: '/services/payments' },
				{ title: 'Refunds', onClick: noop },
			],
		},
	},
	{ name: 'text', item: { title: 'Payments' } },
	{ name: 'icon', item: { title: 'Payments', icon: <CreditCard />, href: '/services/payments' } },
];

function kindTrail(item: BreadcrumbItemType): BreadcrumbItemType[] {
	return [{ title: 'Services', href: '/services' }, item, { title: 'Latency' }];
}

const OVERFLOW_WIDTHS = ['720px', '480px', '320px', '240px'];

const SHRINKING_TITLE =
	'Latency of checkout-service-prod-us-east-1b over the last twenty four hours';

const SHRINKING_TRAIL: BreadcrumbItemType[] = [
	{ title: 'Infrastructure', href: '/infrastructure', icon: <House /> },
	{ title: 'Services', href: '/services' },
	{ title: 'checkout-service', href: '/services/checkout-service' },
	{ title: SHRINKING_TITLE },
];

const SHRINKING_WIDTHS = ['360px', '260px', '180px'];

const MAX_VISIBLE_COUNTS = [5, 3, 2];

const SEPARATORS = ['/', '>', '›', '·', '|'];

const CRUMB_MENU_TRAIL: BreadcrumbItemType[] = [
	{ title: 'Services', href: '/services' },
	{ title: 'Payments', href: '/services/payments' },
	{
		title: 'checkout-service',
		menu: [
			{ title: 'billing-service', href: '/services/payments/billing-service' },
			{ title: 'checkout-service', href: '/services/payments/checkout-service' },
			{ title: 'refund-service', href: '/services/payments/refund-service' },
			{ title: 'Create service', onClick: fn() },
		],
	},
];

const NavigateContext = createContext<(to: string) => void>(noop);

/**
 * Stands in for the `Link` of a router: an `<a>` with a `to` prop that navigates without a reload.
 */
const RouterLink = forwardRef<
	HTMLAnchorElement,
	AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
>(function RouterLink({ to, onClick, children, ...props }, ref) {
	const navigate = useContext(NavigateContext);

	return (
		<a
			ref={ref}
			{...props}
			href={to}
			data-router-link=""
			onClick={(event) => {
				onClick?.(event);
				event.preventDefault();
				navigate(to);
			}}
		>
			{children}
		</a>
	);
});

const ROUTER_TRAIL: BreadcrumbItemType[] = [
	{ title: 'Services', render: <RouterLink to="/services" /> },
	{ title: 'Payments', render: <RouterLink to="/services/payments" /> },
	{ title: 'checkout-service', render: <RouterLink to="/services/payments/checkout-service" /> },
	{
		title: 'Deployments',
		render: <RouterLink to="/services/payments/checkout-service/deployments" />,
	},
	{
		title: 'production',
		render: <RouterLink to="/services/payments/checkout-service/deployments/production" />,
	},
	{ title: 'Latency' },
];

const ROUTER_MENU_TRAIL: BreadcrumbItemType[] = [
	{ title: 'Services', render: <RouterLink to="/services" /> },
	{ title: 'Payments', render: <RouterLink to="/services/payments" /> },
	{
		title: 'checkout-service',
		menu: [
			{ title: 'billing-service', render: <RouterLink to="/services/payments/billing-service" /> },
			{
				title: 'checkout-service',
				render: <RouterLink to="/services/payments/checkout-service" />,
			},
			{ title: 'Create service', onClick: noop },
		],
	},
];

/**
 * The route of a crumb that renders a `RouterLink`.
 */
function getRoute(item: BreadcrumbItemType): string | undefined {
	return (item.render as ReactElement<{ to?: string }> | undefined)?.props.to;
}

function RouterLinks(): ReactElement {
	const [location, setLocation] = useState(
		'/services/payments/checkout-service/deployments/production',
	);

	return (
		<NavigateContext.Provider value={setLocation}>
			<div className={styles.stack}>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					Location: <span data-testid="router-location">{location}</span>
				</Typography>
				<Case caption="720px: every crumb but the current page is a router link" width="720px">
					<Breadcrumb items={ROUTER_TRAIL} testId="router-wide" />
				</Case>
				<Case caption="320px: the rows of the ... menu are router links too" width="320px">
					<Breadcrumb items={ROUTER_TRAIL} testId="router-narrow" />
				</Case>
				<Case caption="A crumb with a menu: its entries take a render as well" width="32rem">
					<Breadcrumb items={ROUTER_MENU_TRAIL} testId="router-menu" />
				</Case>
			</div>
		</NavigateContext.Provider>
	);
}

/**
 * The menus held open in the snapshot: the one a crumb's own `menu` opens, and the one behind the
 * `...` crumb.
 */
const HELD_OPEN_MENUS = ['crumb-menu-item-2-menu', 'overflow-menu-ellipsis'];

function BreadcrumbShowcaseLayout(): ReactElement {
	return (
		<div className="story-container-full">
			<div className={styles.showcaseContainer}>
				<ShowcaseSection
					title="Crumb kinds"
					note="One trail per kind of crumb, plus one with an icon, the one under test in the middle, at rest, hovered and focused. A crumb with an href, an onClick or a menu reacts to hover and focus. A crumb with none of them is plain text and never reacts, so its hover and focus columns look like its rest column. The last crumb is the current page and looks the same as the others."
				>
					<div className={styles.matrix}>
						<span />
						{KIND_STATES.map((state) => (
							<Typography
								key={state}
								variant="label"
								size="small"
								weight="medium"
								color="inherit"
								as="span"
								textOverflow="visible"
							>
								{state}
							</Typography>
						))}
						{KIND_ROWS.map(({ name, item }) => (
							<Fragment key={name}>
								<Typography
									variant="label"
									size="small"
									weight="medium"
									color="inherit"
									as="span"
									textOverflow="visible"
								>
									{name}
								</Typography>
								{KIND_STATES.map((state) => (
									<div key={state} data-state-cell={state}>
										<Breadcrumb items={kindTrail(item)} testId={`kind-${name}-${state}`} />
									</div>
								))}
							</Fragment>
						))}
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Overflow"
					note="The same seven crumbs in less and less room. Middle crumbs collapse one at a time, from the centre outward, into one ... crumb, and come back as the room grows. There is no ... crumb while everything fits. Drag a frame's corner to watch it happen."
				>
					<div className={styles.stack}>
						{OVERFLOW_WIDTHS.map((width) => (
							<Case key={width} caption={width} width={width}>
								<Breadcrumb items={LONG_TRAIL} testId={`overflow-${width}`} />
							</Case>
						))}
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Shrinking"
					note="Once only the first and the last crumb are left and the trail still does not fit, the last crumb shortens first, then the first one, each to a floor. A shortened crumb ends with … and shows its full title in a tooltip, held open here on the 260px trail."
				>
					<div className={styles.stack}>
						{SHRINKING_WIDTHS.map((width) => (
							<Case key={width} caption={width} width={width}>
								<Breadcrumb items={SHRINKING_TRAIL} testId={`shrinking-${width}`} />
							</Case>
						))}
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Text overflow"
					note="A label past its maximum width ends with … and the crumb shows its full title in a tooltip, whatever the room, so a machine-generated name never takes the whole trail. With textOverflow hidden it is clipped at its edge instead, with no … and no tooltip."
				>
					<div className={styles.stack}>
						<Case caption="textOverflow ellipsis (default)" width="720px">
							<Breadcrumb items={LONG_TITLES_TRAIL} testId="text-overflow-ellipsis" />
						</Case>
						<Case caption="textOverflow hidden" width="720px">
							<Breadcrumb
								items={LONG_TITLES_TRAIL}
								textOverflow={BreadcrumbTextOverflow.Hidden}
								testId="text-overflow-hidden"
							/>
						</Case>
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="maxVisible"
					note="Caps how many crumbs show, the first and the last included, whatever the room. The rest collapse into the ... crumb from the centre outward. A value below 2 counts as 2."
				>
					<div className={styles.stack}>
						<Case caption="No maxVisible" width="720px">
							<Breadcrumb items={LONG_TRAIL} testId="max-visible-none" />
						</Case>
						{MAX_VISIBLE_COUNTS.map((count) => (
							<Case key={count} caption={`maxVisible ${count}`} width="720px">
								<Breadcrumb items={LONG_TRAIL} maxVisible={count} testId={`max-visible-${count}`} />
							</Case>
						))}
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Wrapping"
					note="With truncate={false} nothing collapses and the trail wraps onto more lines, every crumb visible. The default, on top, keeps one line."
				>
					<div className={styles.stack}>
						<Case caption="truncate (default)" width="320px">
							<Breadcrumb items={LONG_TRAIL} testId="wrap-on" />
						</Case>
						<Case caption="truncate={false}" width="320px">
							<Breadcrumb items={LONG_TRAIL} truncate={false} testId="wrap-off" />
						</Case>
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Separators"
					note="Any string, drawn between two crumbs and left out of the accessibility tree."
				>
					<div className={styles.stack}>
						{SEPARATORS.map((separator, index) => (
							<Breadcrumb
								key={separator}
								items={SERVICE_TRAIL}
								separator={separator}
								testId={`separator-${index}`}
							/>
						))}
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Router links"
					note="A crumb or a menu entry takes a render, here a stand-in for the Link of a router, drawn in place of a plain <a> with the title as its label. The current page has none and stays text. In the menu of the ... crumb and in the menu of a crumb, an entry with a render is a row drawn by that element, so a collapsed crumb is still a router link. Click a crumb or a row to move the location."
				>
					<RouterLinks />
				</ShowcaseSection>

				<ShowcaseSection
					title="Empty titles"
					note="A crumb whose title renders nothing, an empty string, null or only whitespace, is left out of the trail with the separator before it. Test ids keep each crumb's place in items. With no crumb left, nothing renders, so the second trail here is absent."
				>
					<div className={styles.stack}>
						<Breadcrumb
							testId="empty"
							items={[
								{ title: 'Services', href: '/services' },
								{ title: '', href: '/services/hidden' },
								{ title: 'Payments', href: '/services/payments' },
								{ title: null },
								{ title: '   ' },
								{ title: 'checkout-service' },
							]}
						/>
						<Breadcrumb aria-label="Empty trail" items={[{ title: '' }, { title: null }]} />
					</div>
				</ShowcaseSection>

				<ShowcaseSection
					title="Menus"
					note="Held open. On the left, a crumb with a menu, such as the siblings of the current page: an entry with an href is a link, one with only an onClick is an action. On the right, the menu behind the ... crumb: the collapsed crumbs in path order, each one a link to that crumb, with no icons. Both triggers keep their hover fill while their menu is open."
					className={styles.roomBelow}
				>
					<div className={styles.menus}>
						<Frame width="32rem">
							<Breadcrumb testId="crumb-menu" items={CRUMB_MENU_TRAIL} />
						</Frame>
						<Frame width="240px">
							<Breadcrumb items={LONG_TRAIL} testId="overflow-menu" />
						</Frame>
					</div>
				</ShowcaseSection>
			</div>
		</div>
	);
}

async function expectCrumbKinds(canvasElement: HTMLElement): Promise<void> {
	const canvas = within(canvasElement);
	const crumb = (name: string): HTMLElement => canvas.getByTestId(`kind-${name}-rest-item-1`);

	await expect(within(crumb('link')).getByRole('link', { name: 'Payments' })).toHaveAttribute(
		'href',
		'/services/payments',
	);
	await expect(within(crumb('button')).getByRole('button', { name: 'Payments' })).toBeVisible();
	await expect(within(crumb('menu')).getByRole('button', { name: 'Payments' })).toHaveAttribute(
		'aria-haspopup',
		'menu',
	);
	await expect(within(crumb('text')).queryByRole('link')).toBeNull();
	await expect(within(crumb('text')).queryByRole('button')).toBeNull();
	await expect(crumb('icon').querySelector('[data-slot="breadcrumb-item-icon"]')).not.toBeNull();

	for (const kind of ['link', 'button', 'menu', 'text']) {
		await expect(crumb(kind)).toHaveAttribute('data-kind', kind);
	}

	// The last crumb is the current page, whatever it does, and no other crumb is.
	await expect(
		canvas.getByTestId('kind-link-rest-item-2').querySelector('[aria-current="page"]'),
	).not.toBeNull();
	await expect(crumb('link').querySelector('[aria-current]')).toBeNull();
}

async function expectOverflow(canvasElement: HTMLElement): Promise<void> {
	const canvas = within(canvasElement);
	const wide = getNav(canvasElement, 'overflow-720px');
	const middle = getNav(canvasElement, 'overflow-480px');
	const narrow = getNav(canvasElement, 'overflow-240px');

	// Room for everything: no `...` crumb, and every crumb in the flow.
	await expect(wide).not.toHaveAttribute('data-overflowing');
	await expect(getEllipsis(wide)).toBeNull();
	await expect(getVisibleCrumbs(wide)).toHaveLength(LONG_TRAIL.length);

	// Some room: the centre goes first, in one run, and the first and the last stay.
	await waitFor(() => expect(middle).toHaveAttribute('data-overflowing'));

	const collapsed = getCollapsedPositions(middle);

	await expect(collapsed).toContain(Math.floor((LONG_TRAIL.length - 1) / 2));
	await expect(Math.max(...collapsed) - Math.min(...collapsed) + 1).toBe(collapsed.length);
	await expect(collapsed).not.toContain(0);
	await expect(collapsed).not.toContain(LONG_TRAIL.length - 1);

	// Little room: only the first and the last crumb, and the `...` crumb for the rest.
	await waitFor(() => expect(getCollapsedPositions(narrow)).toEqual([1, 2, 3, 4, 5]));
	await expect(getEllipsis(narrow)).toBeVisible();
	await expect(canvas.getByTestId('overflow-240px-item-0')).toBeVisible();
	await expect(canvas.getByTestId('overflow-240px-item-6')).toBeVisible();

	for (const index of [1, 2, 3, 4, 5]) {
		await expect(canvas.queryByTestId(`overflow-240px-item-${index}`)).toBeNull();
	}
}

async function expectTextOverflow(canvasElement: HTMLElement): Promise<void> {
	const canvas = within(canvasElement);
	const ellipsis = getNav(canvasElement, 'text-overflow-ellipsis');
	const hidden = getNav(canvasElement, 'text-overflow-hidden');
	const long = getContent(canvas.getByTestId('text-overflow-ellipsis-item-1'));

	await expect(ellipsis).not.toHaveAttribute('data-overflowing');
	await expect(getContent(canvas.getByTestId('text-overflow-ellipsis-item-0'))).not.toHaveAttribute(
		'data-truncated',
	);
	await waitFor(() => expect(long).toHaveAttribute('data-truncated'));
	await expect(getLabel(long)).toHaveTextContent(LONG_TITLE);

	await expect(hidden).toHaveAttribute('data-text-overflow', 'hidden');
	await expect(hidden.querySelector('[data-truncated]')).toBeNull();

	const clipped = getLabel(canvas.getByTestId('text-overflow-hidden-item-1'));

	await expect(clipped.scrollWidth).toBeGreaterThan(clipped.clientWidth);
	await expect(getComputedStyle(clipped).textOverflow).toBe('clip');
}

async function expectMaxVisible(canvasElement: HTMLElement): Promise<void> {
	const canvas = within(canvasElement);

	await expect(getEllipsis(getNav(canvasElement, 'max-visible-none'))).toBeNull();

	for (const count of MAX_VISIBLE_COUNTS) {
		const nav = getNav(canvasElement, `max-visible-${count}`);

		await waitFor(() => expect(getVisibleCrumbs(nav)).toHaveLength(count));
		await expect(getEllipsis(nav)).toHaveAccessibleName(
			`Show ${LONG_TRAIL.length - count} hidden items`,
		);
		await expect(canvas.getByTestId(`max-visible-${count}-item-0`)).toBeVisible();
		await expect(
			canvas.getByTestId(`max-visible-${count}-item-${LONG_TRAIL.length - 1}`),
		).toBeVisible();
	}
}

async function expectWrapping(canvasElement: HTMLElement): Promise<void> {
	const canvas = within(canvasElement);
	const top = (testId: string): number => canvas.getByTestId(testId).getBoundingClientRect().top;
	const wrapped = getNav(canvasElement, 'wrap-off');

	await expect(wrapped).toHaveAttribute('data-truncate', 'false');
	await expect(getEllipsis(wrapped)).toBeNull();
	await expect(getVisibleCrumbs(wrapped)).toHaveLength(LONG_TRAIL.length);
	await expect(top('wrap-off-item-6')).toBeGreaterThan(top('wrap-off-item-0'));

	await expect(getEllipsis(getNav(canvasElement, 'wrap-on'))).not.toBeNull();
	await expect(top('wrap-on-item-6')).toBeCloseTo(top('wrap-on-item-0'), 0);
}

async function expectSeparators(canvasElement: HTMLElement): Promise<void> {
	const canvas = within(canvasElement);

	for (const [index, separator] of SEPARATORS.entries()) {
		const mark = canvas.getByTestId(`separator-${index}-item-separator-1`);

		await expect(mark).toHaveTextContent(separator);
		await expect(mark).toHaveAttribute('aria-hidden', 'true');
	}
}

/**
 * Opens the menu behind `trigger` and returns the rows of the popup that holds `rowIdPrefix`.
 * Base UI opens a menu on `mousedown`.
 */
async function openMenuRows(trigger: HTMLElement, rowIdPrefix: string): Promise<HTMLElement[]> {
	fireEvent.mouseDown(trigger);

	return waitFor(() => {
		const popup = document.querySelector<HTMLElement>(
			`[data-slot="dropdown-popup"]:has([data-testid^="${rowIdPrefix}"])`,
		);

		expect(popup).not.toBeNull();

		return within(popup as HTMLElement).getAllByRole('menuitem');
	});
}

async function expectRouterLinks(canvasElement: HTMLElement): Promise<void> {
	const canvas = within(canvasElement);
	const location = canvas.getByTestId('router-location');
	const payments = within(canvas.getByTestId('router-wide-item-1')).getByRole('link', {
		name: 'Payments',
	});

	await expect(payments).toHaveAttribute('href', '/services/payments');
	await expect(payments).toHaveAttribute('data-router-link');
	await expect(canvas.getByTestId('router-wide-item-5')).toHaveAttribute('data-kind', 'text');
	await expect(canvas.getByTestId('router-wide-item-5').querySelector('a')).toBeNull();

	// A collapsed crumb is still a router link: its row is drawn by the element, so it keeps the route
	// and the click that moves the location.
	const narrow = getNav(canvasElement, 'router-narrow');

	await waitFor(() => expect(getEllipsis(narrow)).not.toBeNull());

	const hiddenRoutes = getCollapsedPositions(narrow).map((position) =>
		getRoute(ROUTER_TRAIL[position] as BreadcrumbItemType),
	);
	const hiddenRows = await openMenuRows(getEllipsis(narrow) as HTMLElement, 'router-narrow-item-');

	await expect(hiddenRows.map((row) => row.getAttribute('href'))).toEqual(hiddenRoutes);

	for (const row of hiddenRows) {
		await expect(row).toHaveAttribute('data-router-link');
	}

	await userEvent.click(hiddenRows[0] as HTMLElement);
	await waitFor(() => expect(location).toHaveTextContent(hiddenRoutes[0] as string));

	// The entries of a crumb's own menu take a `render` the same way, and an entry with none stays
	// an action.
	const menuRows = await openMenuRows(
		canvas.getByTestId('router-menu-item-2-menu'),
		'router-menu-item-2-menu-item-',
	);

	await expect(menuRows).toHaveLength(3);
	await expect(menuRows.map((row) => row.getAttribute('href'))).toEqual([
		'/services/payments/billing-service',
		'/services/payments/checkout-service',
		null,
	]);
	await expect(menuRows[0]).toHaveAttribute('data-router-link');
	await expect(menuRows[2]).not.toHaveAttribute('data-router-link');

	await userEvent.click(menuRows[0] as HTMLElement);
	await waitFor(() => expect(location).toHaveTextContent('/services/payments/billing-service'));
	await waitFor(() => expect(document.querySelector('[data-slot="dropdown-popup"]')).toBeNull());
}

async function expectEmptyTitles(canvasElement: HTMLElement): Promise<void> {
	const canvas = within(canvasElement);
	const nav = getNav(canvasElement, 'empty');

	await expect(getVisibleCrumbs(nav).map((crumb) => crumb.textContent)).toEqual([
		'Services',
		'Payments',
		'checkout-service',
	]);

	for (const index of [1, 3, 4]) {
		await expect(canvas.queryByTestId(`empty-item-${index}`)).toBeNull();
	}

	await expect(canvas.queryByRole('navigation', { name: 'Empty trail' })).toBeNull();
}

async function expectHeldOpenMenus(canvasElement: HTMLElement): Promise<void> {
	const canvas = within(canvasElement);

	await waitFor(() => expect(canvas.getByTestId('overflow-menu-ellipsis')).toBeVisible());

	// Base UI opens a menu on `mousedown`, and an open menu dismisses itself on a press outside it,
	// on a document listener it only registers once it has settled. Opening both in one synchronous
	// block beats that listener, which leaves both open in the same snapshot.
	for (const testId of HELD_OPEN_MENUS) {
		fireEvent.mouseDown(canvas.getByTestId(testId));
	}

	await waitFor(() =>
		expect(document.querySelectorAll('[data-slot="dropdown-popup"]')).toHaveLength(
			HELD_OPEN_MENUS.length,
		),
	);

	const rows = (testId: string): HTMLElement[] => {
		const popup = document.querySelector<HTMLElement>(
			`[data-slot="dropdown-popup"]:has([data-testid^="${testId}-"])`,
		);

		if (popup === null) {
			throw new Error(`Breadcrumb story: no open menu for ${testId}.`);
		}

		return within(popup).getAllByRole('menuitem');
	};

	await expect(rows('crumb-menu-item-2-menu').map((row) => row.textContent)).toEqual([
		'billing-service',
		'checkout-service',
		'refund-service',
		'Create service',
	]);
	await expect(rows('overflow-menu-item').map((row) => row.getAttribute('href'))).toEqual(
		LONG_TRAIL.slice(1, 6).map((item) => item.href),
	);
}

/**
 * Every kind of crumb in every state, every overflow step, both text overflows, `maxVisible`,
 * wrapping, separators, router links and empty titles in one snapshot. Hover and focus are held by
 * `storybook-addon-pseudo-states`, both kinds of menu are held open, and the tooltip of a shortened
 * crumb is held open.
 */
export const BreadcrumbShowcase: Story = {
	parameters: {
		layout: 'fullscreen',
		controls: { disable: true },
		chromatic: { disableSnapshot: false, modes: allModes },
		design: { type: 'figma', url: `${FIGMA_FILE}?node-id=6854-45&p=f&m=dev` },
		pseudo: {
			hover:
				'[data-state-cell="hover"] [data-slot="breadcrumb-item"][data-position="middle"] [data-slot="breadcrumb-item-content"]:is(a, button)',
			focusVisible:
				'[data-state-cell="focus"] [data-slot="breadcrumb-item"][data-position="middle"] [data-slot="breadcrumb-item-content"]:is(a, button)',
		},
	},
	play: async ({ canvasElement }) => {
		await waitForEffects();

		await expectCrumbKinds(canvasElement);
		await expectOverflow(canvasElement);
		await expectTextOverflow(canvasElement);
		await expectMaxVisible(canvasElement);
		await expectWrapping(canvasElement);
		await expectSeparators(canvasElement);
		await expectRouterLinks(canvasElement);
		await expectEmptyTitles(canvasElement);
		await expectHeldOpenMenus(canvasElement);

		// The tooltip goes last, and by hover rather than a press, which would dismiss both menus.
		const shrinking = getNav(canvasElement, 'shrinking-260px');
		const shortened = getContent(within(shrinking).getByTestId('shrinking-260px-item-3'));

		await waitFor(() => expect(shrinking).toHaveAttribute('data-shrinking'));
		await expect(getEllipsis(shrinking)).toBeVisible();
		await expect(shortened).toHaveAttribute('aria-current', 'page');
		await waitFor(() => expect(shortened).toHaveAttribute('data-truncated'));
		fireEvent.pointerEnter(shortened);
		fireEvent.mouseEnter(shortened);
		fireEvent.mouseMove(shortened);

		await waitFor(() =>
			expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveTextContent(
				SHRINKING_TITLE,
			),
		);
	},
	render: () => <BreadcrumbShowcaseLayout />,
};
