import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrement,
  increment,
  reset,
  start,
  stop,
  selectCount,
  selectSessionLength,
  selectBreakLength,
} from './timerSlice';
import styles from './Timer.module.css';
//import bootstrap icons
import 'bootstrap-icons/font/bootstrap-icons.css';

//https://commons.wikimedia.org/wiki/File:Rotating-bicycle-bell.wav
//AntumDeluge, CC0, via Wikimedia Commons
const beepSRC = 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Rotating-bicycle-bell.wav';

const timerSettingsArray = [
  {
    id: 'session',
    headerText: 'Session Length',
    unitType: 'length',
    unit: 'minute(s)',
    selector: selectSessionLength
  },
  {
    id: 'break',
    headerText: 'Break Length',
    unitType: 'length',
    unit: 'minute(s)',
    selector: selectBreakLength
  }
];

function TimerSettings(props) {
  const dispatch = useDispatch();
  const settings = timerSettingsArray.find(e => e.id === props.id);
  const count = useSelector(settings.selector);

  return (
    <div className={styles.timerSettings}>
      <h1 id={props.id + '-label'} className={styles.header}>{settings.headerText}</h1>
      <div className={styles.row}>
        <button
          id={props.id + '-decrement'}
          className={styles.button}
          aria-label={'Decrement value for' + props.id}
          onClick={() => dispatch(decrement(props.id))}>-</button>
        <span
          id={props.id + '-' + settings.unitType}
          className={styles.value}>{count}</span>
        <button
          id={props.id + '-increment'}
          className={styles.button}
          aria-label={'Increment value for' + props.id}
          onClick={() => dispatch(increment(props.id))}>+</button>
      </div>
      <label id={props.id + '-' + settings.unit}>{settings.unit}</label>
    </div>
  );
}

function Timer() {
  const dispatch = useDispatch();
  const remainingTime = useSelector(selectCount);
  const currentTimer = useSelector(selectCount);

  return (
    <div>
      <div>
        <h1 id='timer-label'>{currentTimer}</h1>
        <label id='time-left'>{remainingTime}</label>
      </div>
      <div className={styles.row}>
        <button
          id='start_stop'
          className={styles.button}
          aria-label='Start or stop current session or break timer'
        ><span><i className="bi bi-play-fill"></i><i className="bi bi-pause-fill"></i></span></button>
      </div>
      <div className={styles.row}>
        <select id='resetSelect' className={styles.select}>
          <option value="25/5 Timer" id="timer_25_5" className={styles.option}>25 + 5</option>
          <option value="52/17 Timer" id="timer_52_17" className={styles.option}>52 / 17</option>
        </select>
        <button
          id='reset'
          className={styles.button}
          aria-label='Reset current session orr break timer'
        ><i className="bi bi-arrow-clockwise"></i></button>
      </div>
    </div>
  );
}

export function ProductivityTimer() {
  return (
    <div>
      <div hidden>
        <audio id='beep' src={beepSRC}></audio>
      </div>
      <div className={styles.row}>
        {timerSettingsArray.map(timerSetting => <TimerSettings id={timerSetting.id} key={timerSetting.id}/>)}
      </div>
      <div className={styles.row}>
        <Timer />
      </div>
    </div>
  );
}
