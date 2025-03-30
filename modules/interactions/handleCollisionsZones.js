// Функция для проверки пересечения круга и прямоугольника
function circleRectIntersect(circleX, circleY, radius, rectX, rectY, rectWidth, rectHeight) {
    // Находим ближайшую точку прямоугольника к центру круга
    const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
    const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));
    
    // Рассчитываем расстояние от центра круга до этой точки
    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;
    
    // Если расстояние меньше радиуса - есть пересечение
    return (distanceX * distanceX + distanceY * distanceY) < (radius * radius);
}

export const createCollisionZones = (currentData, CELL_SIZE) => {
    const collisionData = currentData.squares.filter(x => x.type === 'collision');
    const collisionZones = [];

    for (const zone of collisionData) {
        collisionZones.push({
            x: zone.x * CELL_SIZE,
            y: zone.y * CELL_SIZE,
            width: zone.size.width * CELL_SIZE,
            height: zone.size.height * CELL_SIZE
        });
    }

    return collisionZones;
};

export const checkCollisionZones = (player, map, collisionZones, beforePlayerMove, beforeMapMove) => {
    const playerRadius = 100;
    const playerX = player.x;
    const playerY = player.y;
    
    let isColliding = false;

    for (const zone of collisionZones) {
        if (circleRectIntersect(
            playerX, playerY, playerRadius,
            zone.x, zone.y, zone.width, zone.height
        )) {
            isColliding = true;
            break;
        }
    }

    if (isColliding) {
        // Возвращаем и игрока, и карту на предыдущие позиции
        player.x = beforePlayerMove.x;
        player.y = beforePlayerMove.y;
        map.x = beforeMapMove.x;
        map.y = beforeMapMove.y;
    }

    return isColliding;
};