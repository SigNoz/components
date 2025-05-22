interface IconProps extends React.SVGProps<SVGSVGElement> {
	size?: number | string;
	strokeWidth?: number;
	className?: string;
}

export interface IconManifest {
	name: string;
	component: React.ComponentType<IconProps>;
	category: string;
	tags: string[];
}

// Import all icons
import * as Icons from '@signozhq/icons';

// Create manifest
export const iconsManifest: IconManifest[] = Object.entries(Icons).map(
	([name, component]) => ({
		name,
		component: component as React.ComponentType<IconProps>,
		category: name.includes('Solid') ? 'Solid' : 'Outline',
		tags: name.toLowerCase().split(/(?=[A-Z])/),
	}),
);
