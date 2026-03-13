import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { cn } from '../lib/utils.js';
import sonner from './sonner.module.scss';

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner theme={theme as ToasterProps['theme']} className={cn(sonner.toaster)} {...props} />
	);
};

export { type ToasterProps, toast } from 'sonner';
export { Toaster };
