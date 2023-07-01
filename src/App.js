import React from 'react';
import './styles/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu'; // Update the path to the Menu component if necessary
import Deck from './components/Deck'; // make sure the path to the Deck component is correct
import Hand from './components/Hand'; // make sure the path to the Hand component is correct
import Board from './components/Board'; // make sure the path to the Hand component is correct


function App() {
  const cards = [
    { rank: '6', suit: 'hearts' },
    { rank: '7', suit: 'clubs' },
    { rank: '8', suit: 'diamonds' },
    { rank: '9', suit: 'spades' },
    { rank: '10', suit: 'hearts' },
    // Add more cards as needed
  ];
  return (
      <Routes>
        <Route path="/" element = {<Menu />} />
        <Route path="/board" element = {<Board />} />
      </Routes>
  );
}

export default App;
