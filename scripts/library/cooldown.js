/**
 * Cooldown Handler
 * Author :: Kenzo <github.com/itsmekenzzx>
 * License :: GPL V3.0
 * Path :: /scripts/library/cooldown.js
 */

const cooldowns = new Map();

export function checkCooldown(senderJid, commandId, defaultCooldown = 5) {
	const cooldownTime = defaultCooldown * 1000;
	const cooldownKey = `${senderJid}_${commandId}`;
	const lastUsed = cooldowns.get(cooldownKey);

	if (lastUsed && Date.now() - lastUsed < cooldownTime) {
		const remainingMs = cooldownTime - (Date.now() - lastUsed);
		return { isCooldown: true, remainingMs };
	}

	cooldowns.set(cooldownKey, Date.now());
	setTimeout(() => {
		cooldowns.delete(cooldownKey);
	}, cooldownTime);

	return { isCooldown: false, remainingMs: 0 };
}
