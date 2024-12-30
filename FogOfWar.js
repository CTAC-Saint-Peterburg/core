import { BlurFilter, Graphics, Rectangle, Sprite, SCALE_MODES } from 'pixi.js';

export const CreateFogOfWar = (x,y, renderer) => {

     const radius = 900;

     const blurSize = 32;

     const bounds = new Rectangle(0, 0, x, y);
     const circle = new Graphics().circle(bounds.width / 2, bounds.height / 2, radius).fill({ color: 0xff0000 });
     circle.filters = [new BlurFilter(blurSize)];
     const texture2 = renderer.generateTexture({
             target: circle,
             style: { scaleMode: SCALE_MODES.NEAREST },
             resolution: 1,
             frame: bounds,
         });
    const focus = new Sprite(texture2);

    return focus;
} 