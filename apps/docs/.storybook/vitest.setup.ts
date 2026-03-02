import { setProjectAnnotations } from '@storybook/react-vite';
import * as previewAnnotations from './preview.js';

export const annotations = setProjectAnnotations([previewAnnotations]);
