class Debris extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'rocket');
        this.scene = scene;
        scene.add.existing(this);
    }

}
