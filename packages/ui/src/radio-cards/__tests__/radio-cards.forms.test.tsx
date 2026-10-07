import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RadioCards } from '../radio-cards.js';
import { ITEMS } from './radio-cards.test-utils.js';

function form(): HTMLFormElement {
	return screen.getByRole('form') as HTMLFormElement;
}

describe('RadioCards in a form', () => {
	it('submits the checked value under name', () => {
		render(
			<form aria-label="Onboarding">
				<RadioCards aria-label="Signal" items={ITEMS} name="signal" defaultValue="traces" />
			</form>,
		);

		expect(new FormData(form()).getAll('signal')).toEqual(['traces']);
	});

	it('submits a group rendered outside the form through form', () => {
		render(
			<>
				<form aria-label="Onboarding" id="onboarding" />
				<RadioCards
					aria-label="Signal"
					items={ITEMS}
					name="signal"
					form="onboarding"
					defaultValue="logs"
				/>
			</>,
		);

		expect(new FormData(form()).getAll('signal')).toEqual(['logs']);
	});

	it('leaves a disabled group out of the submit', () => {
		render(
			<form aria-label="Onboarding">
				<RadioCards
					aria-label="Signal"
					items={ITEMS}
					name="signal"
					defaultValue="traces"
					disabled
					disabledTooltip="Ask an admin"
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('signal')).toEqual([]);
	});

	it('submits a read-only group', () => {
		render(
			<form aria-label="Onboarding">
				<RadioCards
					aria-label="Signal"
					items={ITEMS}
					name="signal"
					defaultValue="traces"
					readOnly
					readOnlyTooltip="Saving"
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('signal')).toEqual(['traces']);
	});

	it('blocks the submit while required and no card is checked', async () => {
		const user = userEvent.setup();
		render(
			<form aria-label="Onboarding">
				<RadioCards aria-label="Signal" items={ITEMS} name="signal" required />
			</form>,
		);

		expect(form().checkValidity()).toBe(false);

		await user.click(screen.getByRole('radio', { name: 'Logs' }));

		expect(form().checkValidity()).toBe(true);
	});

	it('drops required from every card once one is checked, since an unnamed radio is its own group', async () => {
		const user = userEvent.setup();
		const { container } = render(
			<form aria-label="Onboarding">
				<RadioCards aria-label="Signal" items={ITEMS} required />
			</form>,
		);

		expect(container.querySelectorAll('input[required]')).toHaveLength(3);

		await user.click(screen.getByRole('radio', { name: 'Logs' }));

		expect(container.querySelectorAll('input[required]')).toHaveLength(0);
		expect(form().checkValidity()).toBe(true);
	});

	it('submits nothing once allowClear unchecks the card, and blocks a required group', async () => {
		const user = userEvent.setup();
		render(
			<form aria-label="Onboarding">
				<RadioCards
					aria-label="Signal"
					items={ITEMS}
					name="signal"
					defaultValue="logs"
					required
					allowClear
				/>
			</form>,
		);

		await user.click(screen.getByRole('radio', { name: 'Logs' }));

		expect(new FormData(form()).getAll('signal')).toEqual([]);
		expect(form().checkValidity()).toBe(false);
	});

	it.each([
		['a value that matches no item', 'newrelic', false],
		['a checked card that is disabled', 'profiles', true],
	])('submits nothing for %s, and it fills required: %s', (_, defaultValue, isValid) => {
		render(
			<form aria-label="Onboarding">
				<RadioCards
					aria-label="Signal"
					items={[
						...ITEMS,
						{ label: 'Profiles', value: 'profiles', disabled: true, disabledTooltip: 'Soon' },
					]}
					name="signal"
					defaultValue={defaultValue}
					required
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('signal')).toEqual([]);
		// A native radio group counts a disabled checked radio, though it submits nothing.
		expect(form().checkValidity()).toBe(isValid);
	});
});

describe('RadioCards.Multiple in a form', () => {
	it('submits one name entry per checked card', () => {
		render(
			<form aria-label="Onboarding">
				<RadioCards.Multiple
					aria-label="Tools"
					items={ITEMS}
					name="tools"
					defaultValue={['logs', 'metrics']}
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('tools')).toEqual(['logs', 'metrics']);
	});

	it('submits a group rendered outside the form through form', () => {
		render(
			<>
				<form aria-label="Onboarding" id="onboarding" />
				<RadioCards.Multiple
					aria-label="Tools"
					items={ITEMS}
					name="tools"
					form="onboarding"
					defaultValue={['traces']}
				/>
			</>,
		);

		expect(new FormData(form()).getAll('tools')).toEqual(['traces']);
	});

	it('leaves a disabled group out of the submit', () => {
		render(
			<form aria-label="Onboarding">
				<RadioCards.Multiple
					aria-label="Tools"
					items={ITEMS}
					name="tools"
					defaultValue={['logs']}
					disabled
					disabledTooltip="Ask an admin"
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('tools')).toEqual([]);
	});

	it('submits a read-only group', () => {
		render(
			<form aria-label="Onboarding">
				<RadioCards.Multiple
					aria-label="Tools"
					items={ITEMS}
					name="tools"
					defaultValue={['logs']}
					readOnly
					readOnlyTooltip="Saving"
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('tools')).toEqual(['logs']);
	});

	it('blocks the submit while required and empty, and accepts any one card', async () => {
		const user = userEvent.setup();
		render(
			<form aria-label="Onboarding">
				<RadioCards.Multiple aria-label="Tools" items={ITEMS} name="tools" required allowClear />
			</form>,
		);

		expect(form().checkValidity()).toBe(false);

		await user.click(screen.getByRole('checkbox', { name: 'Traces' }));
		expect(form().checkValidity()).toBe(true);

		await user.click(screen.getByRole('checkbox', { name: 'Traces' }));
		expect(form().checkValidity()).toBe(false);
	});

	it('counts neither a value that matches no item nor a disabled card toward required', () => {
		render(
			<form aria-label="Onboarding">
				<RadioCards.Multiple
					aria-label="Tools"
					items={[
						...ITEMS,
						{ label: 'Profiles', value: 'profiles', disabled: true, disabledTooltip: 'Soon' },
					]}
					name="tools"
					defaultValue={['newrelic', 'profiles']}
					required
				/>
			</form>,
		);

		expect(new FormData(form()).getAll('tools')).toEqual([]);
		expect(form().checkValidity()).toBe(false);
	});
});
