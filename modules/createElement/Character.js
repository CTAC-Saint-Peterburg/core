import { Graphics } from "pixi.js";

export const CreateCharacter = (texture, currentData, CELL_SIZE)=> {
    const data = currentData.squares.filter(x=> x.type === 'spawn');
    const characters = [];
    for(let i = 0; i < data.length; i++) {
        const mock = new Graphics();
        // mock.anchor.set(0.5);
        mock.label = data[i].name;
        mock.circle(data[i].x * CELL_SIZE, data[i].y * CELL_SIZE, 50);
        mock.fill(0xde3249);
        mock.texture(texture,0xffffff, data[i].x * CELL_SIZE, data[i].y * CELL_SIZE, 100, 150);
        console.log(mock, 'mock')
        characters.push(mock);
    }

    return characters;
}