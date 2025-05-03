export const handleButtonsPressed = (keys, player) => {
    if (keys['f']) {
        player.changeAnimation('hit');
    }
    if (keys['-']) {
        player.changeHealth(-10);
    }
    if (keys['=']) {
        player.changeHealth(+100);
    }
}