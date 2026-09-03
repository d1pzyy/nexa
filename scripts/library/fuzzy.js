/**
 * command matcher
 * path : ./library/fuzzy.js
 */
function getSimilarity(str1, str2) {
	const a = str1.toLowerCase();
	const b = str2.toLowerCase();
	if (a === b) return 100;
	if (a.length === 0 || b.length === 0) return 0;
	const matrix = [];
	for (let i = 0; i <= b.length; i++) matrix[i] = [i];
	for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1, // substitution
					matrix[i][j - 1] + 1, // insertion
					matrix[i - 1][j] + 1 // deletion
				);
			}
		}
	}
	const distance = matrix[b.length][a.length];
	const maxLen = Math.max(a.length, b.length);
	return Math.round(((maxLen - distance) / maxLen) * 100);
}

export function findDidYouMean(inputCmd, pluginsMap, threshold = 60) {
	if (inputCmd.length < 2) return null;
	let bestMatch = null;
	let highestPercent = 0;
	for (const [_, plugin] of pluginsMap) {
		let cmds = [];
		if (Array.isArray(plugin.command)) {
			cmds = plugin.command;
		} else if (typeof plugin.command === 'string') {
			cmds = [plugin.command];
		} else if (plugin.help) {
			cmds = plugin.help;
		}
		for (const cmd of cmds) {
			const percent = getSimilarity(inputCmd, cmd);
			if (percent > highestPercent) {
				highestPercent = percent;
				bestMatch = cmd;
			}
		}
	}
	if (highestPercent >= threshold) {
		return {
			cmdMean: bestMatch,
			cmdPercent: `${highestPercent}%`,
		};
	}

	return null;
}
