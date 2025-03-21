import { Graphics, Container } from "pixi.js"

export const createMapBorders = (ltop, rtop, lbottom, rbottom) => {
    const borders = new Container();
    const points = [
        { x: ltop, y: rbottom, toX: ltop, toY: lbottom }, // Левая граница
        { x: ltop, y: rbottom, toX: rtop, toY: rbottom }, // Верхняя граница
        { x: rtop, y: rbottom, toX: rtop, toY: lbottom }, // Правая граница
        { x: ltop, y: lbottom, toX: rtop, toY: lbottom }  // Нижняя граница
    ];

    points.forEach(point => {
        const border = new Graphics()
            .moveTo(point.x, point.y)
            .lineTo(point.toX, point.toY)
            .stroke({ width: 10, color: 'black', alpha: 0.8 });
        borders.addChild(border);
    });

    return borders;
};
