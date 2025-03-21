import { Sprite } from "pixi.js";


export const createCages = (texture, currentData, CELL_SIZE)=> {
    const data = currentData.squares.filter(x=> x.type === 'cages');
    const cages = [];
    for(let i = 0; i < data.length; i++) {
        const mock = new Sprite(texture);
        // mock.anchor.set(0.5);
        mock.x = data[i].x * CELL_SIZE;
        mock.y = data[i].y * CELL_SIZE;
        mock.height = data[i].size.height * CELL_SIZE;
        mock.width = data[i].size.width * CELL_SIZE;
        mock.label = data[i].name;
        cages.push(mock);
    }

    return cages;
}