import { writeData } from '#engine/dbHandler.js';

export async function handler(m, { conn, args, usedPrefix, command, t, userData }) {
	const selectedLang = args[0]?.toLowerCase();
	const availableLangs = ['id', 'en', 'cn'];

	if (!selectedLang || !availableLangs.includes(selectedLang)) {
		const egUsed = `${usedPrefix}${command} <id|en|cn>`;
		const fallbackMsg = t('command.example', { egUsed });
		return await conn.sendMessage(m.chat, { text: fallbackMsg }, { quoted: m });
	}

	const senderJid = userData?.jid || m.sender || m.key.remoteJid;

	writeData('user', senderJid, {
		languageDefault: selectedLang,
	});

	const langNames = {
		id: 'Bahasa Indonesia',
		en: 'English',
		cn: '简体中文',
	};

	const successMsg =
		selectedLang === 'id'
			? `✅ Bahasa berhasil diubah ke *${langNames[selectedLang]}*!`
			: selectedLang === 'cn'
				? `✅ 语言已成功更改为 *${langNames[selectedLang]}*！`
				: `✅ Language successfully set to *${langNames[selectedLang]}*!`;

	await conn.sendMessage(m.chat, { text: successMsg }, { quoted: m });
}

handler.help = ['setlang', 'setlanguage'];
handler.tags = ['tools'];
handler.command = /^(setlang|setlanguage)$/i;
handler.description = 'Change your preferred default language';
