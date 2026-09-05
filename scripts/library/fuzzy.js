function getSimilarity(str1, str2) {
	const a = str1.toLowerCase();
	const b = str2.toLowerCase();

	if (a === b) return 100;
	if (a.length === 0 || b.length === 0) return 0;

	// using 2 array 1d
	let prevRow = Array.from({ length: a.length + 1 }, (_, i) => i);
	let currRow = new Array(a.length + 1);

	for (let i = 1; i <= b.length; i++) {
		currRow[0] = i;
		for (let j = 1; j <= a.length; j++) {
			const cost = b[i - 1] === a[j - 1] ? 0 : 1;
			currRow[j] = Math.min(
				currRow[j - 1] + 1, // insertion
				prevRow[j] + 1, // deletion
				prevRow[j - 1] + cost // substitution
			);
		}

		[prevRow, currRow] = [currRow, prevRow];
	}

	const distance = prevRow[a.length];
	const maxLen = Math.max(a.length, b.length);
	return Math.round(((maxLen - distance) / maxLen) * 100);
}

export function findDidYouMean(inputCmd, pluginsMap, threshold = 60) {
	if (inputCmd.length < 2) return null;

	let bestMatch = null;
	let highestPercent = 0;
	const inputLen = inputCmd.length;
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
			const cmdLen = cmd.length;

			// early exit
			const maxPossiblePercent =
				(Math.min(inputLen, cmdLen) / Math.max(inputLen, cmdLen)) * 100;
			if (maxPossiblePercent < threshold && highestPercent < threshold) {
				continue;
			}

			const percent = getSimilarity(inputCmd, cmd);
			if (percent > highestPercent) {
				highestPercent = percent;
				bestMatch = cmd;
			}
		}
	}

	if (highestPercent >= threshold) {
		return {
			command: bestMatch,
			similarity: `${highestPercent}%`,
		};
	}

	return null;
}
