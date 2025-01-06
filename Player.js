import { Graphics, Text } from "pixi.js";

export const CreatePlayer = (x = 0, y = 0, texture) => {
    const text = new Text({ text: `x: ${x} y: ${y}`});
    text.x = x;
    text.y = y - 50;
    const player = new Graphics();
    player.circle(x, y, 100);
    player.fill(0xde3249);
    player.name = 'player';
    player.texture(texture,0xffffff, x, y);
    player.addChild(text)
    console.log(player.x)

return player
}
