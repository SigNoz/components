import { Autocomplete } from '@base-ui/react/autocomplete';
import { type ReactNode, type Ref, useEffect, useMemo, useRef, useState } from 'react';
import { useScrollEdges } from '../../lib/use-scroll-edges.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { COMMAND_EMPTY_CONTENT } from '../constants.js';
import styles from '../command.module.scss';
import type { CommandActionItemType, CommandItemType, CommandSearchInputProps } from '../types.js';
import {
	groupJumpIndex,
	hasModifier,
	isCommandItemInert,
	isReplayedKey,
	rankCommandSections,
	readCommandMove,
	replayKey,
	toCommandSections,
} from '../utils.js';
import { CommandItem } from './command-item.js';
import { CommandSearch } from './command-search.js';

/**
 * @access private
 */
export type CommandPanelProps = {
	items: CommandItemType[];
	label: string;
	searchInputProps: CommandSearchInputProps;
	noContent: ReactNode;
	onPick: (item: CommandActionItemType) => void;
	testId: string | undefined;
	inputRef: Ref<HTMLInputElement>;
};

/**
 * The search row and the list. Mounted only while the palette is open, so the query starts empty
 * on every open.
 *
 * @access private
 */
export function CommandPanel({
	items,
	label,
	searchInputProps,
	// A default, not `??`: `null` turns the message off.
	noContent = COMMAND_EMPTY_CONTENT,
	onPick,
	testId,
	inputRef,
}: CommandPanelProps): ReactNode {
	const { filter = true, loading = false, onChange } = searchInputProps;
	const [query, setQuery] = useState('');
	const { ref: viewportRef, edges, measure } = useScrollEdges<HTMLDivElement>();

	const sections = useMemo(() => toCommandSections(items), [items]);
	const visibleSections = useMemo(
		() => (filter ? rankCommandSections(sections, query) : sections),
		[filter, sections, query],
	);
	const showEmpty =
		visibleSections.length === 0 && (filter || !loading) && hasRenderableContent(noContent);

	// Read when the panel unmounts, which is when the palette closes, whatever closed it.
	const queryRef = useRef('');
	const onChangeRef = useRef(onChange);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(
		() => () => {
			if (queryRef.current !== '') {
				onChangeRef.current?.('');
			}
		},
		[],
	);

	// The row Base UI highlights, counted across `visibleSections` in order. `-1` for none.
	const highlightedIndexRef = useRef(-1);

	// A loading or disabled row runs nothing and leaves the palette open, whether a click, a plain
	// `Enter` or a modified one picked it.
	function pick(item: CommandActionItemType): void {
		if (!isCommandItemInert(item)) {
			onPick(item);
		}
	}

	const handleKeyDown: Autocomplete.Input.Props['onKeyDown'] = (event) => {
		// The keys typed into an IME stay the IME's.
		if (isReplayedKey(event.nativeEvent) || event.nativeEvent.isComposing) {
			return;
		}

		// Base UI runs the highlighted row on a plain `Enter` only. cmdk runs it with any modifier.
		if (event.key === 'Enter' && hasModifier(event)) {
			const rows = visibleSections.flatMap((section) => section.rows);
			const row = rows[highlightedIndexRef.current];

			if (row !== undefined) {
				event.preventBaseUIHandler();
				event.preventDefault();
				pick(row.item);
			}

			return;
		}

		// With a modifier, `Home` and `End` stay the field's, so `Shift+Home` still selects the query.
		// Base UI's list navigation would move the highlight on them whatever the modifier.
		if ((event.key === 'Home' || event.key === 'End') && hasModifier(event)) {
			event.preventBaseUIHandler();
			return;
		}

		const move = readCommandMove(event);

		if (move === undefined) {
			return;
		}

		event.preventBaseUIHandler();
		event.preventDefault();

		const input = event.currentTarget;

		if (move.to === 'edge') {
			replayKey(input, move.direction === 1 ? 'End' : 'Home');
			return;
		}

		const current = highlightedIndexRef.current;
		const groupIndex =
			move.to === 'group' ? groupJumpIndex(visibleSections, current, move.direction) : undefined;

		replayKey(
			input,
			move.direction === 1 ? 'ArrowDown' : 'ArrowUp',
			groupIndex === undefined ? 1 : Math.abs(groupIndex - current),
		);
	};

	function changeQuery(next: string): void {
		if (next === queryRef.current) {
			return;
		}

		queryRef.current = next;
		setQuery(next);
		onChange?.(next);
	}

	return (
		<Autocomplete.Root
			inline
			open
			value={query}
			onValueChange={changeQuery}
			filter={null}
			autoHighlight="always"
			keepHighlight
			onItemHighlighted={(_value, eventDetails) => {
				highlightedIndexRef.current = eventDetails.index;
			}}
		>
			<CommandSearch
				label={label}
				searchInputProps={searchInputProps}
				commandTestId={testId}
				inputRef={inputRef}
				onKeyDown={handleKeyDown}
			/>
			<div
				ref={viewportRef}
				data-slot="command-viewport"
				data-scroll-start={edges.start || undefined}
				data-scroll-end={edges.end || undefined}
				className={styles['command__viewport']}
				onScroll={measure}
			>
				{showEmpty && (
					<div
						data-slot="command-empty"
						data-testid={partTestId(testId, 'empty')}
						className={styles['command__empty']}
					>
						{noContent}
					</div>
				)}
				<Autocomplete.List data-slot="command-list" className={styles['command__list']}>
					{visibleSections.flatMap((section) => {
						const rows = section.rows.map((row) => (
							<CommandItem
								key={`item-${row.item.value}`}
								item={row.item}
								commandTestId={testId}
								onPick={pick}
							/>
						));

						// A row outside any group sits in the list itself, keyed by its own value, so it
						// keeps its node when the sections around it change.
						if (section.group === undefined) {
							return rows;
						}

						return (
							<Autocomplete.Group
								key={`group-${section.group.value}`}
								data-slot="command-group"
								data-testid={
									section.group.testId ?? partTestId(testId, `group-${section.group.value}`)
								}
								className={styles['command__group']}
							>
								<Autocomplete.GroupLabel
									data-slot="command-group-label"
									className={styles['command__group-label']}
								>
									{section.group.label}
								</Autocomplete.GroupLabel>
								{rows}
							</Autocomplete.Group>
						);
					})}
				</Autocomplete.List>
			</div>
		</Autocomplete.Root>
	);
}
