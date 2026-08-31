import {
	existsSync,
	readFileSync,
	writeFileSync,
	renameSync,
	copyFileSync,
	mkdirSync,
} from 'node:fs';
import { join } from 'node:path';
import { logColor } from '#library/logger.js';
import { getTime } from '#library/times.js';
import { userSchema, groupSchema } from './initDatabase.js';

const dbDir = join(import.meta.dirname, '../../database/activity');
if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true }); /* 2 */

const cache = new Map();
const dirty = new Set();

let isFlushing = false;

const intervalSave = 10000;
const monthMS = 30 * 24 * 60 * 60 * 1000;
const getPath = name => join(dbDir, `${name}.json`);
const getTmpPath = name => join(dbDir, `${name}.tmp.json`);

function loadDB(name) {
	if (cache.has(name)) return cache.get(name);

	const fp = getPath(name);
	if (!existsSync(fp)) {
		cache.set(name, {});
		return {};
	}

	try {
		const raw = readFileSync(fp, 'utf-8');
		const parsed = JSON.parse(raw || '{}');
		cache.set(name, parsed);
		return parsed;
	} catch (error) {
		logColor.error(`Database corrupted ${name}.json: ${error.message}. Backup created`);
		copyFileSync(fp, `${fp}.corrupt.${Date.now()}`);
		cache.set(name, {});
		return {};
	}
}

export function flushDB() {
	if (dirty.size === 0 || isFlushing) return;
	isFlushing = true;

	const savedFiles = Array.from(dirty);
	const timeNow = getTime('HH:mm:ss');

	for (const name of savedFiles) {
		try {
			const data = cache.get(name);
			const fp = getPath(name);
			const tmpFp = getTmpPath(name);
			writeFileSync(tmpFp, JSON.stringify(data, null, 2));
			renameSync(tmpFp, fp);
			dirty.delete(name);
		} catch (error) {
			logColor.error(`Failed to save database ${name}.json: ${error.message}`);
		}
	}

	logColor.success(
		`Database FLUSH ${timeNow}. Saved changes to: ${savedFiles.map(f => f + '.json').join(', ')}`
	);

	isFlushing = false;
}

setInterval(flushDB, intervalSave);

['exit', 'SIGINT', 'SIGTERM', 'uncaughtException'].forEach(signal => {
	process.on(signal, err => {
		if (signal === 'uncaughtException') {
			logColor.error(`Database fatal. System Crash: ${err.message}`);
		}
		flushDB();
		if (signal !== 'exit') process.exit(signal === 'uncaughtException' ? 1 : 0);
	});
});

export function readData(dbName, id) {
	const db = loadDB(dbName);

	if (!db[id]) {
		const schema = dbName === 'user' ? userSchema : dbName === 'group' ? groupSchema : {};
		db[id] = structuredClone(schema);
		dirty.add(dbName);
	} else {
		const schema = dbName === 'user' ? userSchema : dbName === 'group' ? groupSchema : null;
		if (schema) {
			let isUpdated = false;
			for (const key of Object.keys(schema)) {
				if (!(key in db[id])) {
					db[id][key] = structuredClone(schema[key]);
					isUpdated = true;
				}
			}
			if (isUpdated) dirty.add(dbName);
		}
	}

	return db[id];
}

export function getData(dbName, id, key) {
	return readData(dbName, id)?.[key];
}

function isObject(item) {
	return item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge(target, source) {
	const output = { ...target };
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach(key => {
			if (Array.isArray(source[key])) {
				if (Array.isArray(target[key])) {
					output[key] = [...target[key], ...source[key]];
				} else {
					output[key] = source[key];
				}
			} else if (isObject(source[key])) {
				output[key] = key in target ? deepMerge(target[key], source[key]) : source[key];
			} else {
				output[key] = source[key];
			}
		});
	}
	return output;
}

export function writeData(dbName, id, newData) {
	const db = loadDB(dbName);
	const currentData = readData(dbName, id);
	db[id] = deepMerge(currentData, newData);
	dirty.add(dbName);
}

export function pushData(dbName, id, key, item) {
	const data = readData(dbName, id);
	if (Array.isArray(data[key])) {
		data[key].push(item);
		dirty.add(dbName);
	} else {
		logColor.warning(`Key '${key}' on ${dbName}[${id}] is not an Array!`);
	}
}

export function deleteData(dbName, id) {
	const db = loadDB(dbName);
	if (db[id]) {
		delete db[id];
		dirty.add(dbName);
	}
}

export function viewAllData(dbName) {
	return loadDB(dbName);
}

export function restoreDB(dbName, defaultData = {}) {
	cache.set(dbName, defaultData);
	dirty.add(dbName);
	flushDB();
	logColor.success(`Database ${dbName}.json restored successfully`);
}

export function autoCleanDatabase() {
	const now = Date.now();
	let totalCleaned = 0;
	for (const dbName of ['user', 'group']) {
		const db = loadDB(dbName);
		for (const id of Object.keys(db)) {
			const data = db[id];
			if (data.lastInteraction) {
				const cleanDateStr = data.lastInteraction.replace(/-(\d{2}:\d{2}[AP]M)$/, ' $1');
				const lastTime = new Date(cleanDateStr).getTime();
				if (!isNaN(lastTime) && now - lastTime > monthMS) {
					delete db[id];
					dirty.add(dbName);
					totalCleaned++;
				}
			}
		}
	}

	if (totalCleaned > 0) {
		logColor.info(`Cleaned ${totalCleaned} inactive records (30+ days inactive) in database`);
		flushDB();
	}
}

export function createBackup() {
	for (const name of ['user', 'group']) {
		const fp = getPath(name);
		const backupFp = join(dbDir, `${name}.bak.json`);
		if (existsSync(fp)) {
			copyFileSync(fp, backupFp);
		}
	}

	logColor.success(`Backup database created successfully at ${getTime('HH:mm:ss')}`);
}

setInterval(autoCleanDatabase, 24 * 60 * 60 * 1000);
