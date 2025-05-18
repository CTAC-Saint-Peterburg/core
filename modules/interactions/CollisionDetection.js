export const checkCollision = (player, playersArr, type = 'circle') => {
    // Проверяем коллизию с каждым игроком в массиве
    for(let i = 0; i < playersArr.length; i++) {
        const otherPlayer = playersArr[i];
        
        // Пропускаем проверку коллизии с самим собой
        if (otherPlayer.name === player.name) continue;

        const dx = player.x - otherPlayer.x; 
        const dy = player.y - otherPlayer.y; 
        const distance = Math.sqrt(dx * dx + dy * dy); 
        const radiusSum = 100 + 100; // красные круги у игроков
    
        if (distance < radiusSum) {
            console.log(otherPlayer.name, 'caught!');
            // Здесь можно добавить логику при коллизии (например, нанесение урона)
            return otherPlayer; // Возвращаем игрока, с которым столкнулись
        }
    }
    return null; // Если коллизий не обнаружено
};