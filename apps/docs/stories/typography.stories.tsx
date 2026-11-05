import { ExternalLink, SolidAlertCircle, SolidCheckCircle2 } from '@signozhq/icons';
import { Typography, type TypographyColorType, type TypographyProps } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { forwardRef, Fragment, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { waitForEffects } from './shared/play.js';
import {
	COLORS,
	LONG_TEXT,
	SENTENCE,
	typographyArgTypes,
	typographyParameters,
	WEIGHT_NUMBERS,
	WEIGHTS,
} from './shared/typography-arg-types.js';
import styles from './typography.stories.module.css';

type TextStyle = TypographyProps extends infer Props
	? Props extends { variant: infer Variant; size: infer Size }
		? { variant: Variant; size: Size }
		: never
	: never;

const TEXT_STYLES: TextStyle[] = [
	{ variant: 'label', size: 'large' },
	{ variant: 'label', size: 'medium' },
	{ variant: 'label', size: 'base' },
	{ variant: 'label', size: 'small' },
	{ variant: 'uppercase', size: 'base' },
	{ variant: 'uppercase', size: 'small' },
	{ variant: 'code', size: 'base' },
	{ variant: 'code', size: 'small' },
	{ variant: 'paragraph', size: 'medium' },
	{ variant: 'paragraph', size: 'base' },
	{ variant: 'paragraph', size: 'small' },
];

const caption = {
	variant: 'code',
	size: 'small',
	weight: 'regular',
	color: 'tertiary',
} as const;

const BOX_PROPERTIES = [
	'margin',
	'padding',
	'max-width',
	'gap',
	'align-items',
	'justify-content',
	'text-align',
	'font-variant-numeric',
	'white-space',
	'overflow',
	'text-overflow',
	'-webkit-line-clamp',
];

function capitalize(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function readStyle(node: Element, names: string[]): Record<string, string> {
	const style = getComputedStyle(node);

	return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name)]));
}

function Caption({ children }: { children: string }) {
	return (
		<Typography {...caption} as="span" textOverflow="visible">
			{children}
		</Typography>
	);
}

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="story-section">
			<Typography
				variant="paragraph"
				size="base"
				weight="bold"
				color="main"
				as="h2"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="secondary"
				as="p"
				textOverflow="wrap"
			>
				{description}
			</Typography>
			{children}
		</div>
	);
}

const OVERFLOWS = [
	{ textOverflow: 'wrap' },
	{ textOverflow: 'visible' },
	{ textOverflow: 'hidden' },
	{ textOverflow: 'ellipsis' },
] as const;

const DURATIONS = [
	['frontend', '1,111.10'],
	['checkout', '848.06'],
	['payments', '11.71'],
	['redis', '0.98'],
] as const;

const RouterLink = forwardRef<
	HTMLAnchorElement,
	AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
>(function RouterLink({ to, ...props }, ref) {
	// eslint-disable-next-line jsx-a11y/anchor-has-content -- the children arrive through `props`.
	return <a ref={ref} href={to} {...props} />;
});

const meta: Meta<typeof Typography> = {
	title: 'Primitive Components/Typography',
	component: Typography,
	parameters: {
		...typographyParameters,
		docs: {
			description: {
				component:
					'Text in one of the 33 Periscope text styles. Every font property and the layout come from props.',
			},
		},
	},
	argTypes: typographyArgTypes,
	args: {
		variant: 'paragraph',
		size: 'base',
		weight: 'regular',
		color: 'main',
		as: 'p',
		textOverflow: 'wrap',
		children: SENTENCE,
	},
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Playground: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<div className="story-container-lg">
			<Typography {...args} />
		</div>
	),
};

/**
 * Every text style, every color, the four overflows, the layouts, the number features, nested text,
 * the elements and `Typography.Link`, all in one snapshot. The cut `ellipsis` text has its tooltip
 * opened by `play`, so the snapshot carries it.
 */
export const TypographyShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const hovered = canvas.getByTestId('overflow-ellipsis-hovered');
		const flex = canvas.getByTestId('layout-flex-ellipsis');

		await waitFor(() =>
			expect(canvas.getByTestId('overflow-ellipsis')).toHaveAttribute('data-truncated'),
		);
		await waitFor(() => expect(hovered).toHaveAttribute('data-truncated'));
		await waitFor(() =>
			expect(canvas.getByTestId('overflow-ellipsis-2')).toHaveAttribute('data-truncated'),
		);
		await waitFor(() => expect(flex).toHaveAttribute('data-truncated'));
		expect(canvas.getByTestId('overflow-wrap')).not.toHaveAttribute('data-truncated');
		for (const testId of ['overflow-hidden', 'overflow-ellipsis']) {
			const style = getComputedStyle(canvas.getByTestId(testId));
			expect([style.overflowX, style.overflowY]).toEqual(['clip', 'visible']);
		}
		expect(getComputedStyle(canvas.getByTestId('overflow-ellipsis-2')).overflowY).toBe('hidden');
		expect(flex.querySelector('svg')?.getBoundingClientRect().width).toBe(12);
		const nestedText = canvas.getByTestId('layout-flex-nested-text');
		await waitFor(() => expect(nestedText).toHaveAttribute('data-truncated'));
		expect(nestedText.getBoundingClientRect().right).toBeLessThanOrEqual(
			canvas.getByTestId('layout-flex-nested').getBoundingClientRect().right,
		);
		const spaced = getComputedStyle(canvas.getByTestId('layout-spacing'));
		expect([spaced.marginTop, spaced.marginBottom, spaced.marginLeft]).toEqual([
			'8px',
			'8px',
			'0px',
		]);
		expect([spaced.paddingTop, spaced.paddingLeft]).toEqual(['4px', '8px']);
		const inner = canvas.getByTestId('nested-inner');
		const alone = inner.cloneNode(true) as HTMLElement;
		canvasElement.append(alone);
		const names = [
			...Array.from(getComputedStyle(canvas.getByTestId('nested-outer'))).filter((name) =>
				name.startsWith('--typography-internal-'),
			),
			...BOX_PROPERTIES,
		];
		const nested = readStyle(inner, names);
		const standalone = readStyle(alone, names);
		alone.remove();
		expect(names).toEqual(
			expect.arrayContaining(['--typography-internal-margin', '--typography-internal-max-lines']),
		);
		expect(nested).toEqual(standalone);
		await waitForEffects();

		fireEvent.pointerEnter(hovered);
		fireEvent.mouseEnter(hovered);
		fireEvent.mouseMove(hovered);

		await waitFor(() =>
			expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveTextContent(LONG_TEXT),
		);
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section
				title="Text styles"
				description={
					<>
						The 33 text styles, named the way Figma names them: <code>variant</code>,{' '}
						<code>size</code> and <code>weight</code> are the three parts of{' '}
						<code>Label / Base / 500</code>.
					</>
				}
			>
				<div className={styles.styleTable}>
					{TEXT_STYLES.flatMap((style) =>
						WEIGHTS.map((weight) => (
							<Fragment key={`${style.variant}-${style.size}-${weight}`}>
								<Caption>{`${capitalize(style.variant)} / ${capitalize(style.size)} / ${WEIGHT_NUMBERS[weight]}`}</Caption>
								<Typography
									{...style}
									weight={weight}
									color="main"
									as="span"
									textOverflow="visible"
								>
									Before we knew, we got some cake.
								</Typography>
							</Fragment>
						)),
					)}
				</div>
			</Section>

			<Section
				title="Colors"
				description={
					<>
						Each hue draws in the label color of an outlined Badge of the same <code>color</code>.{' '}
						<code>inherit</code> takes the color of the parent element, here a red one.
					</>
				}
			>
				<div className={styles.styleTable}>
					{COLORS.filter(
						(color): color is Exclude<TypographyColorType, 'inherit'> => color !== 'inherit',
					).map((color) => (
						<Fragment key={color}>
							<Caption>{color}</Caption>
							<Typography
								variant="paragraph"
								size="base"
								weight="medium"
								color={color}
								as="span"
								textOverflow="visible"
							>
								{SENTENCE}
							</Typography>
						</Fragment>
					))}
					<Caption>inherit</Caption>
					<span className={styles.inheritParent}>
						<Typography
							variant="paragraph"
							size="base"
							weight="medium"
							color="inherit"
							as="span"
							textOverflow="visible"
						>
							{SENTENCE}
						</Typography>
					</span>
				</div>
			</Section>

			<Section
				title="Overflow"
				description={
					<>
						The same long text in a 240px box with each <code>textOverflow</code>. While an{' '}
						<code>ellipsis</code> text is cut, hovering it opens a tooltip with the full text.
					</>
				}
			>
				<div className={styles.overflowList}>
					{OVERFLOWS.map((overflow) => (
						<div key={overflow.textOverflow} className={styles.overflowRow}>
							<Caption>{`textOverflow="${overflow.textOverflow}"`}</Caption>
							<div className={styles.overflowBox}>
								<Typography
									variant="paragraph"
									size="base"
									weight="regular"
									color="main"
									as="p"
									{...overflow}
									testId={`overflow-${overflow.textOverflow}`}
								>
									{LONG_TEXT}
								</Typography>
							</div>
						</div>
					))}
					<div className={styles.overflowRow}>
						<Caption>{'textOverflow="ellipsis" maxLines={2}'}</Caption>
						<div className={styles.overflowBox}>
							<Typography
								variant="paragraph"
								size="base"
								weight="regular"
								color="main"
								as="p"
								textOverflow="ellipsis"
								maxLines={2}
								testId="overflow-ellipsis-2"
							>
								{LONG_TEXT}
							</Typography>
						</div>
					</div>
					<div className={`${styles.overflowRow} ${styles.hoveredRow}`}>
						<div className={styles.overflowBox}>
							<Typography
								variant="paragraph"
								size="base"
								weight="regular"
								color="main"
								as="p"
								textOverflow="ellipsis"
								testId="overflow-ellipsis-hovered"
							>
								{LONG_TEXT}
							</Typography>
						</div>
						<Caption>{'textOverflow="ellipsis", hovered'}</Caption>
					</div>
				</div>
			</Section>

			<Section
				title="Layout"
				description={
					<>
						A <code>flex</code> text lays out an icon and the text in one row, and only the text
						cuts. A text inside it cuts on its own. An <code>inline-block</code> text has a box and
						stays in the line. <code>align</code> aligns the lines of a block. The margin and
						padding props take steps of the spacing scale, each 2px, for all sides, two or one.
					</>
				}
			>
				<div className={styles.overflowList}>
					<div className={styles.overflowRow}>
						<Caption>{'display="inline-flex" gap={2}'}</Caption>
						<Typography
							variant="label"
							size="base"
							weight="medium"
							color="success"
							as="span"
							display="inline-flex"
							gap={2}
							textOverflow="visible"
						>
							<SolidCheckCircle2 size={12} />
							Healthy
						</Typography>
					</div>
					<div className={styles.overflowRow}>
						<Caption>{'display="inline-block" minWidth={80}'}</Caption>
						<span>
							<Typography
								variant="label"
								size="base"
								weight="medium"
								color="secondary"
								as="span"
								display="inline-block"
								minWidth={80}
								textOverflow="visible"
							>
								Service
							</Typography>
							<Typography
								variant="label"
								size="base"
								weight="medium"
								color="main"
								as="span"
								textOverflow="visible"
							>
								checkout
							</Typography>
						</span>
					</div>
					<div className={styles.overflowRow}>
						<Caption>{'display="flex" textOverflow="ellipsis"'}</Caption>
						<div className={styles.overflowBox}>
							<Typography
								variant="label"
								size="base"
								weight="medium"
								color="danger"
								as="div"
								display="flex"
								gap={2}
								textOverflow="ellipsis"
								testId="layout-flex-ellipsis"
							>
								<SolidAlertCircle size={12} />
								{LONG_TEXT}
							</Typography>
						</div>
					</div>
					<div className={styles.overflowRow}>
						<Caption>{'display="flex", a text inside with textOverflow="ellipsis"'}</Caption>
						<div className={styles.overflowBox}>
							<Typography
								variant="label"
								size="base"
								weight="medium"
								color="main"
								as="div"
								display="flex"
								gap={2}
								textOverflow="visible"
								testId="layout-flex-nested"
							>
								<SolidCheckCircle2 size={12} />
								<Typography
									variant="label"
									size="base"
									weight="regular"
									color="secondary"
									as="span"
									display="block"
									textOverflow="ellipsis"
									testId="layout-flex-nested-text"
								>
									{LONG_TEXT}
								</Typography>
							</Typography>
						</div>
					</div>
					{(['start', 'center', 'end'] as const).map((align) => (
						<div key={align} className={styles.overflowRow}>
							<Caption>{`align="${align}"`}</Caption>
							<div className={styles.layoutBox}>
								<Typography
									variant="paragraph"
									size="base"
									weight="regular"
									color="main"
									as="p"
									align={align}
									textOverflow="wrap"
								>
									{SENTENCE}
								</Typography>
							</div>
						</div>
					))}
					<div className={styles.overflowRow}>
						<Caption>{'marginY={4} paddingY={2} paddingX={4}'}</Caption>
						<div className={styles.layoutBox}>
							<Typography
								variant="paragraph"
								size="base"
								weight="regular"
								color="main"
								as="p"
								marginY={4}
								paddingY={2}
								paddingX={4}
								textOverflow="wrap"
								testId="layout-spacing"
							>
								{SENTENCE}
							</Typography>
						</div>
					</div>
				</div>
			</Section>

			<Section
				title="Numbers"
				description={
					<>
						Digits are proportional by default. <code>tabularNumbers</code> goes on the number only,
						where digits line up or change in place, and the unit stays outside it.{' '}
						<code>slashedZero</code> goes on ids and hashes.
					</>
				}
			>
				<div className={styles.numbers}>
					{([false, true] as const).map((tabularNumbers) => (
						<div key={String(tabularNumbers)} className={styles.numbersColumn}>
							<Caption>{tabularNumbers ? 'tabularNumbers' : 'proportional'}</Caption>
							{DURATIONS.map(([service, duration]) => (
								<div key={service} className={styles.numbersRow}>
									<Typography
										variant="label"
										size="base"
										weight="regular"
										color="secondary"
										as="span"
										textOverflow="visible"
									>
										{service}
									</Typography>
									<Typography
										variant="label"
										size="base"
										weight="regular"
										color="main"
										as="span"
										display="block"
										align="end"
										width={80}
										textOverflow="visible"
										tabularNumbers={tabularNumbers}
									>
										{duration}
									</Typography>
									<Typography
										variant="label"
										size="base"
										weight="regular"
										color="tertiary"
										as="span"
										textOverflow="visible"
									>
										ms
									</Typography>
								</div>
							))}
						</div>
					))}
					<div className={styles.numbersColumn}>
						<Caption>slashedZero</Caption>
						<Typography
							variant="code"
							size="base"
							weight="regular"
							color="main"
							as="code"
							textOverflow="visible"
							slashedZero
						>
							4f0a-27b0-0O
						</Typography>
					</div>
				</div>
			</Section>

			<Section
				title="Nested text"
				description={
					<>
						A <code>Typography</code> inside another one states its own style. A bold word repeats
						the style of the sentence and changes only <code>weight</code>.
					</>
				}
			>
				<div className={styles.layoutBox}>
					<Typography
						variant="paragraph"
						size="base"
						weight="regular"
						color="secondary"
						as="p"
						textOverflow="wrap"
					>
						Logs are kept for{' '}
						<Typography
							variant="paragraph"
							size="base"
							weight="bold"
							color="main"
							as="span"
							textOverflow="wrap"
						>
							15 days
						</Typography>
						, then archived.
					</Typography>
				</div>
				<div className={styles.layoutBox}>
					<Typography
						variant="paragraph"
						size="base"
						weight="medium"
						color="secondary"
						as="div"
						display="flex"
						gap={4}
						align="end"
						verticalAlign="baseline"
						width="100%"
						minWidth={120}
						maxWidth={280}
						margin={2}
						padding={2}
						textOverflow="ellipsis"
						maxLines={2}
						tabularNumbers
						slashedZero
						testId="nested-outer"
					>
						Retention
						<Typography
							variant="paragraph"
							size="small"
							weight="regular"
							color="main"
							as="span"
							display="block"
							textOverflow="wrap"
							testId="nested-inner"
						>
							15 days, then archived
						</Typography>
					</Typography>
				</div>
			</Section>

			<Section
				title="Elements"
				description={
					<>
						<code>as</code> picks the element, never the look. A heading takes its size and weight
						from the props.
					</>
				}
			>
				<div className={styles.overflowList}>
					<Typography
						variant="label"
						size="large"
						weight="bold"
						color="main"
						as="h3"
						textOverflow="wrap"
					>
						Dashboards
					</Typography>
					<Typography
						variant="uppercase"
						size="small"
						weight="medium"
						color="secondary"
						as="h4"
						textOverflow="wrap"
					>
						Recently viewed
					</Typography>
					<ul className={styles.list}>
						{['Kubernetes overview', 'Checkout latency', 'Redis'].map((name) => (
							<Typography
								key={name}
								variant="paragraph"
								size="base"
								weight="regular"
								color="main"
								as="li"
								textOverflow="wrap"
							>
								{name}
							</Typography>
						))}
					</ul>
				</div>
			</Section>

			<Section
				title="Typography.Link"
				description={
					<>
						Inside a sentence, a link repeats the <code>variant</code> and <code>size</code> of the
						sentence. A <code>flex</code> link lays out an icon next to its text, and a router link
						goes through <code>render</code>.
					</>
				}
			>
				<div className={styles.overflowList}>
					<div className={styles.layoutBox}>
						<Typography
							variant="paragraph"
							size="base"
							weight="regular"
							color="main"
							as="p"
							textOverflow="wrap"
						>
							Traces are sampled at 10%. Read the{' '}
							<Typography.Link
								variant="paragraph"
								size="base"
								weight="regular"
								textOverflow="wrap"
								href="https://signoz.io/docs"
								target="_blank"
							>
								sampling docs
							</Typography.Link>{' '}
							to change it.
						</Typography>
					</div>
					<Typography.Link
						variant="label"
						size="base"
						weight="medium"
						display="inline-flex"
						gap={2}
						textOverflow="visible"
						href="https://signoz.io/docs"
						target="_blank"
					>
						Open the docs
						<ExternalLink size={12} />
					</Typography.Link>
					<Typography.Link
						variant="label"
						size="small"
						weight="medium"
						textOverflow="visible"
						render={<RouterLink to="/settings" />}
					>
						Settings
					</Typography.Link>
				</div>
			</Section>
		</div>
	),
};
