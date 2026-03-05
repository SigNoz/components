import './index.css'; // Keep for CSS variable definitions

import { useTheme } from 'next-themes';
import type React from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { cn } from '../lib/utils.js';
import styles from './sonner.module.css';

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className={cn(styles['toaster'], styles['group'])}
			style={
				{
					'--normal-bg': 'var(--popover)',
					'--normal-text': 'var(--popover-foreground)',
					'--normal-border': 'var(--border)',
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { type ToasterProps, toast } from 'sonner';
export { Toaster };
