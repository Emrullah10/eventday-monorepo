import { useQuery } from '@tanstack/react-query';
import { eventApi } from '@api/event.api';

export const useEvents = () =>
  useQuery({
    queryKey: ['event', 'list'],
    queryFn: eventApi.list,
  });
