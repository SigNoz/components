import type * as React from 'react';

export const Spinner = (props: React.SVGProps<SVGSVGElement>) => (
	<svg data-testid="spinner" className="animate-fast-spin" {...props} />
);
