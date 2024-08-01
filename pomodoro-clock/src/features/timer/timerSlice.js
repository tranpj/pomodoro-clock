import { createSlice } from '@reduxjs/toolkit';

//types of timers
const SESSION = 'session';
const BREAK = 'break';

//timer states
const START = 'start';
export const STOP = 'stop';

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
  remainingTimeString: msToStringTime(minutesToMS(timerDefaults[0].session)),
  currentTimer: SESSION,
  sessionLength: timerDefaults[0].session,
  breakLength: timerDefaults[0].break,
  status: STOP
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const startStopAsync = () => (dispatch, getState) => {
  dispatch(startStop());
  const curStatus = selectStatus(getState());
  if (curStatus === START) {
    dispatch(updateCountDown());
  }
};

const updateCountDown = () => (dispatch, getState) =>
  setTimeout(() => {
    const curRemainingTimeMS = selectRemainingTimeMS(getState());
    const curStatus = selectStatus(getState());
    if (curStatus === START && curRemainingTimeMS > 0) {
      dispatch(countDown());
      //recursively dispatch this thunk
      dispatch(updateCountDown());
    }
    else if (curRemainingTimeMS <= 0) {
      //toggle to stop
      dispatch(switchTimers());
      document.getElementById('beep').play();
      dispatch(updateCountDown());
    }
  }, 1000);

export const timerSlice = createSlice({
  name: 'timer',
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

      state.remainingTimeString = msToStringTime(state.remainingTimeMS);
    },
    decrement: (state, action) => {
      //timer not running allow updates of session and break lengths
      if (state.status === STOP && action.payload) {
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

      state.remainingTimeString = msToStringTime(state.remainingTimeMS);
    },
    countDown: (state) => {
      state.remainingTimeMS = state.remainingTimeMS - 1000;
      state.remainingTimeString = msToStringTime(state.remainingTimeMS);
    },
    reset: (state) => {
      const resetTimerDefault = timerDefaults[document.getElementById('resetSelect').options.selectedIndex];
      const beep = document.getElementById('beep');

      //reset to session timer and set state to idle
      state.currentTimer = SESSION;
      state.status = STOP;

      //reset timer lengths
      state.sessionLength = resetTimerDefault.session;
      state.breakLength = resetTimerDefault.break;
      state.remainingTimeMS = minutesToMS(resetTimerDefault.session);
      state.remainingTimeString = msToStringTime(minutesToMS(resetTimerDefault.session));

      //reset audio
      beep.pause();
      beep.currentTime = 0;
    },
    startStop: (state) => {
      switch (state.status) {
        case START:
          state.status = STOP;
          break;
        case STOP:
          state.status = START;
          break;
      }
    },
    switchTimers: (state) => {
      const beep = document.getElementById('beep');

      //reset audio
      beep.pause();
      beep.currentTime = 0;

      let remainingTimeMS;
      state.status = STOP;

      switch (state.currentTimer) {
        case SESSION:
          state.currentTimer = BREAK;
          remainingTimeMS = minutesToMS(state.breakLength);
          break;
        case BREAK:
          state.currentTimer = SESSION;
          remainingTimeMS = minutesToMS(state.sessionLength);
          break;
      }

      state.remainingTimeMS = remainingTimeMS;
      state.remainingTimeString = msToStringTime(remainingTimeMS);

      state.status = START;
    }
  }
});

export const { increment, decrement, countDown, reset, startStop, switchTimers } = timerSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
const selectRemainingTimeMS = (state) => state.timer.remainingTimeMS;
export const selectRemainingTime = (state) => state.timer.remainingTimeString;
export const selectCurrentTimer = (state) => state.timer.currentTimer;
export const selectSessionLength = (state) => state.timer.sessionLength;
export const selectBreakLength = (state) => state.timer.breakLength;
export const selectStatus = (state) => state.timer.status;

export default timerSlice.reducer;
