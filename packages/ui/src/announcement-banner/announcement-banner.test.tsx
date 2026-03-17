import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	AnnouncementBanner,
	type AnnouncementBannerProps,
	PersistedAnnouncementBanner,
} from './index.js';

const STORAGE_KEY = 'test-banner-dismissed';

function renderBanner(props: Partial<AnnouncementBannerProps> = {}): void {
	render(<AnnouncementBanner {...props}>Test message</AnnouncementBanner>);
}

afterEach(() => {
	localStorage.removeItem(STORAGE_KEY);
});

describe('AnnouncementBanner', () => {
	it('renders message and default warning variant', () => {
		render(
			<AnnouncementBanner>
				<strong>Heads up</strong>
			</AnnouncementBanner>
		);

		const alert = screen.getByRole('alert');
		expect(alert).toHaveAttribute('data-type', 'warning');
		expect(alert).toHaveTextContent('Heads up');
	});

	it.each([
		'warning',
		'info',
		'success',
		'error',
	] as const)('renders %s variant correctly', (type) => {
		renderBanner({ type });
		const alert = screen.getByRole('alert');
		expect(alert).toHaveAttribute('data-type', type);
	});

	it('calls action onClick when action button is clicked', () => {
		const onClick = vi.fn();
		renderBanner({ action: { label: 'Go to Settings', onClick } });

		fireEvent.click(screen.getByRole('button', { name: /go to settings/i }));

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('hides dismiss button when onClose is not provided and hides icon when icon is null', () => {
		render(
			<AnnouncementBanner onClose={undefined} icon={null}>
				Test message
			</AnnouncementBanner>
		);

		expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
		expect(screen.queryByTestId('banner-icon')).not.toBeInTheDocument();
	});
});

describe('PersistedAnnouncementBanner', () => {
	it('dismisses on click, calls onDismiss, and persists to localStorage', () => {
		const onDismiss = vi.fn();
		render(
			<PersistedAnnouncementBanner storageKey={STORAGE_KEY} onDismiss={onDismiss}>
				Test message
			</PersistedAnnouncementBanner>
		);

		fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
		expect(onDismiss).toHaveBeenCalledTimes(1);
		expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
	});

	it('does not render when storageKey is already set in localStorage', () => {
		localStorage.setItem(STORAGE_KEY, 'true');
		render(
			<PersistedAnnouncementBanner storageKey={STORAGE_KEY}>
				Test message
			</PersistedAnnouncementBanner>
		);

		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});
});
