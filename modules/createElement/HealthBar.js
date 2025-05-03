import { Graphics, Container } from "pixi.js";

export const CreateHealthBar = (x, y, health) => {
    const healthBarContainer = new Container();
    healthBarContainer.position.set(x, y);

    // Background (black rectangle)
    const background = new Graphics();
    background.rect(0, 0, 104, 14);
    background.fill(0x000000);
    healthBarContainer.addChild(background);

    // Health bar (red rectangle)
    const healthBar = new Graphics();
    healthBar.rect(2, 2, 100 * (health / 100), 10);
    healthBar.fill(0xFF0000);
    healthBar.name = "healthBar";
    healthBarContainer.addChild(healthBar);

    // Health update method
    healthBarContainer.updateHealth = (newHealth) => {
        const healthBar = healthBarContainer.getChildByName("healthBar");
        healthBar.clear();
        healthBar.rect(2, 2, 100 * (newHealth / 100), 10);
        healthBar.fill(0xFF0000);
    };

    return healthBarContainer;
};