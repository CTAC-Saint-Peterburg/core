import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Button, TableContainer, TableCell, TableRow, TableBody, TableHead, Table, Paper } from "@mui/material";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: {
    name: '', // Имя пользователя будет обновлено ниже
  },
});

const ConfigModal = ({ onDefaultConfig, onCustomConfig }) => {
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

  return (
    <Box>
      <Box>
        <Typography>Никнейм: {name}</Typography>
        <TextField
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
      {!!name?.length && (
        <>
          <Box>
            <Typography>Лобби: {lobbyName}</Typography>
            <TextField
              variant="outlined"
              value={lobbyName}
              onChange={(e) => setLobbyName(e.target.value)}
            />
          </Box>
          <Box>
            <Button onClick={handleCreateLobby}>Создать лобби</Button>
          </Box>
          <Box>
            <Button onClick={handleUpdateLobbies}>Обновить список лобби</Button>
          </Box>
          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Позиция</TableCell>
                    <TableCell align="right">Имя создателя</TableCell>
                    <TableCell align="right">Название лобби</TableCell>
                    <TableCell align="right">Время создания</TableCell>
                    <TableCell align="right">Участники</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lobbies.length > 0 ? (
                    lobbies.map((lobby, index) => (
                      <TableRow
                        key={lobby.id}
                        onClick={() => handleJoinLobby(lobby.id)}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="right">{lobby.creator}</TableCell>
                        <TableCell align="right">{lobby.name}</TableCell>
                        <TableCell align="right">{lobby.createdAt}</TableCell>
                        <TableCell align="right">
                          {lobby.players.map((player, idx) => (
                            <div key={idx}>{player.name}</div>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">Нет доступных лобби</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
      {startGame && (
        <Box
          id="configModal"
          style={{
            display: "block",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <p>Выберите конфигурацию:</p>
          <button onClick={onDefaultConfig}>Стандартный конфиг</button>
          <button onClick={onCustomConfig}>Загрузить свой конфиг</button>
        </Box>
      )}
    </Box>
  );
};

export default ConfigModal;
