import { Application, Assets, Sprite, Container } from 'pixi.js';
import { CreatePlayer } from './Player';
import { CreateFogOfWar } from './FogOfWar';
import { createChests } from './Chests';
import { createCages } from './Cages';
import { CreateControlCircle } from './ControlCircle';

(async () => {
    // Создание нового приложения
    const app = new Application();

    // Инициализация приложения
    await app.init({ background: '#1099bb', resizeTo: window });
    console.log('NERPA запущена!!!');

    // Добавление холста приложения в документ
    document.body.appendChild(app.canvas);

    const texture = await Assets.load('./assets/sprite.jpg');
    const textureChest = await Assets.load('./assets/spriteChest.jpg');
    const textureCage = await Assets.load('./assets/cageoriginal.jpg');

    // Создание контейнера для объектов сцены
    const map = new Container();

    // Создание игрока и установка его в центр экрана
    const player = CreatePlayer(app.screen.width / 2, app.screen.height / 2, texture);

    const chests = createChests(textureChest);
    const cages = createCages(textureCage);


    const focus = CreateFogOfWar(app.screen.width, app.screen.height, app.renderer);
    const controlCircle = CreateControlCircle(Math.max(app.screen.width / 10, 200), Math.max(app.screen.height - (app.screen.height / 4), 300), 150);


    map.addChild(...chests, ...cages);
    app.stage.addChild(map, player, controlCircle);

    let defaultCirleCoords = {x: controlCircle.getChildByName('grey').x, y: controlCircle.getChildByName('grey').y};

    console.log(controlCircle.children[1], controlCircle.getChildByName('grey'), 's')
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
        if (keys['w']) {
            controlCircle.getChildByName('grey').y = defaultCirleCoords.y;
            controlCircle.getChildByName('grey').y -= 110;
            map.y += speed; // Движение сцены вверх
        }
        if (keys['s']) {
            controlCircle.getChildByName('grey').y = defaultCirleCoords.y;
            controlCircle.getChildByName('grey').y += 110;
            map.y -= speed; // Движение сцены вниз
        }
        if (keys['a']) {
            controlCircle.children[1].x = defaultCirleCoords.x;
            controlCircle.children[1].x -= 110;
            map.x += speed; // Движение сцены влево
        }
        if (keys['d']) {
            controlCircle.children[1].x = defaultCirleCoords.x;
            controlCircle.children[1].x += 110;
            map.x -= speed; // Движение сцены вправо
        }

        // Обновляем позицию игрока в центре экрана
    });
})();
