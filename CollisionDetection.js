import dataJSON from './settings/Characters.json';

const data = dataJSON;

export const checkCollision = (player, type = 'circle') =>  {

    for(let i = 0; i < data.characters.length; i++) {
        const dx = player.x - data.characters[i].x; 
        const dy = player.y - data.characters[i].y; 
        const distance = Math.sqrt(dx * dx + dy * dy); 
        const radiusSum = 100 + 50; 
    
        if (distance < radiusSum) {
            console.log(data.characters[i]?.name, 'cought!');
        }
    }
}