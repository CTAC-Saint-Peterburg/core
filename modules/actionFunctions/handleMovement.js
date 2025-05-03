 export const handleMovement = (keys, player, map, controlCircle, defaultCirleCoords, speed) => {
    const beforeMove = { x: map.x, y: map.y };
    const beforePlayerMove = { x: player.x, y: player.y };
    // player.changeAnimation('idle');

    if (keys['w']) {
      controlCircle.getChildByName('grey').y = defaultCirleCoords.y - 110;
      player.changeAnimation('run');
      player.y -= speed;
      map.y += speed;
    }
    if (keys['s']) {
      controlCircle.getChildByName('grey').y = defaultCirleCoords.y + 110;
      player.changeAnimation('run');
      player.y += speed;
      map.y -= speed;
    }
    if (keys['a']) {
      controlCircle.getChildByName('grey').x = defaultCirleCoords.x - 110;
      player.changeAnimation('run');
      player.x -= speed;
      map.x += speed;
    }
    if (keys['d']) {
      controlCircle.getChildByName('grey').x = defaultCirleCoords.x + 110;
      player.changeAnimation('run');
      player.x += speed;
      map.x -= speed;
    }

    return { beforeMove, beforePlayerMove };
  };