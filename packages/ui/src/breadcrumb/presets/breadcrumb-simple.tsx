import { ChevronRight } from '@signozhq/icons';
import * as React from 'react';
import { useMemo } from 'react';
import styles from '../breadcrumb.module.scss';
import { Breadcrumb, type BreadcrumbProps } from '../subcomponents/breadcrumb.js';
import { BreadcrumbDropdown } from '../subcomponents/breadcrumb-dropdown.js';
import { BreadcrumbItem } from '../subcomponents/breadcrumb-item.js';
import { BreadcrumbLink } from '../subcomponents/breadcrumb-link.js';
import { BreadcrumbList } from '../subcomponents/breadcrumb-list.js';
import { BreadcrumbPage } from '../subcomponents/breadcrumb-page.js';
import { BreadcrumbSeparator } from '../subcomponents/breadcrumb-separator.js';
import type { BreadcrumbItemType } from '../subcomponents/breadcrumb-types.js';

const CHEVRON_SEPARATOR = <ChevronRight size={14} />;

export type BreadcrumbSimpleProps = BreadcrumbProps & {
	/**
	 * The breadcrumb items to display.
	 */
	items: BreadcrumbItemType[];
	/**
	 * Custom renderer for breadcrumb items. Useful for integration with
	 * react-router or other routing libraries.
	 */
	itemRender?: (
		route: BreadcrumbItemType,
		params: Record<string, string> | undefined,
		routes: BreadcrumbItemType[],
		paths: string[]
	) => React.ReactNode;
	/**
	 * Route parameters to pass to itemRender.
	 */
	params?: Record<string, string>;
	/**
	 * Separator between breadcrumb items. Use 'chevron' for chevron icon,
	 * or any string for custom separator text (default: '/').
	 */
	separator?: string;
};

/**
 * All-in-one breadcrumb component that renders a navigation trail from an
 * items array. Use when you need standard breadcrumbs with minimal setup.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BreadcrumbSimple
 *   items={[
 *     { title: 'Home', href: '/' },
 *     { title: 'Products', href: '/products' },
 *     { title: 'Widget' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With icons
 * <BreadcrumbSimple
 *   items={[
 *     { title: 'Home', href: '/', icon: <HomeIcon /> },
 *     { title: 'Settings', href: '/settings', icon: <SettingsIcon /> },
 *     { title: 'Profile' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With dropdown menu
 * <BreadcrumbSimple
 *   items={[
 *     { title: 'Home', href: '/' },
 *     {
 *       title: 'Products',
 *       menu: [
 *         { title: 'Electronics', href: '/products/electronics' },
 *         { title: 'Clothing', href: '/products/clothing' },
 *       ],
 *     },
 *     { title: 'Widget' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom separator
 * <BreadcrumbSimple
 *   separator=">"
 *   items={[
 *     { title: 'Home', href: '/' },
 *     { title: 'About' },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With react-router
 * import { Link } from 'react-router-dom';
 *
 * <BreadcrumbSimple
 *   items={items}
 *   itemRender={(route, params, routes, paths) => {
 *     const isLast = route === routes[routes.length - 1];
 *     return isLast ? (
 *       <span>{route.title}</span>
 *     ) : (
 *       <Link to={`/${paths.join('/')}`}>{route.title}</Link>
 *     );
 *   }}
 * />
 * ```
 */
export const BreadcrumbSimple = React.forwardRef<HTMLElement, BreadcrumbSimpleProps>(
	({ items, itemRender, params, separator = '/', className, testId, ...props }, ref) => {
		const separatorContent = separator === 'chevron' ? CHEVRON_SEPARATOR : separator;

		const elements = useMemo(() => {
			const paths: string[] = [];
			const result: React.ReactNode[] = [];

			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const isLast = i === items.length - 1;

				if (item.path) {
					paths.push(item.path);
				}

				if (i > 0) {
					result.push(
						<BreadcrumbSeparator
							key={`sep-${i}`}
							testId={testId ? `${testId}-separator-${i}` : undefined}
						>
							{separatorContent}
						</BreadcrumbSeparator>
					);
				}

				let content: React.ReactNode;
				if (itemRender) {
					content = itemRender(item, params, items, [...paths]);
				} else if (item.menu && item.menu.length > 0) {
					content = (
						<BreadcrumbDropdown
							items={item.menu}
							className={item.className}
							testId={testId ? `${testId}-dropdown-${i}` : undefined}
						>
							{item.icon && <span className={styles['breadcrumb-icon']}>{item.icon}</span>}
							{item.title}
						</BreadcrumbDropdown>
					);
				} else if (isLast) {
					content = (
						<BreadcrumbPage
							icon={item.icon}
							className={item.className}
							testId={testId ? `${testId}-page-${i}` : undefined}
						>
							{item.title}
						</BreadcrumbPage>
					);
				} else {
					content = (
						<BreadcrumbLink
							href={item.href}
							onClick={item.onClick}
							icon={item.icon}
							className={item.className}
							testId={testId ? `${testId}-link-${i}` : undefined}
						>
							{item.title}
						</BreadcrumbLink>
					);
				}

				result.push(
					<BreadcrumbItem key={`item-${i}`} testId={testId ? `${testId}-item-${i}` : undefined}>
						{content}
					</BreadcrumbItem>
				);
			}

			return result;
		}, [items, itemRender, params, separatorContent, testId]);

		return (
			<Breadcrumb ref={ref} className={className} testId={testId} {...props}>
				<BreadcrumbList testId={testId ? `${testId}-list` : undefined}>{elements}</BreadcrumbList>
			</Breadcrumb>
		);
	}
);

BreadcrumbSimple.displayName = 'BreadcrumbSimple';
