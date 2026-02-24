import { useTheme } from 'next-themes';
import React from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import './index.css';

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className="toaster group"
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

export { toast, type ToasterProps } from 'sonner';
export { Toaster };
