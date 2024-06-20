import React from 'react';
import logo from './logo.svg';
import { PomodoroClock } from './features/timer/Timer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pomodoro Clock</h1>
        <PomodoroClock />
      </header>
    </div>
  );
}

export default App;
