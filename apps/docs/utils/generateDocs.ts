interface PackageDocConfig {
	packageName: string;
	description: string;
	examples: string[];
	installation?: {
		npm?: boolean;
		yarn?: boolean;
		pnpm?: boolean;
	};
}

export function generateDocs(config: PackageDocConfig): string {
	const {
		packageName,
		description,
		examples,
		installation = { npm: true, yarn: true, pnpm: true },
	} = config;

	// Generate installation instructions
	const installCommands: string[] = [];
	if (installation.npm) installCommands.push(`npm install ${packageName}`);
	if (installation.yarn) installCommands.push(`yarn add ${packageName}`);
	if (installation.pnpm) installCommands.push(`pnpm add ${packageName}`);

	const installationDocs = `
## Installation

${installCommands.map((cmd) => `\`\`\`bash\n${cmd}\n\`\`\``).join('\n\n')}
`;

	// Generate usage examples
	const usage = `
## Usage

${examples.map((example) => `\`\`\`jsx\n${example}\n\`\`\``).join('\n\n')}
`;

	// Combine all sections
	return `
${description}

${installationDocs}

${usage}

`;
}
