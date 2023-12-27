import axiosClient from '../axiosClient';
import { AxiosResponse } from 'axios';

export const castApi = {
  async getCastDetail(): Promise<AxiosResponse> {
    const url: string = `/auth/mypage/settings/detail`;
    return axiosClient.get(url);
  },

  async editCast(data: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/settings/detail/update`;
    return axiosClient.post(url, data);
  },

  async sendEmailChangePassword(data: any): Promise<AxiosResponse> {
    const url: string = `/auth/mypage/settings/detail/password`;
    return axiosClient.post(url, data);
  },

  async setNewPassword(data: any): Promise<AxiosResponse> {
    const url: string = `/auth/mypage/settings/detail/password/change`;
    return axiosClient.post(url, data);
  },

  async registerSchedule(data: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/shift`;
    return axiosClient.post(url, data);
  },

  async getAllJob(): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/list-shift`;
    return axiosClient.get(url);
  },

  async getJobById(data: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/detail-shift`;
    return axiosClient.post(url, data);
  },
  async getAllJobMatching(param: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/job?page_size=${param}`;
    return axiosClient.get(url, param);
  },

  async getShiftCastById(data: any): Promise<AxiosResponse> {
    const url: string = `/user/mypage/cast-worked/detail-shift-cast`;
    return axiosClient.post(url, data);
  },

  async getAllShiftCast(data: any): Promise<AxiosResponse> {
    const url: string = `/user/mypage/cast-worked/shift`;
    return axiosClient.post(url, data);
  },

  async getJobMatchingById(id: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/job/detail/${id}`;
    return axiosClient.get(url);
  },

  async updateJobMatching(id: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/job/detail/status/${id}`;
    return axiosClient.put(url);
  },
  async updateJobNotificationMatching(id: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/job/detail/status-notification/${id}`;
    return axiosClient.put(url);
  },

  async castContact(data: any): Promise<AxiosResponse> {
    const url: string = `/cast/contact`;
    return axiosClient.post(url, data);
  },
  async getCastJobCurrentDate(): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/job-current-date`;
    return axiosClient.get(url);
  },
  async postCurrentJobReport(data: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/job/report`;
    return axiosClient.post(url, data);
  },
  async deleteService(id: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/shift/delete-shift/${id}`;
    return axiosClient.delete(url);
  },
  async deleteMatching(id: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/delete-matching/${id}`;
    return axiosClient.delete(url);
  },
  async getCurrentShift(): Promise<AxiosResponse> {
    const url: string = `/user/mypage/shift-not-assign`;
    return axiosClient.get(url);
  },
  async getRequireMatching(): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/require-matching`;
    return axiosClient.get(url);
  },
  async postRequireMatching(data: any): Promise<AxiosResponse> {
    const url: string = `/cast/mypage/process-require-matching`;
    return axiosClient.post(url, data);
  },
};
