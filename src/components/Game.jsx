import React, { useEffect, useRef } from 'react';
import { Application, Assets, Container } from 'pixi.js';
import { CreatePlayer } from '../../modules/createElement/Player';
import { CreateFogOfWar } from '../../modules/ui/FogOfWar';
import { createChests } from '../../modules/createElement/Chests';
import { createCages } from '../../modules/createElement/Cages';
import { CreateControlCircle } from '../../modules/ui/ControlCircle';
import { createGameUI } from '../../modules/ui/GameUi';
import { createMapBorders } from '../../modules/createElement/MapBorders';
import { CreateCharacter } from '../../modules/createElement/Character';
import { checkCollision } from '../../modules/interactions/CollisionDetection';
import { CreateEnvironment } from '../../modules/createElement/Environment';
import { createTimer } from '../../modules/interactions/Timer';
import { handleButtonsPressed } from '../../modules/actionFunctions/handleButtonsPressed';
import { handleMovement } from '../../modules/actionFunctions/handleMovement';
import { handleCheckMapBounds } from '../../modules/actionFunctions/handleCheckMapBounds';
import { createCollisionZones, checkCollisionZones } from '../../modules/interactions/handleCollisionsZones';
import { CreateAlerts } from '../../modules/ui/Alert';

const CELL_SIZE = 60;

const Game = ({ currentData, socket, name }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    const app = new Application();
    const spawnCords = { x: 0, y: 0 };

    let beforemymoveX = spawnCords.x;
    let beforemymoveY = spawnCords.y;

    let lobbyInfo = [];
    let playersArr = [];

    (async () => {
      await app.init({ background: '#1099bb', resizeTo: window });
      gameRef.current.appendChild(app.canvas);

      const texture = await Assets.load('./assets/sprite.jpg');
      const textureChest = await Assets.load('./assets/spriteChest.jpg');
      const textureCage = await Assets.load('./assets/cageoriginal.jpg');
      const textureUImap = await Assets.load('./assets/map.jpg');
      const textureUISettings = await Assets.load('./assets/settings.jpg');
      const textureUIuse = await Assets.load('./assets/use.jpg');
      const textureAttack = await Assets.load('./assets/knife.jpg');
      const textureCharacter = await Assets.load('./assets/character.jpg');
      const runTexture = await Assets.load('./assets/run.png');
      const idleTexture = await Assets.load('./assets/stand.png');
      const hitTexture = await Assets.load('./assets/hit.png');
      const dieTexture = await Assets.load('./assets/die.png');

      const map = new Container();
      map.x = app.screen.width / 2 - spawnCords.x;
      map.y = app.screen.height / 2 - spawnCords.y;

      const testBorder = { x: map.x, y: map.y };
      const collisionZones = createCollisionZones(currentData, CELL_SIZE);

      const environment = CreateEnvironment(currentData, CELL_SIZE);

      const player = await CreatePlayer('player', spawnCords.x, spawnCords.y, texture, [runTexture, idleTexture, hitTexture, dieTexture]);

      const chests = createChests(textureChest, currentData, CELL_SIZE);
      const cages = createCages(textureCage, currentData, CELL_SIZE);
      const characters = CreateCharacter(textureCharacter, currentData, CELL_SIZE);
      const { container: alertsContainer, draw: showAlert } = CreateAlerts(app.screen.width, app.screen.height);
      const alerts = {
        show: showAlert,
        clear: () => alertsContainer.clear(),
        getQueue: () => alertsContainer.getQueueLength()
    };

      const focus = CreateFogOfWar(app.screen.width, app.screen.height, app.renderer);
      const controlCircle = CreateControlCircle(Math.max(app.screen.width / 10, 200), Math.max(app.screen.height - (app.screen.height / 4), 300), 150);

      const gameUi = createGameUI(app.screen.width, app.screen.height, [textureUIuse, textureUImap, textureUISettings, textureAttack]);

      const mapBordersCoords = [0, 3000, 3000, 0];
      const mapBorders = createMapBorders(...mapBordersCoords);

      // Добавляем игрока и другие объекты на карту
      map.addChild(mapBorders, environment, ...chests, ...cages, ...characters, player);
      app.stage.addChild(map, controlCircle, gameUi, alertsContainer, alertsContainer);

      let defaultCirleCoords = { x: controlCircle.getChildByLabel('grey').x, y: controlCircle.getChildByLabel('grey').y };

      map.mask = focus;

      const speed = 5;
      const keys = {};

      window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
      });

      window.addEventListener('keyup', (event) => {
        controlCircle.getChildByLabel('grey').x = defaultCirleCoords.x;
        controlCircle.getChildByLabel('grey').y = defaultCirleCoords.y;

        player.changeAnimation('idle');

        if (keys['f']) {
          let address = app.stage.getChildByLabel('attack', true);
          if (!address.timerState) {
            createTimer(address, 5);
            checkCollision(player);
          }
        }
        keys[event.key] = false;
      });

      // Обработчик для получения данных о других игроках
      socket.on('keyPressedInLobby', async (data) => {
        try {
            // Проверяем, что данные валидны и есть игроки для обработки
            if (!data?.players || !Array.isArray(data.players)) return;
    
            // Обновляем информацию о лобби
            lobbyInfo = data.players;
    
            // Обрабатываем каждого игрока асинхронно
            await Promise.all(lobbyInfo.map(async (playerData) => {
                // Пропускаем текущего игрока
                if (playerData.name === name) return;
    
                // Ищем существующего игрока по имени (более надежно, чем по индексу)
                const existingPlayerIndex = playersArr.findIndex(p => p?.name === playerData.name);
    
                if (existingPlayerIndex >= 0) {
                    // Обновляем существующего игрока
                    const player = playersArr[existingPlayerIndex];
                    player.changePosition(playerData.x, playerData.y);
                    player.changeAnimation(playerData.animationState || 'idle');
                } else {
                    try {
                        // Создаем нового игрока с анимациями
                        const newPlayer = await CreatePlayer(
                            playerData.name,  // Используем имя как идентификатор
                            playerData.x,
                            playerData.y,
                            texture,
                            [runTexture, idleTexture, hitTexture, dieTexture]
                        );

                        // Устанавливаем начальную анимацию
                        newPlayer.changeAnimation(playerData.animationState || 'idle');
                        
                        // Добавляем в массив и на карту
                        playersArr.push(newPlayer);
                        map.addChild(newPlayer);
                    } catch (error) {
                        console.error(`Failed to create player ${playerData.name}:`, error);
                    }
                }
            }));
    
        } catch (error) {
            console.error('Error processing lobby data:', error);
        }
    });

      app.ticker.add((time) => {

        const { beforeMove, beforePlayerMove } = handleMovement(
          keys,
          map.getChildByLabel('player'),
          map,
          controlCircle,
          defaultCirleCoords,
          speed
        );

        handleButtonsPressed(keys, map.getChildByLabel('player'), alerts);

        const hasCollision = checkCollisionZones(
          player,
          map,
          collisionZones,
          beforePlayerMove,
          beforeMove
      );
  
      // Проверяем границы карты только если не было коллизии
      if (!hasCollision) {
          handleCheckMapBounds(
              map,
              testBorder,
              spawnCords,
              beforeMove,
              beforePlayerMove
          );
      }

        const animationState = keys['w'] || keys['a'] || keys['s'] || keys['d'] ? 'run' : 'idle';
        map.getChildByLabel('player').children[1].text = `x: ${player.x} y: ${player.y} name: ${name}`;

        if (name) {
          let currentX = player.x;
          let currentY = player.y;

          // Если координаты изменились
          if (currentX !== beforemymoveX || currentY !== beforemymoveY || 
            player.currentAnimationState !== animationState) {
            // Отправляем новые координаты на сервер
            socket.emit('keyPressed', { key: 11, name, x: currentX, y: currentY, animationState });

            // Обновляем предыдущие координаты
            beforemymoveX = currentX;
            beforemymoveY = currentY;
          }
        }
      });
    })();

    return () => {
      app.destroy(true); // Очистка при размонтировании компонента
    };
  }, [currentData]);

  return <div ref={gameRef}></div>;
};

export default Game;