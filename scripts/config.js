/**
 * Global Configuration
 * Author :: d6. <github.com/d1pzyy>
 * License :: GPL V3.0
 */

import pkg from '../package.json' with { type: 'json' };

const name = 'Nexa™';

Object.assign(global, {
	botName: name,
	version: pkg.version,
	footer: `Powered by ${name}`,
	packname: 'Created by',
	author: name,
	prefix: ['.', '!', '/', '#'],
	owner: [['62812345678', 'd6.', true]],
	socmed: {
		github: 'https://github.com/d1pzyy',
		instagram: 'https://instagram.com/d1p.zy',
		tiktok: 'https://tiktok.com/@d1p.zy',
		telegram: 'https://t.me/d1pzzy',
	},
	channel: {
		name: 'd6. [HQ]',
		/* idch: '4d5', // hex */
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
		antiVirtex: true,
		botMode: 'public',
		blockCall: true,
		maintenance: false,
		presence: 'typing', // recording
		maxWarning: 3,
		group: {
			antiLink: true,
			antiMedia: false,
			antiTagStatus: true,
			antiNsfw: true,
			autoKick: {
				kick: true,
				interval: 3,
			},
		},
	},
	limit: {
		default: 20,
		premium: -1,
		owner: -1,
	},
	media: {
		/* audio: '../source/media/audio/*.mp3', */
		thumbImg: '../source/media/image/thumb/*.png',
		/*
    qrisImg: '../source/media/image/utils/qris.png',
		paypalImg: '../source/media/image/utils/paypal.png',
    */
		defaultPfp: '../source/media/image/utils/default.png',
	},
});
