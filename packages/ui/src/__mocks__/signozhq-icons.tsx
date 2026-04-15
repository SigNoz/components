import type * as React from 'react';

const createIcon = (testId: string, className?: string) =>
	function Icon(props: React.SVGProps<SVGSVGElement>) {
		return <svg data-testid={testId} className={className} {...props} />;
	};

export const Spinner = (props: React.SVGProps<SVGSVGElement>) => (
	<svg data-testid="spinner" className="animate-fast-spin" {...props} />
);

export const CircleAlert = createIcon('circle-alert');
export const CircleCheckBig = createIcon('circle-check-big');
export const Info = createIcon('info');
export const TriangleAlert = createIcon('triangle-alert');
export const X = createIcon('x');
export const Check = createIcon('check');
export const Slash = createIcon('slash');
export const ChevronDown = createIcon('chevron-down');
export const ChevronLeft = createIcon('chevron-left');
export const ChevronRight = createIcon('chevron-right');
export const Minus = createIcon('minus');
