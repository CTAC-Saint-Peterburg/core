import { Container, Graphics, Color } from 'pixi.js';

export const CreateEnvironment = (currentData, CELL_SIZE) => {
    const data = currentData.squares.filter(x => x.type === 'environment');
    console.log(data, 'test')
    const container = new Container();

    for (let i = 0; i < data.length; i++) {
        const square = new Graphics();

        // Устанавливаем цвет заливки
        const color = new Color(data[i].color).toNumber();

        // Начинаем путь
        square.beginPath();

        // Рисуем прямоугольник
        square.rect(
            0, // начальная точка x (относительно square.x)
            0, // начальная точка y (относительно square.y)
            data[i].size.width * CELL_SIZE, // ширина
            data[i].size.height * CELL_SIZE // высота
        );

        // Заливаем прямоугольник цветом
        square.fill(color);

        // Завершаем путь
        square.closePath();

        // Устанавливаем позицию
        square.x = data[i].x * CELL_SIZE;
        square.y = data[i].y * CELL_SIZE;

        // Добавляем метку (если нужно)
        square.label = data[i].name;

        // Добавляем квадрат в контейнер
        container.addChild(square);
    }

    return container;
};