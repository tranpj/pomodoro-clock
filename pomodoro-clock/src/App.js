import React from 'react';
import logo from './logo.svg';
import { ProductivityTimer } from './features/timer/Timer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Productivity Timer</h1>
        <ProductivityTimer />
      </header>
    </div>
  );
}

export default App;
