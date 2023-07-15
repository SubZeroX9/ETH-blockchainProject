import React from 'react';
import './styles/App.css';
import {BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from './components/Menu'; // Update the path to the Menu component if necessary
import Board from './components/Board'; // make sure the path to the Board component is correct

function App() {
  return (
    <BrowserRouter basename="/durak-game">
      <Routes>
        <Route path="/" element={<Menu />}/> 
        <Route path="/board" element={<Board />}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
