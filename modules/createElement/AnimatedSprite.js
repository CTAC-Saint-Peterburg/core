import { AnimatedSprite, Spritesheet } from "pixi.js";

export const CreateAnimatedSprite = async (name, x = 0, y = 0, texture, config) => {
    texture.baseTexture.source.style.scaleMode = 'nearest';
    // Создаем frames на основе конфига
    const frames = {};
    const frameWidth = config.width;
    const frameHeight = config.height;
    
    for (let i = 0; i < config.frames; i++) {
        frames[`frame${i}`] = {
            frame: { x: i * frameWidth, y: 0, w: frameWidth, h: frameHeight },
            sourceSize: { w: frameWidth, h: frameHeight },
            spriteSourceSize: { x: 0, y: 0, w: frameWidth, h: frameHeight }
        };
    }

    // Создаем спрайтшит
    const spritesheet = new Spritesheet(texture, {
        frames,
        meta: { scale: "1" },
        animations: {
            animate: Object.keys(frames)
        }
    });
    
    // Парсим и создаем анимированный спрайт
    await spritesheet.parse();
    
    const animatedSprite = new AnimatedSprite(spritesheet.animations.animate);
    animatedSprite.x = x;
    animatedSprite.y = y;
    animatedSprite.label = name;
    animatedSprite.animationSpeed = config.speed;
    animatedSprite.scale.set(config.scale);
    animatedSprite.play();
    animatedSprite.loop = config.loop;

    return animatedSprite;
};