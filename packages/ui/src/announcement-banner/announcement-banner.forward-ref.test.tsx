import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { AnnouncementBanner, PersistedAnnouncementBanner } from './index.js';

describe('AnnouncementBanner forwardRef', () => {
	it('AnnouncementBanner forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<AnnouncementBanner ref={ref}>Announcement</AnnouncementBanner>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('PersistedAnnouncementBanner forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<PersistedAnnouncementBanner ref={ref} storageKey="test">
				Announcement
			</PersistedAnnouncementBanner>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
