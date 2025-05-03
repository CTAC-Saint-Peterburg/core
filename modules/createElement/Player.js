import { Graphics, Text, Container } from "pixi.js";
import { CreateAnimatedSprite } from "./AnimatedSprite";

export const CreatePlayer = async (name, x = 0, y = 0, texture, animationsTextures) => {
    const animations = {
        run: {
            texture: animationsTextures[0],
            params: { frames: 6, width: 16, height: 24, speed: 0.2, scale: 6 }
        },
        idle: {
            texture: animationsTextures[1],
            params: { frames: 1, width: 16, height: 24, speed: 0.1, scale: 6 }
        },
        hit: {
            texture: animationsTextures[2],
            params: { frames: 6, width: 16, height: 24, speed: 0.3, scale: 6 }
        },
        die: {
            texture: animationsTextures[3],
            params: { frames: 7, width: 16, height: 24, speed: 0.1, scale: 6 }
        }
    }
    // Создаем контейнер для игрока
    const playerContainer = new Container();
    playerContainer.x = x;
    playerContainer.y = y;
    playerContainer.name = name;

    // Графическое представление игрока (круг)
    const playerGraphics = new Graphics();
    playerGraphics.circle(0, 0, 100);
    playerGraphics.fill(0xde3249);
    playerContainer.addChild(playerGraphics);

    // Текст с координатами
    const text = new Text({ text: `x: ${x} y: ${y}` });
    text.x = 0;
    text.y = -50;
    playerContainer.addChild(text);

    // Система анимационных состояний
    const animState = {};
    let currentAnimation = null;

    // Загружаем все анимации
    for (const [state, config] of Object.entries(animations)) {
        animState[state] = await CreateAnimatedSprite(
            `${name}_${state}`,
            0,
            -50,
            config.texture,
            config.params
        );
        animState[state].visible = false;
        playerContainer.addChild(animState[state]);
    }

    // Метод для изменения состояния анимации
    playerContainer.changeAnimation = (state) => {
        if (currentAnimation) {
            currentAnimation.visible = false;
            currentAnimation.stop();
        }
        
        if (animState[state]) {
            currentAnimation = animState[state];
            currentAnimation.visible = true;
            currentAnimation.play();
        }
    };

    // Инициализируем первую анимацию, если есть
    if (Object.keys(animState).length > 0) {
        const initialState = Object.keys(animState)[1];
        playerContainer.changeAnimation(initialState);
    }

    return playerContainer;
};