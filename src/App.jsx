import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ConfigModal from './components/ConfigModal';
import Game from './components/Game';
import defaultMap from '../settings/defaultconfig.json';
const App = () => {
  const [currentData, setCurrentData] = useState(null);

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
      {!currentData && <ConfigModal onDefaultConfig={handleDefaultConfig} onCustomConfig={handleCustomConfig} />}
      {currentData && <Game currentData={currentData} />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);