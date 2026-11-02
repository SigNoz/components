import { motion } from 'motion/react';
import * as React from 'react';
import { drawerTransition, syncMotionStyle } from '../utils.js';

type MotionContentProps = React.ComponentProps<typeof motion.div> & {
	'data-state'?: 'open' | 'closed';
};

/**
 * Panel element of `DrawerContent`. Radix hands it `data-state`, which picks the motion variant
 * it starts from and the one it animates to.
 *
 * @access private
 */
export const DrawerMotionContent = React.forwardRef<HTMLDivElement, MotionContentProps>(
	({ 'data-state': state, initial, animate, transition, exit, ...rest }, ref) => {
		const resolvedInitial = state === 'open' ? (initial ?? 'initial') : (initial ?? 'exit');
		const resolvedAnimate = state === 'open' ? (animate ?? 'animate') : (animate ?? 'exit');
		const resolvedExit = exit ?? 'exit';

		return (
			<motion.div
				ref={ref}
				initial={resolvedInitial}
				animate={resolvedAnimate}
				transition={transition ?? drawerTransition}
				exit={resolvedExit}
				onUpdate={syncMotionStyle}
				{...rest}
			/>
		);
	},
);
DrawerMotionContent.displayName = 'DrawerMotionContent';
