import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { getLinkProps } from './link-props.js';

const anchor = (props: Record<string, unknown> = {}) => createElement('a', props);

describe('getLinkProps', () => {
	describe('href', () => {
		it('takes the href of the link when the element sets none', () => {
			expect(getLinkProps(anchor(), { href: '/docs' }).props).toEqual({ href: '/docs' });
		});

		it('takes the href of the link when the element sets it to undefined', () => {
			expect(getLinkProps(anchor({ href: undefined }), { href: '/docs' }).props).toEqual({
				href: '/docs',
			});
		});

		it('keeps the href of the element over the one of the link', () => {
			expect(getLinkProps(anchor({ href: '/element' }), { href: '/link' }).props).toEqual({
				href: '/element',
			});
		});

		it('passes an empty href through, it is a destination', () => {
			const result = getLinkProps(anchor(), { href: '' });

			expect(result.props).toEqual({ href: '' });
			expect(result.hasDestination).toBe(true);
		});
	});

	describe('target', () => {
		it('takes the target of the link when the element sets none', () => {
			expect(getLinkProps(anchor(), { target: '_self' }).props).toEqual({ target: '_self' });
		});

		it('takes the target of the link when the element sets it to undefined', () => {
			expect(getLinkProps(anchor({ target: undefined }), { target: '_self' }).props).toEqual({
				target: '_self',
			});
		});

		it('keeps the target of the element over the one of the link', () => {
			expect(getLinkProps(anchor({ target: '_self' }), { target: '_blank' }).props).toEqual({
				target: '_self',
			});
		});
	});

	describe('rel', () => {
		it('adds noopener and noreferrer for a _blank target of the link', () => {
			expect(getLinkProps(anchor(), { target: '_blank' }).props).toEqual({
				target: '_blank',
				rel: 'noopener noreferrer',
			});
		});

		it('adds noopener and noreferrer for a _blank target of the element', () => {
			expect(getLinkProps(anchor({ target: '_blank' }), {}).props).toEqual({
				target: '_blank',
				rel: 'noopener noreferrer',
			});
		});

		it('keeps the values the element has next to the two it adds', () => {
			expect(
				getLinkProps(anchor({ rel: 'nofollow author' }), { target: '_blank' }).props,
			).toMatchObject({ rel: 'nofollow author noopener noreferrer' });
		});

		it('adds each value once when the element has one of them already', () => {
			expect(
				getLinkProps(anchor({ rel: 'noopener nofollow' }), { target: '_blank' }).props,
			).toMatchObject({ rel: 'noopener nofollow noreferrer' });
			expect(
				getLinkProps(anchor({ rel: 'noopener noreferrer' }), { target: '_blank' }).props,
			).toMatchObject({ rel: 'noopener noreferrer' });
		});

		it('reads the values of the element however much white space separates them', () => {
			expect(
				getLinkProps(anchor({ rel: '  nofollow \t author  ' }), { target: '_blank' }).props,
			).toMatchObject({ rel: 'nofollow author noopener noreferrer' });
		});

		it('leaves the rel of the element alone without a _blank target', () => {
			expect(getLinkProps(anchor({ rel: 'nofollow' }), { href: '/docs' }).props).toEqual({
				href: '/docs',
			});
			expect(getLinkProps(anchor({ rel: 'nofollow' }), { target: '_self' }).props).toEqual({
				target: '_self',
			});
		});

		it('adds none when the target of the element is not _blank, though the one of the link is', () => {
			expect(getLinkProps(anchor({ target: '_self' }), { target: '_blank' }).props).toEqual({
				target: '_self',
			});
		});
	});

	describe('unset props', () => {
		it('leaves out every prop neither side sets', () => {
			expect(getLinkProps(anchor(), {}).props).toEqual({});
			expect(Object.keys(getLinkProps(anchor(), {}).props)).toEqual([]);
		});

		it('leaves out the props the link passes as undefined', () => {
			const { props } = getLinkProps(anchor(), { href: undefined, target: undefined });

			expect(Object.keys(props)).toEqual([]);
		});

		it('leaves out the href when only the target is set', () => {
			const { props } = getLinkProps(anchor(), { target: '_self' });

			expect(props).not.toHaveProperty('href');
			expect(props).not.toHaveProperty('rel');
		});

		it('leaves out the target and the rel when only the href is set', () => {
			const { props } = getLinkProps(anchor(), { href: '/docs' });

			expect(props).not.toHaveProperty('target');
			expect(props).not.toHaveProperty('rel');
		});
	});

	describe('hasDestination', () => {
		it('is true for an href of the link', () => {
			expect(getLinkProps(anchor(), { href: '/docs' }).hasDestination).toBe(true);
		});

		it('is true for an href of the element', () => {
			expect(getLinkProps(anchor({ href: '/docs' }), {}).hasDestination).toBe(true);
		});

		it('is true for the `to` of a router link', () => {
			expect(getLinkProps(createElement('a', { to: '/docs' }), {}).hasDestination).toBe(true);
		});

		it('is true for a `to` that is an object', () => {
			expect(
				getLinkProps(createElement('a', { to: { pathname: '/docs' } }), {}).hasDestination,
			).toBe(true);
		});

		it('does not put the `to` of the element into the props', () => {
			expect(getLinkProps(createElement('a', { to: '/docs' }), {}).props).toEqual({});
		});

		it('is false when neither side says where it goes', () => {
			expect(getLinkProps(anchor(), {}).hasDestination).toBe(false);
			expect(getLinkProps(anchor(), { target: '_blank' }).hasDestination).toBe(false);
			expect(getLinkProps(anchor({ rel: 'nofollow' }), {}).hasDestination).toBe(false);
		});

		it('is false for an href and a `to` that are undefined or null', () => {
			expect(
				getLinkProps(createElement('a', { href: undefined, to: undefined }), { href: undefined })
					.hasDestination,
			).toBe(false);
			expect(getLinkProps(createElement('a', { to: null }), {}).hasDestination).toBe(false);
		});
	});

	it('does not change the element it reads', () => {
		const element = anchor({ rel: 'nofollow' });

		getLinkProps(element, { href: '/docs', target: '_blank' });

		expect(element.props).toEqual({ rel: 'nofollow' });
	});
});
