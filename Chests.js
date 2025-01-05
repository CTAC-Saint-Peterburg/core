import { Sprite } from "pixi.js";
import dataJSON from './settings/Chests.json';

const data = dataJSON;

export const createChests = (texture)=> {
    const chests = [];
    for(let i = 0; i < data.chests.length; i++) {
        const mock = new Sprite(texture);
        // mock.anchor.set(0.5);
        mock.x = data.chests[i].x;
        mock.y = data.chests[i].y;
        chests.push(mock);
    }

    return chests;
}