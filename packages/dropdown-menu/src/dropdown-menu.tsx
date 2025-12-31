import './index.css';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

import { cn } from './lib/utils';

// Simplified API Type Definitions
export interface BaseMenuItem {
	key?: string;
	label?: React.ReactNode;
	disabled?: boolean;
	icon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	shortcut?: React.ReactNode;
	onClick?: (info: { key: string; keyPath: string[] }) => void;
	danger?: boolean;
	className?: string;
}

export interface MenuGroup extends BaseMenuItem {
	type: 'group';
	label: string;
	children: MenuItem[];
}

export interface MenuDivider {
	type: 'divider';
	key?: string;
}

export interface SubMenuItem extends BaseMenuItem {
	children: MenuItem[];
}

export interface CheckboxMenuItem extends BaseMenuItem {
	type: 'checkbox';
	key: string;
	label: React.ReactNode;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

export interface RadioMenuItem {
	type: 'radio';
	key: string;
	label: React.ReactNode;
	value: string;
	disabled?: boolean;
	className?: string;
}

export interface RadioGroupMenuItem {
	type: 'radio-group';
	key?: string;
	value?: string;
	onChange?: (value: string) => void;
	children: RadioMenuItem[];
}

export type MenuItem =
	| MenuGroup
	| MenuDivider
	| CheckboxMenuItem
	| RadioGroupMenuItem
	| (SubMenuItem & { type?: never })
	| (BaseMenuItem & { type?: never; children?: never });

export interface MenuProps {
	items: MenuItem[];
	search?: {
		placeholder?: string;
		searchIcon?: React.ReactNode;
		onSearchChange?: (value: string) => void;
	};
	loading?: boolean | { text?: string };
}

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
		inset?: boolean;
		leftIcon?: React.ReactNode;
	}
>(({ className, inset, leftIcon, children, ...props }, ref) => (
	<DropdownMenuPrimitive.SubTrigger
		ref={ref}
		data-slot="dropdown-menu-sub-trigger"
		className={cn(
			'flex cursor-default select-none items-center gap-2 rounded-sm px-3 py-[10px] text-sm leading-none outline-none transition-colors',
			'text-l1-foreground',
			'data-[state=open]:bg-[var(--bg-slate-100)]',
			' hover:bg-l1-background-hover dark:data-[state=open]:bg-[var(--bg-slate-300)]',
			inset && 'pl-8',
			className,
		)}
		{...props}
	>
		{leftIcon && (
			<span className="flex-shrink-0 h-[14px] w-[14px] flex items-center justify-center">
				{leftIcon}
			</span>
		)}
		{children}
		<ChevronRight className="ml-auto h-[14px] w-[14px] flex-shrink-0" />
	</DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
	DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.SubContent
		ref={ref}
		data-slot="dropdown-menu-sub-content"
		className={cn(
			'z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			'bg-l1-background border-[var(--bg-vanilla-400)] text-l1-foreground',
			className,
		)}
		{...props}
	/>
));
DropdownMenuSubContent.displayName =
	DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			data-slot="dropdown-menu-content"
			sideOffset={sideOffset}
			className={cn(
				'min-w-[8rem] overflow-hidden rounded border border-solid [border-image:none] py-1 [box-shadow:4px_10px_16px_2px_rgba(0,0,0,0.2)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				'bg-l1-background border-[var(--l2-border)] text-l1-foreground',
				className,
			)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export interface DropdownMenuItemProps
	extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
	inset?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	destructive?: boolean;
}

const DropdownMenuItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	DropdownMenuItemProps
>(
	(
		{ className, inset, leftIcon, rightIcon, destructive, children, ...props },
		ref,
	) => (
		<DropdownMenuPrimitive.Item
			ref={ref}
			data-slot="dropdown-menu-item"
			data-destructive={destructive ? '' : undefined}
			className={cn(
				'relative flex cursor-default select-none items-center gap-2 rounded-sm px-3 py-[10px] text-sm leading-none outline-none transition-colors w-full min-w-[177px]',
				'text-l1-foreground',
				'focus:bg-[var(--bg-slate-200)]',
				'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				'hover:bg-l1-background-hover',
				destructive &&
					'text-[var(--bg-cherry-500)] dark:text-[var(--bg-cherry-500)] ',
				inset && 'pl-8',
				className,
			)}
			{...props}
		>
			{leftIcon && (
				<span
					className={cn(
						'flex-shrink-0 h-[14px] w-[14px] flex items-center justify-center',
					)}
				>
					{leftIcon}
				</span>
			)}
			{children}
			{rightIcon && (
				<span className="ml-auto flex-shrink-0 h-[14px] w-[14px] flex items-center justify-center">
					{rightIcon}
				</span>
			)}
		</DropdownMenuPrimitive.Item>
	),
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<DropdownMenuPrimitive.CheckboxItem
		ref={ref}
		data-slot="dropdown-menu-checkbox-item"
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-[10px] pl-8 pr-3 text-sm leading-none outline-none transition-colors',
			'text-l1-foreground',
			'focus:bg-[var(--bg-slate-200)]',
			'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			' hover:bg-l1-background-hover',
			className,
		)}
		checked={checked}
		{...props}
	>
		<span
			data-slot="checkbox-indicator"
			className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
		>
			<DropdownMenuPrimitive.ItemIndicator>
				<Check size={14} />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
	DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		data-slot="dropdown-menu-radio-item"
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm py-[10px] pl-8 pr-3 text-sm leading-none outline-none transition-colors',
			'text-l1-foreground',
			'focus:bg-[var(--bg-slate-200)]',
			'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			' hover:bg-l1-background-hover',
			className,
		)}
		{...props}
	>
		<span
			data-slot="radio-indicator"
			className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
		>
			<DropdownMenuPrimitive.ItemIndicator>
				<Check size={14} />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		data-slot="dropdown-menu-label"
		className={cn(
			'px-3 py-2 text-[11px] font-medium uppercase tracking-[0.44px] leading-[100%]',
			'text-[var(--l3-foreground)]',
			inset && 'pl-8',
			className,
		)}
		{...props}
	/>
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		data-slot="dropdown-menu-separator"
		className={cn('-mx-1 my-1 h-px', 'bg-[var(--l2-border)]', className)}
		{...props}
	/>
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn(
				'ml-auto text-xs tracking-widest opacity-60 font-mono',
				className,
			)}
			{...props}
		/>
	);
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

// Helper function to render menu items recursively
const renderMenuItems = (
	items: MenuItem[],
	keyPath: string[] = [],
): React.ReactNode[] => {
	return items.map((item, index) => {
		const itemKey = item.key || `item-${index}`;
		const currentKeyPath = [...keyPath, itemKey];

		// Handle divider
		if ('type' in item && item.type === 'divider') {
			return <DropdownMenuSeparator key={itemKey || index} />;
		}

		// Handle group
		if ('type' in item && item.type === 'group') {
			return (
				<React.Fragment key={itemKey}>
					<DropdownMenuLabel>{item.label}</DropdownMenuLabel>
					{renderMenuItems(item.children, currentKeyPath)}
				</React.Fragment>
			);
		}

		// Handle checkbox
		if ('type' in item && item.type === 'checkbox') {
			return (
				<DropdownMenuCheckboxItem
					key={itemKey}
					checked={item.checked}
					onCheckedChange={item.onCheckedChange}
					className={item.className}
				>
					{item.label}
				</DropdownMenuCheckboxItem>
			);
		}

		// Handle radio group
		if ('type' in item && item.type === 'radio-group') {
			return (
				<DropdownMenuRadioGroup
					key={itemKey}
					value={item.value}
					onValueChange={item.onChange}
				>
					{item.children.map((radioItem) => (
						<DropdownMenuRadioItem
							key={radioItem.key}
							value={radioItem.value}
							disabled={radioItem.disabled}
							className={radioItem.className}
						>
							{radioItem.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			);
		}

		// Handle submenu (has children but not a group)
		if ('children' in item && item.children && item.children.length > 0) {
			return (
				<DropdownMenuSub key={itemKey}>
					<DropdownMenuSubTrigger
						leftIcon={item.icon}
						disabled={item.disabled}
						className={item.className}
					>
						{item.label}
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{renderMenuItems(item.children, currentKeyPath)}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			);
		}

		// Handle regular menu item
		const baseItem = item as BaseMenuItem;
		const handleSelect = () => {
			if (baseItem.onClick) {
				baseItem.onClick({ key: itemKey, keyPath: currentKeyPath });
			}
		};

		return (
			<DropdownMenuItem
				key={itemKey}
				leftIcon={baseItem.icon}
				rightIcon={baseItem.rightIcon}
				destructive={baseItem.danger}
				disabled={baseItem.disabled}
				onSelect={handleSelect}
				className={baseItem.className}
			>
				{baseItem.label}
				{baseItem.shortcut && (
					<DropdownMenuShortcut>{baseItem.shortcut}</DropdownMenuShortcut>
				)}
			</DropdownMenuItem>
		);
	});
};

// Loading state component
export interface DropdownMenuLoadingProps {
	className?: string;
	text?: string;
}

const DropdownMenuLoading: React.FC<DropdownMenuLoadingProps> = ({
	className,
	text = 'Loading...',
}) => {
	return (
		<div
			data-slot="dropdown-menu-loading"
			className={cn(
				'flex items-center justify-center gap-2 p-4 text-sm',
				'text-l1-foreground',
				className,
			)}
		>
			<Loader2 className="h-4 w-4 animate-spin" />
			<span>{text}</span>
		</div>
	);
};
DropdownMenuLoading.displayName = 'DropdownMenuLoading';

// Search component for dropdown
export interface DropdownMenuSearchProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	onSearchChange?: (value: string) => void;
	searchIcon?: React.ReactNode;
}

const DropdownMenuSearch = React.forwardRef<
	HTMLInputElement,
	DropdownMenuSearchProps
>(
	(
		{
			className,
			onSearchChange,
			searchIcon,
			placeholder = 'Search...',
			...props
		},
		ref,
	) => {
		const [value, setValue] = React.useState('');

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setValue(newValue);
			onSearchChange?.(newValue);
		};

		return (
			<div
				data-slot="dropdown-menu-search"
				className="relative px-1 py-2 border-b border-[var(--bg-vanilla-400)] dark:border-[var(--bg-slate-400)]"
			>
				{searchIcon && (
					<span
						data-slot="search-icon"
						className="absolute left-3 top-1/2 -translate-y-1/2 h-[14px] w-[14px] text-[var(--text-slate-400)] pointer-events-none"
					>
						{searchIcon}
					</span>
				)}
				<input
					ref={ref}
					type="text"
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					className={cn(
						'w-full px-3 py-2 pl-8 rounded border text-sm',
						'bg-[var(--bg-vanilla-100)] border-[var(--bg-vanilla-400)] text-l1-foreground',
						'dark:bg-[var(--bg-ink-500)] dark:border-[var(--bg-slate-400)] ',
						className,
					)}
					{...props}
				/>
			</div>
		);
	},
);
DropdownMenuSearch.displayName = 'DropdownMenuSearch';

// Simplified Dropdown Component (Ant Design-style API)
export interface DropdownProps
	extends Omit<
		React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
		'children'
	> {
	menu: MenuProps;
	children: React.ReactNode;
}

const Dropdown = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	DropdownProps
>(({ menu, children, sideOffset = 4, className, ...props }, ref) => {
	const { items, search, loading } = menu;
	const [, setSearchQuery] = React.useState('');

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		search?.onSearchChange?.(value);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent
				ref={ref}
				sideOffset={sideOffset}
				className={className}
				{...props}
			>
				{search && (
					<DropdownMenuSearch
						placeholder={search.placeholder}
						searchIcon={search.searchIcon}
						onSearchChange={handleSearchChange}
					/>
				)}
				{loading ? (
					<DropdownMenuLoading
						text={typeof loading === 'object' ? loading.text : undefined}
					/>
				) : (
					renderMenuItems(items)
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
});
Dropdown.displayName = 'Dropdown';

// Back button for nested menus
export interface DropdownMenuBackProps
	extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
	label: string;
	onBack?: () => void;
}

const DropdownMenuBack = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	DropdownMenuBackProps
>(({ className, label, onBack, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		data-slot="dropdown-menu-item"
		className={cn(
			'relative flex cursor-default select-none items-center gap-2 rounded-sm px-3 py-[10px] text-sm leading-none outline-none transition-colors font-medium',
			'text-l1-foreground',
			'focus:bg-[var(--bg-slate-200)]',
			'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			' hover:bg-l1-background-hover',
			className,
		)}
		onSelect={(e) => {
			e.preventDefault();
			onBack?.();
		}}
		{...props}
	>
		<ChevronLeft className="h-[14px] w-[14px] flex-shrink-0" />
		<span>{label}</span>
	</DropdownMenuPrimitive.Item>
));
DropdownMenuBack.displayName = 'DropdownMenuBack';

// Multi-step dropdown context
interface MultiStepContextType {
	currentStep: 'primary' | 'secondary';
	setCurrentStep: (step: 'primary' | 'secondary') => void;
}

const MultiStepContext = React.createContext<MultiStepContextType | null>(null);

// Multi-step dropdown component
export interface DropdownMenuMultiStepProps
	extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> {
	children: React.ReactNode;
}

const DropdownMenuMultiStep = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Root>,
	DropdownMenuMultiStepProps
>(({ children, ...props }) => {
	const [currentStep, setCurrentStep] = React.useState<'primary' | 'secondary'>(
		'primary',
	);
	const [open, setOpen] = React.useState(false);

	// Reset to primary when menu closes
	React.useEffect(() => {
		if (!open) {
			setCurrentStep('primary');
		}
	}, [open]);

	return (
		<MultiStepContext.Provider value={{ currentStep, setCurrentStep }}>
			<DropdownMenuPrimitive.Root {...props} open={open} onOpenChange={setOpen}>
				{children}
			</DropdownMenuPrimitive.Root>
		</MultiStepContext.Provider>
	);
});
DropdownMenuMultiStep.displayName = 'DropdownMenuMultiStep';

// Multi-step content component
export interface DropdownMenuMultiStepContentProps
	extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
	primaryContent: React.ReactNode;
	secondaryContent: React.ReactNode;
	secondaryLabel: string;
}

const DropdownMenuMultiStepContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	DropdownMenuMultiStepContentProps
>(
	(
		{
			primaryContent,
			secondaryContent,
			secondaryLabel,
			className,
			sideOffset = 4,
			...props
		},
		ref,
	) => {
		const context = React.useContext(MultiStepContext);
		if (!context) {
			throw new Error(
				'DropdownMenuMultiStepContent must be used within DropdownMenuMultiStep',
			);
		}

		const { currentStep, setCurrentStep } = context;

		const handleBack = () => {
			setCurrentStep('primary');
		};

		return (
			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					ref={ref}
					data-slot="dropdown-menu-content"
					sideOffset={sideOffset}
					className={cn(
						'min-w-[8rem] overflow-hidden rounded-md border border-solid [border-image:none] p-1 [box-shadow:4px_10px_16px_2px_rgba(0,0,0,0.2)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
						'bg-[var(--bg-vanilla-100)] border-[var(--l2-border)] text-l1-foreground',
						'dark:bg-[var(--bg-ink-400)] ',
						className,
					)}
					{...props}
				>
					{currentStep === 'primary' ? (
						primaryContent
					) : (
						<>
							<DropdownMenuBack label={secondaryLabel} onBack={handleBack} />
							<DropdownMenuSeparator />
							{secondaryContent}
						</>
					)}
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		);
	},
);
DropdownMenuMultiStepContent.displayName = 'DropdownMenuMultiStepContent';

// Multi-step trigger item component
export interface DropdownMenuMultiStepTriggerProps
	extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
	leftIcon?: React.ReactNode;
}

const DropdownMenuMultiStepTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	DropdownMenuMultiStepTriggerProps
>(({ className, leftIcon, children, ...props }, ref) => {
	const context = React.useContext(MultiStepContext);
	if (!context) {
		throw new Error(
			'DropdownMenuMultiStepTrigger must be used within DropdownMenuMultiStep',
		);
	}

	const { setCurrentStep } = context;

	return (
		<DropdownMenuPrimitive.Item
			ref={ref}
			data-slot="dropdown-menu-item"
			className={cn(
				'relative flex cursor-default select-none items-center gap-2 rounded-sm px-3 py-[10px] text-sm leading-none outline-none transition-colors',
				'text-l1-foreground',
				'focus:bg-[var(--bg-slate-200)]',
				'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				' hover:bg-l1-background-hover',
				className,
			)}
			onSelect={(e) => {
				e.preventDefault();
				setCurrentStep('secondary');
			}}
			{...props}
		>
			{leftIcon && (
				<span className="flex-shrink-0 h-[14px] w-[14px] flex items-center justify-center">
					{leftIcon}
				</span>
			)}
			{children}
			<ChevronRight className="ml-auto h-[14px] w-[14px] flex-shrink-0" />
		</DropdownMenuPrimitive.Item>
	);
});
DropdownMenuMultiStepTrigger.displayName = 'DropdownMenuMultiStepTrigger';

// Primary export - simplified API
export { Dropdown };

// Legacy exports (kept for backward compatibility, but use Dropdown instead)
export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
	DropdownMenuLoading,
	DropdownMenuSearch,
	DropdownMenuBack,
	DropdownMenuMultiStep,
	DropdownMenuMultiStepContent,
	DropdownMenuMultiStepTrigger,
};
