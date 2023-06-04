import React from 'react';
import './styles/App.css';
import Card from './components/Card'; // make sure the path to the Card component is correct
import Deck from './components/Deck'; // make sure the path to the Deck component is correct

function App() {
  return (
    <div >
      <main className='test'>
        <Card rank="A" suit="spades" isFaceUp={true} />
        <Card rank="6" suit="hearts" isFaceUp={true} />
        <Card rank="7" suit="hearts" isFaceUp={true} />
        <Card rank="8" suit="hearts" isFaceUp={true} />
        <Card rank="9" suit="diamonds" isFaceUp={true} />
        <Card rank="10" suit="clubs" isFaceUp={true} />
      </main>

      <div>
        <Deck />
      </div>
    </div>
  );
}

export default App;
