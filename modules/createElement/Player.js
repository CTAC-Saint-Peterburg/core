import { Graphics, Text, Container } from "pixi.js";
import { CreateAnimatedSprite } from "./AnimatedSprite";
import { CreateHealthBar } from "./HealthBar";

export const CreatePlayer = async (name, x = 0, y = 0, texture, animationsTextures) => {
    const animations = {
        run: {
            texture: animationsTextures[0],
            params: { frames: 6, width: 16, height: 24, speed: 0.2, scale: 6, loop: true }
        },
        idle: {
            texture: animationsTextures[1],
            params: { frames: 1, width: 16, height: 24, speed: 0.1, scale: 6, loop: false }
        },
        hit: {
            texture: animationsTextures[2],
            params: { frames: 6, width: 16, height: 24, speed: 0.3, scale: 6, loop: true }
        },
        die: {
            texture: animationsTextures[3],
            params: { frames: 7, width: 16, height: 24, speed: 0.1, scale: 6, loop: false}
        }
    }
    // Создаем контейнер для игрока
    const playerContainer = new Container();
    playerContainer.x = x;
    playerContainer.y = y;
    playerContainer.name = name;

    // Добавляем здоровье игрока
    playerContainer.health = 100;

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

    const healthBar = CreateHealthBar(-52, -120, playerContainer.health);
    playerContainer.addChild(healthBar);
    playerContainer.healthBar = healthBar;

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
        if (playerContainer.health <= 0) {
            state = 'die';
        }
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

     // Метод для изменения здоровья
     playerContainer.changeHealth = (amount) => {
        playerContainer.health += amount;
        
        // Ограничиваем здоровье от 0 до 100
        playerContainer.health = Math.max(0, Math.min(100, playerContainer.health));

        // Обновляем HealthBar
        playerContainer.healthBar.updateHealth(playerContainer.health);
        
        // Если здоровье <= 0, включаем анимацию смерти
        if (playerContainer.health <= 0) {
            playerContainer.changeAnimation('die');
        } 
        return playerContainer.health;
    };

    return playerContainer;
};