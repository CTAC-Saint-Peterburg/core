import { Graphics, Container } from "pixi.js"

export const createMapBorders = (ltop, rtop, lbottom, rbottom) => {
    const borders = new Container();
    const borderLeft = new Graphics().moveTo(ltop,rbottom).lineTo(ltop, lbottom).stroke({ width: 10, color: 'black', alpha: 0.8 });
    const borderTop = new Graphics().moveTo(ltop,rbottom).lineTo(rtop, rbottom).stroke({ width: 10, color: 'black', alpha: 0.8 });
    const borderRight = new Graphics().moveTo(rtop,rbottom).lineTo(rtop, lbottom).stroke({ width: 10, color: 'black', alpha: 0.8 });
    const borderBottom = new Graphics().moveTo(ltop,lbottom).lineTo(rtop, lbottom).stroke({ width: 10, color: 'black', alpha: 0.8 });
    borders.addChild(borderLeft, borderTop, borderRight, borderBottom);
    return borders;
}
