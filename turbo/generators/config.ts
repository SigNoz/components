import { PlopTypes } from '@turbo/gen';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
const PROJECT_ROOT = path.resolve(__dirname, '../..');

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setGenerator('new-package', {
		description: 'Creates a new package based on the button package',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is the name of the new package?',
				validate: (input: string) => {
					if (input.includes(' ')) {
						return 'Package name cannot include spaces';
					}
					if (!input) {
						return 'Package name is required';
					}
					return true;
				},
			},
			{
				type: 'input',
				name: 'description',
				message: 'Provide a brief description of the package:',
				default: 'A new package',
			},
		],
		actions: [
			// Copy the entire button package directory
			async (answers) => {
				const sourcePath = path.resolve(PROJECT_ROOT, 'packages/button');
				const targetPath = path.resolve(
					PROJECT_ROOT,
					`packages/${(answers as { name: string }).name}`,
				);

				if (!fs.existsSync(sourcePath)) {
					throw new Error(`Button package directory not found: ${sourcePath}`);
				}

				if (fs.existsSync(targetPath)) {
					const { replace } = await inquirer.prompt([
						{
							type: 'confirm',
							name: 'replace',
							message: `The package ${(answers as { name: string }).name} already exists. Do you want to replace it?`,
							default: false,
						},
					]);

					if (replace) {
						fs.removeSync(targetPath);
					} else {
						throw new Error(
							`Package ${(answers as { name: string }).name} already exists. Operation cancelled.`,
						);
					}
				}

				fs.copySync(sourcePath, targetPath);

				// Remove CHANGELOG.md and src/button.tsx
				fs.removeSync(path.join(targetPath, 'CHANGELOG.md'));
				fs.removeSync(path.join(targetPath, 'src', 'button.tsx'));
				fs.removeSync(path.join(targetPath, 'src', 'button-variants.tsx'));

				console.log(`Copied button package to ${targetPath}`);
				return 'Package directory created';
			},

			// Update package.json
			(answers) => {
				const packageJsonPath = path.resolve(
					PROJECT_ROOT,
					`packages/${(answers as { name: string }).name}/package.json`,
				);
				const packageJson = fs.readJsonSync(packageJsonPath);

				packageJson.name = `@signozhq/${(answers as { name: string }).name}`;
				packageJson.description = (answers as { description: string }).description;
				packageJson.version = '0.0.0';

				// Update main, module, and types fields
				packageJson.main = `./dist/${(answers as { name: string }).name}.js`;
				packageJson.module = `./dist/${(answers as { name: string }).name}.js`;
				packageJson.types = `./dist/${(answers as { name: string }).name}.d.ts`;

				// Update exports
				packageJson.exports = {
					'.': {
						types: `./dist/${(answers as { name: string }).name}.d.ts`,
						import: `./dist/${(answers as { name: string }).name}.js`,
					},
				};

				fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

				console.log(
					`Updated package.json for ${(answers as { name: string }).name}`,
				);
				return 'package.json updated';
			},

			// Update tsup.config.ts
			(answers) => {
				const configPath = path.resolve(
					PROJECT_ROOT,
					`packages/${(answers as { name: string }).name}/tsup.config.ts`,
				);
				let content = fs.readFileSync(configPath, 'utf8');

				content = content.replace(/button/g, (answers as { name: string }).name);

				fs.writeFileSync(configPath, content);

				console.log(
					`Updated tsup.config.ts for ${(answers as { name: string }).name}`,
				);
				return 'tsup.config.ts updated';
			},
			// Update docs app package.json
			{
				type: 'append',
				path: path.resolve(PROJECT_ROOT, 'apps/docs/package.json'),
				pattern: /"dependencies": {/,
				template: `    "@signozhq/{{ name }}": "workspace:*",`,
			},

			// Prompt for component type and create accordingly
			async (answers) => {
				const packagePath = path.resolve(
					PROJECT_ROOT,
					`packages/${(answers as { name: string }).name}`,
				);

				const { componentType } = await inquirer.prompt([
					{
						type: 'list',
						name: 'componentType',
						message:
							'Do you want to import a shadcn component or create a component from scratch?',
						choices: ['shadcn', 'from_scratch'],
					},
				]);

				if (componentType === 'shadcn') {
					console.log(
						`Running shadcn command for ${(answers as { name: string }).name}`,
					);
					try {
						execSync(
							`pnpm dlx shadcn@latest add ${(answers as { name: string }).name}`,
							{
								cwd: packagePath,
								stdio: 'inherit',
							},
						);

						// Append import statement to the newly generated component
						const componentPath = path.join(
							packagePath,
							`src/${(answers as { name: string }).name}.tsx`,
						);
						const componentContent = fs.readFileSync(componentPath, 'utf8');
						const updatedContent = `import "./index.css"\n${componentContent}`;
						fs.writeFileSync(componentPath, updatedContent);

						return `Shadcn ${(answers as { name: string }).name} added successfully and import statement appended`;
					} catch (error) {
						console.error('Error running shadcn command:', error);
						return `Failed to add shadcn ${(answers as { name: string }).name}`;
					}
				} else {
					// Create a component from scratch
					const componentPath = path.join(
						packagePath,
						`src/${(answers as { name: string }).name}.tsx`,
					);
					const componentName =
						(answers as { name: string }).name.charAt(0).toUpperCase() +
						(answers as { name: string }).name.slice(1);
					const componentContent = `

  const ${componentName} = () => {
    return (
      <div>${(answers as { name: string }).name}</div>
    );
  };

  export default ${componentName};

`;
					fs.writeFileSync(componentPath, componentContent);
					return `component  ${(answers as { name: string }).name} created from scratch successfully`;
				}
			},

			// Create a generic story file
			async (answers) => {
				const componentName = (answers as { name: string }).name;
				const description = (answers as { description: string }).description;
				const storiesPath = path.resolve(
					PROJECT_ROOT,
					`apps/docs/stories/${componentName}.stories.tsx`,
				);

				// Convert kebab-case to PascalCase
				const toPascalCase = (str: string) => {
					return str
						.split('-')
						.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
						.join('');
				};

				const pascalCaseName = toPascalCase(componentName);

				// Create documentation boilerplate
				const exampleCode = `import { ${pascalCaseName} } from '@signozhq/${componentName}';

export default function MyComponent() {
  return (
    <${pascalCaseName} />
  );
}`;

				// Create documentation boilerplate
				const storiesContent = `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ${pascalCaseName} } from '@signozhq/${componentName}';
import { generateDocs } from '../utils/generateDocs';

const ${pascalCaseName}Examples = [
\`${exampleCode}\`
];

const ${pascalCaseName}Docs = generateDocs({
  packageName: '@signozhq/${componentName}',
  description: '${description}',
  examples: ${pascalCaseName}Examples,
});

const meta: Meta<typeof ${pascalCaseName}> = {
  title: 'Components/${pascalCaseName}',
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
    // Add default props here
  },
};`;

				fs.writeFileSync(storiesPath, storiesContent);
				console.log(`Created Storybook story with documentation at ${storiesPath}`);
				return 'Storybook story created';
			},

			// Run pnpm clean && pnpm install && pnpm run dev at PROJECT_ROOT level
			() => {
				console.log(
					'Running pnpm clean && pnpm install && pnpm run dev at PROJECT_ROOT',
				);
				try {
					execSync('pnpm clean && pnpm install && pnpm run dev', {
						cwd: PROJECT_ROOT,
						stdio: 'inherit',
					});
					return 'pnpm clean && pnpm install && pnpm run dev completed successfully at PROJECT_ROOT';
				} catch (error) {
					console.error('Error running commands at PROJECT_ROOT:', error);
					return 'Failed to run pnpm clean && pnpm install && pnpm run dev at PROJECT_ROOT';
				}
			},
		],
	});
}
