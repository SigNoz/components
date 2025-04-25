import React from 'react';
import { Button } from '@signozhq/button';
import './App.css';
import { ThemeSwitcher } from '@signozhq/theme';
import { Code } from 'lucide-react';

const VARIANTS = ['solid', 'outlined', 'dashed', 'ghost', 'link'] as const;
const COLORS = ['primary', 'destructive', 'warning', 'secondary'] as const;

function App() {
	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">Button Component</h1>
				<ThemeSwitcher />
			</div>

			<hr />

			<hr />

			<div className="space-y-12">
				{COLORS.map((color) => (
					<div key={color} className="space-y-4">
						<h2
							className=""
							style={{ textAlign: 'left', fontSize: '16px', fontWeight: '600' }}
						>
							{color}
						</h2>
						<div className="grid gap-4" style={{ display: 'flex' }}>
							{VARIANTS.map((variant) => (
								<div key={variant} className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Button
											variant={variant}
											color={color}
											prefixIcon={<Code />}
											suffixIcon={<Code />}
										>
											{variant}
										</Button>
										<p className="text-sm text-slate-500">Normal state</p>
									</div>
									<div className="space-y-2">
										<Button
											variant={variant}
											color={color}
											prefixIcon={<Code />}
											suffixIcon={<Code />}
											disabled
										>
											{variant}
										</Button>
										<p className="text-sm text-slate-500">Disabled state</p>
									</div>
									<div className="space-y-2">
										<Button
											variant={variant}
											color={color}
											prefixIcon={<Code />}
											suffixIcon={<Code />}
											loading
										>
											{variant}
										</Button>
										<p className="text-sm text-slate-500">Loading state</p>
									</div>
								</div>
							))}
						</div>
						<hr />
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
