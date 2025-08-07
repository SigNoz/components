import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { getTransformedTypographyTokens } from '../utils';

export default {
	title: 'Design System/Typography',
	component: () => null,
	parameters: {
		layout: 'fullscreen',
		backgrounds: {
			default: 'dark',
			values: [{ name: 'dark', value: '#1a1a1a' }],
		},
	},
} as Meta;

const typography = getTransformedTypographyTokens();

const getFontSize = (variant: string): string => {
	return typography.FONTSIZE[variant as keyof typeof typography.FONTSIZE] || '';
};

const getFontWeight = (variant: string): string => {
	return (
		typography.FONTWEIGHT[variant as keyof typeof typography.FONTWEIGHT] || ''
	);
};

const FontSizeShowcase: React.FC = () => (
	<div className="p-5">
		<h1 className="mb-5 text-lg font-bold text-vanilla-100">Font Sizes</h1>
		<div className="grid grid-cols-1 gap-4">
			{Object.keys(typography.FONTSIZE).map((variant) => (
				<div key={variant} className="text-vanilla-100">
					<h2 style={{ fontSize: getFontSize(variant) }}>
						{variant} - {getFontSize(variant)}
					</h2>
					<p style={{ fontSize: getFontSize(variant) }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
				</div>
			))}
		</div>
	</div>
);

const FontWeightShowcase: React.FC = () => (
	<div className="p-5">
		<h1 className="mb-5 text-lg font-bold text-vanilla-100">Font Weights</h1>
		<div className="grid grid-cols-1 gap-4">
			{Object.keys(typography.FONTWEIGHT).map((variant) => (
				<div key={variant} className="text-vanilla-100">
					<h2 style={{ fontWeight: getFontWeight(variant) }}>
						{variant} - {getFontWeight(variant)}
					</h2>
					<p style={{ fontWeight: getFontWeight(variant) }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</p>
				</div>
			))}
		</div>
	</div>
);

export const FontSize: StoryFn = () => <FontSizeShowcase />;
export const FontWeight: StoryFn = () => <FontWeightShowcase />;
