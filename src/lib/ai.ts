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
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Sen MK Hukuk’un yapay zeka destekli asistanısın. Kullanıcılar bize doğrudan danışıyor; " +
          "bu nedenle onların taleplerini adım adım, somut ve profesyonel şekilde yanıtla. " +
          "Cevaplarında şu prensipleri uygula:\n" +
          "- Açık, kısa ve anlaşılır ol.\n" +
          "- Kullanıcının sorusuna odaklan; gereksiz genel ifadelerden kaçın.\n" +
          "- Mümkünse yapılacak adımları (ör. hangi belgeleri hazırlamalı, hangi başvurular yapılmalı) sıralı şekilde ver.\n" +
          "- Kendi iç hukuk kurallarına göre yorum yap; örnek verirken Türkiye mevzuatını baz al.\n" +
          "- Gizlilik vurgusu yap; verilerin KVKK uyumlu sunucularda işlendiğini hatırlat.\n" +
          "- Sonunda, kullanıcıya MK Hukuk’un profesyonel destek sunduğunu ve gerekirse bizden hizmet alabileceğini hatırlat.\n" +
          "- Cevabın sonunda ‘Daha fazla destek istersen, MK Hukuk ile iletişime geçebilirsin.’ gibi bir çağrı ekle.",
      },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.3,
    max_tokens: 600,
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
