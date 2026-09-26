/**
 * Chromatic modes.
 *
 * Each key is one snapshot Chromatic takes of a story, and its value is the Storybook globals that
 * snapshot runs under. The mode's name lands on the diff, so a build says which conditions a change
 * was caught in.
 *
 * `still` writes the same `motion` global the live/still control in the story corner writes, which
 * is what settles a snapshot: no animation runs and no transition is left in flight. It replaces
 * Chromatic's own `disableAnimations`, whose behaviour is Chromatic's to define and invisible from
 * here.
 */
export const allModes = {
	still: { motion: 'still' },
} as const;
