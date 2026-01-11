import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	Combobox,
	ComboboxTrigger,
	ComboboxContent,
	ComboboxCommand,
	ComboboxInput,
	ComboboxList,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxGroup,
	ComboboxLabel,
	ComboboxSeparator,
} from '@signozhq/combobox';
import { generateDocs } from '../utils/generateDocs';

const ComboboxExamples = [
	`import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxCommand,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
} from '@signozhq/combobox';

export default function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <Combobox>
      <ComboboxTrigger placeholder="Select a framework..." value={value} />
      <ComboboxContent>
        <ComboboxCommand>
          <ComboboxInput placeholder="Search frameworks..." />
          <ComboboxList>
            <ComboboxItem value="react">React</ComboboxItem>
            <ComboboxItem value="vue">Vue</ComboboxItem>
            <ComboboxItem value="angular">Angular</ComboboxItem>
          </ComboboxList>
        </ComboboxCommand>
      </ComboboxContent>
    </Combobox>
  );
}`,
];

const ComboboxDocs = generateDocs({
	packageName: '@signozhq/combobox',
	description:
		'Autocomplete input and command palette with a list of suggestions',
	examples: ComboboxExamples,
});

const meta: Meta<typeof Combobox> = {
	title: 'Components/Combobox',
	component: Combobox,
	parameters: {
		docs: {
			description: {
				component: ComboboxDocs,
			},
		},
		layout: 'fullscreen',
		design: [
			{
				name: 'Figma',
				type: 'figma',
				url: 'https://www.figma.com/design/egMidgk6VJDXTumxcCYUl1/Periscope---Primitives?node-id=12-742&p=f',
			},
		],
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const frameworks = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
];

const languages = [
	{ value: 'javascript', label: 'JavaScript' },
	{ value: 'typescript', label: 'TypeScript' },
	{ value: 'python', label: 'Python' },
	{ value: 'go', label: 'Go' },
	{ value: 'rust', label: 'Rust' },
];

const databases = [
	{ value: 'postgres', label: 'PostgreSQL' },
	{ value: 'mongodb', label: 'MongoDB' },
	{ value: 'redis', label: 'Redis' },
	{ value: 'mysql', label: 'MySQL' },
];

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(false);

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select a framework..."
						value={frameworks.find((f) => f.value === value)?.label || ''}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand>
								<ComboboxInput placeholder="Search frameworks..." />
								<ComboboxList>
									{frameworks.length === 0 ? (
										<ComboboxEmpty>No framework found.</ComboboxEmpty>
									) : (
										frameworks.map((framework) => (
											<ComboboxItem
												key={framework.value}
												value={framework.value}
												onSelect={() => {
													setValue(framework.value);
													setOpen(false);
												}}
												isSelected={value === framework.value}
											>
												{framework.label}
											</ComboboxItem>
										))
									)}
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};

export const WithDefaultValue: Story = {
	render: () => {
		const [value, setValue] = useState('react');
		const [open, setOpen] = useState(false);

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select a framework..."
						value={frameworks.find((f) => f.value === value)?.label || ''}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand>
								<ComboboxInput placeholder="Search frameworks..." />
								<ComboboxList>
									{frameworks.map((framework) => (
										<ComboboxItem
											key={framework.value}
											value={framework.value}
											onSelect={() => {
												setValue(framework.value);
												setOpen(false);
											}}
											isSelected={value === framework.value}
										>
											{framework.label}
										</ComboboxItem>
									))}
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};

export const WithGroups: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(false);

		const allItems = [
			{
				group: 'Frameworks',
				items: frameworks,
			},
			{
				group: 'Languages',
				items: languages,
			},
		];

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select an option..."
						value={
							[...frameworks, ...languages].find((f) => f.value === value)?.label || ''
						}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand>
								<ComboboxInput placeholder="Search..." />
								<ComboboxList>
									{allItems.map((group) => (
										<ComboboxGroup key={group.group}>
											<ComboboxLabel>{group.group}</ComboboxLabel>
											{group.items.map((item) => (
												<ComboboxItem
													key={item.value}
													value={item.value}
													onSelect={() => {
														setValue(item.value);
														setOpen(false);
													}}
													isSelected={value === item.value}
												>
													{item.label}
												</ComboboxItem>
											))}
										</ComboboxGroup>
									))}
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};

export const WithMultipleGroups: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(false);

		const allItems = [
			{
				group: 'Frameworks',
				items: frameworks,
			},
			{
				group: 'Languages',
				items: languages,
			},
			{
				group: 'Databases',
				items: databases,
			},
		];

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select a technology..."
						value={
							[...frameworks, ...languages, ...databases].find(
								(f) => f.value === value,
							)?.label || ''
						}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand>
								<ComboboxInput placeholder="Search technologies..." />
								<ComboboxList>
									{allItems.map((group, idx) => (
										<div key={group.group}>
											{idx > 0 && <ComboboxSeparator />}
											<ComboboxGroup>
												<ComboboxLabel>{group.group}</ComboboxLabel>
												{group.items.map((item) => (
													<ComboboxItem
														key={item.value}
														value={item.value}
														onSelect={() => {
															setValue(item.value);
															setOpen(false);
														}}
														isSelected={value === item.value}
													>
														{item.label}
													</ComboboxItem>
												))}
											</ComboboxGroup>
										</div>
									))}
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};

export const Searchable: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(false);
		const [search, setSearch] = useState('');

		const filtered = frameworks.filter((f) =>
			f.label.toLowerCase().includes(search.toLowerCase()),
		);

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Search frameworks..."
						value={frameworks.find((f) => f.value === value)?.label || ''}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand shouldFilter={false}>
								<ComboboxInput
									placeholder="Search frameworks..."
									value={search}
									onValueChange={setSearch}
								/>
								<ComboboxList>
									{filtered.length === 0 ? (
										<ComboboxEmpty>No framework found.</ComboboxEmpty>
									) : (
										filtered.map((framework) => (
											<ComboboxItem
												key={framework.value}
												value={framework.value}
												onSelect={() => {
													setValue(framework.value);
													setSearch('');
													setOpen(false);
												}}
												isSelected={value === framework.value}
											>
												{framework.label}
											</ComboboxItem>
										))
									)}
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="p-8 w-full max-w-sm">
			<Combobox>
				<ComboboxTrigger placeholder="Select a framework..." disabled value="" />
			</Combobox>
		</div>
	),
};

export const WithDescription: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(false);

		const itemsWithDesc = [
			{
				value: 'react',
				label: 'React',
				description: 'A JavaScript library for building user interfaces',
			},
			{
				value: 'vue',
				label: 'Vue',
				description: 'The Progressive JavaScript Framework',
			},
			{
				value: 'angular',
				label: 'Angular',
				description: 'Platform for building mobile and desktop web applications',
			},
		];

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select a framework..."
						value={itemsWithDesc.find((f) => f.value === value)?.label || ''}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand>
								<ComboboxInput placeholder="Search frameworks..." />
								<ComboboxList>
									{itemsWithDesc.map((item) => (
										<ComboboxItem
											key={item.value}
											value={item.value}
											onSelect={() => {
												setValue(item.value);
												setOpen(false);
											}}
											isSelected={value === item.value}
										>
											<div className="flex flex-col">
												<span>{item.label}</span>
												<span className="text-xs text-muted-foreground">
													{item.description}
												</span>
											</div>
										</ComboboxItem>
									))}
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};

export const CustomWidth: Story = {
	render: () => {
		const [value1, setValue1] = useState('');
		const [open1, setOpen1] = useState(false);
		const [value2, setValue2] = useState('');
		const [open2, setOpen2] = useState(false);

		return (
			<div className="p-8 space-y-6">
				<div>
					<p className="text-sm text-gray-600 mb-2">Small (w-[200px])</p>
					<Combobox open={open1} onOpenChange={setOpen1}>
						<ComboboxTrigger
							placeholder="Select..."
							value={frameworks.find((f) => f.value === value1)?.label || ''}
							className="w-[200px]"
						/>
						{open1 && (
							<ComboboxContent>
								<ComboboxCommand>
									<ComboboxInput placeholder="Search..." />
									<ComboboxList>
										{frameworks.map((framework) => (
											<ComboboxItem
												key={framework.value}
												value={framework.value}
												onSelect={() => {
													setValue1(framework.value);
													setOpen1(false);
												}}
												isSelected={value1 === framework.value}
											>
												{framework.label}
											</ComboboxItem>
										))}
									</ComboboxList>
								</ComboboxCommand>
							</ComboboxContent>
						)}
					</Combobox>
				</div>

				<div>
					<p className="text-sm text-gray-600 mb-2">Large (w-[400px])</p>
					<Combobox open={open2} onOpenChange={setOpen2}>
						<ComboboxTrigger
							placeholder="Select a framework..."
							value={frameworks.find((f) => f.value === value2)?.label || ''}
							className="w-[400px]"
						/>
						{open2 && (
							<ComboboxContent>
								<ComboboxCommand>
									<ComboboxInput placeholder="Search frameworks..." />
									<ComboboxList>
										{frameworks.map((framework) => (
											<ComboboxItem
												key={framework.value}
												value={framework.value}
												onSelect={() => {
													setValue2(framework.value);
													setOpen2(false);
												}}
												isSelected={value2 === framework.value}
											>
												{framework.label}
											</ComboboxItem>
										))}
									</ComboboxList>
								</ComboboxCommand>
							</ComboboxContent>
						)}
					</Combobox>
				</div>
			</div>
		);
	},
};

export const Controlled: Story = {
	render: () => {
		const [value, setValue] = useState('react');
		const [open, setOpen] = useState(false);

		const handleChange = (newValue: string) => {
			console.log('Value changed to:', newValue);
			setValue(newValue);
			setOpen(false);
			// You can add any custom logic here
			// e.g., API calls, validation, etc.
		};

		return (
			<div className="p-8 w-full max-w-sm space-y-4">
				<div>
					<p className="text-sm font-medium mb-2">
						Selected: <span className="text-primary">{value}</span>
					</p>
					<Combobox open={open} onOpenChange={setOpen}>
						<ComboboxTrigger
							placeholder="Select a framework..."
							value={frameworks.find((f) => f.value === value)?.label || ''}
						/>
						{open && (
							<ComboboxContent>
								<ComboboxCommand>
									<ComboboxInput placeholder="Search frameworks..." />
									<ComboboxList>
										{frameworks.map((framework) => (
											<ComboboxItem
												key={framework.value}
												value={framework.value}
												onSelect={() => handleChange(framework.value)}
												isSelected={value === framework.value}
											>
												{framework.label}
											</ComboboxItem>
										))}
									</ComboboxList>
								</ComboboxCommand>
							</ComboboxContent>
						)}
					</Combobox>
				</div>
			</div>
		);
	},
};

export const WithoutSearch: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(false);

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select a framework..."
						value={frameworks.find((f) => f.value === value)?.label || ''}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand>
								{/* No ComboboxInput - search bar is hidden */}
								<ComboboxList>
									{frameworks.map((framework) => (
										<ComboboxItem
											key={framework.value}
											value={framework.value}
											onSelect={() => {
												setValue(framework.value);
												setOpen(false);
											}}
											isSelected={value === framework.value}
										>
											{framework.label}
										</ComboboxItem>
									))}
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};

export const WithoutSearchNoCheck: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [open, setOpen] = useState(false);

		return (
			<div className="p-8 w-full max-w-sm">
				<Combobox open={open} onOpenChange={setOpen}>
					<ComboboxTrigger
						placeholder="Select a framework..."
						value={frameworks.find((f) => f.value === value)?.label || ''}
					/>
					{open && (
						<ComboboxContent>
							<ComboboxCommand>
								{/* No ComboboxInput - search bar is hidden */}
								<ComboboxList>
									{frameworks.map((framework) => (
										<ComboboxItem
											key={framework.value}
											value={framework.value}
											onSelect={() => {
												setValue(framework.value);
												setOpen(false);
											}}
											isSelected={value === framework.value}
											showCheck={false}
										>
											{framework.label}
										</ComboboxItem>
									))}
								</ComboboxList>
							</ComboboxCommand>
						</ComboboxContent>
					)}
				</Combobox>
			</div>
		);
	},
};
