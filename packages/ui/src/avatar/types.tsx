import type { AriaAttributes, ComponentProps, RefAttributes } from 'react';
import type { AvatarColor, AvatarImageStatus, AvatarShape, AvatarSize } from './constants.js';

export type AvatarSizeType = (typeof AvatarSize)[keyof typeof AvatarSize];

export type AvatarColorType = (typeof AvatarColor)[keyof typeof AvatarColor];

export type AvatarShapeType = (typeof AvatarShape)[keyof typeof AvatarShape];

export type AvatarImageStatusType = (typeof AvatarImageStatus)[keyof typeof AvatarImageStatus];

export type AvatarProps = Pick<ComponentProps<'span'>, 'id'> &
	AriaAttributes & {
		/**
		 * The name of the person. The initials come from it, and it is the accessible name of the
		 * avatar, so a screen reader reads it once and never spells out the letters.
		 *
		 * A name with two or more words gives the first letter of the first word and of the last
		 * one, `Alex Example` is `AE`. One word gives its first letter. An email address uses the part
		 * before the `@`, and the dots in it do not split words, `alex.example@example.com` is `A`.
		 *
		 * @note An empty or blank name has no initials: the avatar shows a generic user icon, and its
		 * accessible name is `Unknown user`.
		 */
		name: string;
		/**
		 * The URL of the person's image. Without it, or when it fails to load, the avatar shows the
		 * initials.
		 *
		 * @note The initials stay until the image has loaded. Changing `src` loads the new image,
		 * even after the previous one failed.
		 */
		src?: string;
		/**
		 * The size of the avatar: `sm` is 24px with an 11px letter, `md` is 32px with a 13px letter.
		 * The same sizes as `Skeleton.Avatar`.
		 */
		size: AvatarSizeType;
		/**
		 * Picks the fill behind the initials and the color of the initials. Same palette as
		 * `Badge`'s `color`.
		 *
		 * @note The generic user icon takes the same colors as the initials.
		 */
		color: AvatarColorType;
		/**
		 * The shape of the avatar. Same union as `Skeleton.Avatar`.
		 *
		 * @default 'circle'
		 */
		shape?: AvatarShapeType;
		/**
		 * Forwarded to the root as `data-testid`. The image takes `${testId}-image` and the initials
		 * or the icon `${testId}-fallback`.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the root.
		 */
		[key: `data-${string}`]: unknown;
	};

/**
 * The props the avatar refuses, and that it drops when one gets past the types. Each has a rule
 * below that says what to do instead.
 *
 * @access private
 */
export type AvatarRejectedKey = 'className' | 'style' | 'alt' | 'children' | 'loading' | 'onClick';

// The compiler prints these names, so a rejected prop reads as the rule instead of as a mismatch
// on `never`. The required key keeps a value from matching them.
interface TheAvatarTakesNoClassName {
	'`Avatar` takes no `className` or `style`: pick a `size`, a `shape` and a `color`': never;
}

interface TheAltIsTheName {
	'`alt` is `name`: it is the accessible name of the avatar, and the image inside has an empty `alt`': never;
}

interface TheInitialsComeFromTheName {
	'`children` are not the initials: they come from `name`': never;
}

interface ALoadingAvatarIsASkeleton {
	'`loading` is not a prop: render `Skeleton.Avatar` in its place while the person loads': never;
}

interface TheAvatarIsNotInteractive {
	'`onClick` is not a prop, the avatar is display only: put it in a `Button` or a menu trigger, which owns the click and the focus': never;
}

type RuleFor<T, Keys extends PropertyKey, Rule> = [Extract<keyof T, Keys>] extends [never]
	? unknown
	: Rule;

/**
 * Extra constraints layered on top of {@link AvatarProps} at the call site. Each rejected prop
 * names what to do instead.
 *
 * Resolves to `unknown` (which disappears from an intersection) while the props are valid, and to
 * a rule object when they are not.
 *
 * @access private
 */
export type ValidateAvatarProps<T> = RuleFor<T, 'className' | 'style', TheAvatarTakesNoClassName> &
	RuleFor<T, 'alt', TheAltIsTheName> &
	RuleFor<T, 'children', TheInitialsComeFromTheName> &
	RuleFor<T, 'loading', ALoadingAvatarIsASkeleton> &
	RuleFor<T, 'onClick', TheAvatarIsNotInteractive>;

/**
 * The props an avatar takes at the call site: `T`, its rules, the ref, and no other key. `T` is
 * inferred from the call site, so `T extends AvatarProps` alone never runs the excess property
 * check, and an object spread with a stray key in it would compile. Every key outside
 * {@link AvatarProps} that has no rule is pinned to `never`.
 *
 * @access private
 */
export type AvatarExactProps<T> = T &
	ValidateAvatarProps<T> &
	Record<
		Exclude<keyof T, keyof AvatarProps | keyof RefAttributes<HTMLSpanElement> | AvatarRejectedKey>,
		never
	> &
	RefAttributes<HTMLSpanElement>;
