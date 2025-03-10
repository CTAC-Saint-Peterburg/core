import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], 
  server: {
    open: true, // Автоматически открывать браузер при запуске сервера
  },
});