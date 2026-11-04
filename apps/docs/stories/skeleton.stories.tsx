import { Button, Skeleton, type SkeletonProps, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { SIZES, skeletonArgTypes, skeletonParameters } from './shared/skeleton-arg-types.js';
import styles from './skeleton.stories.module.css';

const meta: Meta<typeof Skeleton> = {
	title: 'Primitive Components/Skeleton',
	component: Skeleton,
	parameters: {
		...skeletonParameters,
		docs: {
			description: {
				component:
					'A placeholder that keeps the shape of content while it loads, so the layout does not jump when the data arrives.',
			},
		},
	},
	argTypes: skeletonArgTypes,
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	parameters: {
		// Every state it can be driven into is covered by `SkeletonShowcase`.
		chromatic: { disableSnapshot: true },
	},
	args: {
		title: { width: '38%' },
		paragraph: { rows: 3 },
	},
};

function Row({ label, children }: { label: string; children: ReactElement }): ReactElement {
	return (
		<>
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="main"
				as="span"
				textOverflow="visible"
			>
				{label}
			</Typography>
			{children}
		</>
	);
}

const TEXT_BLOCKS: Array<{ label: string; props: SkeletonProps }> = [
	{ label: 'default', props: {} },
	{ label: 'title width 60%', props: { title: { width: '60%' } } },
	{ label: 'title width 120', props: { title: { width: 120 } } },
	{ label: 'no title', props: { title: false } },
	{ label: 'no paragraph', props: { paragraph: false } },
	{ label: '0 rows', props: { paragraph: { rows: 0 } } },
	{ label: '1 row', props: { paragraph: { rows: 1 } } },
	{ label: '6 rows', props: { paragraph: { rows: 6 } } },
	{ label: 'one width for every row', props: { paragraph: { rows: 3, width: '60%' } } },
	{
		label: 'one width per row',
		props: { paragraph: { rows: 4, width: ['100%', '90%', '70%'] } },
	},
];

const WIDTHS: Array<{ label: string; part: ReactElement }> = [
	{ label: 'fills the parent', part: <Skeleton.Input size="sm" /> },
	{ label: 'width 240', part: <Skeleton.Input size="sm" width={240} /> },
	{ label: 'width 50%', part: <Skeleton.Input size="sm" width="50%" /> },
	{ label: 'maxWidth 200', part: <Skeleton.Input size="sm" maxWidth={200} /> },
	{ label: 'Skeleton, width 240', part: <Skeleton width={240} paragraph={{ rows: 2 }} /> },
	{ label: 'Skeleton, maxWidth 60%', part: <Skeleton maxWidth="60%" paragraph={{ rows: 2 }} /> },
	{ label: 'Button, width 120', part: <Skeleton.Button size="md" width={120} /> },
	{ label: 'Button, width 100%', part: <Skeleton.Button size="md" width="100%" /> },
];

const PART_ROWS: Array<{ label: string; render: (size: (typeof SIZES)[number]) => ReactElement }> =
	[
		{ label: 'Input', render: (size) => <Skeleton.Input size={size} /> },
		{ label: 'Input, width 120', render: (size) => <Skeleton.Input size={size} width={120} /> },
		{ label: 'Button', render: (size) => <Skeleton.Button size={size} /> },
		{ label: 'Button, width 120', render: (size) => <Skeleton.Button size={size} width={120} /> },
		{ label: 'Button, width 100%', render: (size) => <Skeleton.Button size={size} width="100%" /> },
		{ label: 'Avatar, circle', render: (size) => <Skeleton.Avatar size={size} shape="circle" /> },
		{ label: 'Avatar, square', render: (size) => <Skeleton.Avatar size={size} shape="square" /> },
	];

const SURFACES = ['surface-1', 'surface-2', 'surface-3'] as const;

const CELLS = [
	{ label: '12rem', className: styles.cellWide },
	{ label: '6rem', className: styles.cellMedium },
	{ label: '3rem', className: styles.cellNarrow },
];

function matrixStyle(columns: number): CSSProperties {
	return { '--matrix-columns': columns } as CSSProperties;
}

const SERVICES = ['checkout', 'payments', 'inventory', 'search'];

function LoadingRegion(): ReactElement {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div className={styles.stack}>
			<div className={styles.card} aria-busy={isLoading} data-testid="service-region">
				<output className={styles.srOnly}>{isLoading ? 'Loading the service summary' : ''}</output>
				{isLoading ? (
					<Skeleton testId="service-skeleton" />
				) : (
					<div className={styles.loaded}>
						<Typography
							variant="label"
							size="base"
							weight="bold"
							color="main"
							as="p"
							textOverflow="wrap"
						>
							checkout
						</Typography>
						<Typography
							variant="paragraph"
							size="small"
							weight="regular"
							color="secondary"
							as="p"
							textOverflow="wrap"
						>
							P99 latency is 240 ms and the error rate is 0.4% over the last hour.
						</Typography>
					</div>
				)}
			</div>
			<div>
				<Button
					size="sm"
					variant="outlined"
					color="secondary"
					onClick={() => setIsLoading((current) => !current)}
				>
					{isLoading ? 'Finish loading' : 'Load again'}
				</Button>
			</div>
		</div>
	);
}

/**
 * Text blocks, the three placeholders in both sizes, widths, the surfaces, a narrow parent and the
 * compositions, all in one snapshot. The shimmer only moves with the Motion toolbar item on live.
 * The play function toggles the busy region both ways and blurs the button, so the
 * snapshot keeps it loading with no focus ring.
 */
export const SkeletonShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	argTypes: {
		active: { control: false },
		title: { control: false },
		paragraph: { control: false },
		width: { control: false },
		maxWidth: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography
					variant="label"
					size="base"
					weight="bold"
					color="main"
					as="p"
					textOverflow="wrap"
				>
					Active and static
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					The shimmer plays by default: a band moves across each bar, and stops with{' '}
					<Typography
						variant="code"
						size="small"
						weight="regular"
						color="inherit"
						as="code"
						textOverflow="wrap"
					>
						prefers-reduced-motion: reduce
					</Typography>
					. Pass{' '}
					<Typography
						variant="code"
						size="small"
						weight="regular"
						color="inherit"
						as="code"
						textOverflow="wrap"
					>
						active={'{false}'}
					</Typography>{' '}
					for a still fill.
				</Typography>
				<div className={`${styles.textRows} ${styles.marginTopMedium}`}>
					<Row label="Skeleton">
						<Skeleton />
					</Row>
					<Row label="Skeleton, active={false}">
						<Skeleton active={false} />
					</Row>
					<Row label="Input">
						<Skeleton.Input size="md" />
					</Row>
					<Row label="Input, active={false}">
						<Skeleton.Input active={false} size="md" />
					</Row>
					<Row label="Button">
						<Skeleton.Button size="md" />
					</Row>
					<Row label="Button, active={false}">
						<Skeleton.Button active={false} size="md" />
					</Row>
					<Row label="Avatar">
						<Skeleton.Avatar size="md" />
					</Row>
					<Row label="Avatar, active={false}">
						<Skeleton.Avatar active={false} size="md" />
					</Row>
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="label"
					size="base"
					weight="bold"
					color="main"
					as="p"
					textOverflow="wrap"
				>
					Title and rows
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					A title bar and three rows by default. A row with no width in the array is full width.
				</Typography>
				<div className={`${styles.textRows} ${styles.marginTopMedium}`}>
					{TEXT_BLOCKS.map(({ label, props }) => (
						<Row key={label} label={label}>
							<Skeleton {...props} />
						</Row>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="label"
					size="base"
					weight="bold"
					color="main"
					as="p"
					textOverflow="wrap"
				>
					Placeholders for controls
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					Both sizes have the height of the control they stand for. The button keeps the width of
					its size unless{' '}
					<Typography
						variant="code"
						size="small"
						weight="regular"
						color="inherit"
						as="code"
						textOverflow="wrap"
					>
						width
					</Typography>{' '}
					says otherwise.
				</Typography>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(SIZES.length)}
				>
					<span />
					{SIZES.map((size) => (
						<Typography
							variant="label"
							size="base"
							weight="medium"
							color="main"
							as="span"
							key={size}
							textOverflow="visible"
						>
							{size}
						</Typography>
					))}
					{PART_ROWS.map(({ label, render }) => (
						<Fragment key={label}>
							<Typography
								variant="label"
								size="base"
								weight="medium"
								color="main"
								as="span"
								textOverflow="visible"
							>
								{label}
							</Typography>
							{SIZES.map((size) => (
								<Fragment key={size}>{render(size)}</Fragment>
							))}
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="label"
					size="base"
					weight="bold"
					color="main"
					as="p"
					textOverflow="wrap"
				>
					Width and max width
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					Without{' '}
					<Typography
						variant="code"
						size="small"
						weight="regular"
						color="inherit"
						as="code"
						textOverflow="wrap"
					>
						width
					</Typography>
					, the skeleton and the input placeholder fill the parent. The parent here is 24rem wide.
				</Typography>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					{WIDTHS.map(({ label, part }) => (
						<Row key={label} label={label}>
							{part}
						</Row>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="label"
					size="base"
					weight="bold"
					color="main"
					as="p"
					textOverflow="wrap"
				>
					Narrow parent
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					The skeleton never grows past its parent, so a width of 400 stops at the cell.
				</Typography>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					{CELLS.map(({ label, className }) => (
						<Row key={label} label={label}>
							<div className={className}>
								<Skeleton.Input size="sm" width={400} />
							</div>
						</Row>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="label"
					size="base"
					weight="bold"
					color="main"
					as="p"
					textOverflow="wrap"
				>
					Surfaces
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					The same skeleton on each surface.
				</Typography>
				<div className={`${styles.surfaces} ${styles.marginTopMedium}`}>
					{SURFACES.map((surface) => (
						<div key={surface} className={styles.surface} data-surface={surface}>
							<Typography
								variant="label"
								size="base"
								weight="medium"
								color="main"
								as="span"
								textOverflow="visible"
							>
								{surface}
							</Typography>
							<Skeleton paragraph={{ rows: 2 }} />
							<Skeleton.Input size="md" />
							<div className={styles.surfaceParts}>
								<Skeleton.Avatar size="md" />
								<Skeleton.Avatar size="md" shape="square" />
								<Skeleton.Button size="md" />
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="label"
					size="base"
					weight="bold"
					color="main"
					as="p"
					textOverflow="wrap"
				>
					Compositions
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="secondary"
					as="p"
					textOverflow="wrap"
				>
					The parts sit together. Each region that is loading carries{' '}
					<Typography
						variant="code"
						size="small"
						weight="regular"
						color="inherit"
						as="code"
						textOverflow="wrap"
					>
						aria-busy="true"
					</Typography>
					.
				</Typography>
				<div className={`${styles.compositions} ${styles.marginTopMedium}`}>
					<Row label="card">
						<div className={styles.cards}>
							<div className={styles.card} aria-busy="true">
								<Skeleton />
							</div>
							<div className={styles.card} aria-busy="true">
								<Skeleton
									title={{ width: '24%' }}
									paragraph={{ rows: 4, width: ['100%', '100%', '100%', '60%'] }}
								/>
							</div>
						</div>
					</Row>
					<Row label="table">
						<div className={styles.tableBox} aria-busy="true">
							<table className={styles.table}>
								<thead>
									<tr>
										<th>
											<Typography
												variant="label"
												size="small"
												weight="medium"
												color="secondary"
												as="span"
												textOverflow="visible"
											>
												Service
											</Typography>
										</th>
										<th>
											<Typography
												variant="label"
												size="small"
												weight="medium"
												color="secondary"
												as="span"
												textOverflow="visible"
											>
												P99 latency
											</Typography>
										</th>
										<th>
											<Typography
												variant="label"
												size="small"
												weight="medium"
												color="secondary"
												as="span"
												textOverflow="visible"
											>
												Error rate
											</Typography>
										</th>
										<th>
											<Typography
												variant="label"
												size="small"
												weight="medium"
												color="secondary"
												as="span"
												textOverflow="visible"
											>
												Actions
											</Typography>
										</th>
									</tr>
								</thead>
								<tbody>
									{SERVICES.map((service) => (
										<tr key={service}>
											<td>
												<Skeleton.Input size="sm" width={160} />
											</td>
											<td>
												<Skeleton.Input size="sm" width={64} />
											</td>
											<td>
												<Skeleton.Input size="sm" width={48} />
											</td>
											<td>
												<Skeleton.Button size="sm" />
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Row>
					<Row label="list">
						<div className={`${styles.list} ${styles.narrow}`} aria-busy="true">
							{[0, 1, 2].map((row) => (
								<div key={row} className={styles.listRow}>
									<Skeleton.Avatar size="md" />
									<Skeleton title={false} paragraph={{ rows: 2, width: ['70%', '40%'] }} />
								</div>
							))}
						</div>
					</Row>
					<Row label="form">
						<div className={`${styles.form} ${styles.narrow}`} aria-busy="true">
							{['Name', 'Webhook URL', 'Description'].map((label) => (
								<div key={label} className={styles.field}>
									<Typography
										variant="label"
										size="base"
										weight="medium"
										color="main"
										as="span"
										textOverflow="visible"
									>
										{label}
									</Typography>
									<Skeleton.Input size="md" />
								</div>
							))}
							<div className={styles.actions}>
								<Skeleton.Button size="md" />
								<Skeleton.Button size="md" />
							</div>
						</div>
					</Row>
					<Row label="busy region">
						<div className={styles.narrow}>
							<LoadingRegion />
						</div>
					</Row>
				</div>
			</div>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const region = canvas.getByTestId('service-region');

		await expect(region).toHaveAttribute('aria-busy', 'true');
		await expect(canvas.getByTestId('service-skeleton')).toHaveAttribute('aria-hidden', 'true');
		await expect(canvas.getByRole('status')).toHaveTextContent('Loading the service summary');

		await userEvent.click(canvas.getByRole('button', { name: 'Finish loading' }));

		await expect(region).toHaveAttribute('aria-busy', 'false');
		await expect(canvas.queryByTestId('service-skeleton')).toBeNull();
		await expect(canvas.getByRole('status')).toBeEmptyDOMElement();

		await userEvent.click(canvas.getByRole('button', { name: 'Load again' }));

		await expect(region).toHaveAttribute('aria-busy', 'true');

		canvas.getByRole('button', { name: 'Finish loading' }).blur();
	},
};
