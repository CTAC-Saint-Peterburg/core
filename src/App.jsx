import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import ConfigModal from './components/ConfigModal';
import Game from './components/Game';
import defaultMap from '../settings/defaultconfig.json';
import useGameStore from './zustandStore/store';
import { PersonalProfile } from './components/PersonalProfile';

const App = () => {
  const { name, startGame, initializeSocket, disconnectSocket } = useGameStore();

   useEffect(() => {
    initializeSocket();
    return () => disconnectSocket();
  }, [initializeSocket, disconnectSocket]);

  return (
    <>
      {!name.length && <PersonalProfile />}
      {!!name && !startGame && (<ConfigModal />)}
      {startGame && <Game />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
//