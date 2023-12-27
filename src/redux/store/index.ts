import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../services/authSlice';
import castReducer from '../services/castSlice';
import customerReducer from '../services/customerSlice';
import bankReducer from '../services/bankSlice';
import adminReducer from '../services/adminSlice';

const store: any = configureStore({
  reducer: {
    authReducer: authReducer,
    castReducer: castReducer,
    customerReducer: customerReducer,
    bankReducer: bankReducer,
    adminReducer: adminReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
