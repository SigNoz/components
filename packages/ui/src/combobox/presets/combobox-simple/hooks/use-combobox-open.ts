import * as React from 'react';

export type UseComboboxOpenOptions = {
	disabled?: boolean;
};

export type UseComboboxOpenReturn = {
	open: boolean;
	setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
};

export function useComboboxOpen({
	disabled = false,
}: UseComboboxOpenOptions = {}): UseComboboxOpenReturn {
	const [open, setOpenInternal] = React.useState(false);

	const setOpen = React.useCallback(
		(value: boolean | ((prev: boolean) => boolean)) => {
			if (disabled) return;
			setOpenInternal(value);
		},
		[disabled]
	);

	return { open, setOpen };
}
