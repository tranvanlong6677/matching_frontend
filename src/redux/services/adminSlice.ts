import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import adminApi from '../../api/adminApi/adminApi';
import { AxiosResponse } from 'axios';

export const getListUser: any = createAsyncThunk('admin/getListUser', async (param: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.getListUser(param);
    return res;
  } catch (e) {}
});
export const getListCast: any = createAsyncThunk('admin/getListCast', async (page: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.getListCastPagination(page);
    return res;
  } catch (e) {}
});

export const getCastDetail: any = createAsyncThunk('admin/getCastDetail', async (id: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.getCastDetail(id);
    return res;
  } catch (e) {}
});
export const getUserDetail: any = createAsyncThunk('admin/getUserDetail', async (id: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.getListUserDetail(id);
    return res;
  } catch (e) {}
});
export const getCalendarUser: any = createAsyncThunk('admin/getCalendarUser', async (id: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.getListCalendarUser(id);
    return res;
  } catch (e) {}
});
export const getListMatching: any = createAsyncThunk('admin/getListMatching', async (param: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.getListMatching(param);
    return res;
  } catch (e) {}
});
export const getListShiftCast: any = createAsyncThunk(
  'admin/getListShiftCast',
  async (userId: number): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.getListShiftCast(userId);
      return res;
    } catch (e) {}
  },
);
export const getServiceDetail: any = createAsyncThunk('admin/getServiceDetail', async (data: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.postDetailShift(data);
    return res;
  } catch (e) {}
});
export const putHearingStatus: any = createAsyncThunk(
  'admin/postHearingUser',
  async ({ id, status_hearing }: any): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.putStatusHearing({ id, status_hearing });
      return res;
    } catch (e) {}
  },
);
export const putTrainingStatus: any = createAsyncThunk(
  'admin/putTrainingStatus',
  async ({ id, training_status }: any): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.putTrainingStatusApi(+id, +training_status);
      return res;
    } catch (e) {}
  },
);
export const putAuditStatus: any = createAsyncThunk(
  'admin/putAuditStatus',
  async ({ id, audit_status }: any): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.putAuditStatusApi(+id, +audit_status);
      return res;
    } catch (e) {}
  },
);
export const putMemoAudit: any = createAsyncThunk(
  'admin/putMemoAudit',
  async ({ id, memo_audit }: any): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.putMemoAuditApi(+id, memo_audit);
      return res;
    } catch (e) {}
  },
);

export const putMemoHearing: any = createAsyncThunk(
  'admin/memoHearing',
  async ({ id, memo_hearing }: any): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.putMemoHearing({ id, memo_hearing });
      return res;
    } catch (e) {}
  },
);

export const getAllCalendarCurrentMonth: any = createAsyncThunk(
  'admin/calendarCastCurrentMonth',
  async (id: any): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.getAllCalendarCurrentMonthApi(+id);
      return res;
    } catch (e) {}
  },
);
export const putRankUser: any = createAsyncThunk('admin/rankUser', async ({ id, rank }: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.putRankAdminUser({ id, rank });
    return res;
  } catch (e) {}
});
export const putRankCast: any = createAsyncThunk('admin/putRankCast', async ({ id, rank }: any): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await adminApi.putRankAdminCast({ id, rank });
    return res;
  } catch (e) {}
});
export const postCouponUser: any = createAsyncThunk('admin/couponUser', async ({ file }: any): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await adminApi.postCouponUser(file);
    return response;
  } catch (e) {}
});
export const putUpdateSalaryHour: any = createAsyncThunk(
  'admin/putUpdateSalaryHour',
  async ({ id, salaryHour }: any): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.putUpdateSalaryHourApi(+id, +salaryHour);
      return res;
    } catch (e) {}
  },
);
export const putUpdateSalary: any = createAsyncThunk(
  'admin/putUpdateSalary',
  async ({ id, salary }: any): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.putUpdateSalaryApi(+id, +salary);
      return res;
    } catch (e) {}
  },
);
export const deleteBookingMatching: any = createAsyncThunk(
  'admin/deleteBookingMatching',
  async (id: any): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.deleteMatching(id);
      return res;
    } catch (e) {}
  },
);
export const deleteCastMatching: any = createAsyncThunk('admin/deleteCastMatching', async (id: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.deleteCalendarCast(id);
    return res;
  } catch (e) {}
});
export const deleteUserMatching: any = createAsyncThunk('admin/deleteUserMatching', async (id: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.deleteCalendarUser(id);
    return res;
  } catch (e) {}
});
export const getUserSurveyMatching: any = createAsyncThunk(
  'admin/getUserSurveyMatching',
  async (data: { month: string; year: string }): Promise<any> => {
    try {
      const res: AxiosResponse<any> = await adminApi.getUserSurveyMatching(data);
      return res;
    } catch (e) {}
  },
);

// GET SALES TREND
export const getSalesTrend: any = createAsyncThunk('admin/getSalesTrend', async (params: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await adminApi.getSalesTrend(params);
    return res;
  } catch (e) {}
});

const adminSlice: any = createSlice({
  name: 'admin',
  initialState: {
    loading: false,
    listUser: [],
    listCast: [],
    listUserDetail: [],
    castDetail: {},
    listMatching: [],
    listMatchingForTrends: [],
    calendarDataCast: [],
    serviceDetail: {},
    calendarCurrentMonth: [],
    userSurveyMatching: [],
    userSurveyMatchingChart: [],
    listCalendarUser: [],
    salesTrend: {},
  },
  reducers: {},
  extraReducers: {
    [getListUser.pending]: (state, action): void => {
      state.loading = true;
    },
    [getListUser.reject]: (state, action): void => {
      state.loading = false;
    },
    [getListUser.fulfilled]: (state, action): void => {
      state.loading = false;
      state.listUser = action.payload?.data;
    },
    [getListCast.pending]: (state, action): void => {
      state.loading = true;
    },
    [getListCast.reject]: (state, action): void => {
      state.loading = false;
    },
    [getListCast.fulfilled]: (state, action): void => {
      state.loading = false;
      state.listCast = action.payload?.data;
    },
    [getListUser.fulfilled]: (state, action): void => {
      state.loading = false;
      state.listUser = action.payload?.data;
    },
    [getUserDetail.pending]: (state, action): void => {
      state.loading = true;
    },
    [getUserDetail.reject]: (state, action): void => {
      state.loading = false;
    },
    [getUserDetail.fulfilled]: (state, action): void => {
      state.loading = false;
      state.listUserDetail = action.payload?.data;
    },
    [getCalendarUser.pending]: (state, action): void => {
      state.loading = true;
    },
    [getCalendarUser.reject]: (state, action): void => {
      state.loading = false;
    },
    [getCalendarUser.fulfilled]: (state, action): void => {
      state.loading = false;
      state.listCalendarUser = action.payload?.data;
    },

    [getCastDetail.pending]: (state, action): void => {
      state.loading = true;
    },
    [getCastDetail.reject]: (state, action): void => {
      state.loading = false;
    },
    [getCastDetail.fulfilled]: (state, action): void => {
      state.loading = false;
      state.castDetail = action.payload?.data;
    },
    [getListMatching.pending]: (state, action): void => {
      state.loading = true;
    },
    [getListMatching.reject]: (state, action): void => {
      state.loading = false;
    },
    [getListMatching.fulfilled]: (state, action): void => {
      state.loading = false;
      state.listMatching = action.payload?.data;
    },

    [getListShiftCast.pending]: (state, action): void => {
      state.loading = true;
    },
    [getListShiftCast.reject]: (state, action): void => {
      state.loading = false;
    },
    [getListShiftCast.fulfilled]: (state, action): void => {
      state.loading = false;
      state.calendarDataCast = action.payload?.data;
    },

    [getServiceDetail.pending]: (state, action): void => {
      state.loading = true;
    },
    [getServiceDetail.reject]: (state, action): void => {
      state.loading = false;
    },
    [getServiceDetail.fulfilled]: (state, action): void => {
      state.loading = false;
      state.serviceDetail = action.payload?.data;
    },
    [putTrainingStatus.pending]: (state, action): void => {
      state.loading = true;
    },
    [putTrainingStatus.reject]: (state, action): void => {
      state.loading = false;
    },
    [putTrainingStatus.fulfilled]: (state, action): void => {
      state.loading = false;
    },
    [putAuditStatus.pending]: (state, action): void => {
      state.loading = true;
    },
    [putAuditStatus.reject]: (state, action): void => {
      state.loading = false;
    },
    [putAuditStatus.fulfilled]: (state, action): void => {
      state.loading = false;
    },
    [putMemoAudit.pending]: (state, action): void => {
      state.loading = true;
    },
    [putMemoAudit.reject]: (state, action): void => {
      state.loading = false;
    },
    [putMemoAudit.fulfilled]: (state, action): void => {
      state.loading = false;
    },
    [getAllCalendarCurrentMonth.pending]: (state, action): void => {
      state.loading = true;
    },
    [getAllCalendarCurrentMonth.reject]: (state, action): void => {
      state.loading = false;
    },
    [getAllCalendarCurrentMonth.fulfilled]: (state, action): void => {
      state.loading = false;
      state.calendarCurrentMonth = action.payload?.data;
    },
    [putUpdateSalaryHour.pending]: (state, action): void => {
      state.loading = true;
    },
    [putUpdateSalaryHour.reject]: (state, action): void => {
      state.loading = false;
    },
    [putUpdateSalaryHour.fulfilled]: (state, action): void => {
      state.loading = false;
    },
    [getUserSurveyMatching.pending]: (state, action): void => {
      state.loading = true;
    },
    [getUserSurveyMatching.reject]: (state, action): void => {
      state.loading = false;
    },
    [getUserSurveyMatching.fulfilled]: (state, action): void => {
      state.loading = false;

      const { data, ...totalData } = action?.payload?.data ?? { data: [] };

      const tmpUserSurvey: any = action?.payload?.data && [
        ...action?.payload?.data?.data,
        { totalData, isTotal: true, user_id: '合計' },
      ];

      const tmpUserSurveyV2 =
        tmpUserSurvey &&
        tmpUserSurvey?.map((survey: any, index: number): void => {
          return {
            ...survey,
            survey_id: index,
          };
        });

      state.userSurveyMatching = tmpUserSurveyV2;
      state.userSurveyMatchingChart = action.payload?.data?.data;
    },
    [getSalesTrend.pending]: (state, action): void => {
      state.loading = true;
    },
    [getSalesTrend.reject]: (state, action): void => {
      state.loading = false;
    },
    [getSalesTrend.fulfilled]: (state, action): void => {
      state.loading = false;
      state.salesTrend = action?.payload?.data;
      state.listMatchingForTrends = action?.payload?.data?.data;
    },
  },
});

const { reducer: adminReducer } = adminSlice;

export default adminReducer;
