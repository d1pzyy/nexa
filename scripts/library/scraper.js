import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import ytdl from 'ytdl-core';
import { smartFetch } from '#engine/reqHandler.js';

const tempDir = path.join(process.cwd(), 'database', 'temp');
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

async function saveToTemp(filename, responseOrStream) {
	const filePath = path.join(tempDir, filename);
	if (responseOrStream instanceof Response) {
		const fileStream = fs.createWriteStream(filePath);
		await pipeline(responseOrStream.body, fileStream);
	} else if (responseOrStream.pipe) {
		const fileStream = fs.createWriteStream(filePath);
		await pipeline(responseOrStream, fileStream);
	} else if (Buffer.isBuffer(responseOrStream)) {
		fs.writeFileSync(filePath, responseOrStream);
	}
	return filePath;
}

// yt downloader
export async function dlYouTube(url, format = 'video') {
	if (!ytdl.validateURL(url)) throw new Error('Invalid YouTube URL.');
	const info = await ytdl.getInfo(url);
	const title = info.videoDetails.title.replace(/[^\w\s]/gi, '').slice(0, 30);
	const ext = format === 'audio' ? 'mp3' : 'mp4';
	const filename = `yt_${Date.now()}_${title}.${ext}`;
	const filterOption = format === 'audio' ? 'audioonly' : 'audioandvideo';
	const stream = ytdl(url, { filter: filterOption, quality: 'highest' });
	const filePath = await saveToTemp(filename, stream);
	return {
		title: info.videoDetails.title,
		channel: info.videoDetails.author.name,
		path: filePath,
	};
}

// tiktok downloader
export async function dlTikTok(url) {
	const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
	const apiRes = await smartFetch(apiUrl);
	const json = await apiRes.json();
	if (json.code !== 0) throw new Error('Failed to get data from TikTok.');

	const data = json.data;

	if (data.images && Array.isArray(data.images) && data.images.length > 0) {
		const imagePaths = [];
		for (const [index, imgUrl] of data.images.entries()) {
			const filename = `tt_img_${Date.now()}_${index}.jpg`;
			const imgRes = await smartFetch(imgUrl);
			const filePath = await saveToTemp(filename, imgRes);
			imagePaths.push(filePath);
		}
		return {
			type: 'image',
			title: data.title || 'tiktok_image',
			author: data.author?.nickname || 'Unknown',
			paths: imagePaths,
		};
	}

	const videoUrl = data.play;
	const filename = `tt_vid_${Date.now()}.mp4`;
	const videoRes = await smartFetch(videoUrl);
	const filePath = await saveToTemp(filename, videoRes);

	return {
		type: 'video',
		title: data.title || 'tiktok_video',
		author: data.author?.nickname || 'Unknown',
		path: filePath,
	};
}

// ig downloader
export async function dlInstagram(url) {
	const apiUrl = `https://aemt.me/download/igdl?url=${encodeURIComponent(url)}`;
	const apiRes = await smartFetch(apiUrl);
	const json = await apiRes.json();

	if (!json.status || !json.result || json.result.length === 0) {
		throw new Error('Failed to get media from Instagram.');
	}

	const results = [];
	for (const [index, media] of json.result.entries()) {
		const ext = media.url.includes('.jpg') || media.url.includes('.webp') ? 'jpg' : 'mp4';
		const filename = `ig_${Date.now()}_${index}.${ext}`;
		const mediaRes = await smartFetch(media.url);
		const filePath = await saveToTemp(filename, mediaRes);
		results.push(filePath);
	}

	return { paths: results };
}

export default { dlYouTube, dlTikTok, dlInstagram };
