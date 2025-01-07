import { Graphics } from "pixi.js";
import dataJSON from './settings/Characters.json';

const data = dataJSON;

export const CreateCharacter = (texture)=> {
    const characters = [];
    for(let i = 0; i < data.characters.length; i++) {
        const mock = new Graphics();
        // mock.anchor.set(0.5);
        mock.name = data.characters[i].name;
        mock.circle(data.characters[i].x, data.characters[i].y, 50);
        mock.fill(0xde3249);
        mock.texture(texture,0xffffff, data.characters[i].x, data.characters[i].y, 100, 150);
        characters.push(mock);
    }

    return characters;
}