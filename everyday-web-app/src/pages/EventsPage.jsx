import { useTranslation } from 'react-i18next';
import { useEvents } from '@features/event/hooks/useEvents';

const EventsPage = () => {
  const { t } = useTranslation();
  const { data: events, isLoading } = useEvents();

  return (
    <div>
      <h1>{t('events.title')}</h1>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (events?.length ?? 0) === 0 && <p>{t('events.empty')}</p>}
      <ul>
        {events?.map((event) => (
          <li key={event.id}>{event.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventsPage;
