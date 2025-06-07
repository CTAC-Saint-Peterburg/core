// stores/gameStore.js
import { create } from 'zustand';
import { io } from 'socket.io-client';
import defaultMap from '../../settings/defaultconfig.json';

const useGameStore = create((set, get) => ({
  // Состояния пользователя
  name: '',
  setName: (name) => {
    set({ name });
    const socket = get().socket;
    if (socket) {
      socket.io.opts.auth.name = name;
      socket.io.opts.query = `name=${name}`;
      socket.disconnect().connect();
    }
  },

  // Конфигурация игры
  currentData: null,
  setCurrentData: (data) => set({ currentData: data }),

  // Состояние сокета
  socket: null,
  initializeSocket: () => {
    const socket = io("http://localhost:3000", {
      auth: {
        name: get().name,
      },
    });
    
    socket.on("initialLobbies", (lobbies) => {
      set({ lobbies });
    });
    
    socket.on("updateLobbies", (lobbies) => {
      set({ lobbies });
    });
    
    set({ socket });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  // Лобби
  lobbyName: '',
  setLobbyName: (name) => set({ lobbyName: name }),
  lobbies: [],
  currentLobby: null,

  // Флаги состояния
  configPicked: null,
  setConfigPicked: (value) => set({ configPicked: value }),
  startGame: false,
  setStartGame: (value) => set({ startGame: value }),

  // Действия с лобби
  createLobby: () => {
    const { socket, name, lobbyName } = get();
    if (socket && name && lobbyName) {
      socket.emit("createLobby", { lobbyName, creatorName: name });
      set({ startGame: true });
    }
  },
  
  joinLobby: (lobbyId) => {
    const socket = get().socket;
    if (socket) {
      socket.emit("joinLobby", { lobbyId });
      set({ startGame: true });
    }
  },
  
  updateLobbies: () => {
    const socket = get().socket;
    if (socket) {
      socket.emit("requestLobbies");
    }
  },

  // Загрузка конфигураций
  loadDefaultConfig: () => {
    set({ currentData: defaultMap });
  },
  
  loadCustomConfig: () => {
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
            set({ currentData: customData });
          } catch (error) {
            alert('Убедитесь, что файл корректен.');
          }
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  },
}));

export default useGameStore;