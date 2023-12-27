import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../api';
import { LoginType } from '../../types/castTypes/authType';

export const sendEmailReg: any = createAsyncThunk('auth/sendEmailReg', async (data: any): Promise<any> => {
  try {
    const res = await authApi.castRegisterEmail(data);
    return res;
  } catch (error: any) {
    if (error?.response?.data?.data?.message?.email[0] === 'The email has already been taken.') {
      return {
        status: 'exist',
      };
    }
  }
});

export const login: any = createAsyncThunk('auth/login', async (data: LoginType): Promise<any> => {
  try {
    const res: any = await authApi.login(data);
    if (res.status === 'success') {
      localStorage.setItem('access_token', JSON.stringify(res?.data?.access_token.trim()));
      return res;
    }
  } catch (error: any) {
    if (error?.response?.status === 422) {
      return {
        status: false,
      };
    }
  }
});

export const deleteUser: any = createAsyncThunk('auth/deleteUser', async (): Promise<any> => {
  try {
    let res: any = await authApi.deleteAccount();
    return res;
  } catch (error: any) {}
});

export const logout: any = createAsyncThunk('auth/logout', async (): Promise<any> => {
  try {
    const res: any = await authApi.logout();
    if (res.message === 'Successfully logged out') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      return true;
    }
  } catch (error) {}
});
export const postEmail: any = createAsyncThunk('auth/postEmail', async (data: any): Promise<any> => {
  try {
    const res = await authApi.castPostEmail(data);
    return res;
  } catch (error) {}
});

const authSlice: any = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    tokenRegister: {},
    isLoadingDeleteUser: false,
    email: '',
  },
  reducers: {
    setTokenRegister(state: any, action: any): void {
      state.tokenRegister = action.payload;
    },
  },
  extraReducers: {
    [deleteUser.pending]: (state, action): void => {
      state.isLoadingDeleteUser = true;
    },
    [deleteUser.reject]: (state, action): void => {
      state.isLoadingDeleteUser = false;
    },
    [deleteUser.fulfilled]: (state, action): void => {
      state.isLoadingDeleteUser = false;
    },
    [postEmail.fulfilled]: (state, action): void => {
      state.email = action.payload?.data?.email;
    },
  },
});

export const { setTokenRegister } = authSlice.actions;
const { reducer: authReducer } = authSlice;

export default authReducer;
