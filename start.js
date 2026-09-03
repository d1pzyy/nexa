/**
 *  Original Code  : Naze <github.com/nazedev>
 *                   Copyright (c) 2025 Naze
 *                   Licensed under MIT License
 *
 *  Modifications  : d6. <github.com/d1pzyy>
 *                   Copyright (c) 2026 d6.
 *                   Licensed under GPL v3.0
 *
 *  Last Modified  : Sep, 3 2026
 */

import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { logColor } from '#library/logger.js';

let isRunning = true;
let isa; /* i miss u */

// rapid restart loop prevention
let crashCount = 0;
let lastCrashTime = Date.now();
const MAX_CRASH_COUNT = 5;
const CRASH_RESET_WINDOW = 60000;
let gcInterval = null;

function start() {
	const args = [
		'--expose-gc',
		join(import.meta.dirname, './scripts/index.js'),
		...process.argv.slice(2),
	];

	isa = spawn(process.argv[0], args, {
		stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
	});

	// exec interval gc evry 15m
	if (!gcInterval) {
		gcInterval = setInterval(
			() => {
				if (isa && isa.connected) {
					isa.send('gc');
				}
			},
			15 * 60 * 1000
		);
	}

	isa.on('message', data => {
		if (data === 'reset') {
			logColor.loading('Restarting process...');
			cleanupAndRestart();
		} else if (data === 'uptime') {
			isa.send(process.uptime());
		} else if (data === 'exit') {
			cleanupAndExit(0);
		}
	});

	isa.on('exit', code => {
		if (!isRunning) {
			logColor.success('Process stopped manually. Have a nice day <3');
			cleanupAndExit(0);
		} else if (code !== 0) {
			logColor.error(`Process crashed with exit code: ${code}`);

			const now = Date.now();
			// if crash happen more than 1m
			if (now - lastCrashTime > CRASH_RESET_WINDOW) {
				crashCount = 0;
			}

			crashCount++;
			lastCrashTime = now;

			if (crashCount >= MAX_CRASH_COUNT) {
				/* console.error('${crashCount') */
				logColor.error(
					`Process crashed ${crashCount} times within 1 minute. Stopping auto-restart.`
				);
				cleanupAndExit(1);
			} else {
				logColor.loading('Auto restarting in 3s...');
				setTimeout(start, 3000);
			}
		} else {
			logColor.success('Process exited cleanly. Have a nice day <3');
			cleanupAndExit(0);
		}
	});
}

function cleanupAndRestart() {
	if (isa) isa.kill();
	setTimeout(start, 3000);
}

function cleanupAndExit(code = 0) {
	if (gcInterval) clearInterval(gcInterval);
	process.exit(code);
}

start();

// graceful shutdown
process.on('SIGINT', () => {
	isRunning = false;
	logColor.warning('SIGINT received. Shutting down gracefully...');

	if (gcInterval) clearInterval(gcInterval);
	if (isa) {
		isa.kill('SIGINT');
		// force exit if 5s not responding/freeze
		const killTimeout = setTimeout(() => {
			logColor.error('Child process unresponsive. Forcing shutdown...');
			process.exit(1);
		}, 5000);

		// cancel timeout if succes
		isa.once('exit', () => {
			clearTimeout(killTimeout);
		});
	} else {
		process.exit(0);
	}
});
// TODO: conn.makeWASocket (index.js)
