import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

export const bankApi: any = {
  async searchBank(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/bank?filter=${data}`;
    return axiosClient.get(url);
  },

  async getBankBranches(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/branch/${data}`;
    return axiosClient.get(url);
  },
};
