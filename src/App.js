import React from 'react';
import './styles/App.css';
import Card from './components/Card'; // make sure the path to the Card component is correct

function App() {
  return (
    <div >
      <main className='test'>
        <Card rank="A" suit="hearts" isFaceUp={true} />
        <Card rank="K" suit="diamonds" isFaceUp={true} />
        <Card rank="Q" suit="spades" isFaceUp={true} />
        <Card rank="J" suit="clubs" isFaceUp={false} />
        <Card rank="6" suit="hearts" isFaceUp={true} />
      </main>
    </div>
  );
}

export default App;
