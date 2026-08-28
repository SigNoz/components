import { Typography } from '@signozhq/ui';
import type * as React from 'react';
import styles from '../base-ui.stories.module.css';

/**
 * Shared frame for the per-component entries in the Base UI section. Each entry
 * states which Base UI parts back the component and what the swap changed for
 * callers, then shows live demos — so a reviewer can check the claim against the
 * rendered result without leaving the page.
 */
export function BaseUIPanel({
	parts,
	notes,
	children,
}: {
	/** Base UI parts (or helper) this component renders. */
	parts: string;
	/** What the swap changed for callers. Each entry must be unique. */
	notes: string[];
	children: React.ReactNode;
}) {
	return (
		<div className={styles.page}>
			<div className={styles.intro}>
				<Typography.Text className={styles.caption}>
					Renders <code className={styles.mono}>{parts}</code>
				</Typography.Text>
				<ul>
					{notes.map((note) => (
						<li key={note}>
							<Typography.Text className={styles.caption}>{note}</Typography.Text>
						</li>
					))}
				</ul>
			</div>
			<div className={styles.gallery}>{children}</div>
		</div>
	);
}

export function Demo({
	title,
	note,
	block,
	wide,
	children,
}: {
	title: string;
	note?: string;
	/** Stack the demo contents instead of laying them out in a row. */
	block?: boolean;
	/** Span the full gallery width. */
	wide?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className={styles.card} style={wide ? { gridColumn: '1 / -1' } : undefined}>
			<div className={styles.cardHead}>
				<span className={styles.cardTitle}>{title}</span>
				{note === undefined ? null : <span className={styles.cardNote}>{note}</span>}
			</div>
			<div className={styles.demo} style={block ? { display: 'block' } : undefined}>
				{children}
			</div>
		</div>
	);
}
