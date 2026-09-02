/**
 * Oxlint custom rules plugin for SigNoz.
 *
 * This plugin aggregates all custom SigNoz linting rules.
 * Individual rules are defined in the ./rules directory.
 */

import noConditionalTextNodesWithSiblings from './rules/no-conditional-text-nodes-with-siblings.mjs';
import noReturnTextNodes from './rules/no-return-text-nodes.mjs';

export default {
	meta: {
		name: 'signoz',
	},
	rules: {
		'no-conditional-text-nodes-with-siblings': noConditionalTextNodesWithSiblings,
		'no-return-text-nodes': noReturnTextNodes,
	},
};
