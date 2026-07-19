import { GoogleGenerativeAI } from '@google/generative-ai';

const fallbackEvaluate = (event) => {
  const lowerTitle = event.title.toLowerCase();
  if (lowerTitle.includes('tamamlandı') || lowerTitle.includes('geçmiş')) {
    return { approved: false, confidence: 1.0, reason: 'Geçmiş etkinlik (Yedek mantık).' };
  }
  return { approved: false, confidence: 0.5, reason: 'AI Anahtarı eksik veya hata oluştu. Manuel onay gerekli.' };
};

const buildPrompt = (event) => `
  Sen bir etkinlik ve bootcamp analiz asistanısın.
  Aşağıdaki etkinlik bilgilerini incele ve şu kurallara göre karar ver:
  1. Etkinlik tarihi geçmişte mi? (Bugünün tarihi: ${new Date().toLocaleDateString('tr-TR')})
  2. Etkinlik yazılım, teknoloji, kariyer veya yapay zeka ile mi ilgili?
  3. Etkinlik bilgileri (başlık, açıklama) yeterli ve ciddi mi?

  Kararını şu JSON formatında ver, başka bir şey yazma:
  {
    "approved": true/false (Eğer gelecek tarihte ve yazılım/teknoloji ile ilgiliyse true),
    "confidence": 0.0-1.0 arası sayı,
    "reason": "Neden bu kararı verdiğinin kısa açıklaması"
  }

  Etkinlik Bilgileri:
  Başlık: ${event.title}
  Açıklama: ${event.description}
  Tarih: ${event.eventDate}
  Konum: ${event.location}
`;

/** Wraps Gemini to decide whether a scraped event should auto-publish, falling back to a keyword heuristic. */
export const makeAiAnalyst = ({ apiKey, logger }) => ({
  evaluate: async (event) => {
    if (!apiKey || apiKey.includes('BURAYA')) {
      logger?.warn('Gemini API key missing or placeholder — using fallback evaluation.');
      return fallbackEvaluate(event);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(buildPrompt(event));
      const text = (await result.response).text();
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const decision = JSON.parse(cleanJson);

      return {
        approved: decision.approved || false,
        confidence: decision.confidence || 0.5,
        reason: decision.reason || 'Gemini analizi tamamlandı.',
      };
    } catch (error) {
      logger?.error('Gemini API error', error.message);
      return fallbackEvaluate(event);
    }
  },
});
