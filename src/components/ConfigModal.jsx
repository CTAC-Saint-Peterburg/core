import React from "react";
import { Box, TextField, Typography, Button, TableContainer, TableCell, TableRow, TableBody, TableHead, Table, Paper } from "@mui/material";
import useGameStore from "../zustandStore/store";
const ConfigModal = () => {
const { 
    lobbyName, 
    setLobbyName, 
    lobbies, 
    createLobby, 
    joinLobby, 
    updateLobbies 
  } = useGameStore();

  return (
    <Box>
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
            <Button onClick={createLobby}>Создать лобби</Button>
          </Box>
          <Box>
            <Button onClick={updateLobbies}>Обновить список лобби</Button>
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
                  {lobbies?.length > 0 ? (
                    lobbies?.map((lobby, index) => (
                      <TableRow
                        key={lobby.id}
                        onClick={() => joinLobby(lobby.id)}
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
    </Box>
  );
};

export default ConfigModal;