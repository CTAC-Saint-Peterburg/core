import { Graphics } from "pixi.js";

export const CreatePlayer = (x = 0, y = 0, texture) => {
    const player = new Graphics();
    player.rect(x, y, 100, 100);
    player.fill(0xde3249);
    player.name = 'player';
    player.texture(texture,0xffffff, x, y);
    console.log(player.x)

return player
}
