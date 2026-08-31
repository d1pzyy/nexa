import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { logColor } from '#library/logger.js';

export const plugins = new Map();
const pluginDir = join(import.meta.dirname, '../plugin');

export async function loadPlugins() {
	if (!existsSync(pluginDir)) {
		logColor.error(`Plugin directory not found at: ${pluginDir}`);
		return;
	}

	plugins.clear();

	const files = readdirSync(pluginDir, { recursive: true }).filter(f => f.endsWith('.js'));
	let loadedCount = 0;

	for (const file of files) {
		const filePath = join(pluginDir, file);
		const pluginKey = file.replace(/\\/g, '/');

		try {
			const fileUrl = `file://${filePath}?v=${Date.now()}`;
			const module = await import(fileUrl);
			const plugin = module.handler || module.default;

			if (plugin && plugin.command) {
				plugins.set(pluginKey, plugin);
				loadedCount++;
			} else {
				logColor.warning(
					`Plugin ${pluginKey} skipped: Missing export handler or command property`
				);
			}
		} catch (error) {
			logColor.error(`Failed to load plugin ${pluginKey}: ${error.message}`);
		}
	}

	logColor.success(`Successfully loaded ${loadedCount} plugin(s)`);
}
