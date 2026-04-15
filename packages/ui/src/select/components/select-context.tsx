import * as React from 'react';

export type SelectContextValue = {
	multiple: boolean;
	value: string[];
	onValueChange: (value: string) => void;
	onRemove: (value: string) => void;
};

export const SelectContext = React.createContext<SelectContextValue | null>(null);

export function useSelectContext() {
	const context = React.useContext(SelectContext);
	return context;
}
