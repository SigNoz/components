import { setProjectAnnotations } from '@storybook/react-vite';
import * as previewAnnotations from './preview';

export const annotations = setProjectAnnotations([previewAnnotations]);
