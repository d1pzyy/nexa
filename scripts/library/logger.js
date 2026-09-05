import { styleText } from 'node:util';
import { getTime } from './times.js';

const getTimestamp = () => styleText('gray', `[${getTime('HH:mm:ss')}]`);

export const logColor = {
	error: text =>
		console.error(
			`${getTimestamp()} ${styleText(['white', 'bgRed', 'bold'], `[ERROR] ${text}`)}`
		),
	warning: text =>
		console.log(`${getTimestamp()} ${styleText(['yellow', 'bold'], '[WARN]')} ${text}`),
	success: text =>
		console.log(`${getTimestamp()} ${styleText(['green', 'bold'], '[DONE]')} ${text}`),
	loading: text => console.log(`${getTimestamp()} ${styleText(['gray', 'italic'], text)}`),
	info: text => console.log(`${getTimestamp()} ${styleText(['blue', 'bold'], '[INFO]')} ${text}`),
	bot: (me, message) =>
		console.log(
			`${getTimestamp()} ${styleText(['magenta', 'bold'], '[NEXA]')} ${styleText('cyan', me)}: ${message}`
		),
	cmd: (sender, command) =>
		console.log(
			`${getTimestamp()} ${styleText(['bgMagenta', 'white', 'bold'], '[CMD]')} ${styleText('cyan', sender)} executed ${styleText('bold', command)}`
		),
};
