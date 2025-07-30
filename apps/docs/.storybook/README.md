# Storybook Configuration

This directory contains the Storybook configuration for the SigNoz Components documentation.

## Features

### 🎨 **Dark Mode by Default**
- Storybook starts in dark mode by default
- Toggle button in the top-right corner to switch between light/dark modes
- Manager UI (sidebar and panels) also uses dark theme

### 🔤 **Inter Font**
- Uses Inter font family from Google Fonts
- Applied globally to all components and UI
- Optimized font rendering with proper font-feature-settings

### 🏷️ **SigNoz Branding**
- Custom favicon with SigNoz branding (placeholder SVG)
- Dark theme optimized for SigNoz brand colors
- Professional appearance matching SigNoz design system

## Files

- `preview.js` - Main Storybook configuration with dark mode settings
- `preview.css` - Global styles including Inter font and dark theme
- `preview-head.html` - HTML head content (fonts, favicon)
- `manager.js` - Manager UI configuration (sidebar, panels)
- `modeDecorator.tsx` - Dark/light mode toggle component

## Customization

To update the favicon, replace the base64 SVG in `preview-head.html` with your actual SigNoz logo.

To modify the theme colors, update the CSS variables in `preview.css`. 