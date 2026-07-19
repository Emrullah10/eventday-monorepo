import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes candidate events from coderspace.io. Filtering out past ("Tamamlandı")
 * events is deliberately left to the AI analyst rather than DOM heuristics —
 * see the original aggregator.service.js comment history for why.
 */
export const fetchCoderspaceEvents = async () => {
  const { data } = await axios.get('https://coderspace.io/etkinlikler');
  const $ = cheerio.load(data);
  const events = [];

  $('h5 a').each((_i, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr('href');
    const fullLink = link.startsWith('http') ? link : `https://coderspace.io${link}`;

    events.push({
      title,
      description: `Coderspace Etkinliği: ${title}. Detaylar için: ${fullLink}`,
      eventDate: new Date().toISOString(),
      location: 'Online',
      eventType: 'BOOTCAMP',
      price: 0,
      quota: 100,
      externalId: fullLink,
    });
  });

  return events;
};
