import { axiosInstance } from '@shared/axios/axios-instance';

export const authApi = {
  register: (payload) => axiosInstance.post('/gateway/register', payload).then((res) => res.data),
  login: (payload) => axiosInstance.post('/gateway/login', payload).then((res) => res.data),
  logout: () => axiosInstance.post('/gateway/logout').then((res) => res.data),
  me: () => axiosInstance.get('/gateway/me').then((res) => res.data),
};
