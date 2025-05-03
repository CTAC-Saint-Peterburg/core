export const handleButtonsPressed = (keys, player, alerts) => {
    if (keys['f']) {
        player.changeAnimation('hit');
    }
    if (keys['-']) {
        player.changeHealth(-10);
    }
    if (keys['=']) {
        player.changeHealth(+100);
    }
    if (keys[',']) {
        alerts.show("Внимание! Опасность!", true, 'center', 'middle', 1);
    }
    if (keys['.']) {
        alerts.show("Небольшое уведомление", false, 'right', 'bottom', 1);
    }
    if (keys['/']) {
        alerts.show("Еще одно сообщение", false, 'left', 'top', 1);
    }
}