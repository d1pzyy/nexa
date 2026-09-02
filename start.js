/**
 *  Original Code  : Naze <github.com/nazedev>
 *                   Copyright (c) 2025 Naze
 *                   Licensed under MIT License
 *
 *  Modifications  : DiP6 <github.com/d1pzyy>
 *                   Copyright (c) 2026 DiP6
 *                   Licensed under GPL v3.0
 *
 *  Last Modified  : Sep, 2 2026
 */

import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { logColor } from '#library/logger.js';

let isRunning = true;
let dizzy;

function start() {
	const args = [
		'--expose-gc',
		join(import.meta.dirname, './scripts/index.js'),
		...process.argv.slice(2),
	];

	dizzy = spawn(process.argv[0], args, {
		stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
	});

	dizzy.on('message', data => {
		if (data === 'reset') {
			logColor.loading('Restarting process...');
			dizzy.kill();
			setTimeout(start, 3000);
		} else if (data === 'uptime') {
			dizzy.send(process.uptime());
		} else if (data === 'exit') {
			process.exit(0);
		}
	});

	dizzy.on('exit', code => {
		if (!isRunning) {
			logColor.success('Process stopped manually. Have a nice day <3');
			process.exit(0);
		} else if (code !== 0) {
			logColor.error(`Process crashed with exit code: ${code}`);
			logColor.loading('Auto restarting in 3s...');
			setTimeout(start, 3000);
		} else {
			logColor.success('Process exited cleanly. Have a nice day <3');
			process.exit(0);
		}
	});
}

start();

process.on('SIGINT', () => {
	isRunning = false;
	logColor.warning('SIGINT received. Shutting down gracefully...');
	if (dizzy) {
		dizzy.kill('SIGINT');
	}
});
