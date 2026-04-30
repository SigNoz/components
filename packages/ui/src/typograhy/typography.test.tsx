import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Typography } from './typography';

vi.mock('copy-text-to-clipboard', () => ({
	default: vi.fn(() => true),
}));

describe('Typography', () => {
	describe('color prop', () => {
		it('applies data-color attribute for danger', () => {
			render(<Typography color="danger">Error text</Typography>);
			const element = screen.getByText('Error text');
			expect(element).toHaveAttribute('data-color', 'danger');
		});

		it('applies data-color attribute for warning', () => {
			render(<Typography color="warning">Warning text</Typography>);
			const element = screen.getByText('Warning text');
			expect(element).toHaveAttribute('data-color', 'warning');
		});

		it('applies data-color attribute for success', () => {
			render(<Typography color="success">Success text</Typography>);
			const element = screen.getByText('Success text');
			expect(element).toHaveAttribute('data-color', 'success');
		});

		it('applies data-color attribute for muted', () => {
			render(<Typography color="muted">Muted text</Typography>);
			const element = screen.getByText('Muted text');
			expect(element).toHaveAttribute('data-color', 'muted');
		});
	});

	describe('strong prop', () => {
		it('applies data-strong attribute when true', () => {
			render(<Typography strong>Bold text</Typography>);
			const element = screen.getByText('Bold text');
			expect(element).toHaveAttribute('data-strong', 'true');
		});
	});

	describe('italic prop', () => {
		it('applies data-italic attribute when true', () => {
			render(<Typography italic>Italic text</Typography>);
			const element = screen.getByText('Italic text');
			expect(element).toHaveAttribute('data-italic', 'true');
		});
	});

	describe('code prop', () => {
		it('applies data-code attribute when true', () => {
			render(<Typography code>const x = 1</Typography>);
			const element = screen.getByText('const x = 1');
			expect(element).toHaveAttribute('data-code', 'true');
		});
	});

	describe('disabled prop', () => {
		it('applies data-disabled attribute when true', () => {
			render(<Typography disabled>Disabled text</Typography>);
			const element = screen.getByText('Disabled text');
			expect(element).toHaveAttribute('data-disabled', 'true');
		});
	});

	describe('level prop', () => {
		it('renders h1 and applies data-level for level 1', () => {
			render(
				<Typography variant="title" level={1}>
					Heading 1
				</Typography>
			);
			const element = screen.getByText('Heading 1');
			expect(element.tagName).toBe('H1');
			expect(element).toHaveAttribute('data-level', '1');
		});

		it('renders h3 and applies data-level for level 3', () => {
			render(
				<Typography variant="title" level={3}>
					Heading 3
				</Typography>
			);
			const element = screen.getByText('Heading 3');
			expect(element.tagName).toBe('H3');
			expect(element).toHaveAttribute('data-level', '3');
		});
	});

	describe('backward compatibility', () => {
		it('muted boolean prop still works', () => {
			render(<Typography muted>Muted via boolean</Typography>);
			const element = screen.getByText('Muted via boolean');
			expect(element).toHaveAttribute('data-muted', 'true');
		});
	});

	describe('Typography.Text', () => {
		it('renders with variant="text"', () => {
			render(<Typography.Text>Text content</Typography.Text>);
			const element = screen.getByText('Text content');
			expect(element.tagName).toBe('P');
			expect(element).toHaveAttribute('data-variant', 'text');
		});

		it('accepts all base props', () => {
			render(
				<Typography.Text color="danger" strong>
					Styled text
				</Typography.Text>
			);
			const element = screen.getByText('Styled text');
			expect(element).toHaveAttribute('data-color', 'danger');
			expect(element).toHaveAttribute('data-strong', 'true');
		});
	});

	describe('Typography.Title', () => {
		it('renders h1 by default (level=1)', () => {
			render(<Typography.Title>Title</Typography.Title>);
			const element = screen.getByText('Title');
			expect(element.tagName).toBe('H1');
			expect(element).toHaveAttribute('data-level', '1');
		});

		it('renders h3 for level=3', () => {
			render(<Typography.Title level={3}>Title 3</Typography.Title>);
			const element = screen.getByText('Title 3');
			expect(element.tagName).toBe('H3');
			expect(element).toHaveAttribute('data-level', '3');
		});
	});

	describe('Typography.Link', () => {
		it('renders as anchor element', () => {
			render(<Typography.Link href="/test">Link text</Typography.Link>);
			const element = screen.getByText('Link text');
			expect(element.tagName).toBe('A');
			expect(element).toHaveAttribute('href', '/test');
		});

		it('applies data-link attribute', () => {
			render(<Typography.Link href="/test">Link</Typography.Link>);
			const element = screen.getByText('Link');
			expect(element).toHaveAttribute('data-link', 'true');
		});

		it('accepts target and rel props', () => {
			render(
				<Typography.Link href="/test" target="_blank" rel="noopener">
					External
				</Typography.Link>
			);
			const element = screen.getByText('External');
			expect(element).toHaveAttribute('target', '_blank');
			expect(element).toHaveAttribute('rel', 'noopener');
		});
	});

	describe('copyable prop', () => {
		it('renders copy button when copyable is true', () => {
			render(<Typography copyable>Copy me</Typography>);
			const button = screen.getByRole('button', { name: 'Copy to clipboard' });
			expect(button).toBeInTheDocument();
		});

		it('does not render copy button when copyable is false', () => {
			render(<Typography>No copy</Typography>);
			expect(screen.queryByRole('button')).not.toBeInTheDocument();
		});

		it('changes aria-label to Copied after clicking', async () => {
			render(<Typography copyable>Copy text</Typography>);
			const button = screen.getByRole('button', { name: 'Copy to clipboard' });
			fireEvent.click(button);
			await waitFor(() => {
				expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
			});
		});
	});
});
