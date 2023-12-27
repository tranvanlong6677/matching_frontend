import { AxiosResponse } from 'axios';
import axiosClient from '../axiosClient';

const adminApi = {
  async getListCast(): Promise<AxiosResponse<any>> {
    const url: string = '/admin/list-cast';
    return axiosClient.get(url);
  },
  async getListCastPagination(params: any): Promise<AxiosResponse> {
    const url: string = `/admin/list-cast?page=${params}`;
    return axiosClient.get(url);
  },
  async getCastDetail(id: any): Promise<AxiosResponse<any>> {
    const url: string = `/admin/detail-cast/${id}`;
    return axiosClient.get(url);
  },
  async getListUser(param: any): Promise<AxiosResponse> {
    const url: string = `/admin/list-user?${param}`;
    return axiosClient.get(url);
  },
  async getListUserDetail(id: any): Promise<AxiosResponse> {
    const url: string = `/admin/detail-user/${id}`;
    return axiosClient.get(url);
  },
  async getListCalendarUser(id: any): Promise<AxiosResponse> {
    const url: string = `/admin/calendar-user/${id}`;
    return axiosClient.get(url);
  },
  async deleteCalendarUser(id: any): Promise<AxiosResponse> {
    const url: string = `/admin/shift/${id}`;
    return axiosClient.delete(url);
  },
  async deleteCalendarCast(id: any): Promise<AxiosResponse> {
    const url: string = `/admin/shift-cast//${id}`;
    return axiosClient.delete(url);
  },
  async getListMatching(param: any): Promise<AxiosResponse> {
    const url: string = `/admin/list-matching?${param}`;
    return axiosClient.get(url);
  },
  async getListShiftCast(userId: number): Promise<AxiosResponse> {
    const url: string = `/admin/list-shift/${userId}`;
    return axiosClient.get(url);
  },
  async postDetailShift(data: any): Promise<AxiosResponse> {
    const url: string = `/admin/detail-shift`;
    return axiosClient.post(url, { ...data });
  },
  async putStatusHearing({ id, status_hearing }: any): Promise<AxiosResponse> {
    const url: string = `/admin/hearing-status/${id}`;
    return axiosClient.put(url, status_hearing);
  },
  async putTrainingStatusApi(id: number, training_status: number): Promise<AxiosResponse> {
    const url: string = `/admin/training-status/${id}`;
    return axiosClient.put(url, { training_status });
  },
  async putAuditStatusApi(id: number, audit_status: number): Promise<AxiosResponse> {
    const url: string = `/admin/audit-status/${id}`;
    return axiosClient.put(url, { audit_status });
  },
  async putMemoHearing({ id, memo_hearing }: any): Promise<AxiosResponse> {
    const url: string = `/admin/memo-hearing/${id}`;
    return axiosClient.put(url, memo_hearing);
  },
  async putMemoAuditApi(id: number, memo_audit: string): Promise<AxiosResponse> {
    const url: string = `/admin/memo-audit/${id}`;
    return axiosClient.put(url, { memo_audit });
  },
  async getAllCalendarCurrentMonthApi(id: number): Promise<AxiosResponse> {
    const url: string = `/admin/calendar-cast/${id}`;
    return axiosClient.get(url);
  },
  async putRankAdminUser({ id, rank }: any): Promise<AxiosResponse> {
    const url: string = `/admin/rank/user/${id}`;
    return axiosClient.put(url, rank);
  },
  async putRankAdminCast({ id, rank }: any): Promise<AxiosResponse> {
    const url: string = `/admin/rank/cast/${id}`;
    return axiosClient.put(url, rank);
  },
  async postCouponUser(file: any): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    const response = await axiosClient.post('/admin/import-coupon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  async putUpdateSalaryHourApi(id: any, salaryHour: any): Promise<AxiosResponse> {
    const url: string = `/admin/salary-hour/${+id}`;
    return axiosClient.put(url, { salary_hour: +salaryHour });
  },
  async putUpdateSalaryApi(id: any, salary: any): Promise<AxiosResponse> {
    const url: string = `/admin/salary/${+id}`;
    return axiosClient.put(url, { salary: +salary });
  },
  async deleteMatching(id: any): Promise<AxiosResponse> {
    const url: string = `/admin/shift/${id}`;
    return axiosClient.delete(url);
  },
  async getUserSurveyMatching(data: { month: string; year: string }): Promise<AxiosResponse> {
    const url: string = `/admin/user-survey?month=${data.month}&year=${data.year}`;
    return axiosClient.get(url);
  },
  async getSalesTrend(params: any): Promise<AxiosResponse> {
    const url: string = `/admin/sales-trend?${params}`;
    return axiosClient.get(url);
  },
  async downloadCoupon(): Promise<AxiosResponse> {
    const url = `/admin/export-coupon`;
    return axiosClient.get(url);
  },
};

export default adminApi;
