const db = require('../../common/database');
const EventService = require('../events/event.service');
const axios = require('axios');
const cheerio = require('cheerio');
const AIAnalyst = require('./ai-analyst');

/**
 * AggregatorService - Orchestrates syncing events from various external platforms
 */
class AggregatorService {
  /**
   * Sync all registered sources
   */
  async syncAll() {
    console.log('🔄 Starting full sync from external sources...');
    const results = {
      patika: await this.syncPatika(),
      meetup: await this.syncMeetup(),
      coderspace: await this.syncCoderspace()
    };
    return results;
  }

  // Simulated Patika Scraper
  async syncPatika() {
    console.log('Fetching from Patika.dev...');
    // Real implementation would use axios/cheerio to scrape or API if available
    const mockPatikaEvents = [
      {
        title: 'Veri Bilimi ve Makine Öğrenmesi Patikası',
        description: 'Veri dünyasına Patika ile adım atın.',
        eventDate: new Date('2024-05-01').toISOString(),
        location: 'Online',
        eventType: 'BOOTCAMP',
        price: 0,
        quota: 150,
        externalId: 'patika-1' // Unique ID to prevent duplicates
      }
    ];

    return this.saveEvents(mockPatikaEvents, 'Patika.dev');
  }

  // Simulated Meetup API Fetcher
  async syncMeetup() {
    console.log('Fetching from Meetup.com...');
    const mockMeetupEvents = [
      {
        title: 'Istanbul Coders - Rust & Go Atölyesi',
        description: 'Sistem programlama dilleri üzerine derinlemesine buluşma.',
        eventDate: new Date('2024-02-28').toISOString(),
        location: 'Nidakule, Göztepe',
        eventType: 'MEETUP',
        price: 0,
        quota: 80,
        externalId: 'meetup-ic-001'
      }
    ];

    return this.saveEvents(mockMeetupEvents, 'Meetup');
  }

  async syncCoderspace() {
    console.log('Fetching from Coderspace.io...');
    try {
      const { data } = await axios.get('https://coderspace.io/etkinlikler');
      const $ = cheerio.load(data);
      const events = [];

      // Loop through event cards
      // Improved Strategy: Iterate over all cards but check structure/text to avoid 'Geçmiş'
      // Often strictly separating by DOM section is hard without seeing it, so we rely on text heuristics
      // and checking if the link is in the 'Geçmiş Etkinlikler' text block vicinity.
      // For now, we'll fetch all h5 links but let the AI Analyst filter "Tamamlandı" ones.

      $('h5 a').each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr('href');
        const fullLink = link.startsWith('http') ? link : `https://coderspace.io${link}`;

        // Simple heuristic: if the parent or near text says "Tamamlandı", it's past.
        // We will pass this responsibility to AIAnalyst for now to keep scraping simple.

        events.push({
          title: title,
          description: `Coderspace Etkinliği: ${title}. Detaylar için: ${fullLink}`,
          eventDate: new Date().toISOString(),
          location: 'Online',
          eventType: 'BOOTCAMP',
          price: 0,
          quota: 100,
          externalId: fullLink
        });
      });

      console.log(`Found ${events.length} candidates from Coderspace.`);
      return this.processWithErrorCorrection(events, 'Coderspace');
    } catch (error) {
      console.error('Coderspace scrape error:', error.message);
      return { added: 0, skipped: 0, error: error.message };
    }
  }

  /**
   * Saves external events to local DB avoiding duplicates
   */
  async processWithErrorCorrection(events, sourceName) {
    let stats = { added: 0, skipped: 0, autoPublished: 0, sentToDraft: 0 };

    for (const eventData of events) {
      // 1. Check duplicates
      const exists = await db.query(
        'SELECT id FROM events WHERE external_id = $1 AND source = $2',
        [eventData.externalId, sourceName]
      );

      if (exists.rows.length === 0) {
        // 2. AI EVALUATION
        const aiResult = await AIAnalyst.evaluate(eventData);
        const status = aiResult.approved ? 'PUBLISHED' : 'DRAFT';

        // 3. Create Event
        await EventService.createEvent({
          ...eventData,
          status: status,
          source: sourceName,
          description: `[AI CONFIDENCE: ${(aiResult.confidence * 100).toFixed(0)}%] ${eventData.description}\n[AI NOTE]: ${aiResult.reason}`,
          organizerId: null
        });

        stats.added++;
        if (status === 'PUBLISHED') stats.autoPublished++;
        else stats.sentToDraft++;
      } else {
        stats.skipped++;
      }
    }

    console.log('Sync Stats:', stats);
    return stats;
  }

  // Legacy method wrapper
  async saveEvents(events, sourceName) {
     return this.processWithErrorCorrection(events, sourceName);
  }
}

module.exports = new AggregatorService();
