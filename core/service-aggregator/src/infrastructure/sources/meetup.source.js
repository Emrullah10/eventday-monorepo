/** Simulated Meetup.com source. A real implementation would call the Meetup API. */
export const fetchMeetupEvents = async () => [
  {
    title: 'Istanbul Coders - Rust & Go Atölyesi',
    description: 'Sistem programlama dilleri üzerine derinlemesine buluşma.',
    eventDate: new Date('2024-02-28').toISOString(),
    location: 'Nidakule, Göztepe',
    eventType: 'MEETUP',
    price: 0,
    quota: 80,
    externalId: 'meetup-ic-001',
  },
];
