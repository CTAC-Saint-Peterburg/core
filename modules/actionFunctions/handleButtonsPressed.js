export const handleButtonsPressed = (keys, player) => {
    if (keys['f']) {
        player.changeAnimation('hit');
    }
}