/**
 * Resolves once React has run the effects of the render before it.
 *
 * Storybook wraps a story's render and every `fireEvent` in React's `act()` only in a development
 * build, so under Vitest those effects have all run before the next line of `play`. The production
 * build Chromatic shoots skips `act`: `play` starts right after the first commit, before Base UI has
 * attached the listeners its triggers open on, and an event fired then is dropped. Two frames give
 * React time to run those effects and the render they schedule.
 */
export async function waitForEffects(): Promise<void> {
	for (let frame = 0; frame < 2; frame += 1) {
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}
}
