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
export const ArrowUpDown = createIcon('arrow-up-down');
export const Calendar = createIcon('calendar');
export const X = createIcon('x');
export const Check = createIcon('check');
export const Slash = createIcon('slash');
export const ChevronDown = createIcon('chevron-down');
export const ChevronLeft = createIcon('chevron-left');
export const ChevronRight = createIcon('chevron-right');
export const ChevronsLeft = createIcon('chevrons-left');
export const ChevronsRight = createIcon('chevrons-right');
export const ChevronUp = createIcon('chevron-up');
export const Ellipsis = createIcon('ellipsis');
export const Eye = createIcon('eye');
export const EyeOff = createIcon('eye-off');
export const Filter = createIcon('filter');
export const GripVertical = createIcon('grip-vertical');
export const LoaderCircle = createIcon('loader-circle');
export const Lock = createIcon('lock');
export const Minus = createIcon('minus');
export const MousePointerClick = createIcon('mouse-pointer-click');
export const Pin = createIcon('pin');
export const PinOff = createIcon('pin-off');
export const Search = createIcon('search');
export const SolidAlertTriangle = createIcon('solid-alert-triangle');
export const SolidCheckCircle2 = createIcon('solid-check-circle-2');
export const SolidInfoCircle = createIcon('solid-info-circle');
export const SolidXCircle = createIcon('solid-x-circle');
