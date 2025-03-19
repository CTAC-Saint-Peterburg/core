import React, { useEffect, useRef } from 'react';
import { Application, Assets, Container } from 'pixi.js';
import { CreatePlayer } from '../../Player';
import { CreateFogOfWar } from '../../FogOfWar';
import { createChests } from '../../Chests';
import { createCages } from '../../Cages';
import { CreateControlCircle } from '../../ControlCircle';
import { createGameUI } from '../../GameUi';
import { createMapBorders } from '../../MapBorders';
import { CreateCharacter } from '../../Character';
import { checkCollision } from '../../CollisionDetection';
import { CreateEnvironment } from '../../Environment';
import { createTimer } from '../../Timer';

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
      const textureUISettings = await Assets.load('./assets/settingsIcon.jpg');
      const textureUIuse = await Assets.load('./assets/useIcon.jpg');
      const textureAttack = await Assets.load('./assets/attack.jpg');
      const textureCharacter = await Assets.load('./assets/character.jpg');

      const map = new Container();
      map.x = app.screen.width / 2 - spawnCords.x;
      map.y = app.screen.height / 2 - spawnCords.y;

      const testBorder = { x: map.x, y: map.y };

      const environment = CreateEnvironment(currentData, CELL_SIZE);

      const player = CreatePlayer('player', spawnCords.x, spawnCords.y, texture);

      const chests = createChests(textureChest, currentData, CELL_SIZE);
      const cages = createCages(textureCage, currentData, CELL_SIZE);
      const characters = CreateCharacter(textureCharacter, currentData, CELL_SIZE);

      const focus = CreateFogOfWar(app.screen.width, app.screen.height, app.renderer);
      const controlCircle = CreateControlCircle(Math.max(app.screen.width / 10, 200), Math.max(app.screen.height - (app.screen.height / 4), 300), 150);

      const gameUi = createGameUI(app.screen.width, app.screen.height, [textureUIuse, textureUImap, textureUISettings, textureAttack]);

      const mapBordersCoords = [0, 3000, 3000, 0];
      const mapBorders = createMapBorders(...mapBordersCoords);

      // Добавляем игрока и другие объекты на карту
      map.addChild(mapBorders, environment, ...chests, ...cages, ...characters, player);
      app.stage.addChild(map, controlCircle, gameUi);

      let defaultCirleCoords = { x: controlCircle.getChildByName('grey').x, y: controlCircle.getChildByName('grey').y };

      map.mask = focus;

      const speed = 5;
      const keys = {};

      window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
      });

      window.addEventListener('keyup', (event) => {
        controlCircle.getChildByName('grey').x = defaultCirleCoords.x;
        controlCircle.getChildByName('grey').y = defaultCirleCoords.y;

        if (keys['f']) {
          let address = app.stage.getChildByName('attack', true);
          if (!address.timerState) {
            createTimer(address, 5);
            checkCollision(player);
          }
        }
        keys[event.key] = false;
      });

      // Обработчик для получения данных о других игроках
      socket.on('keyPressedInLobby', (data) => {
        if (data.name !== name) {
          lobbyInfo = data.players;

          // Обновляем позиции других игроков
          lobbyInfo.forEach((player, index) => {
            if (player.name !== name) {
              // Если игрок уже существует, обновляем его позицию
              if (playersArr[index]) {
                playersArr[index].x = player.x;
                playersArr[index].y = player.y;
                playersArr[index].children[0].text = `x: ${player.x} y: ${player.y} name: ${player.name}`;
              } else {
                // Если игрок не существует, создаем его
                const pObj = CreatePlayer(index, player.x, player.y, texture);
                pObj.children[0].text = `x: ${player.x} y: ${player.y} name: ${player.name}`;
                playersArr[index] = pObj;
                map.addChild(pObj); // Добавляем игрока на карту
              }
            }
          });
        }
      });

      app.ticker.add((time) => {
        let beforeMove = { x: map.x, y: map.y };
        let beforePlayerMove = { x: map.getChildByName('player').x, y: map.getChildByName('player').y };

        if (keys['w']) {
          controlCircle.getChildByName('grey').y = defaultCirleCoords.y;
          controlCircle.getChildByName('grey').y -= 110;
          map.getChildByName('player').y -= speed;
          map.y += speed;
        }
        if (keys['s']) {
          controlCircle.getChildByName('grey').y = defaultCirleCoords.y;
          controlCircle.getChildByName('grey').y += 110;
          map.getChildByName('player').y += speed;
          map.y -= speed;
        }
        if (keys['a']) {
          controlCircle.getChildByName('grey').x = defaultCirleCoords.x;
          controlCircle.getChildByName('grey').x -= 110;
          map.getChildByName('player').x -= speed;
          map.x += speed;
        }
        if (keys['d']) {
          controlCircle.getChildByName('grey').x = defaultCirleCoords.x;
          controlCircle.getChildByName('grey').x += 110;
          map.getChildByName('player').x += speed;
          map.x -= speed;
        }

        if (map.x > testBorder.x + spawnCords.x || map.x < testBorder.x - 3000 + spawnCords.x || map.y > testBorder.y + spawnCords.y || map.y < (testBorder.y - 3000 + spawnCords.y)) {
          map.x = beforeMove.x;
          map.y = beforeMove.y;
          map.getChildByName('player').x = beforePlayerMove.x;
          map.getChildByName('player').y = beforePlayerMove.y;
        }

        map.getChildByName('player').children[0].text = `x: ${player.x} y: ${player.y} name: ${name}`;

        if (name) {
          let currentX = player.x;
          let currentY = player.y;

          // Если координаты изменились
          if (currentX !== beforemymoveX || currentY !== beforemymoveY) {
            // Отправляем новые координаты на сервер
            socket.emit('keyPressed', { key: 11, name, x: currentX, y: currentY });

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