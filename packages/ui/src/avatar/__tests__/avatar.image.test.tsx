import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { Avatar } from '../avatar.js';
import { swallowImageEvents } from './avatar.test-utils.js';

// A browser keeps the images it has decoded, and one it already has is `complete` the moment its
// element exists. Every test that reads the `loading` state gets a source the page has not seen.
let sources = 0;

function newImage(): string {
	sources += 1;
	const bytes = [
		0x47,
		0x49,
		0x46,
		0x38,
		0x39,
		0x61,
		0x01,
		0x00,
		0x01,
		0x00,
		0x80,
		0x00,
		0x00,
		sources % 256,
		0x00,
		0x00,
		0x00,
		0x00,
		0x00,
		0x21,
		0xf9,
		0x04,
		0x01,
		0x00,
		0x00,
		0x00,
		0x00,
		0x2c,
		0x00,
		0x00,
		0x00,
		0x00,
		0x01,
		0x00,
		0x01,
		0x00,
		0x00,
		0x02,
		0x02,
		0x44,
		0x01,
		0x00,
		0x3b,
	];
	return `data:image/gif;base64,${btoa(String.fromCharCode(...bytes))}`;
}

function brokenImage(): string {
	sources += 1;
	return `data:image/png;base64,not-an-image-${sources}`;
}

function image(testId = 'avatar'): HTMLImageElement {
	return screen.getByTestId(`${testId}-image`) as HTMLImageElement;
}

// A `decode` that settles when the test says so, one entry per call.
function holdDecode(): {
	decode: ReturnType<typeof vi.spyOn>;
	calls: Array<{ resolve: () => void; reject: (reason: unknown) => void }>;
} {
	const calls: Array<{ resolve: () => void; reject: (reason: unknown) => void }> = [];
	const decode = vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(
		() =>
			new Promise<void>((resolve, reject) => {
				calls.push({ resolve, reject });
			}),
	);

	return { decode, calls };
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Avatar image', () => {
	it('renders the image with an empty alt, lazy and async', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		expect(image()).toHaveAttribute('src', '/alex.png');
		expect(image()).toHaveAttribute('alt', '');
		expect(image()).toHaveAttribute('loading', 'lazy');
		expect(image()).toHaveAttribute('decoding', 'async');
	});

	it('sets loading and decoding on the image before its src', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		const names = image().getAttributeNames();

		expect(names.indexOf('loading')).toBeGreaterThanOrEqual(0);
		expect(names.indexOf('loading')).toBeLessThan(names.indexOf('src'));
		expect(names.indexOf('decoding')).toBeGreaterThanOrEqual(0);
		expect(names.indexOf('decoding')).toBeLessThan(names.indexOf('src'));
	});

	it('crops the image to fill the shape, centred', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		const style = getComputedStyle(image());

		expect(style.objectFit).toBe('cover');
		expect(style.objectPosition).toBe('50% 50%');
	});

	it('does not stretch the image in the avatar', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);

		const { width, height } = image().getBoundingClientRect();

		expect(width).toBe(32);
		expect(height).toBe(32);
	});
});

describe('Avatar image status', () => {
	it('has no status without a src', () => {
		render(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar')).not.toHaveAttribute('data-image-status');
	});

	it('is loading with the initials showing until the image has loaded', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
		expect(getComputedStyle(image()).opacity).toBe('0');
	});

	it('replaces the initials once the image has loaded', async () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);

		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded'),
		);

		expect(screen.queryByTestId('avatar-fallback')).toBeNull();
		expect(image()).toBeInTheDocument();
		expect(getComputedStyle(image()).opacity).toBe('1');
	});

	it('keeps the initials when the image fails', async () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src={brokenImage()} testId="avatar" />,
		);

		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'error'),
		);

		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
		expect(screen.queryByTestId('avatar-image')).toBeNull();
	});

	it('follows the load event of the image', async () => {
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockResolvedValue();
		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		fireEvent.load(image());

		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded'),
		);
		expect(screen.queryByTestId('avatar-fallback')).toBeNull();
	});

	it('follows the error event of the image', () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		fireEvent.error(image());

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'error');
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
		expect(screen.queryByTestId('avatar-image')).toBeNull();
	});

	it('does not take the root out of the page while the image changes state', async () => {
		render(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);
		const root = screen.getByTestId('avatar');

		await waitFor(() => expect(root).toHaveAttribute('data-image-status', 'loaded'));

		expect(screen.getByTestId('avatar')).toBe(root);
	});

	it('shows no status once the src is removed', async () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);
		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded'),
		);

		rerender(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		expect(screen.getByTestId('avatar')).not.toHaveAttribute('data-image-status');
		expect(screen.queryByTestId('avatar-image')).toBeNull();
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
	});

	it('shows the image again when the src comes back after being removed', async () => {
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockResolvedValue();
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);
		fireEvent.load(image());
		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded'),
		);
		rerender(<Avatar color="primary" name="Alex Example" size="md" testId="avatar" />);

		rerender(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
	});

	it('does not read an image that finished before the handlers as still loading', () => {
		vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
		vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(24);

		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded');
		expect(screen.queryByTestId('avatar-fallback')).toBeNull();
	});

	it('reads an image that failed before the handlers as failed', async () => {
		onTestFinished(swallowImageEvents());
		vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
		vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(0);
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockRejectedValue(
			new DOMException('broken', 'EncodingError'),
		);

		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'error'),
		);
		expect(screen.queryByTestId('avatar-image')).toBeNull();
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
	});

	it('reads a finished image with no width that decodes, an SVG with no size, as loaded', async () => {
		onTestFinished(swallowImageEvents());
		vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
		vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(0);
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockResolvedValue();

		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.svg" testId="avatar" />,
		);

		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded'),
		);
		expect(screen.queryByTestId('avatar-fallback')).toBeNull();
	});
});

describe('Avatar image decoding', () => {
	it('keeps the initials after the image has loaded, until it is decoded', async () => {
		const { decode, calls } = holdDecode();
		render(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);

		await waitFor(() => expect(decode).toHaveBeenCalledTimes(1));

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
		expect(getComputedStyle(image()).opacity).toBe('0');

		await act(async () => {
			calls[0]?.resolve();
		});

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded');
		expect(screen.queryByTestId('avatar-fallback')).toBeNull();
		expect(getComputedStyle(image()).opacity).toBe('1');
	});

	it('keeps the initials when the image loads but cannot be decoded', async () => {
		const { decode, calls } = holdDecode();
		render(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);
		await waitFor(() => expect(decode).toHaveBeenCalledTimes(1));

		await act(async () => {
			calls[0]?.reject(new DOMException('broken', 'EncodingError'));
		});

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'error');
		expect(screen.queryByTestId('avatar-image')).toBeNull();
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
	});

	it('keeps the initials through a render while the image is decoding', async () => {
		const { decode, calls } = holdDecode();
		const source = newImage();
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src={source} testId="avatar" />,
		);
		await waitFor(() => expect(decode).toHaveBeenCalledTimes(1));

		rerender(<Avatar color="primary" name="Alex Example" size="sm" src={source} testId="avatar" />);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');

		await act(async () => {
			calls[0]?.resolve();
		});

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded');
	});

	it('ignores the decode of an image that was replaced, even by the same src', async () => {
		vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(false);
		const { decode, calls } = holdDecode();
		const first = newImage();
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src={first} testId="avatar" />,
		);
		await waitFor(() => expect(decode).toHaveBeenCalledTimes(1));
		rerender(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);
		await waitFor(() => expect(decode).toHaveBeenCalledTimes(2));
		rerender(<Avatar color="primary" name="Alex Example" size="md" src={first} testId="avatar" />);

		await act(async () => {
			calls[0]?.resolve();
			calls[1]?.resolve();
		});

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');

		await waitFor(() => expect(decode).toHaveBeenCalledTimes(3));
		await act(async () => {
			calls[2]?.resolve();
		});

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded');
	});

	it('reads a loaded image as loaded where there is no decode, as in jsdom', () => {
		const original = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'decode');
		Object.defineProperty(HTMLImageElement.prototype, 'decode', {
			value: undefined,
			configurable: true,
			writable: true,
		});
		onTestFinished(() => {
			if (original) {
				Object.defineProperty(HTMLImageElement.prototype, 'decode', original);
			}
		});
		render(
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />,
		);

		fireEvent.load(image());

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded');
		expect(screen.queryByTestId('avatar-fallback')).toBeNull();
	});
});

describe('Avatar src change', () => {
	it('starts loading the new src after the previous one failed', async () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src={brokenImage()} testId="avatar" />,
		);
		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'error'),
		);

		const next = newImage();
		rerender(<Avatar color="primary" name="Alex Example" size="md" src={next} testId="avatar" />);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
		expect(image()).toHaveAttribute('src', next);
		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded'),
		);
		expect(screen.queryByTestId('avatar-fallback')).toBeNull();
	});

	it('shows the initials again while the new src loads after the previous one loaded', async () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);
		await waitFor(() => expect(screen.queryByTestId('avatar-fallback')).toBeNull());

		rerender(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AE');
	});

	it('loads the new image in a reused avatar, as a row of a list does', async () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src={newImage()} testId="avatar" />,
		);
		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded'),
		);

		rerender(
			<Avatar color="primary" name="Sam Rivers" size="md" src={newImage()} testId="avatar" />,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('SR');
		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded'),
		);
	});

	it('does not keep the failure of a src it had before the last one', () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src="/first.png" testId="avatar" />,
		);
		fireEvent.error(image());
		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'error');

		rerender(
			<Avatar color="primary" name="Alex Example" size="md" src="/second.png" testId="avatar" />,
		);
		rerender(
			<Avatar color="primary" name="Alex Example" size="md" src="/first.png" testId="avatar" />,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
		expect(image()).toHaveAttribute('src', '/first.png');
	});

	it('ignores the error of an image that is no longer the current one', () => {
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src="/first.png" testId="avatar" />,
		);
		const stale = image();

		rerender(
			<Avatar color="primary" name="Alex Example" size="md" src="/second.png" testId="avatar" />,
		);
		fireEvent.error(stale);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loading');
	});

	it('keeps the status while an unrelated prop changes', async () => {
		const source = newImage();
		const { rerender } = render(
			<Avatar color="primary" name="Alex Example" size="md" src={source} testId="avatar" />,
		);
		await waitFor(() =>
			expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded'),
		);

		rerender(
			<Avatar
				color="primary"
				name="Alex Example"
				size="sm"
				shape="square"
				src={source}
				testId="avatar"
			/>,
		);

		expect(screen.getByTestId('avatar')).toHaveAttribute('data-image-status', 'loaded');
	});
});

describe('Avatar image after hydration', () => {
	it('reads an image that failed before hydration as failed', async () => {
		const element = (
			<Avatar color="primary" name="Alex Example" size="md" src="/alex.png" testId="avatar" />
		);
		const container = document.createElement('div');
		container.innerHTML = renderToString(element);
		document.body.append(container);
		onTestFinished(swallowImageEvents());
		// The browser tried the image and gave up before React attached `onError`.
		vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
		vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(0);
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockRejectedValue(
			new DOMException('broken', 'EncodingError'),
		);
		const error = vi.spyOn(console, 'error');
		let root: Root | undefined;

		act(() => {
			root = hydrateRoot(container, element);
		});

		try {
			await waitFor(() =>
				expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute(
					'data-image-status',
					'error',
				),
			);
			expect(container.querySelector('[data-slot="avatar-image"]')).toBeNull();
			expect(container.querySelector('[data-slot="avatar-fallback"]')).toHaveTextContent('AE');
			expect(error).not.toHaveBeenCalled();
		} finally {
			act(() => {
				root?.unmount();
			});
			container.remove();
		}
	});
});
