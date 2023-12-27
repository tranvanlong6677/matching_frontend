import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {
    'content-type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const newConfig: InternalAxiosRequestConfig<any> = config;
    const token =
      localStorage.getItem('access_token') === null ? 'null' : JSON.parse(localStorage.getItem('access_token')!);

    if (token && token !== 'undefined' && token !== 'null') {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }

    return newConfig;
  },

  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response && response.data && response.data.data && response.data.data.rows) {
      return response.data.data.rows;
    }

    if (response && response.data) {
      return response.data;
    }

    return response;
  },

  async (errors) => {
    if (errors.response?.status === 401 && errors.response?.data?.message === 'Unauthenticated.') {
      localStorage.clear();
      window.location.replace('/');
    }

    return Promise.reject(errors);
  },
);

export default axiosClient;
