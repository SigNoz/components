import tailwindAnimate from 'tailwindcss-animate';
import { ColorTailwind } from '@signozhq/design-tokens';

export default {
	darkMode: ['class'],
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				background: {
					DEFAULT: '#ffffff',
					dark: '#121317',
				},
				foreground: {
					DEFAULT: '#23262e',
					dark: '#e9e9e9',
				},
				card: {
					DEFAULT: '#ffffff',
					foreground: '#23262e',
					dark: '#1e2028',
					'foreground-dark': '#e9e9e9',
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#23262e',
					dark: '#1e2028',
					'foreground-dark': '#e9e9e9',
				},
				primary: {
					DEFAULT: '#3b82f6',
					foreground: '#ffffff',
					dark: '#60a5fa',
					'foreground-dark': '#121317',
				},
				secondary: {
					DEFAULT: '#f3f4f6',
					foreground: '#374151',
					dark: '#2a2d37',
					'foreground-dark': '#d1d5db',
				},
				muted: {
					DEFAULT: '#f3f4f6',
					foreground: '#6b7280',
					dark: '#2a2d37',
					'foreground-dark': '#9ca3af',
				},
				accent: {
					DEFAULT: '#8b5cf6',
					foreground: '#ffffff',
					dark: '#a78bfa',
					'foreground-dark': '#121317',
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff',
					dark: '#f87171',
					'foreground-dark': '#121317',
				},
				border: {
					DEFAULT: '#e5e7eb',
					dark: '#374151',
				},
				input: {
					DEFAULT: '#e5e7eb',
					dark: '#374151',
				},
				ring: {
					DEFAULT: '#3b82f6',
					dark: '#60a5fa',
				},
				chart: {
					1: '#3b82f6',
					2: '#10b981',
					3: '#f59e0b',
					4: '#ef4444',
					5: '#8b5cf6',
					'1-dark': '#60a5fa',
					'2-dark': '#34d399',
					'3-dark': '#fbbf24',
					'4-dark': '#f87171',
					'5-dark': '#a78bfa',
				},
				...ColorTailwind,
			},
		},
	},
	safelist: [
		{
			pattern: /^(bg|text|border)-/,
			variants: ['hover', 'focus'],
		},
	],
	plugins: [tailwindAnimate],
};
