export const handleMovement = (keys, player, map, controlCircle, defaultCirleCoords, speed) => {
    const beforeMove = { x: map.x, y: map.y };
    const beforePlayerMove = { x: player.x, y: player.y };
    
    // Временные переменные для новых координат
    let newPlayerX = player.x;
    let newPlayerY = player.y;
    let newMapX = map.x;
    let newMapY = map.y;
    let isMoving = false;

    if (keys['w']) {
        controlCircle.getChildByLabel('grey').y = defaultCirleCoords.y - 110;
        newPlayerY -= speed;
        newMapY += speed;
        isMoving = true;
    }
    if (keys['s']) {
        controlCircle.getChildByLabel('grey').y = defaultCirleCoords.y + 110;
        newPlayerY += speed;
        newMapY -= speed;
        isMoving = true;
    }
    if (keys['a']) {
        controlCircle.getChildByLabel('grey').x = defaultCirleCoords.x - 110;
        newPlayerX -= speed;
        newMapX += speed;
        isMoving = true;
    }
    if (keys['d']) {
        controlCircle.getChildByLabel('grey').x = defaultCirleCoords.x + 110;
        newPlayerX += speed;
        newMapX -= speed;
        isMoving = true;
    }

    // Применяем изменения через changePosition (если было движение)
    if (isMoving) {
        player.changeAnimation('run');
        player.changePosition(newPlayerX, newPlayerY);
        map.position.set(newMapX, newMapY);
    } else {
        player.changeAnimation('idle');
        // Возвращаем серый круг в исходное положение, если нет движения
        controlCircle.getChildByLabel('grey').position.set(defaultCirleCoords.x, defaultCirleCoords.y);
    }

    return { beforeMove, beforePlayerMove };
};