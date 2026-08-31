export const getTime = (format = 'HH:mm', date = new Date()) => {
	const d = new Date(date);
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Jakarta',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23',
	});

	const parts = formatter.formatToParts(d);
	const getPart = type => parts.find(p => p.type === type).value;
	const year = getPart('year');
	const month = getPart('month');
	const day = getPart('day');
	const hour = getPart('hour');
	const minute = getPart('minute');
	const second = getPart('second');
	const hourNum = parseInt(hour);
	const ampm = hourNum >= 12 ? 'PM' : 'AM';
	let hour12 = hourNum % 12;
	hour12 = hour12 ? hour12 : 12;
	const hour12Str = hour12.toString().padStart(2, '0');
	return format
		.replace('DD', day)
		.replace('MM', month)
		.replace('YYYY', year)
		.replace('HH', hour)
		.replace('hh', hour12Str)
		.replace('mm', minute)
		.replace('ss', second)
		.replace('A', ampm);
};

export const greetings = () => {
	const currentHour = parseInt(getTime('HH'));
	if (currentHour >= 5 && currentHour < 12) return 'morning';
	if (currentHour >= 12 && currentHour < 15) return 'afternoon';
	if (currentHour >= 15 && currentHour < 18) return 'evening';
	return 'night';
};

export const dates = (numer = new Date()) => {
	const d = new Date(numer);
	const options = {
		timeZone: 'Asia/Jakarta',
		weekday: 'long',
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	};

	return new Intl.DateTimeFormat('id-ID', options).format(d);
};

export const clockString = ms => {
	const d = Math.floor(ms / (24 * 60 * 60 * 1000));
	const h = Math.floor(ms / (60 * 60 * 1000)) % 24;
	const m = Math.floor(ms / (60 * 1000)) % 60;
	const s = Math.floor(ms / 1000) % 60;
	return [
		d ? `${d} day${d > 1 ? 's' : ''}` : '',
		h ? `${h} hour${h > 1 ? 's' : ''}` : '',
		m ? `${m} minute${m > 1 ? 's' : ''}` : '',
		s ? `${s} second${s > 1 ? 's' : ''}` : '',
	]
		.filter(Boolean)
		.join(' ')
		.trim();
};
