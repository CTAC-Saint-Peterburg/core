import { Graphics, Container, Sprite, Text } from "pixi.js";

export const createGameUI = (appWidth, appHeight, textures) => {
    const gameUi = new Container();

    const data = [
        { name: 'attack', x: Math.max(appWidth - 300, 200), y: Math.max(appHeight - (appHeight / 4), 300), radius: 50, texture: textures[3],
            title: { x: 0, y: 100, text: 'F' }
        },
        { name: 'use', x: Math.max(appWidth - 100, 200), y: Math.max(appHeight - (appHeight / 4), 300), radius: 50, texture: textures[0],
            title: { x: 0, y: 100, text: 'E' }
        },
        { name: 'map', x: Math.max(appWidth - 100, 200), y: 300, radius: 50, texture: textures[1],
            title: { x: 0, y: 100, text: 'TAB' }
        },
        { name: 'settings', x: Math.max(appWidth - 100, 200), y: 100, radius: 50, texture: textures[2],
            title: { x: 0, y: 100, text: 'ESC' }
        }
    ];

    const ui = data.map(unit => {
        const mock = new Container();
        mock.x = unit.x;
        mock.y = unit.y;
        mock.name = unit.name + 'container';

        const text = new Text({
            text: '',
            style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 'white',
                align: 'center',
            }
        });
        text.x = -30;
        text.y = -60;
        text.name = unit.name;
        text.timerState = false;

        const titleText = new Text({
            text: unit.title.text,
            style: {
                fontFamily: 'Arial',
                fontSize: 40,
                fill: 'yellow',
                fontWeight: 'bold',
                align: 'center',
            }
        });
        titleText.anchor.set(0.5);
        titleText.x = unit.title.x;
        titleText.y = unit.title.y;

        const mask = new Graphics()
            .circle(0, 0, unit.radius)
            .fill(0xFFFFFF);

        const sprite = new Sprite(unit.texture);
        sprite.anchor.set(0.5);

        sprite.texture.baseTexture.scaleMode = 'linear';

        const iconSize = unit.radius * 1.6;
        const scale = Math.min(iconSize / sprite.width, iconSize / sprite.height);
        sprite.scale.set(scale);

        sprite.mask = mask;

        const circleBg = new Graphics()
            .circle(0, 0, unit.radius)
            .fill(0xFF0000, 0.3);

        mock.addChild(circleBg);
        mock.addChild(sprite);
        mock.addChild(mask);
        mock.addChild(titleText);
        mock.addChild(text);

        return mock;
    });

    gameUi.addChild(...ui);
    return gameUi;
};
