import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCount } from './timerAPI';

const SESSION = 'session';
const BREAK = 'break';

const timerRanges = [
  {
    id: 'session',
    min: 1,
    max: 60
  },
  {
    id: 'break',
    min: 1,
    max: 60
  }
];

const timerDefaults = [
  {
    id: 'timer_25_5',
    session: 25,
    break: 5
  },
  {
    id: 'timer_52_17',
    session: 52,
    break: 17
  },
]

const initialState = {
  value: 0,
  sessionLength: timerDefaults[0].session,
  breakLength: timerDefaults[0].break,
  currentTimer: 'session',
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const range = timerRanges.find((e) => e.id = action.payload);
      switch(action.payload){
        case SESSION:
          if(state.sessionLength < range.max)
          {
            state.sessionLength += 1;
          }
          break;
        case BREAK:
          if(state.breakLength < range.max)
          {
            state.breakLength += 1;
          }
          break;
      }
    },
    decrement: (state, action) => {
      const range = timerRanges.find((e) => e.id = action.payload);
      switch(action.payload){
        case SESSION:
          if(state.sessionLength > range.min)
          {
            state.sessionLength -= 1;
          }
          break;
        case BREAK:
          if(state.breakLength > range.min)
          {
            state.breakLength -= 1;
          }
          break;
        }
    },
    reset: (state, action) => {
      state.value += action.payload;
    },
    start: (state) => {
      ;
    },
    pause: (state) => {
      ;
    }
  }
});

export const { increment, decrement, reset, start, stop } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state) => state.counter.value;
export const selectSessionLength = (state) => state.counter.sessionLength;
export const selectBreakLength = (state) => state.counter.breakLength;

export default counterSlice.reducer;
