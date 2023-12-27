import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { castApi } from '../../api';
import { AxiosResponse } from 'axios';

export const getCastDetail: any = createAsyncThunk('cast/getCastDetail', async (): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.getCastDetail();
    return res.data;
  } catch (error) {}
});

export const editCast: any = createAsyncThunk('cast/editCast', async (data): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.editCast(data);
    return res;
  } catch (error) {}
});

export const getAllJob: any = createAsyncThunk('cast/getAllJob', async (): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.getAllJob();
    return res;
  } catch (error) {}
});

export const getJobById: any = createAsyncThunk('cast/getJobById', async (id: any): Promise<any> => {
  try {
    const res: any = await castApi.getJobById(id);
    return res;
  } catch (error) {}
});
export const getAllJobMatching: any = createAsyncThunk('cast/getAllJobMatching', async (param: any): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.getAllJobMatching(param);
    return res;
  } catch (error) {}
});

export const getShiftCastById: any = createAsyncThunk('cast/getShiftCastById', async (data: any): Promise<any> => {
  try {
    const res: any = await castApi.getShiftCastById(data);
    return res;
  } catch (error) {}
});

export const getAllShiftCast: any = createAsyncThunk('cast/getAllShiftCast', async (id: void): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.getAllShiftCast(id);
    return res;
  } catch (error) {}
});

export const getJobMatchingById: any = createAsyncThunk('cast/getJobMatchingById', async (id: any): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.getJobMatchingById(id);
    return res?.data;
  } catch (error) {}
});

export const updateStatusJobMatching: any = createAsyncThunk(
  'cast/updateJobMatchingById',
  async (id: any): Promise<any> => {
    try {
      const res: AxiosResponse<any, any> = await castApi.updateJobMatching(id);
      return res;
    } catch (error) {}
  },
);

export const updateStatusNotificationMatching: any = createAsyncThunk(
  'cast/updateNotificationMatchingById',
  async (id: any): Promise<any> => {
    try {
      const res: AxiosResponse<any, any> = await castApi.updateJobNotificationMatching(id);
      return res;
    } catch (error) {}
  },
);

export const sendEmailChangePassword: any = createAsyncThunk(
  'cast/sendEmailChangePassword',
  async (data: any): Promise<any> => {
    try {
      const res: AxiosResponse<any, any> = await castApi.sendEmailChangePassword(data);
      return res;
    } catch (error) {}
  },
);
export const getCastJobCurrentDate: any = createAsyncThunk('/cast/getJobCurrentDate', async (): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.getCastJobCurrentDate();
    return res;
  } catch (error) {}
});
export const postJobCurrentDate: any = createAsyncThunk('cast/postJobCurrentDate', async (data: any): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.postCurrentJobReport(data);
    return res;
  } catch (error) {}
});

export const deleteCastService: any = createAsyncThunk('cast/deleteService', async (id: any): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.deleteService(id);
    return res;
  } catch (e) {}
});

export const getCurrentShift: any = createAsyncThunk('cast/getCurrentShift', async (): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.getCurrentShift();
    return res;
  } catch (e) {}
});
export const getRequireMatching: any = createAsyncThunk('cast/getRequireMatching', async (): Promise<any> => {
  try {
    const res: AxiosResponse<any, any> = await castApi.getRequireMatching();
    return res;
  } catch (e) {}
});
export const postRequireMatching: any = createAsyncThunk(
  'cast/postRequireMatching',
  async (data: any): Promise<any> => {
    try {
      const res: AxiosResponse<any, any> = await castApi.postRequireMatching(data);
      return res;
    } catch (e) {}
  },
);

const castSlice: any = createSlice({
  name: 'cast',
  initialState: {
    loading: false,
    statusDetail: false,
    castDetails: {},
    date_time: {},
    castJobs: [],
    castJobActive: [],
    castJobById: [],
    hourIdActive: [],
    hourIdActiveMatching: [],
    expired_date: {},
    castJobMatching: [],
    castShiftById: [],
    castShiftActiveId: [],
    castShiftActiveIdForUpdate: [],
    listShiftCast: [],
    listDateShiftCast: [],
    castJobMatchingById: {},
    castUpdateStatusJob: {},
    castJobCurrentDate: [],
    castRequireMatching: [],
    price: 0,
    listJobLoading: false,
    isDashboard: false,
    isShowMenuCastDashboard: false,
  },
  reducers: {
    resetDateShiftCast(state: any): void {
      state.listDateShiftCast = [];
      state.listShiftCast = [];
    },
    resetShitCastById(state: any): void {
      state.castShiftById = [];
    },
    setStateIsDashBoard: (state, action) => {
      state.isDashboard = action.payload;
    },
    setStateMenuCastDashboard: (state, action) => {
      state.isShowMenuCastDashboard = action.payload;
    },
    resetHourIdActiveMatching: (state: any) => {
      state.hourIdActiveMatching = [];
    },
  },
  extraReducers: {
    [getCastDetail.pending]: (state, action): void => {
      state.loading = true;
    },
    [getCastDetail.reject]: (state, action): void => {
      state.loading = false;
    },
    [getCastDetail.fulfilled]: (state, action): void => {
      state.loading = false;
      state.castDetails = action.payload;
      const datetimeConvert = action?.payload?.date_of_birth.split('-');
      state.date_time = {
        year: datetimeConvert && datetimeConvert[0],
        month: datetimeConvert && datetimeConvert[1],
        day: datetimeConvert && datetimeConvert[2],
      };
      if (action?.payload?.customer_detail !== undefined) {
        const expired_date = action?.payload?.customer_detail?.expired_date.split('-');
        state.expired_date = expired_date;
      }
    },
    [getAllJob.pending]: (state, action): void => {
      state.loading = true;
    },
    [getAllJob.reject]: (state, action): void => {
      state.loading = false;
    },
    [getAllJob.fulfilled]: (state, action): void => {
      state.loading = false;
      state.castJobs = action.payload;
      const activeJob = action?.payload?.data?.map((item: any) => {
        return new Date(item.date);
      });
      state.castJobActive = activeJob;
    },
    [getJobById.pending]: (state, action): void => {
      state.loading = true;
    },
    [getJobById.reject]: (state, action): void => {
      state.loading = false;
    },
    [getJobById.fulfilled]: (state, action): void => {
      state.loading = false;
      let listActiveId: any = [];
      let listActiveMatching: any = [];
      for (const arrayElement of action.payload?.data) {
        if (arrayElement?.status_matching === 0) {
          for (let i = arrayElement.start_time; i <= arrayElement.end_time; i++) {
            listActiveId.push(i);
          }
        }

        if (arrayElement?.status_matching === 1) {
          for (let i = arrayElement.start_time; i <= arrayElement.end_time; i++) {
            listActiveMatching.push(i);
          }
        }
      }
      state.castJobById = action.payload;
      state.hourIdActive = listActiveId;
      state.hourIdActiveMatching = listActiveMatching;
    },
    [getAllJobMatching.pending]: (state, action): void => {
      state.listJobLoading = true;
    },
    [getAllJobMatching.reject]: (state, action): void => {
      state.listJobLoading = false;
    },
    [getAllJobMatching.fulfilled]: (state, action): void => {
      state.listJobLoading = false;
      state.castJobMatching = action.payload?.data;
    },
    [getShiftCastById.pending]: (state, action): void => {
      state.loading = true;
    },
    [getShiftCastById.reject]: (state, action): void => {
      state.loading = false;
    },
    [getShiftCastById.fulfilled]: (state, action): void => {
      state.loading = false;
      let tmpCastShiftActiveId: any = [];
      let tmpCastShiftActiveIdForUpdate: any = [];
      for (const arrayElement of action.payload?.data) {
        if (arrayElement?.status_matching === 1) {
          continue;
        }
        for (let i = arrayElement.start_time; i <= arrayElement.end_time; i++) {
          tmpCastShiftActiveId.push(i);
        }
      }

      action?.payload?.data.forEach((item: any): void => {
        for (let i = item.start_time; i <= item.end_time; i++) {
          tmpCastShiftActiveIdForUpdate.push(i);
        }
      });

      state.castShiftById = action.payload;
      state.castShiftActiveId = tmpCastShiftActiveId;
      state.castShiftActiveIdForUpdate = tmpCastShiftActiveIdForUpdate;
    },
    [getAllShiftCast.pending]: (state, action): void => {
      state.loading = true;
    },
    [getAllShiftCast.reject]: (state, action): void => {
      state.loading = false;
    },
    [getAllShiftCast.fulfilled]: (state, action): void => {
      state.loading = false;
      state.listShiftCast = action.payload?.data;

      // FILTER CORRECT DATA
      const dateNow: Date = new Date();
      const tmpDateArray = action.payload?.data?.map((item: any) => new Date(item?.date));
      const tmpDateArrayV2 = tmpDateArray?.filter(
        (item: any): boolean => item > dateNow.setHours(0, 0, 0, 0) && item.getMonth() < dateNow.getMonth() + 2,
      );
      state.listDateShiftCast = tmpDateArrayV2;
    },
    [getJobMatchingById.pending]: (state, action): void => {
      state.loading = true;
    },
    [getJobMatchingById.reject]: (state, action): void => {
      state.loading = false;
    },
    [getJobMatchingById.fulfilled]: (state, action): void => {
      state.loading = false;
      state.castJobMatchingById = action.payload;
      let price: number = 0;
      price = action?.payload?.cancel_cost;
      state.price = price;
    },
    [updateStatusJobMatching.fulfilled]: (state, action): void => {
      state.loading = false;
      state.castUpdateStatusJob = action.payload;
    },
    [sendEmailChangePassword.pending]: (state, action): void => {
      state.loading = true;
    },
    [sendEmailChangePassword.reject]: (state, action): void => {
      state.loading = false;
    },
    [sendEmailChangePassword.fulfilled]: (state, action): void => {
      state.loading = false;
    },
    [getCastJobCurrentDate.pending]: (state, action): void => {
      state.loading = true;
    },
    [getCastJobCurrentDate.reject]: (state, action): void => {
      state.loading = false;
    },
    [getCastJobCurrentDate.fulfilled]: (state, action): void => {
      state.loading = false;
      state.castJobCurrentDate = action.payload?.data;
    },
    [getRequireMatching.pending]: (state, action): void => {
      state.loading = true;
    },
    [getRequireMatching.reject]: (state, action): void => {
      state.loading = false;
    },
    [getRequireMatching.fulfilled]: (state, action): void => {
      state.loading = false;
      state.castRequireMatching = action.payload?.data;
    },

    [getCurrentShift.pending]: (state, action): void => {
      state.loading = true;
    },
    [getCurrentShift.reject]: (state, action): void => {
      state.loading = false;
    },
    [getCurrentShift.fulfilled]: (state, action): void => {
      state.loading = false;
      const tmpDateArray = action.payload?.data?.map((item: any) => new Date(item?.date));
      state.listDateShiftCast = tmpDateArray;
      state.listShiftCast = action.payload?.data?.map((item: any, index: number) => {
        return {
          ...item,
          id: index + 1,
        };
      });
    },
  },
});

export const {
  resetDateShiftCast,
  resetShitCastById,
  resetHourIdActiveMatching,
  setStateIsDashBoard,
  setStateMenuCastDashboard,
} = castSlice.actions;

const { reducer: castReducer } = castSlice;

export default castReducer;
