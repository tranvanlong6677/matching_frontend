import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

export const authApi: any = {
  async login(data: any): Promise<AxiosResponse<any>> {
    const url: string = '/auth/login';
    return axiosClient.post(url, data);
  },

  async castRegisterEmail(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/auth/register`;
    return axiosClient.post(url, data);
  },
  async castPostEmail(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/auth/email`;
    return axiosClient.post(url, data);
  },
  async castSignUp(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/cast/signup`;
    return axiosClient.post(url, data);
  },

  async logout(): Promise<AxiosResponse<any>> {
    const url: string = `/auth/logout`;
    return axiosClient.post(url);
  },

  async deleteAccount(): Promise<AxiosResponse<any>> {
    const url: string = `/auth/mypage/settings/detail/delete-service`;
    return axiosClient.post(url);
  },
};
