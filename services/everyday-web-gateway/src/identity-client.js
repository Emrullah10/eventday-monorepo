import axios from 'axios';
import { appConfig } from '../configs/app-config.js';

/** Thin client the gateway uses to delegate credential checks to service-identity. */
export const identityClient = {
  register: async ({ email, password, fullName }) => {
    const { data } = await axios.post(`${appConfig.IDENTITY_SERVICE_URL}/register`, { email, password, fullName });
    return data.user;
  },

  login: async ({ email, password }) => {
    const { data } = await axios.post(`${appConfig.IDENTITY_SERVICE_URL}/login`, { email, password });
    return data.user;
  },

  findById: async (id) => {
    const { data } = await axios.get(`${appConfig.IDENTITY_SERVICE_URL}/internal/users/${id}`);
    return data;
  },
};
