import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/timer/timerSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
