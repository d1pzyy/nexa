import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { logColor } from '#library/logger.js';

const envPath = join(import.meta.dirname, '../.env');

try {
	logColor.loading('Checking environment variables...');
	if (existsSync(envPath)) {
		process.loadEnvFile(envPath);
		logColor.success(`.env file loaded successfully from: ${envPath}`);
	} else {
		logColor.warning(`Physical .env file not found at: ${envPath}`);
		logColor.info('Relying on system/cloud injected environment variables.');
	}
} catch (error) {
	logColor.error(`Failed to setup environment: ${error.message}`);
}
