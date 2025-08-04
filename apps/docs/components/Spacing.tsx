import React from 'react';
import { getTransformedSpacingTokens } from '../utils';

const spacing = getTransformedSpacingTokens();
const spacingKeys = Object.keys(spacing);

function Spacing() {
	return (
		<div className="p-4">
			<h1 className="mb-5 text-lg font-bold text-vanilla-100">Spacing Scale</h1>

			{spacingKeys.map((size) => {
				const value = spacing[size as keyof typeof spacing];

				return (
					<div key={size} className="mb-4">
						<span className="text-vanilla-100">
							{size} - {value}
						</span>
						<div className={`bg-slate-50 h-4`} style={{ width: value }}></div>
					</div>
				);
			})}
		</div>
	);
}

export default Spacing;
