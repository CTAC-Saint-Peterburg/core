import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import ConfigModal from './components/ConfigModal';
import Game from './components/Game';
import defaultMap from '../settings/defaultconfig.json';
import io from 'socket.io-client';

const socket = io("http://localhost:3000", {
  auth: {
    name: '', // Имя пользователя будет обновлено ниже
  },
});

const App = () => {
  const [currentData, setCurrentData] = useState(null);
  const [name, setName] = useState("");
  const [lobbyName, setLobbyName] = useState("");
  const [lobbies, setLobbies] = useState([]);
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    // Обновляем имя пользователя при подключении
    socket.io.opts.auth.name = name;
    socket.io.opts.query = `name=${name}`;
    socket.disconnect().connect();
  }, [name]);

  // Получение списка лобби от сервера
  useEffect(() => {
    // Получаем список лобби при первом подключении
    socket.on("initialLobbies", (lobbies) => {
      setLobbies(lobbies);
    });

    // Обновляем список лобби при изменениях
    socket.on("updateLobbies", (lobbies) => {
      setLobbies(lobbies);
    });

    // Очистка слушателей при размонтировании
    return () => {
      socket.off("initialLobbies");
      socket.off("updateLobbies");
      socket.off('keyPressedInLobby');
    };
  }, []);

  // Создание лобби
  const handleCreateLobby = () => {
    if (name && lobbyName) {
      socket.emit("createLobby", { lobbyName, creatorName: name });
      setStartGame(true);
    }
  };

  // Присоединение к лобби
  const handleJoinLobby = (lobbyId) => {
    socket.emit("joinLobby", { lobbyId });
    setStartGame(true);
  };

  // Обновление списка лобби
  const handleUpdateLobbies = () => {
    socket.emit("requestLobbies");
  };

  const handleDefaultConfig = () => {
    setCurrentData(defaultMap);
  };

  const handleCustomConfig = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const customData = JSON.parse(e.target.result);
            setCurrentData(customData);
          } catch (error) {
            alert('Убедитесь, что файл корректен.');
          }
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };

  return (
    <div>
      {!currentData && (
        <ConfigModal
          name={name}
          setName={setName}
          lobbyName={lobbyName}
          setLobbyName={setLobbyName}
          lobbies={lobbies}
          startGame={startGame}
          onCreateLobby={handleCreateLobby}
          onJoinLobby={handleJoinLobby}
          onUpdateLobbies={handleUpdateLobbies}
          onDefaultConfig={handleDefaultConfig}
          onCustomConfig={handleCustomConfig}
        />
      )}
      {currentData && <Game currentData={currentData} socket={socket} name={name} />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
//