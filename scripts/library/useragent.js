const DESKTOP_UAS = [
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
];

const MOBILE_UAS = [
	'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
	'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.108 Mobile/15E148 Safari/604.1',
];

export function getRandomUA(isMobile = false) {
	const list = isMobile ? MOBILE_UAS : DESKTOP_UAS;
	return list[Math.floor(Math.random() * list.length)];
}

/**
 * header for scraping basic web/api
 * @param {Object} customHeaders - another header
 * @param {boolean} isMobile - true for mobile ua
 * @returns {Object}
 */
export function getScraperHeaders(customHeaders = {}, isMobile = false) {
	const ua = getRandomUA(isMobile);
	return {
		'User-Agent': ua,
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
		'Accept-Language': 'en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7',
		'Accept-Encoding': 'gzip, deflate, br',
		Connection: 'keep-alive',
		'Upgrade-Insecure-Requests': '1',
		'Sec-Fetch-Dest': 'document',
		'Sec-Fetch-Mode': 'navigate',
		'Sec-Fetch-Site': 'none',
		'Cache-Control': 'max-age=0',
		...customHeaders,
	};
}

/**
 * header for fetch rest api/json
 * @param {Object} customHeaders - another header
 * @param {boolean} isMobile - true for mobile ua
 * @returns {Object}
 */
export function getApiHeaders(customHeaders = {}, isMobile = false) {
	const ua = getRandomUA(isMobile);
	return {
		'User-Agent': ua,
		Accept: 'application/json, text/plain, */*',
		'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
		'Content-Type': 'application/json',
		'Sec-Fetch-Dest': 'empty',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Site': 'same-origin',
		...customHeaders,
	};
}
