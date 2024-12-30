import { Application, Assets, Sprite, Container } from 'pixi.js';
import { CreatePlayer } from './Player';
import { CreateFogOfWar } from './FogOfWar';

(async () => {
    // Создание нового приложения
    const app = new Application();

    // Инициализация приложения
    await app.init({ background: '#000000', resizeTo: window });
    console.log('NERPA запущена!!!');

    // Добавление холста приложения в документ
    document.body.appendChild(app.canvas);

    const texture = await Assets.load('./assets/sprite.jpg');

    // Создание контейнера для объектов сцены
    const map = new Container();

    // Создание игрока и установка его в центр экрана
    const player = CreatePlayer(app.screen.width / 2, app.screen.height / 2, texture); // Игрок будет находиться в координатах (0, 0)
    
    // Создание спрайта bunny
    const bunny = new Sprite(texture);
    bunny.anchor.set(0.5);
    bunny.x = 100; // Позиция по X для объекта
    bunny.y = 100; // Позиция по Y для объекта

    const focus = CreateFogOfWar(app.screen.width, app.screen.height, app.renderer);


    map.addChild(bunny);
    app.stage.addChild(map, player, focus);
    map.mask = focus;

    const speed = 5; // Скорость перемещения
    const keys = {}; // Объект для хранения состояния клавиш

    window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    app.ticker.add((time) => {
        if (keys['w']) {
            map.y += speed; // Движение сцены вверх
        }
        if (keys['s']) {
            map.y -= speed; // Движение сцены вниз
        }
        if (keys['a']) {
            map.x += speed; // Движение сцены влево
        }
        if (keys['d']) {
            map.x -= speed; // Движение сцены вправо
        }

        // Обновляем позицию игрока в центре экрана
    });
})();
