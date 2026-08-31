import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { logColor } from '#library/logger.js';

const dbDir = join(import.meta.dirname, '../../database/activity');
const userDbPath = join(dbDir, 'user.json');
const groupDbPath = join(dbDir, 'group.json');

const userSchema = {
	name: '',
	phone: '',
	jid: '',
	region: '',
	warning: 0,
	banned: false,
	firstInteraction: '',
	lastInteraction: '',
	lastOrder: [],
	languageDefault: '',
	paymentDefault: '',
};

const groupSchema = {
	name: '',
	lid: '',
	link: '',
	banned: false,
	createdAt: '',
	totalMembers: 0,
	firstInteraction: '',
	lastInteraction: '',
	interactedMembers: [],
};

const initDatabase = () => {
	try {
		logColor.loading('Starting database initialization...');

		if (!existsSync(dbDir)) {
			logColor.loading('Creating database directory...');
			mkdirSync(dbDir, { recursive: true }); /* 1 */
			logColor.success('Database directory created successfully');
		} else {
			logColor.info('Database directory already exists');
		}

		if (!existsSync(userDbPath)) {
			logColor.loading('Building user.json...');
			writeFileSync(userDbPath, JSON.stringify({}, null, 2));
			logColor.success('user.json initialized successfully');
		} else {
			logColor.info('user.json already exists, skipping this file');
		}

		if (!existsSync(groupDbPath)) {
			logColor.loading('Building group.json...');
			writeFileSync(groupDbPath, JSON.stringify({}, null, 2));
			logColor.success('group.json initialized successfully');
		} else {
			logColor.info('group.json already exists, skipping this file');
		}

		logColor.success('Database system is ready to use');
	} catch (error) {
		logColor.error(`Failed to initialize database: ${error.message}`);
		process.exit(1); // better exit bfore evrything blow up
	}
};

export { userSchema, groupSchema, initDatabase };
