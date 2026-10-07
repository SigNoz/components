import { createContext, useContext } from 'react';
import type { CalloutColorType } from './types.js';

/**
 * The color of the callout around a part, `undefined` outside one.
 *
 * @access private
 */
export const CalloutColorContext = createContext<CalloutColorType | undefined>(undefined);

/**
 * @access private
 */
export function useCalloutColor(): CalloutColorType | undefined {
	return useContext(CalloutColorContext);
}
