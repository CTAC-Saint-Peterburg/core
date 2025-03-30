export const handleCheckMapBounds = (map, testBorder, spawnCords, beforeMove, beforePlayerMove) => {
    const isOutOfBounds = 
      map.x > testBorder.x + spawnCords.x || 
      map.x < testBorder.x - 3000 + spawnCords.x || 
      map.y > testBorder.y + spawnCords.y || 
      map.y < (testBorder.y - 3000 + spawnCords.y);

    if (isOutOfBounds) {
      map.x = beforeMove.x;
      map.y = beforeMove.y;
      map.getChildByName('player').x = beforePlayerMove.x;
      map.getChildByName('player').y = beforePlayerMove.y;
    }

    return isOutOfBounds;
  };