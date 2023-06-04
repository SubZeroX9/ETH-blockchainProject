import React from 'react';
import './styles/App.css';
import Card from './components/Card'; // make sure the path to the Card component is correct
import Deck from './components/Deck'; // make sure the path to the Deck component is correct

function App() {
  return (
    <div >
      <div>
        <Deck />
      </div>
    </div>
  );
}

export default App;
