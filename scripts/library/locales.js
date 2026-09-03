import fs from 'node:fs';
import path from 'node:path';
import { logColor } from './logger.js';

const pathLocales = path.join(import.meta.dirname, '../../source/locales');
const fallbackLang = 'en';
const localesData = {};

function loadLocales() {
	if (!fs.existsSync(pathLocales)) {
		logColor.error(`Can't find locales directory at: ${pathLocales}`);
		return;
	}

	const files = fs.readdirSync(pathLocales);
	let loadedCount = 0;

	for (const file of files) {
		if (!file.endsWith('.json')) continue;

		const filePath = path.join(pathLocales, file);
		try {
			const fileContent = fs.readFileSync(filePath, 'utf-8');
			const parsedData = JSON.parse(fileContent);
			const langKey = parsedData?.meta?.lang;
			if (!langKey) {
				logColor.warning(`File ${file} is missing meta.lang. Skipped`);
				continue;
			}

			localesData[langKey] = parsedData;
			loadedCount++;
		} catch (error) {
			logColor.error(`Failed to parse file ${file}: ${error.message}`);
		}
	}

	if (!localesData[fallbackLang]) {
		logColor.error(`Fallback lang (${fallbackLang}) not found! The system may be unstable`);
	} else {
		logColor.success(`Successfully loaded ${loadedCount} language(s)`);
	}
}

loadLocales();

export function getLangData(langCode) {
	return localesData[langCode] || localesData[fallbackLang] || {};
}

export function t(langCode, keyPath, variables = {}) {
	const langObj = getLangData(langCode);
	const keys = keyPath.split('.');
	let text = langObj;

	for (const key of keys) {
		if (text?.[key] !== undefined) {
			text = text[key];
		} else {
			text = undefined;
			break;
		}
	}

	if (text === undefined && langCode !== fallbackLang) {
		return t(fallbackLang, keyPath, variables);
	}

	if (typeof text !== 'string') {
		return `Missing: \`${keyPath}\`!`;
	}

	if (Object.keys(variables).length > 0) {
		for (const [varName, varValue] of Object.entries(variables)) {
			text = text.replaceAll(`{${varName}}`, varValue);
		}
	}

	return text;
}

export default localesData;
