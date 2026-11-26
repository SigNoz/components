import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useState,
} from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import type { TooltipToneType } from './types.js';

type SetTooltipTones = Dispatch<SetStateAction<readonly TooltipToneType[]>>;

const NO_TONES: readonly TooltipToneType[] = [];

const TooltipToneContext = createContext<SetTooltipTones | undefined>(undefined);

/**
 * The tones the `TooltipTone`s rendered in one popup ask for, in mount order.
 *
 * A popup reads them from React state, never from its DOM: a CSS `:has()` on the popup also
 * matches a `TooltipTone` in another popup portalled into it, so a danger tooltip opened inside a
 * neutral one would turn both red. Context follows the component tree instead, and every popup
 * has a provider of its own.
 *
 * @access private
 */
export function useTooltipTones(): [readonly TooltipToneType[], SetTooltipTones] {
	return useState(NO_TONES);
}

/**
 * @access private
 */
export function TooltipToneProvider({
	setTones,
	children,
}: {
	setTones: SetTooltipTones;
	children: ReactNode;
}): ReactNode {
	return <TooltipToneContext.Provider value={setTones}>{children}</TooltipToneContext.Provider>;
}

/**
 * Asks the popup the caller is rendered in for `tone`, for as long as the caller is mounted.
 * Outside a popup it does nothing.
 *
 * @access private
 */
export function useRegisterTooltipTone(tone: TooltipToneType): void {
	const setTones = useContext(TooltipToneContext);

	// A layout effect, so the popup repaints in its tone before the first frame shows it neutral.
	useIsomorphicLayoutEffect(() => {
		if (!setTones) {
			return;
		}

		setTones((current) => [...current, tone]);

		return () =>
			setTones((current) => {
				const index = current.indexOf(tone);

				return index === -1 ? current : current.filter((_, at) => at !== index);
			});
	}, [setTones, tone]);
}
