import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Input } from '../input.js';

function Reveal() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				Edit
			</button>
			{open && <Input aria-label="Field" ref={(node) => node?.focus()} testId="field" />}
		</>
	);
}

// Its own file, so no field has mounted in this module graph before the click: the modality has
// to be tracked from the moment the module loads, not from the first field mount.
describe('Input focus ring on the first mount', () => {
	it('keeps the ring off when a click mounts the first field and focuses it', async () => {
		const user = userEvent.setup();
		render(<Reveal />);

		await user.click(screen.getByRole('button', { name: 'Edit' }));

		expect(screen.getByRole('textbox')).toHaveFocus();
		expect(screen.getByTestId('field')).not.toHaveAttribute('data-focus-visible');
	});
});
