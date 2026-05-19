import { Info } from '@signozhq/icons';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { PinList } from './index.js';

describe('PinList forwardRef', () => {
	it('PinList forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<PinList
				ref={ref}
				items={[
					{
						key: '1',
						itemKey: '1',
						label: 'Test',
						icon: <Info />,
						isPinned: true,
						isEnabled: true,
					},
				]}
			/>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
