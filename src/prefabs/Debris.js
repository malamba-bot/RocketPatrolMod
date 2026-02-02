class Debris extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ship');
        this.scene = scene;
        // Add to the physics system
        scene.physics.add.existing(this);
        // Eject the debris in a random direction at a random velocity
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.setVelocityX(Phaser.Math.Between(75, 200) * this.direction);
        this.setGravityY(200);
    }

}
