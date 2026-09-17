import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useGlobals } from 'storybook/preview-api';

/**
 * The class `index.css` settles the document under. It goes on `<body>` rather than on anything a
 * story renders, so one toolbar choice covers every page.
 */
const STILL_CLASS = 'story-freeze-animations';

/**
 * Applies the `theme`, `palette` and `motion` globals to the document.
 *
 * All three are globals rather than parameters or decorator state because a Chromatic mode is a
 * named set of globals (see `modes.ts`): anything a snapshot has to vary has to be one, and the
 * toolbar then gets the control for free.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ModeDecorator = (Story: any): ReactElement => {
	const [globals] = useGlobals();
	const { theme, palette, motion } = globals;

	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme !== 'light');
	}, [theme]);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', palette ?? 'default');
	}, [palette]);

	useEffect(() => {
		document.body.classList.toggle(STILL_CLASS, motion === 'still');
	}, [motion]);

	return <Story />;
};
