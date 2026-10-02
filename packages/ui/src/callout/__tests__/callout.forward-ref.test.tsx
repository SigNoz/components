import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Callout } from '../callout.js';

const icon = <svg />;

describe('Callout forwardRef', () => {
	it('forwards the ref of every variant to the root', () => {
		const refs = [
			createRef<HTMLDivElement>(),
			createRef<HTMLDivElement>(),
			createRef<HTMLDivElement>(),
			createRef<HTMLDivElement>(),
		];

		render(
			<>
				<Callout ref={refs[0]} color="primary" size="sm" icon={icon}>
					a
				</Callout>
				<Callout.Expandable
					ref={refs[1]}
					color="primary"
					size="sm"
					icon={icon}
					title="t"
					defaultExpanded
				>
					a
				</Callout.Expandable>
				<Callout.Closeable
					ref={refs[2]}
					color="primary"
					size="sm"
					icon={icon}
					closed={false}
					onClose={() => {}}
				>
					a
				</Callout.Closeable>
				<Callout.CloseablePersisted
					ref={refs[3]}
					storageKey="k"
					color="primary"
					size="sm"
					icon={icon}
				>
					a
				</Callout.CloseablePersisted>
			</>,
		);

		for (const ref of refs) {
			expect(ref.current).toBeInstanceOf(HTMLDivElement);
			expect(ref.current).toHaveAttribute('data-slot', 'callout');
		}
	});
});
