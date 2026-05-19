import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { AlertDialog } from './index.js';

describe('AlertDialog forwardRef', () => {
	it('AlertDialog forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<AlertDialog ref={ref} open onOpenChange={() => {}} title="Alert">
				Content
			</AlertDialog>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
