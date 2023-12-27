import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

export const userApi: any = {
  async setNewPassword(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/auth/mypage/settings/detail/password/change`;
    return axiosClient.post(url, data);
  },
};
