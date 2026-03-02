import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { PlopTypes } from '@turbo/gen';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const UI_PACKAGE_PATH = path.resolve(PROJECT_ROOT, 'packages/ui');
const UI_SRC_PATH = path.resolve(UI_PACKAGE_PATH, 'src');

function toPascalCase(str: string): string {
	return str
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

function ensureDirSync(dirPath: string): void {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

function removeDirSync(dirPath: string): void {
	if (fs.existsSync(dirPath)) {
		fs.rmSync(dirPath, { recursive: true, force: true });
	}
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setGenerator('new-component', {
		description: 'Creates a new component inside packages/ui',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is the name of the new component? (use kebab-case, e.g., my-component)',
				validate: (input: string) => {
					if (input.includes(' ')) {
						return 'Component name cannot include spaces';
					}
					if (!input) {
						return 'Component name is required';
					}
					if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(input)) {
						return 'Component name must be kebab-case (e.g., my-component)';
					}
					return true;
				},
			},
			{
				type: 'input',
				name: 'description',
				message: 'Provide a brief description of the component:',
				default: 'A new component',
			},
			{
				type: 'confirm',
				name: 'replaceExisting',
				message: 'A component with this name already exists. Do you want to replace it?',
				default: false,
				when: (answers) => {
					const componentPath = path.resolve(UI_SRC_PATH, answers.name as string);
					return fs.existsSync(componentPath);
				},
			},
			{
				type: 'list',
				name: 'componentType',
				message: 'Do you want to import a shadcn component or create a component from scratch?',
				choices: ['shadcn', 'from_scratch'],
			},
		],
		actions: (answers) => {
			if (!answers) return [];

			const { name, replaceExisting } = answers as {
				name: string;
				replaceExisting?: boolean;
			};
			const componentPath = path.resolve(UI_SRC_PATH, name);

			if (fs.existsSync(componentPath) && replaceExisting === false) {
				throw new Error(`Component ${name} already exists. Operation cancelled.`);
			}

			return [
				(data) => {
					const componentName = (data as { name: string }).name;
					const compPath = path.resolve(UI_SRC_PATH, componentName);
					const compType = (data as { componentType: string }).componentType;

					if (fs.existsSync(compPath)) {
						removeDirSync(compPath);
					}

					ensureDirSync(compPath);

					if (compType === 'shadcn') {
						console.log(`Running shadcn command for ${componentName}`);
						try {
							execSync(`pnpm dlx shadcn@latest add ${componentName}`, {
								cwd: UI_PACKAGE_PATH,
								stdio: 'inherit',
							});

							const componentFilePath = path.join(compPath, `${componentName}.tsx`);
							if (fs.existsSync(componentFilePath)) {
								const componentContent = fs.readFileSync(componentFilePath, 'utf8');
								const updatedContent = `import "./index.css"\n${componentContent}`;
								fs.writeFileSync(componentFilePath, updatedContent);
							}

							return `Shadcn ${componentName} added successfully`;
						} catch (error) {
							console.error('Error running shadcn command:', error);
							removeDirSync(compPath);
							throw new Error(`Failed to add shadcn ${componentName}`);
						}
					} else {
						const pascalCaseName = toPascalCase(componentName);

						const componentContent = `import './index.css';

export interface ${pascalCaseName}Props {
	children?: React.ReactNode;
}

export function ${pascalCaseName}({ children }: ${pascalCaseName}Props) {
	return <div className="${componentName}">{children}</div>;
}
`;

						const indexContent = `export type * from './${componentName}.js';
export { ${pascalCaseName} } from './${componentName}.js';
`;

						const cssContent = `/* Styles for ${pascalCaseName} component */
.${componentName} {
	/* Add your styles here */
}
`;

						fs.writeFileSync(path.join(compPath, `${componentName}.tsx`), componentContent);
						fs.writeFileSync(path.join(compPath, 'index.ts'), indexContent);
						fs.writeFileSync(path.join(compPath, 'index.css'), cssContent);

						return `Component ${componentName} created from scratch`;
					}
				},

				(data) => {
					const componentName = (data as { name: string }).name;
					const indexPath = path.resolve(UI_SRC_PATH, 'index.ts');
					const indexContent = fs.readFileSync(indexPath, 'utf8');

					const exportLine = `export * from './${componentName}/index.js';`;

					if (indexContent.includes(exportLine)) {
						return 'Export already exists in index.ts';
					}

					const lines = indexContent.trim().split('\n');
					lines.push(exportLine);
					lines.sort((a, b) => a.localeCompare(b));

					fs.writeFileSync(indexPath, lines.join('\n') + '\n');

					console.log(`Added export for ${componentName} to packages/ui/src/index.ts`);
					return 'index.ts updated';
				},

				(data) => {
					const componentName = (data as { name: string }).name;
					const viteConfigPath = path.resolve(UI_PACKAGE_PATH, 'vite.config.ts');
					const viteContent = fs.readFileSync(viteConfigPath, 'utf8');

					const entryLine = `\t'${componentName}/index': 'src/${componentName}/index.ts',`;

					if (viteContent.includes(`'${componentName}/index'`)) {
						return 'Entry already exists in vite.config.ts';
					}

					const entriesRegex = /const entries: Record<string, string> = \{([^}]+)\}/;
					const entriesMatch = entriesRegex.exec(viteContent);
					if (!entriesMatch) {
						throw new Error('Could not find entries object in vite.config.ts');
					}

					const entriesContent = entriesMatch[1];
					const entriesLines = entriesContent.split('\n').filter((line) => line.trim());

					const newEntriesLines = [...entriesLines];
					const entryKeyRegex = /'([^']+)\/index'/;
					const insertIndex = newEntriesLines.findIndex((line) => {
						const match = entryKeyRegex.exec(line);
						if (match) {
							return match[1] > componentName;
						}
						return false;
					});

					if (insertIndex === -1) {
						newEntriesLines.push(entryLine);
					} else {
						newEntriesLines.splice(insertIndex, 0, entryLine);
					}

					const newEntriesContent = '\n' + newEntriesLines.join('\n') + '\n';
					const updatedViteContent = viteContent.replace(entriesContent, newEntriesContent);

					fs.writeFileSync(viteConfigPath, updatedViteContent);

					console.log(`Added entry for ${componentName} to packages/ui/vite.config.ts`);
					return 'vite.config.ts updated';
				},

				(data) => {
					const componentName = (data as { name: string }).name;
					const description = (data as { description: string }).description;
					const pascalCaseName = toPascalCase(componentName);

					const storiesPath = path.resolve(
						PROJECT_ROOT,
						`apps/docs/stories/${componentName}.stories.tsx`
					);

					const exampleCode = `import { ${pascalCaseName} } from '@signozhq/ui';

export default function MyComponent() {
  return (
    <${pascalCaseName}>Hello World</${pascalCaseName}>
  );
}`;

					const storiesContent = `import type { Meta, StoryObj } from '@storybook/react-vite';
import { ${pascalCaseName} } from '@signozhq/ui';
import { generateDocs } from '../utils/generateDocs.js';

const ${pascalCaseName}Examples = [
\`${exampleCode}\`
];

const ${pascalCaseName}Docs = generateDocs({
	packageName: '@signozhq/ui',
	description: '${description}',
	examples: ${pascalCaseName}Examples,
});

const meta: Meta<typeof ${pascalCaseName}> = {
	title: 'Working in Progress/${pascalCaseName}',
	component: ${pascalCaseName},
	parameters: {
		docs: {
			description: {
				component: ${pascalCaseName}Docs,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${pascalCaseName}>;

export const Default: Story = {
	args: {
		children: 'Hello World',
	},
};
`;

					fs.writeFileSync(storiesPath, storiesContent);
					console.log(`Created Storybook story at ${storiesPath}`);
					return 'Storybook story created';
				},

				() => {
					console.log('Running pnpm install at PROJECT_ROOT');
					try {
						execSync('pnpm install', {
							cwd: PROJECT_ROOT,
							stdio: 'inherit',
						});
						return 'pnpm install completed successfully';
					} catch (error) {
						console.error('Error running pnpm install:', error);
						return 'Failed to run pnpm install';
					}
				},
			];
		},
	});
}
