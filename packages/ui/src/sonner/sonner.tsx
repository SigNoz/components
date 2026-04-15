import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { cn } from '../lib/utils.js';
import sonner from './sonner.module.scss';

export type SonnerToasterProps = ToasterProps & {
	/**
	 * The testId associated with the toaster.
	 */
	testId?: string;
};

const Toaster = ({ testId, className, ...props }: SonnerToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className={cn(sonner.toaster, className)}
			data-testid={testId}
			{...props}
		/>
	);
};

export { type ToasterProps, toast } from 'sonner';
export { Toaster };
