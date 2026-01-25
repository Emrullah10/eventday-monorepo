const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Analyst Service
 * Uses Google Gemini API to analyze event data and decide on publication status.
 */
class AIAnalyst {
  constructor() {
    // Removed this.genAI initialization from constructor
  }

  /**
   * Evaluates an event using Gemini AI.
   * @param {Object} event
   * @returns {Object} { approved: boolean, confidence: number, reason: string }
   */
  async evaluate(event) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.includes('BURAYA')) {
      console.warn('⚠️ Gemini API Key is missing or default placeholder. Using fallback.');
      return this.fallbackEvaluate(event);
    }

    console.log(`🤖 Gemini AI Analyzing: ${event.title}...`);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // JSON temizleme (Markdown bloklarını kaldır)
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const decision = JSON.parse(cleanJson);

      return {
        approved: decision.approved || false,
        confidence: decision.confidence || 0.5,
        reason: decision.reason || 'Gemini analizi tamamlandı.'
      };
    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      return this.fallbackEvaluate(event);
    }
  }

  /**
   * Fallback logic if API fails or key is missing
   */
  fallbackEvaluate(event) {
    const lowerTitle = event.title.toLowerCase();
    if (lowerTitle.includes('tamamlandı') || lowerTitle.includes('geçmiş')) {
      return { approved: false, confidence: 1.0, reason: 'Geçmiş etkinlik (Yedek mantık).' };
    }
    return { approved: false, confidence: 0.5, reason: 'AI Anahtarı eksik veya hata oluştu. Manuel onay gerekli.' };
  }
}

module.exports = new AIAnalyst();
