import { Sprite } from "pixi.js";


export const createChests = (texture, currentData, CELL_SIZE)=> {
    let data = currentData.squares.filter(x=> x.type === 'chests');
    const chests = [];
    for(let i = 0; i < data.length; i++) {
        const mock = new Sprite(texture);
        mock.height = data[i].size.height * CELL_SIZE;
        mock.width = data[i].size.width * CELL_SIZE;
        // mock.anchor.set(0.5);
        mock.x = data[i].x * CELL_SIZE;
        mock.y = data[i].y * CELL_SIZE;
        mock.label = data[i].name;
        chests.push(mock);
    }

    return chests;
}