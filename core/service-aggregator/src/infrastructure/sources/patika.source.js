/** Simulated Patika.dev source. A real implementation would call Patika's API or scrape it. */
export const fetchPatikaEvents = async () => [
  {
    title: 'Veri Bilimi ve Makine Öğrenmesi Patikası',
    description: 'Veri dünyasına Patika ile adım atın.',
    eventDate: new Date('2024-05-01').toISOString(),
    location: 'Online',
    eventType: 'BOOTCAMP',
    price: 0,
    quota: 150,
    externalId: 'patika-1',
  },
];
