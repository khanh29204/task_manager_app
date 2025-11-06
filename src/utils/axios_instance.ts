import axios from 'axios';

// export const BASE_URL = 'http://192.168.1.25:3000';
export const BASE_URL = 'https://tasks.quockhanh020924.id.vn';

export const instance = axios.create({
  baseURL: BASE_URL,
  httpAgent: 'http',
  httpsAgent: 'https',
  timeout: 15000,
});
