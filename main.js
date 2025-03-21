import { Application, Assets, Sprite, Container, curveEps } from 'pixi.js';
import { CreatePlayer } from './modules/createElement/Player';
import { CreateFogOfWar } from './modules/ui/FogOfWar';
import { createChests } from './modules/createElement/Chests';
import { createCages } from './modules/createElement/Cages';
import { CreateControlCircle } from './modules/ui/ControlCircle';
import { createGameUI } from './modules/ui/GameUi';
import { createMapBorders } from './modules/createElement/MapBorders';
import { CreateCharacter } from './modules/createElement/Character';
import { checkCollision } from './CollisionDetection';
import { CreateEnvironment } from './modules/createElement/Environment';
import { createTimer } from './modules/interactions/Timer';
import defaultMap from './settings/defaultconfig.json';

const CELL_SIZE = 60;

(async () => {
    const configModal = document.getElementById('configModal');
    configModal.style.display = 'block';

    let currentData;

    document.getElementById('defaultConfig').addEventListener('click', () => {
        currentData = defaultMap;
        configModal.style.display = 'none';
        startGame();
    });

    document.getElementById('customConfig').addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        currentData = JSON.parse(e.target.result);
                        console.log(currentData, 'current data2');
                        configModal.style.display = 'none';
                        startGame();
                    } catch (error) {
                        alert('Убедитесь, что файл корректен.');
                    }
                };
                reader.readAsText(file);
            }
        };
        fileInput.click();
    });

    function startGame() {
        const app = new Application();
        const spawnCords = { x: 0, y: 0 };

        (async () => {
            await app.init({ background: '#1099bb', resizeTo: window });
            console.log('NERPA запущена!!!');

            document.body.appendChild(app.canvas);

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
            const player = CreatePlayer(spawnCords.x, spawnCords.y, texture);
            const chests = createChests(textureChest, currentData, CELL_SIZE);
            const cages = createCages(textureCage, currentData, CELL_SIZE);
            const characters = CreateCharacter(textureCharacter, currentData, CELL_SIZE);


            const focus = CreateFogOfWar(app.screen.width, app.screen.height, app.renderer);
            const controlCircle = CreateControlCircle(Math.max(app.screen.width / 10, 200), Math.max(app.screen.height - (app.screen.height / 4), 300), 150);

            const gameUi = createGameUI(app.screen.width, app.screen.height, [textureUIuse, textureUImap, textureUISettings, textureAttack]);

            const mapBordersCoords = [0, 3000, 3000, 0];
            const mapBorders = createMapBorders(...mapBordersCoords);

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

                map.getChildByName('player').children[0].text = `x: ${player.x} y: ${player.y}`;
            });
        })();
    }
})();