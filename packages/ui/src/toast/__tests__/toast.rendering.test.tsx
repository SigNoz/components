import { render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it } from 'vitest';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';
import { findToast, raise, slot, toasts } from './toast.test-utils.js';

describe('Toaster rendering', () => {
	it('renders an empty viewport with its slot', () => {
		render(<Toaster />);

		expect(slot('toaster')).toBeInTheDocument();
		expect(toasts()).toHaveLength(0);
	});

	it('forwards id, className, style, aria-* and data-* to the viewport', () => {
		render(
			<Toaster
				id="my-id"
				className="my-class"
				style={{ opacity: 0.99 }}
				aria-describedby="x"
				data-foo="bar"
			/>,
		);

		const viewport = slot('toaster');
		expect(viewport).toHaveAttribute('id', 'my-id');
		expect(viewport).toHaveClass('my-class');
		expect(viewport).toHaveStyle({ opacity: '0.99' });
		expect(viewport).toHaveAttribute('aria-describedby', 'x');
		expect(viewport).toHaveAttribute('data-foo', 'bar');
	});

	it('keeps data-slot and data-position out of the caller reach', () => {
		render(<Toaster data-slot="mine" data-position="nowhere" />);

		expect(slot('toaster')).toHaveAttribute('data-position', 'top-right');
	});

	describe('test ids', () => {
		it('takes testId as data-testid, and a raw data-testid when there is no testId', () => {
			const { rerender } = render(<Toaster testId="my-toaster" />);
			expect(screen.getByTestId('my-toaster')).toBe(slot('toaster'));

			rerender(<Toaster data-testid="raw" />);
			expect(screen.getByTestId('raw')).toBe(slot('toaster'));
		});

		it('gives each part of a toast its slot and a test id built from the toaster', async () => {
			render(<Toaster testId="my-toaster" />);
			raise(() => toast.success('Saved', { description: 'All good', id: 'one' }));

			const item = await screen.findByTestId('my-toaster-toast-one');
			expect(item).toHaveAttribute('data-slot', 'toast');
			expect(item).toHaveAttribute('data-type', 'success');
			for (const part of ['content', 'icon', 'title', 'description']) {
				expect(screen.getByTestId(`my-toaster-toast-one-${part}`)).toHaveAttribute(
					'data-slot',
					`toast-${part}`,
				);
			}
			expect(screen.getByTestId('my-toaster-toast-one-title')).toHaveTextContent('Saved');
			expect(screen.getByTestId('my-toaster-toast-one-description')).toHaveTextContent('All good');
		});

		it('uses the testId a toast was raised with', async () => {
			render(<Toaster testId="my-toaster" />);
			raise(() => toast.info('Hello', { testId: 'hello' }));

			expect(await screen.findByTestId('hello')).toHaveAttribute('data-slot', 'toast');
			expect(screen.getByTestId('hello-title')).toHaveTextContent('Hello');
		});

		it('sets no data-testid on a toast when neither the toaster nor the call has one', async () => {
			render(<Toaster />);
			raise(() => toast.info('Hello', { description: 'There' }));

			const item = await findToast('Hello');
			// The icon mocks carry a test id of their own, so only the parts of the toast are checked.
			expect(item.querySelectorAll('[data-slot][data-testid]')).toHaveLength(0);
			expect(item).not.toHaveAttribute('data-testid');
		});
	});

	describe('content', () => {
		it('renders the title as a heading and the description as a paragraph', async () => {
			render(<Toaster />);
			raise(() => toast.info('Title', { description: 'Description' }));

			await findToast('Title');
			expect(slot('toast-title')?.tagName).toBe('H2');
			expect(slot('toast-description')?.tagName).toBe('P');
		});

		it('renders a ReactNode title and description', async () => {
			render(<Toaster />);
			raise(() => toast.info(<strong>Bold</strong>, { description: <em>Italic</em>, id: 'node' }));

			expect(await screen.findByText('Bold', { selector: 'strong' })).toBeInTheDocument();
			expect(slot('toast-description')?.querySelector('em')).toHaveTextContent('Italic');
		});

		it('shows the icon of each variant, one glyph for warning and danger', async () => {
			render(<Toaster />);
			raise(() => {
				toast.success('a');
				toast.info('b');
				toast.warning('c');
				toast.danger('d', { action: { label: 'Close' } });
			});

			await findToast('a');
			const icon = (type: string) =>
				slot(
					'toast-icon',
					toasts().find((item) => item.dataset.type === type),
				)?.querySelector('svg')?.dataset.testid;
			expect(icon('success')).toBe('solid-check-circle-2');
			expect(icon('info')).toBe('solid-info-circle');
			expect(icon('warning')).toBe('solid-alert-circle');
			expect(icon('danger')).toBe('solid-alert-circle');
		});

		it('shows a spinner for a loading toast', async () => {
			render(<Toaster />);
			raise(() => toast.loading('Working'));

			const item = await findToast('Working');
			expect(item).toHaveAttribute('data-type', 'loading');
			expect(slot('toast-icon', item)?.querySelector('[data-slot="spinner"]')).not.toBeNull();
		});
	});

	it('loses a toast raised while no Toaster is mounted', async () => {
		toast.info('Too early');
		render(<Toaster />);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(toasts()).toHaveLength(0);
	});

	it('shows a toast raised in an effect on the first render of a component placed after it', async () => {
		function RaiseOnMount() {
			useEffect(() => {
				toast.info('Raised on mount');
			}, []);

			return null;
		}

		render(
			<>
				<Toaster />
				<RaiseOnMount />
			</>,
		);

		await findToast('Raised on mount');
	});

	describe('empty text', () => {
		it.each([[undefined], [null], [false], [true], [''], [[]], [[null, '', false]]])(
			'shows nothing for a title of %j',
			(title) => {
				render(<Toaster />);

				expect(raise(() => toast.info(title))).toBe('');
				expect(toasts()).toHaveLength(0);
			},
		);

		it('shows a toast whose title is an array holding text', async () => {
			render(<Toaster />);
			raise(() => toast.info([null, 'Saved']));

			await findToast('Saved');
		});

		it('shows a toast that only has a description', async () => {
			render(<Toaster />);
			raise(() => toast.info(undefined, { description: 'Only this' }));

			await screen.findByText('Only this');
			expect(slot('toast-title')).toBeNull();
		});

		it('takes no place in the stack', async () => {
			render(<Toaster />);
			raise(() => {
				toast.info('');
				toast.info('');
				toast.info('');
				toast.info('real');
			});

			const item = await findToast('real');
			expect(toasts()).toHaveLength(1);
			expect(item).not.toHaveAttribute('data-limited');
		});
	});
});
