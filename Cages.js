import { Sprite } from "pixi.js";
import dataJSON from './settings/Cages.json';

const data = dataJSON;

export const createCages = (texture)=> {
    const cages = [];
    for(let i = 0; i < data.cages.length; i++) {
        const mock = new Sprite(texture);
        // mock.anchor.set(0.5);
        mock.x = data.cages[i].x;
        mock.y = data.cages[i].y;
        // mock.width = 200;
        // mock.height = 200;
        cages.push(mock);
    }

    return cages;
}