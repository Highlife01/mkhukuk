export type AiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function getAiAssistantReply(
  messages: AiChatMessage[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API anahtarı bulunamadı. Lütfen .env dosyanıza VITE_OPENAI_API_KEY değerini ekleyin."
    );
  }

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Sen MK Hukuk’un (Av. Mahmut Kaya Hukuk & Danışmanlık) uzman yapay zeka asistanısın. " +
          "Kullanıcıların hukuki sorularına profesyonel, somut ve yol gösterici yanıtlar ver. " +
          "Prensiplerin:\n" +
          "- Yanıtların Türk hukuk mevzuatına uygun, güncel ve güvenilir olsun.\n" +
          "- Karmaşık hukuki terimleri basit ama profesyonelce açıkla.\n" +
          "- Kullanıcıya izlemesi gereken hukuki adımları (dava açma, arabuluculuk, ihtarname vb.) net bir şekilde sırala.\n" +
          "- Gizliliğe önem ver; KVKK vurgusu yap.\n" +
          "- Kesin yargılardan kaçın, 'hak kaybına uğramamak için bir avukata danışmanız önerilir' uyarısını uygun yerlerde yap.\n" +
          "- Sonunda mutlaka MK Hukuk'un profesyonel destek sunduğunu belirterek iletişime geçmeye davet et.",
      },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.5,
    max_tokens: 1000,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();

    let message = `OpenAI isteği başarısız oldu: ${response.status} ${response.statusText}`;

    try {
      const json = JSON.parse(text);
      if (json?.error?.code === 'insufficient_quota') {
        message +=
          ' - Kota aşıldı. Lütfen OpenAI plan/bakiye durumunuzu kontrol edin.';
      } else if (json?.error?.message) {
        message += ` - ${json.error.message}`;
      }
    } catch {
      message += ` - ${text}`;
    }

    throw new Error(message);
  }

  const data = (await response.json()) as any;
  const message = data.choices?.[0]?.message?.content;
  if (!message) {
    throw new Error("OpenAI yanıtı beklenmedik bir formatta geldi.");
  }

  return message.trim();
}
