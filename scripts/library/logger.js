import { styleText } from 'node:util';

export const logColor = {
	error: text => console.error(styleText(['white', 'bgRed', 'bold'], `[ERROR] ${text}`)),
	warning: text => console.error(styleText(['yellow', 'bold'], '[WARN]') + ' ' + text),
	success: text => console.log(styleText(['green', 'bold'], '[DONE]') + ' ' + text),
	loading: text => console.log(styleText(['gray', 'italic'], `${text}`)),
	info: text => console.log(styleText(['blue', 'bold'], '[INFO]') + ' ' + text),
};
