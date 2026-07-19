import axios from 'axios';

/** withCredentials so the gateway's httpOnly auth cookie is sent automatically. */
export const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const xsrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('everyday_xsrf_token='))
    ?.split('=')[1];
  if (xsrfToken) config.headers['x-xsrf-token'] = xsrfToken;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // The gateway only issues short-lived cookies; a 401 here means the
      // session is gone, so drop the client-side auth state.
      import('@store/useAuthStore').then(({ useAuthStore }) => {
        useAuthStore.getState().clear();
      });
    }
    return Promise.reject(error);
  },
);
