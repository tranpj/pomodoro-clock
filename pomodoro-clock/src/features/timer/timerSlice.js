import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCount } from './timerAPI';

//types of timers
const SESSION = 'session';
const BREAK = 'break';

//timer states
const START = 'start';
const STOP = 'stop';

const timerRanges = [
  {
    id: SESSION,
    min: 1,
    max: 60
  },
  {
    id: BREAK,
    min: 1,
    max: 60
  }
];

//timer defaults in minutes
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


//convert minutes to ms
const minutesToMS = (mins) => mins * 60000;

//convert ms to string time
const msToStringTime = (ms) => {
  let mins = Math.floor(ms / 60000);
  let secs = Math.floor((ms - minutesToMS(mins)) / 1000);

  //add leading 0 to mins and secs
  if (mins < 10) {
    mins = '0' + mins;
  }
  if (secs < 10) {
    secs = '0' + secs;
  }

  return `${mins}:${secs}`;
}

const initialState = {
  remainingTimeMS: minutesToMS(timerDefaults[0].session),
  currentTimer: SESSION,
  sessionLength: timerDefaults[0].session,
  breakLength: timerDefaults[0].break,
  status: STOP,
  timeout: ''
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
      if (state.status === STOP) {
        const range = timerRanges.find((e) => e.id = action.payload);
        switch (action.payload) {
          case SESSION:
            if (state.sessionLength < range.max) {
              state.sessionLength += 1;
            }
            break;
          case BREAK:
            if (state.breakLength < range.max) {
              state.breakLength += 1;
            }
            break;
        }

        switch (state.currentTimer) {
          case SESSION:
            state.remainingTimeMS = minutesToMS(state.sessionLength);
            break;
          case BREAK:
            state.remainingTimeMS = minutesToMS(state.breakLength);
            break;
        }
      }
    },
    decrement: (state, action) => {
      //timer not running allow updates of session and break lengths
      if (state.status === STOP) {
        const range = timerRanges.find((e) => e.id = action.payload);
        switch (action.payload) {
          case SESSION:
            if (state.sessionLength > range.min) {
              state.sessionLength -= 1;
              state.remainingTimeMS = minutesToMS(state.sessionLength);
            }
            break;
          case BREAK:
            if (state.breakLength > range.min) {
              state.breakLength -= 1;
              state.remainingTimeMS = minutesToMS(state.breakLength);
            }
            break;
        }

        switch (state.currentTimer) {
          case SESSION:
            state.remainingTimeMS = minutesToMS(state.sessionLength);
            break;
          case BREAK:
            state.remainingTimeMS = minutesToMS(state.breakLength);
            break;
        }
      }
      //timer running
      else {
        state.remainingTimeMS--;
      }
    },
    reset: (state) => {
      const resetSelect = document.getElementById('resetSelect');
      const resetTimerDefault = timerDefaults[resetSelect.options.selectedIndex];

      //reset to session timer and set state to idle
      state.currentTimer = SESSION;
      state.status = STOP;

      //reset timer lengths
      state.sessionLength = resetTimerDefault.session;
      state.breakLength = resetTimerDefault.break;
      state.remainingTimeMS = minutesToMS(resetTimerDefault.session);
    },
    startStop: (state) => {
      if (state.status === STOP) {
        state.status = START;
        const start = new Date(Date.now() + state.remainingTimeMS);
        console.log(msToStringTime(state.remainingTimeMS));
        state.timeout = setInterval(function () {
          let deltaMS = start - Date.now();
          console.log(msToStringTime(deltaMS));
        }, 1000);
      }
      else {
        state.status = STOP;
        clearInterval(state.timeout);
        console.log('stop');
      }
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = STOP;
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = STOP;
        //state.value += action.payload;
      });
  },
});

export const { increment, decrement, reset, startStop } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRemainingTime = (state) => msToStringTime(state.counter.remainingTimeMS);
export const selectCurrentTimer = (state) => state.counter.currentTimer;
export const selectSessionLength = (state) => state.counter.sessionLength;
export const selectBreakLength = (state) => state.counter.breakLength;

export default counterSlice.reducer;
