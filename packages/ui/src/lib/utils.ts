import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

// https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
