const PHONE = '447979126819';

/**
 * Sends a WhatsApp message via CallMeBot.
 * Requires VITE_CALLMEBOT_API_KEY to be set in your .env file.
 * To get your API key: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
export async function sendWhatsAppNotification(text: string): Promise<void> {
  const apiKey = import.meta.env.VITE_CALLMEBOT_API_KEY;
  if (!apiKey) return;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${PHONE}&text=${encodeURIComponent(text)}&apikey=${apiKey}`;
  await fetch(url).catch(() => {
    // fire-and-forget — don't block the UI if the notification fails
  });
}
