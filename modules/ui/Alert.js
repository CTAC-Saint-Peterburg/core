import { Graphics, Text, Container, Color } from "pixi.js";

export const CreateAlerts = (screenWidth, screenHeight) => {
    // Создаем основной контейнер для алертов
    const alertContainer = new Container();
    alertContainer.name = "alertsContainer";
    alertContainer.zIndex = 9999;
    alertContainer.eventMode = 'static';
    
    // Очередь сообщений
    const queue = [];
    let currentAlert = null;
    let currentText = null;
    let timeoutId = null;

    // Удаление текущего алерта
    const removeCurrentAlert = () => {
        if (currentAlert) {
            if (currentAlert.parent === alertContainer) {
                alertContainer.removeChild(currentAlert);
            }
            currentAlert.destroy({ children: true });
            currentAlert = null;
        }
        
        if (currentText) {
            if (currentText.parent === alertContainer) {
                alertContainer.removeChild(currentText);
            }
            currentText.destroy();
            currentText = null;
        }
        
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        
        // Обрабатываем следующее сообщение из очереди
        processQueue();
    };

    // Обработка очереди
    const processQueue = () => {
        if (queue.length === 0 || currentAlert !== null) return;

        const nextAlert = queue.shift();
        draw(
            nextAlert.text, 
            nextAlert.fullscreen, 
            nextAlert.horizontal, 
            nextAlert.vertical, 
            nextAlert.time
        );
    };

    // Основная функция отрисовки алерта
    const draw = (
        text, 
        fullscreen = false, 
        horizontal = 'center', 
        vertical = 'middle', 
        time = 3
    ) => {
        // Если уже есть активный алерт, добавляем в очередь
        if (currentAlert) {
            queue.push({ text, fullscreen, horizontal, vertical, time });
            return;
        }

        // Создаем графику для фона алерта
        currentAlert = new Graphics();
        currentAlert.name = "alertBackground";

        // Полноэкранный режим
        if (fullscreen) {
            currentAlert.beginFill(new Color(0x000000).setAlpha(0.25));
            currentAlert.drawRect(0, 0, screenWidth, screenHeight);
            currentAlert.endFill();
        } 
        // Оконный режим
        else {
            const width = 300;
            const height = 150;
            
            // Позиционирование
            let x = 20; // left по умолчанию
            if (horizontal === 'center') x = (screenWidth - width) / 2;
            else if (horizontal === 'right') x = screenWidth - width - 20;

            let y = 20; // top по умолчанию
            if (vertical === 'middle') y = (screenHeight - height) / 2;
            else if (vertical === 'bottom') y = screenHeight - height - 20;

            currentAlert.beginFill(0x000000);
            currentAlert.drawRect(x, y, width, height);
            currentAlert.endFill();
        }

        // Создаем текст
        currentText = new Text({
            text,
            style: {
                fill: 0xFFFFFF,
                fontSize: fullscreen ? 32 : 24,
                wordWrap: true,
                wordWrapWidth: fullscreen ? screenWidth - 100 : 280,
                align: 'center',
                fontFamily: 'Arial'
            }
        });
        currentText.name = "alertText";

        // Позиционирование текста
        if (fullscreen) {
            currentText.anchor.set(0.5);
            currentText.position.set(screenWidth / 2, screenHeight / 2);
        } else {
            currentText.anchor.set(0.5);
            const bounds = currentAlert.getBounds();
            currentText.position.set(
                bounds.x + bounds.width / 2,
                bounds.y + bounds.height / 2
            );
        }

        // Добавляем элементы в контейнер
        alertContainer.addChild(currentAlert);
        alertContainer.addChild(currentText);

        // Устанавливаем таймер автоматического удаления
        timeoutId = setTimeout(removeCurrentAlert, time * 1000);
    };

    // Очистка всех алертов
    const clear = () => {
        queue.length = 0;
        removeCurrentAlert();
    };

    // Возвращаем методы и контейнер
    return {
        container: alertContainer,
        draw,
        clear,
        getQueueLength: () => queue.length,
        hasActiveAlert: () => currentAlert !== null
    };
};