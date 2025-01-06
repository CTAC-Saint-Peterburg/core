import { Graphics, Container, Sprite} from "pixi.js";

export const createGameUI = (appWidth, appHeight, textures) => {

    const gameUi = new Container();
    let data = [
        {name: 'attack', x: Math.max(appWidth - 500, 200), y: Math.max(appHeight - (appHeight / 4), 300), radius: 100, texture: textures[3]},
        {name: 'use', x: Math.max(appWidth - 200, 200), y: Math.max(appHeight - (appHeight / 4), 300), radius: 100, texture: textures[0]},
        {name: 'map', x: Math.max(appWidth - 200, 200), y: 300, radius: 60, texture: textures[1]},
        {name: 'settings', x: Math.max(appWidth - 200, 200), y: 100, radius: 60, texture: textures[2]}
    ];
    let ui = data.map((unit, index)=> {
        let circle = new Graphics().circle(unit.x, unit.y, unit.radius).fill('red');
        const sprite = new Sprite(unit.texture);
        sprite.anchor.set(0.5);
        sprite.x = unit.x;
        sprite.y = unit.y;
        sprite.width = sprite.width / 3;
        sprite.height = sprite.height / 3;

        sprite.mask = circle;
        return sprite;
    });

    gameUi.addChild(...ui);

    return gameUi;
}