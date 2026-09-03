/**
 * Global Configuration
 * Author :: Kenzo <github.com/itsmekenzzx>
 * License :: GPL V3.0
 */

import pkg from '../package.json' with { type: 'json' };

const name = 'Nexa';

Object.assign(global, {
	botName: name,
	version: pkg.version,
	footer: `Powered by ${name}`,
	packname: 'Created by',
	author: name,
	prefix: ['.', '!', '/', '?'],
	owner: [['62812345678', 'd6.', true]],
	socmed: {
		github: 'https://github.com/d1pzyy',
		instagram: 'https://instagram.com/d1p.zy',
		tiktok: 'https://tiktok.com/@d1p.zy',
		telegram: 'https://t.me/d1pzzy',
	},
	channel: {
		name: 'd6. [HQ]',
		idch: '4d5', // hex
		link: 'https://whatsapp.com/channel/0029Vb8ad0iFXUueMu94mF0j',
	},
	settings: {
		antiSpam: {
			spam: true,
			interval: 5,
		},
		autoBan: {
			ban: true,
			interval: 3,
		},
		antiBug: true,
		blockCall: true,
		selfMode: false,
		isMaintance: false,
		presence: 'typing', // recording
		group: {
			antiLink: true,
			autoWelcome: true,
			autoLeave: true,
			autoKick: {
				kick: true,
				interval: 3,
			},
			nsfwContent: false,
		},
	},

	media: {
		thumb: {
			image: '../source/media/img/thumb/*.png',
			video: '../source/media/vid/thumb/*.mp4',
		},
	},
});
