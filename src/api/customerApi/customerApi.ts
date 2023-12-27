import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

export const customerApi: any = {
  async signUp(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/signup`;
    return axiosClient.post(url, data);
  },

  async editCustomer(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/settings/detail/update`;
    return axiosClient.post(url, data);
  },

  async getCastWorked(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/cast-worked`;
    return axiosClient.post(url, data);
  },

  async registerHearing(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/hearing`;
    return axiosClient.post(url, data);
  },
  async deleteBooking({ id, reason }: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/booking/delete/${id}`;
    return axiosClient.post(url, reason);
  },

  async customerBooking(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/booking-matching`;
    return axiosClient.post(url, data);
  },

  async getBookings(): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/list-matching`;
    return axiosClient.get(url);
  },

  async getBookingById(id: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/detail-matching/${id}`;
    return axiosClient.get(url);
  },
  async getCurrentMatching(): Promise<AxiosResponse<any>> {
    const url: string = `user/mypage/matching-current-date`;
    return axiosClient.get(url);
  },
  async getHistoryMatching(): Promise<AxiosResponse<any>> {
    const url: string = `user/mypage/history-matching`;
    return axiosClient.get(url);
  },
  async bookingRequire(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/booking-require`;
    return axiosClient.post(url, data);
  },
  async bookingNotAssigned(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/booking-not-assign`;
    return axiosClient.post(url, data);
  },
  async matchingNotAssigned(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/matching-not-assign`;
    return axiosClient.post(url, data);
  },
  async checkMatchingExist(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/check-matching-exists`;
    return axiosClient.post(url, data);
  },
  async checkCoupon(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/check-coupon`;
    return axiosClient.post(url, data);
  },
  async getMatchingCompleteCustomerApi(): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/complete-matching`;
    return axiosClient.get(url);
  },
  async getMatchingCompleteCustomerByIdApi(matchingId: number): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/survey-matching/${matchingId}`;
    return axiosClient.get(url);
  },
  async postQuestionSurveyAnswerApi({
    matching_id,
    q1,
    q2,
    q3 = '',
    q4 = '',
    q5 = '',
  }: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/survey-matching`;
    return axiosClient.post(url, { matching_id, q1, q2, q3, q4, q5 });
  },
  async updateStatusMatching(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/update-status/${data.id}`;
    return axiosClient.put(url, data.body);
  },
  async extendMatching(id: any): Promise<any> {
    const url: string = `/user/mypage/extend/${id}`;
    return axiosClient.put(url);
  },
  async putFinishMatching(id: any): Promise<any> {
    const url: string = `/user/mypage/process-complete-matching/${id}`;
    return axiosClient.put(url);
  },
  async postSurveyFinish(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/survey-complete-matching`;
    return axiosClient.post(url, data);
  },
  async requestEKYC(): Promise<AxiosResponse<any>> {
    const url: string = `/ekyc/register-kyc`;
    return axiosClient.post(url);
  },
  async checkShiftRegister(data: any): Promise<AxiosResponse<any>> {
    const url: string = `/user/mypage/check-shift-register`;
    return axiosClient.post(url, data);
  },

  async getStatusEkyc(): Promise<AxiosResponse<any>> {
    const url: string = `/ekyc/status-customer`;
    return axiosClient.get(url);
  },
};
