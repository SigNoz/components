import { forwardRef, type ReactElement } from 'react';
import { type RejectedProps, partTestId } from '../lib/utils.js';
import styles from './avatar.module.scss';
import { AvatarImageStatus, AvatarShape, UNKNOWN_USER_LABEL } from './constants.js';
import { AvatarFallback } from './subcomponents/avatar-fallback.js';
import type { AvatarExactProps, AvatarProps, AvatarRejectedKey } from './types.js';
import { useImageStatus } from './use-image-status.js';
import { getInitials } from './utils.js';

const AvatarImpl = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
	{
		name,
		src,
		size,
		color,
		shape = AvatarShape.Circle,
		testId,
		'aria-label': ariaLabel,
		className: _className,
		style: _style,
		alt: _alt,
		children: _children,
		loading: _loading,
		onClick: _onClick,
		...props
	}: AvatarProps & RejectedProps<AvatarRejectedKey>,
	ref,
) {
	const { status, onLoad, onError, imageRef } = useImageStatus(src);
	const initials = getInitials(name);

	return (
		<span
			{...props}
			ref={ref}
			// Written after the spread, so a stray `role` cannot change what the avatar is.
			// eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- the root holds the image and the initials, an <img> cannot hold children.
			role="img"
			aria-label={ariaLabel ?? (initials === '' ? UNKNOWN_USER_LABEL : name)}
			data-slot="avatar"
			data-size={size}
			data-shape={shape}
			data-color={color}
			data-image-status={status}
			className={styles.avatar}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			{status !== undefined && status !== AvatarImageStatus.Error && (
				<img
					key={src}
					ref={imageRef}
					// React 18 sets the attributes in this order, and an image starts loading once it has a
					// `src`, so `loading` has to be set before it.
					loading="lazy"
					decoding="async"
					src={src}
					alt=""
					data-slot="avatar-image"
					data-testid={partTestId(testId, 'image')}
					className={styles['avatar__image']}
					onLoad={onLoad}
					onError={onError}
				/>
			)}
			{status !== AvatarImageStatus.Loaded && (
				<AvatarFallback initials={initials} size={size} testId={testId} />
			)}
		</span>
	);
});
AvatarImpl.displayName = 'Avatar';

/**
 * Renders a small picture that stands for a person: their image when there is one, their initials
 * when there is not.
 *
 * `id`, every `aria-*` and any `data-*` are forwarded to the avatar.
 *
 * `className` and `style` are not props, and a value that gets past the types is dropped. So are
 * `alt`, `children`, `loading` and `onClick`.
 *
 * Visual values are `--avatar-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * The avatar is display only. It is not focusable, it has no hover and it takes no click. A
 * clickable avatar is an `Avatar` inside a `Button` or a menu trigger, which owns the click and the
 * focus.
 *
 * ### Image
 *
 * The image fills the shape, cropped and centred, so it never stretches. It loads lazily.
 *
 * The initials show while it loads and stay when it fails. The image replaces them only once it
 * has loaded and been decoded, so the avatar is never an empty shape. A new `src` loads again, even
 * after the last one failed.
 *
 * ### Accessibility
 *
 * The avatar is `role="img"` and its `aria-label` is `name`, or `Unknown user` when `name` is
 * blank. The image has an empty `alt`, and the initials and the icon are `aria-hidden`.
 *
 * When the name is printed next to the avatar, pass `aria-hidden="true"` so a screen reader does
 * not read it twice.
 *
 * ### Color
 *
 * `color` is required. It picks the fill behind the initials and the color of the initials, and
 * the generic user icon takes the same pair. It is one of `primary`, `secondary`, `danger`,
 * `warning`, `success`, `info`, `archive` and `highlight-danger`, the same palette as `Badge`. An
 * image covers the fill once it has loaded.
 *
 * ### Size
 *
 * The size comes from `size`. The avatar does not shrink in a flex row, and the root clips the
 * image and the initials to its shape.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the avatar, `${testId}-image` on the image and
 * `${testId}-fallback` on the initials or the icon. Otherwise use the role and the data
 * attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"avatar"` |
 * | `data-size`, `data-shape`, `data-color` | mirrors the prop |
 * | `data-image-status` | `loading`, `loaded` or `error`, present only with a `src` |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `avatar-image` | with a `src`, until the image fails |
 * | `avatar-fallback` | until the image has loaded |
 *
 * @example
 * ```tsx
 * <Avatar name="Alex Example" size="md" color="primary" />
 * ```
 *
 * @example
 * ```tsx
 * // With the name printed next to it, hidden from a screen reader
 * <Avatar name={user.email} src={user.avatarUrl} size="sm" color="primary" aria-hidden="true" />
 * ```
 */
export const Avatar = AvatarImpl as <T extends AvatarProps>(
	props: AvatarExactProps<T>,
) => ReactElement;
