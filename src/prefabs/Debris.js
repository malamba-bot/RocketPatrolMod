class Debris extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Pick a random texture for the debris
        const textures = ['spaceship_debris_0', 'spaceship_debris_1', 'spaceship_debris_2'];
        const randTexture = Phaser.Utils.Array.GetRandom(textures);
        super(scene, x, y, randTexture);
        this.scene = scene;
        // Add to the physics system
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // Add debris to collider group
        scene.debrisGroup.add(this);
        // Eject the debris in a random direction at a random velocity
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.setVelocityX(Phaser.Math.Between(0, 100) * this.direction);
        this.setGravityY(200);

    }
}

