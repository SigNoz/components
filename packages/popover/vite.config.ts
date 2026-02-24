import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import getViteLibConfig from '@repo/typescript-config/vite.config.extend';

export default defineConfig(getViteLibConfig('src/popover.tsx', { plugins: [react()] }));
