import * as PopoverPrimitive from '@radix-ui/react-popover';

/**
 * Root component for the combobox. Controls open/close state of the popover.
 *
 * Compose with `ComboboxTrigger`, `ComboboxContent`, `ComboboxCommand`, `ComboboxInput`,
 * `ComboboxList`, `ComboboxGroup`, `ComboboxItem`, `ComboboxEmpty`,
 * `ComboboxSeparator`, and `ComboboxLoading`.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('');
 * const [open, setOpen] = useState(false);
 *
 * return (
 *   <Combobox open={open} onOpenChange={setOpen}>
 *     <ComboboxTrigger placeholder="Select..." value={value} />
 *     <ComboboxContent>
 *       <ComboboxCommand>
 *         <ComboboxInput placeholder="Search..." />
 *         <ComboboxList>
 *           <ComboboxItem value="react" onSelect={() => setValue('react')}>
 *             React
 *           </ComboboxItem>
 *           <ComboboxEmpty>No results.</ComboboxEmpty>
 *         </ComboboxList>
 *       </ComboboxCommand>
 *     </ComboboxContent>
 *   </Combobox>
 * );
 * ```
 */
export const Combobox = PopoverPrimitive.Root;
