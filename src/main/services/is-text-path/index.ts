// my own version of `is-text-path` but with custom extensions (liquid)
import path from 'path';
import { extensions } from './extensions';

const extensionSet = new Set(extensions);

export default function isTextPath(filePath: string) {
	return extensionSet.has(path.extname(filePath).slice(1).toLowerCase());
}