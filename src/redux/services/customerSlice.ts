import { AxiosResponse } from 'axios';
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';

import { customerApi } from '../../api/customerApi/customerApi';
import { serviceItems } from '../../utils/customerServiceItems';
import { hourArrayItems } from '../../utils/hourArrayItems';
import { setLocalStorage } from '../../helper/common';
import { dayItems } from '../../utils/dayItems';

export const updateCustomer: any = createAsyncThunk('customer/updateCustomer', async (data: any): Promise<any> => {
  try {
    const res = await customerApi.editCustomer(data);
    return res;
  } catch (error) {}
});

export const getCastWorked: any = createAsyncThunk('customer/getCastWorked', async (data: any): Promise<any> => {
  try {
    const res = await customerApi.getCastWorked(data);
    return res.data;
  } catch (error) {}
});
export const deleteBooking: any = createAsyncThunk(
  'customer/deleteBooking',
  async ({ id, reason }: any): Promise<any> => {
    try {
      const res = await customerApi.deleteBooking({ id, reason });
      return res.data;
    } catch (error) {}
  },
);

export const getBookingById: any = createAsyncThunk('customer/getBookingById', async (id: any): Promise<any> => {
  try {
    const res = await customerApi.getBookingById(id);
    return res;
  } catch (e) {}
});

export const getBookingByIdForHistory: any = createAsyncThunk(
  'customer/getBookingByIdForHistory',
  async (id: any): Promise<any> => {
    try {
      const res = await customerApi.getBookingById(id);
      return res;
    } catch (e) {}
  },
);

export const getBookings: any = createAsyncThunk('customer/getBookings', async (): Promise<any> => {
  try {
    const res = await customerApi.getBookings();
    return res;
  } catch (e) {}
});
export const getCurrentMatching: any = createAsyncThunk('customer/getCurrentMatching', async (): Promise<any> => {
  try {
    const res = await customerApi.getCurrentMatching();
    return res?.data;
  } catch (e) {}
});

export const getHistoryMatching: any = createAsyncThunk('customer/getHistoryMatching', async (): Promise<any> => {
  try {
    const res = await customerApi.getHistoryMatching();
    return res?.data;
  } catch (e) {}
});

export const bookingNotAssigned: any = createAsyncThunk(
  'customer/bookingNotAssigned',
  async (data: any): Promise<any> => {
    try {
      const res: AxiosResponse = await customerApi.bookingNotAssigned(data);
      return res;
    } catch (e) {}
  },
);
export const getMatchingCompleteCustomer: any = createAsyncThunk(
  'customer/getMatchingComplete',
  async (): Promise<any> => {
    try {
      const res: AxiosResponse = await customerApi.getMatchingCompleteCustomerApi();
      return res;
    } catch (e) {}
  },
);
export const getMatchingCompleteCustomerById: any = createAsyncThunk(
  'customer/getMatchingCompleteById',
  async (matchingId: any): Promise<any> => {
    try {
      const res: AxiosResponse = await customerApi.getMatchingCompleteCustomerByIdApi(+matchingId);
      return res;
    } catch (e) {}
  },
);

export const postQuestionSurveyAnswer: any = createAsyncThunk(
  'customer/postQuestionSurveyAnswer',
  async (data: any): Promise<any> => {
    try {
      const res: AxiosResponse = await customerApi.postQuestionSurveyAnswerApi({
        matching_id: data?.id,
        q1: data?.quality,
        q2: data?.attitude_behavior,
        q3: data?.reuse,
        q4: data?.usually_use,
        q5: data?.opinion,
      });
      return res;
    } catch (e) {}
  },
);
export const updateStatusMatching: any = createAsyncThunk(
  'customer/updateStatusMatching',
  async (data: any): Promise<any> => {
    try {
      const res: AxiosResponse = await customerApi.updateStatusMatching(data);
      return res;
    } catch (e) {}
  },
);

export const extendMatching: any = createAsyncThunk('customer/extendMatching', async (id: any): Promise<any> => {
  try {
    const res: AxiosResponse = await customerApi.extendMatching(id);
    return res;
  } catch (e) {}
});
export const putFinishMatching: any = createAsyncThunk('customer/putFinishMatching', async (id: any): Promise<any> => {
  try {
    const res: AxiosResponse = await customerApi.putFinishMatching(id);
    return res;
  } catch (e) {}
});

export const postFinishJobMatching: any = createAsyncThunk(
  'customer/postFinishMatchingJob',
  async (data: any): Promise<any> => {
    try {
      const res: AxiosResponse = await customerApi.postSurveyFinish(data);
      return res;
    } catch (e) {}
  },
);

export const checkShiftRegister: any = createAsyncThunk(
  'customer/checkShiftRegister',
  async (data: any): Promise<any> => {
    try {
      const res: AxiosResponse = await customerApi.checkShiftRegister(data);
      return res;
    } catch (e) {}
  },
);

export const getStatusEkyc: any = createAsyncThunk('customer/getStatusEkyc', async (): Promise<any> => {
  try {
    const res: AxiosResponse = await customerApi.getStatusEkyc();
    return res;
  } catch (e) {}
});

const customerSlice: any = createSlice({
  name: 'customer',
  initialState: {
    loading: false,
    loadingEkyc: false,
    listCastWorked: [],
    listBooking: [],
    bookingById: {},
    dateById: '',
    currentTime: '',
    listCurrentMatching: [],
    listHistoryMatching: [],
    resultBookingNotAssigned: {},
    matchingComplete: [],
    isDashboard: false,
    dataCastMatchingById: {},
    showDrawer: false,
    shiftRegister: [],
    statusEkycRedux: {},
  },
  reducers: {
    setStateIsDashBoard: (state, action) => {
      state.isDashboard = action.payload;
    },
    setShowDrawer: (state, action) => {
      state.showDrawer = action.payload;
    },
    setDataMatching: (state, action) => {
      state.dataCastMatchingById = action.payload;
    },
  },
  extraReducers: {
    [getCastWorked.pending]: (state, action): void => {
      state.loading = true;
    },
    [getCastWorked.reject]: (state, action): void => {
      state.loading = false;
    },
    [getCastWorked.fulfilled]: (state, action): void => {
      state.loading = false;
      const tmpPayload = action.payload?.map((castItem: any) => {
        const dateConvert: Date = new Date(castItem?.date);
        return {
          ...castItem,
          title: `${dateConvert.getFullYear()}年${dateConvert.getMonth() + 1}月${dateConvert.getDate()}日（${
            dayItems[dateConvert.getDay()]
          }） ${castItem.name}`,
        };
      });
      tmpPayload?.unshift({ user_id: 'none', title: '指名しない', name: '指名しない' });
      state.listCastWorked = tmpPayload;
    },
    [getBookings.pending]: (state, action): void => {
      state.loading = true;
    },
    [getBookings.reject]: (state, action): void => {
      state.loading = false;
    },
    [getBookings.fulfilled]: (state, action): void => {
      state.loading = false;
      state.currentTime = action?.payload?.data[0]?.current_time;
      const tmpArray = action?.payload?.data?.map((item: any) => {
        let statusAssigned: number = 1;
        let assignText: string = '';
        // NOT MATCHING AND NOT ASSIGN
        if (item?.status_matching === 0 && item?.is_assign === 0) {
          statusAssigned = 1;
          assignText = 'アサイン中';
        }
        // NOT MATCHING AND ASSIGN
        if (item?.status_matching === 0 && item?.is_assign === 1) {
          statusAssigned = 2;
          assignText = `${item?.cast_name_assign ?? ''}/アサイン中`;
        }
        // MATCHING AND NOT ASSIGN
        if (item?.status_matching === 1 && item?.is_assign === 0) {
          statusAssigned = 3;
          assignText = `${item?.cast_name_not_assign ?? ''}/指名なし`;
        }
        // MATCHING
        if (item?.status_matching === 1 && item?.is_assign === 1) {
          statusAssigned = 4;
          assignText = `${item?.cast_name_assign ?? ''}/指名`;
        }
        const dateConvert: Date = new Date(item?.date);
        const dateString: string = `${dateConvert?.getFullYear()}年${
          dateConvert?.getMonth() + 1
        }月${dateConvert?.getDate()}日（${dayItems[dateConvert?.getDay()]}） ${
          serviceItems[item?.service_id - 1]?.label
        }`;
        const dateStringWithTime: string = `${dateConvert?.getFullYear()}年${
          dateConvert?.getMonth() + 1
        }月${dateConvert?.getDate()}日（${dayItems[dateConvert?.getDay()]}）${
          hourArrayItems[item?.start_time - 1]?.title
        } ~ ${hourArrayItems[item?.end_time]?.title}`;
        const dateStringWithoutTime: string = `${dateConvert?.getFullYear()}年${
          dateConvert?.getMonth() + 1
        }月${dateConvert?.getDate()}日（${dayItems[dateConvert?.getDay()]}）`;
        return {
          ...item,
          dateString,
          dateStringWithTime,
          dateStringWithoutTime,
          status_assigned: statusAssigned,
          assign_text: assignText,
        };
      });

      state.listBooking = tmpArray;
    },
    [getBookingById.pending]: (state, action): void => {
      state.loading = true;
    },
    [getBookingById.reject]: (state, action): void => {
      state.loading = false;
    },
    [getBookingById.fulfilled]: (state, action): void => {
      state.loading = false;
      state.bookingById = action?.payload?.data;
      if (action?.payload?.data?.assign_name === null) {
        const castData: any = {
          user_id: 'none',
          title: '指名しない',
          name: '指名しない',
        };
        setLocalStorage('cast', castData);
      } else {
        const titleConvert: string = action?.payload?.data?.assign_name ?? '';
        const castData: any = {
          user_id: action?.payload?.data?.assign_user_id,
          matching_id: action?.payload?.data?.old_matching_id,
          title: titleConvert,
          name: action?.payload?.data?.assign_name,
        };
        setLocalStorage('cast', castData);
      }

      if (action?.payload?.data?.date !== undefined) {
        // SCHEDULE DATA
        const scheduleData: any = {
          date: action?.payload?.data?.date,
          end_date: action?.payload?.data?.end_time,
          start_date: action?.payload?.data?.start_time,
          repeat_setting: action?.payload?.data?.repeat_setting ?? null,
          request_description: action?.payload?.data?.request_description ?? null,
          hour: action?.payload?.data?.end_time - action?.payload?.data?.start_time,
          id: action?.payload?.data?.cast_service_id,
          customer_service_id: action?.payload?.data?.customer_service_id,
          price: action?.payload?.data?.price,
          coupon_code: action?.payload?.data?.coupon_code,
          off_percent: action?.payload?.data?.off_percent,
          cancel_cost: action?.payload?.data?.cancel_cost,
        };

        // MATCHING DATA
        const matchingData: any = {
          matching_id: action?.payload?.data?.id,
        };

        // UPDATE DAY
        const updateDay: any = {
          date: action?.payload?.data?.date,
        };

        // SET DATA INTO LOCAL
        setLocalStorage('odt', matchingData);
        setLocalStorage('cse', scheduleData);
        setLocalStorage('udd', updateDay); // Update day
        setLocalStorage('srv', action?.payload?.data?.service_id);
        setLocalStorage('old_data', action?.payload?.data);
      }
    },
    [getBookingByIdForHistory.pending]: (state, action): void => {
      state.loading = true;
    },
    [getBookingByIdForHistory.reject]: (state, action): void => {
      state.loading = false;
    },
    [getBookingByIdForHistory.fulfilled]: (state, action): void => {
      state.loading = false;
      state.bookingById = action?.payload?.data;
      const titleConvert: string = action?.payload?.data?.assign_name ?? '';
      const castData: any = {
        user_id: action?.payload?.data?.cast_id,
        matching_id: action?.payload?.data?.old_matching_id,
        title: titleConvert,
        name: action?.payload?.data?.cast_name,
      };
      setLocalStorage('cast', castData);

      if (action?.payload?.data?.date !== undefined) {
        // SCHEDULE DATA
        const scheduleData: any = {
          // date: action?.payload?.data?.date,
          date: null,
          end_date: action?.payload?.data?.end_time,
          start_date: action?.payload?.data?.start_time,
          repeat_setting: action?.payload?.data?.repeat_setting ?? null,
          request_description: action?.payload?.data?.request_description ?? null,
          hour: action?.payload?.data?.end_time - action?.payload?.data?.start_time,
          id: action?.payload?.data?.cast_service_id,
          customer_service_id: action?.payload?.data?.customer_service_id,
          price: action?.payload?.data?.price,
          coupon_code: action?.payload?.data?.coupon_code,
          off_percent: action?.payload?.data?.off_percent,
        };

        // MATCHING DATA
        const matchingData: any = {
          matching_id: action?.payload?.data?.id,
        };

        // SET DATA INTO LOCAL
        setLocalStorage('odt', matchingData);
        setLocalStorage('cse', scheduleData);
        setLocalStorage('srv', action?.payload?.data?.service_id);
      }
    },
    [getCurrentMatching.pending]: (state, action): void => {
      state.loading = true;
    },
    [getCurrentMatching.reject]: (state, action): void => {
      state.loading = false;
    },
    [getCurrentMatching.fulfilled]: (state, action): void => {
      state.loading = false;
      state.listCurrentMatching = action.payload;
    },
    [getHistoryMatching.pending]: (state, action): void => {
      state.loading = true;
    },
    [getHistoryMatching.reject]: (state, action): void => {
      state.loading = false;
    },
    [getHistoryMatching.fulfilled]: (state, action): void => {
      state.loading = false;
      state.listHistoryMatching = action?.payload;
    },
    [bookingNotAssigned.pending]: (state, action): void => {
      state.loading = true;
    },
    [bookingNotAssigned.reject]: (state, action): void => {
      state.loading = false;
    },
    [bookingNotAssigned.fulfilled]: (state, action): void => {
      state.loading = false;
      state.resultBookingNotAssigned = action?.payload;
    },
    [getMatchingCompleteCustomer.pending]: (state, action): void => {
      state.loading = true;
    },
    [getMatchingCompleteCustomer.reject]: (state, action): void => {
      state.loading = false;
    },
    [getMatchingCompleteCustomer.fulfilled]: (state, action): void => {
      state.loading = false;
      state.matchingComplete = action?.payload?.data;
    },
    [updateStatusMatching.pending]: (state, action): void => {
      state.loading = true;
    },
    [updateStatusMatching.reject]: (state, action): void => {
      state.loading = false;
    },
    [updateStatusMatching.fulfilled]: (state, action): void => {
      state.loading = false;
      const tmpData: any = current(state.listBooking)?.map((booking: any) => {
        if (booking?.id === action?.payload?.data?.id) {
          return {
            ...booking,
            status: action?.payload?.data?.status,
          };
        } else {
          return {
            ...booking,
          };
        }
      });
      state.listBooking = tmpData;
      state.currentTime = action?.payload?.data?.current_time;
    },
    [getMatchingCompleteCustomerById.pending]: (state, action): void => {
      state.loading = true;
    },
    [getMatchingCompleteCustomerById.reject]: (state, action): void => {
      state.loading = false;
    },
    [getMatchingCompleteCustomerById.fulfilled]: (state, action): void => {
      state.loading = false;
      state.dataCastMatchingById = action?.payload?.data;
    },
    [checkShiftRegister.pending]: (state, action): void => {
      state.loading = true;
    },
    [checkShiftRegister.reject]: (state, action): void => {
      state.loading = false;
    },
    [checkShiftRegister.fulfilled]: (state, action): void => {
      state.loading = false;
      state.shiftRegister = action.payload;
    },
    [getStatusEkyc.pending]: (state, action): void => {
      state.loadingEkyc = true;
    },
    [getStatusEkyc.reject]: (state, action): void => {
      state.loadingEkyc = false;
    },
    [getStatusEkyc.fulfilled]: (state, action): void => {
      state.loadingEkyc = false;
      state.statusEkycRedux = action.payload?.data;

      if (action?.payload?.data !== undefined) {
        setLocalStorage('ekstt', action?.payload?.data);
      }
    },
  },
});
export const { setStateIsDashBoard, setShowDrawer, setDataMatching } = customerSlice.actions;
const { reducer: customerReducer } = customerSlice;

export default customerReducer;
