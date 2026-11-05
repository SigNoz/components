import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Avatar } from '../avatar.js';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Avatar on the server', () => {
	it('renders the initials with no warning', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		const html = renderToString(
			<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />,
		);

		expect(html).toContain('data-slot="avatar"');
		expect(html).toContain('role="img"');
		expect(html).toContain('aria-label="Alex Example"');
		expect(html).toContain('data-testid="avatar-fallback"');
		expect(html).toContain('>AE<');
		expect(html).not.toContain('data-image-status');
		expect(error).not.toHaveBeenCalled();
	});

	it('renders the image still loading, under the initials', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		const html = renderToString(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		expect(html).toContain('data-image-status="loading"');
		expect(html).toContain('data-slot="avatar-image"');
		expect(html).toContain('loading="lazy"');
		expect(html).toContain('data-slot="avatar-fallback"');
		expect(error).not.toHaveBeenCalled();
	});

	it('renders the generic icon and the unknown name for an empty name', () => {
		const html = renderToString(<Avatar color="primary" name="" size="sm" testId="avatar" />);

		expect(html).toContain('aria-label="Unknown user"');
		expect(html).toContain('<svg');
	});
});
