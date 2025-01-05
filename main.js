import { Application, Assets, Sprite, Container } from 'pixi.js';
import { CreatePlayer } from './Player';
import { CreateFogOfWar } from './FogOfWar';
import { createChests } from './Chests';
import { createCages } from './Cages';
import { CreateControlCircle } from './ControlCircle';
import { createGameUI } from './GameUi';
import { createMapBorders } from './MapBorders';

(async () => {
    // Создание нового приложения
    const app = new Application();
    const spawnCords = {x: 0, y: 0};

    // Инициализация приложения
    await app.init({ background: '#1099bb', resizeTo: window });
    console.log('NERPA запущена!!!');

    // Добавление холста приложения в документ
    document.body.appendChild(app.canvas);

    const texture = await Assets.load('./assets/sprite.jpg');
    const textureChest = await Assets.load('./assets/spriteChest.jpg');
    const textureCage = await Assets.load('./assets/cageoriginal.jpg');
    const textureUImap = await Assets.load('./assets/map.jpg');
    const textureUISettings = await Assets.load('./assets/settings.png');
    const textureUIuse = await Assets.load('./assets/use.jpg');

    // Создание контейнера для объектов сцены
    const map = new Container();
    map.x = app.screen.width / 2 - spawnCords.x;
    map.y = app.screen.height / 2 - spawnCords.y;

    const testBorder = {x: map.x, y: map.y}


    // Создание игрока и установка его в центр экрана
    const player = CreatePlayer(spawnCords.x,spawnCords.y,  texture);

    const chests = createChests(textureChest);
    const cages = createCages(textureCage);


    const focus = CreateFogOfWar(app.screen.width, app.screen.height, app.renderer);
    const controlCircle = CreateControlCircle(Math.max(app.screen.width / 10, 200), Math.max(app.screen.height - (app.screen.height / 4), 300), 150);

    const gameUi = createGameUI(app.screen.width, app.screen.height, [textureUIuse, textureUImap, textureUISettings]);

    const mapBordersCoords = [0, 3000, 3000, 0] //- как margin
    const mapBorders = createMapBorders(...mapBordersCoords);

    map.addChild(mapBorders,...chests, ...cages, player);
    app.stage.addChild(map, controlCircle, gameUi);

    let defaultCirleCoords = {x: controlCircle.getChildByName('grey').x, y: controlCircle.getChildByName('grey').y};

    map.mask = focus;

    const speed = 5; // Скорость перемещения
    const keys = {}; // Объект для хранения состояния клавиш

    window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
        controlCircle.getChildByName('grey').x = defaultCirleCoords.x;
        controlCircle.getChildByName('grey').y = defaultCirleCoords.y;
        keys[event.key] = false;
    });

    app.ticker.add((time) => {
        let beforeMove = {x: map.x, y: map.y};
        let beforePlayerMove = {x: map.getChildByName('player').x, y: map.getChildByName('player').y}
        console.log(map.x, map.y, 'coords', testBorder.x + 0, testBorder.y + 200);

        if (keys['w']) {
            controlCircle.getChildByName('grey').y = defaultCirleCoords.y;
            controlCircle.getChildByName('grey').y -= 110;
            console.log('1')
            map.getChildByName('player').y -= speed;
            map.y += speed; // Движение сцены вверх
        }
        if (keys['s']) {
            controlCircle.getChildByName('grey').y = defaultCirleCoords.y;
            controlCircle.getChildByName('grey').y += 110;
            map.getChildByName('player').y += speed;
            map.y -= speed; // Движение сцены вниз
        }
        if (keys['a']) {
            controlCircle.getChildByName('grey').x = defaultCirleCoords.x;
            controlCircle.getChildByName('grey').x -= 110;
            map.getChildByName('player').x -= speed;
            map.x += speed; // Движение сцены влево
        }
        if (keys['d']) {
            controlCircle.getChildByName('grey').x = defaultCirleCoords.x;
            controlCircle.getChildByName('grey').x += 110;
            map.getChildByName('player').x += speed;
            map.x -= speed; // Движение сцены вправо
        }

        //- Границы карты
        if (map.x > testBorder.x || map.x < (testBorder.x - 3000) || map.y > testBorder.y || map.y < (testBorder.y - 3000) ) {
            map.x = beforeMove.x;
            map.y = beforeMove.y;
            map.getChildByName('player').x = beforePlayerMove.x;
            map.getChildByName('player').y = beforePlayerMove.y;
        }
    });
})();
