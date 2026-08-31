import { getScraperHeaders } from '#library/useragent.js';
import { logColor } from '#library/logger.js';

export async function smartFetch(url, options = {}) {
	let headers = getScraperHeaders(options.headers || {}, false);
	let response = await fetch(url, { ...options, headers });

	if ([403, 429, 503].includes(response.status)) {
		logColor.warning(
			`Blocked with Status: ${response.status}. Switching to Mobile User-Agent...`
		);

		headers = getScraperHeaders(options.headers || {}, true);
		response = await fetch(url, { ...options, headers });
	}

	if (!response.ok) {
		throw new Error(`HTTP Status: ${response.status} - ${response.statusText}`);
	}

	return response;
}
