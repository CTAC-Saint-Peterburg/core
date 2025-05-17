import { Container, Graphics } from "pixi.js";

export const CreateControlCircle = (x,y, radius) =>  {
    const circleContainer = new Container();
    let circle = new Graphics().circle(0, 0, radius).stroke({ color: 'red', pixelLine: true });
    circle.x = x;
    circle.y = y;
    let innerCircle = new Graphics().circle(0, 0, 40).fill("grey");
    innerCircle.label = 'grey';
    innerCircle.x = circle.x;
    innerCircle.y = circle.y



    circleContainer.addChild(circle, innerCircle);


    return circleContainer;
}