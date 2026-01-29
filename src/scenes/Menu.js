class Menu extends Phaser.Scene {
    constructor() {
        // The string we pass is used to identify this scene in Phaser.Scene
        super("menuScene");
    }

    preload() {
        // Load images and tile sprites
        // We can load assets that we plan on using in future scenes
        // because Phaser provides a persistent cache, which holds all loaded
        // assets
        this.load.image("rocket", "./assets/rocket.png");
        this.load.image("spaceship", "./assets/spaceship.png");
        this.load.image("starfield", "./assets/starfield.png");
        this.load.image("yellowStarfield", "./assets/yellowStarfield.png");
        // Load spritesheet
        this.load.spritesheet("explosion", "./assets/explosion_pfx.png", {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 7,
        })
        // Load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav')
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav')
        this.load.audio('sfx-shot', 'assets/sfx-shot.wav')
    }

    create() {
        // Animation config
        // Animations configured in any scene are available to ALL scenes and
        // spites
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 7, first: 0 }),
            frameRate: 15
        })

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: `${fontSize}px`,
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // Display menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, "ROCKET PATROL", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "Use ←→ arrows to move & (F) to fire", menuConfig).setOrigin(0.5);
        // Display high score text
        menuConfig.fixedWidth = 118;
        this.highScore = this.add.text((game.config.width / 2) - (menuConfig.fixedWidth / 2), borderUISize + borderPadding * 2, highScore, menuConfig);
        menuConfig.fixedWidth = 0;
        this.HI = this.add.text(this.highScore.x, borderUISize + borderPadding * 2, "HI:", menuConfig);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, "Press ← for Novice or → for Expert", menuConfig).setOrigin(0.5);

        // Define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // Easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000,
                timeAdj: 3000, //Time added on hit
            }
            this.sound.play("sfx-select");
            this.scene.start('playScene');
        }

        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // Hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000,
                timeAdj: 2000, //Time added on hit
            }
            this.sound.play("sfx-select");
            this.scene.start('playScene');
        }
    }
}
