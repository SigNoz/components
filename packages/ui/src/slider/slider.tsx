import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import styles from './slider.module.css';

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root ref={ref} className={cn(styles['slider-root'], className)} {...props}>
		<SliderPrimitive.Track className={styles['slider-track']}>
			<SliderPrimitive.Range className={styles['slider-range']} />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className={styles['slider-thumb']} />
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
