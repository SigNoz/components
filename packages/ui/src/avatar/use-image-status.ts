import { type SyntheticEvent, useRef, useState } from 'react';
import { AvatarImageStatus } from './constants.js';
import type { AvatarImageStatusType } from './types.js';

type ImageState = { src: string | undefined; status: AvatarImageStatusType };

/**
 * Where the image at `src` is in its loading: `undefined` without a `src`, otherwise `loading`
 * until the image has loaded and can be painted, or has failed.
 *
 * The status belongs to one `src`. A new `src` starts at `loading`, even when the last one
 * failed, and an event of an image that is no longer the current one changes nothing.
 *
 * @access private
 */
export function useImageStatus(src: string | undefined): {
	status: AvatarImageStatusType | undefined;
	onLoad: (event: SyntheticEvent<HTMLImageElement>) => void;
	onError: () => void;
	imageRef: (image: HTMLImageElement | null) => void;
} {
	const [state, setState] = useState<ImageState>({ src, status: AvatarImageStatus.Loading });
	const tracked = useRef<HTMLImageElement | null>(null);

	let current = state;
	if (state.src !== src) {
		current = { src, status: AvatarImageStatus.Loading };
		setState(current);
	}

	const settle = (status: AvatarImageStatusType): void =>
		setState((previous) =>
			previous.src === src && previous.status !== status ? { src, status } : previous,
		);

	// `load` says the image has arrived, not that it can be painted. With `decoding="async"` the
	// browser may present the page before it has decoded the picture, and the initials would be gone
	// with nothing in their place. `decode` resolves once the picture is ready, and rejects when its
	// data cannot be decoded, which keeps the initials.
	const settleOnceDecoded = (image: HTMLImageElement): void => {
		// jsdom has no `decode`, and there nothing is painted.
		if (typeof image.decode !== 'function') {
			settle(AvatarImageStatus.Loaded);
			return;
		}
		// A `src` that came back builds a new image, so the decode of the old one is not an answer.
		const settleIfTracked = (status: AvatarImageStatusType): void => {
			if (tracked.current === image) {
				settle(status);
			}
		};
		image.decode().then(
			() => settleIfTracked(AvatarImageStatus.Loaded),
			() => settleIfTracked(AvatarImageStatus.Error),
		);
	};

	return {
		status: src ? current.status : undefined,
		onLoad: (event) => settleOnceDecoded(event.currentTarget),
		onError: () => settle(AvatarImageStatus.Error),
		// An image that settled before React attached `onLoad` and `onError`, as one in
		// server-rendered markup can, never fires either again. React calls this again with the same
		// image whenever the function changes, and an image already looked at is left to its events, or
		// a render in the middle of a decode would settle it early.
		imageRef: (image) => {
			if (!image || image === tracked.current) {
				return;
			}
			tracked.current = image;
			if (!image.complete) {
				return;
			}
			if (image.naturalWidth > 0) {
				settle(AvatarImageStatus.Loaded);
				return;
			}
			// No width is a broken image, or an SVG with no size of its own. `decode` tells them apart.
			settleOnceDecoded(image);
		},
	};
}
