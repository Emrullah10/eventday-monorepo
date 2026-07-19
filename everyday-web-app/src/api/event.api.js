import { axiosInstance } from '@shared/axios/axios-instance';

export const eventApi = {
  list: () => axiosInstance.get('/events').then((res) => res.data),
  getById: (id) => axiosInstance.get(`/events/${id}`).then((res) => res.data),
  create: (payload) => axiosInstance.post('/events', payload).then((res) => res.data),
};
