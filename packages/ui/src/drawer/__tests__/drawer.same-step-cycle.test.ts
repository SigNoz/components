import { createElement, type ReactNode } from 'react';
import { expect, it } from 'vitest';
import { isSameStep } from '../utils.js';

type Entity = { name: string; parent?: Entity; children: Entity[] };

// A record from an API store, whose parent and child link to each other.
function entity(name: string): Entity {
	const parent: Entity = { name: 'Cluster', children: [] };
	const child: Entity = { name, parent, children: [] };
	parent.children.push(child);

	return child;
}

function EntityName({ entity: { name } }: { entity: Entity }): ReactNode {
	return name;
}

const crumb = (record: Entity) => ({ title: createElement(EntityName, { entity: record }) });

it('matches a crumb whose title gets a new copy of a record that links back to itself', () => {
	expect(isSameStep(crumb(entity('Node')), crumb(entity('Node')))).toBe(true);
});

it('tells apart crumbs whose linked records differ', () => {
	expect(isSameStep(crumb(entity('Node')), crumb(entity('Pod')))).toBe(false);
});
