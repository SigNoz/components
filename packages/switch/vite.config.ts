import getViteLibConfig from '@repo/typescript-config/vite.config.extend';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(getViteLibConfig('src/switch.tsx', { plugins: [react()] }));
