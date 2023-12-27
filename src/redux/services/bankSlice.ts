import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { bankApi } from '../../api';
import { AxiosResponse } from 'axios';

export const searchBank: any = createAsyncThunk('bank/searchBank', async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await bankApi.searchBank(data);
    return response;
  } catch (err) {}
});

export const getBankBranches: any = createAsyncThunk('bank/getBankBranches', async (data: any): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await bankApi.getBankBranches(data);
    return response;
  } catch (err) {}
});

const bankSlice: any = createSlice({
  name: 'bank',
  initialState: {
    loading: false,
    banks: [],
    branches: [],
  },
  reducers: {},
  extraReducers: {
    [searchBank.pending]: (state, action): void => {
      state.loading = true;
    },
    [searchBank.reject]: (state, action): void => {
      state.loading = false;
    },
    [searchBank.fulfilled]: (state, action): void => {
      state.loading = false;
      const tmpData = action?.payload?.data?.data?.map((item: any) => {
        return {
          ...item,
          label: item?.name,
          value: item?.name,
        };
      });
      state.banks = tmpData;
    },
    [getBankBranches.pending]: (state, action): void => {
      state.loading = true;
    },
    [getBankBranches.reject]: (state, action): void => {
      state.loading = false;
    },
    [getBankBranches.fulfilled]: (state, action): void => {
      state.loading = false;
      const tmpBranches = action?.payload?.data?.data?.map((item: any) => {
        return {
          ...item,
          label: item?.name,
          value: item?.name,
        };
      });
      state.branches = tmpBranches;
    },
  },
});

const { reducer: bankReducer } = bankSlice;

export default bankReducer;
