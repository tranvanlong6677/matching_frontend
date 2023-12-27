import axiosClient from '../axiosClient';
import { AxiosResponse } from 'axios';

export const postalCodeApi: any = {
  async getPostalCode(id: any): Promise<AxiosResponse<any>> {
    const url: string = `/postal-code/${id}`;
    return axiosClient.get(url);
  },
};
