class Play extends Phaser.Scene {
    constructor() {
        // The string we pass is used to identify this scene in Phaser.Scene
        super("playScene");
    }

    create() {
        // Add starfield tile sprites
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.yellowStarfield = this.add.tileSprite(0, 0, 640, 480, 'yellowStarfield').setOrigin(0, 0);
        // Green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // White borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // Add p1 rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // Add 3 spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        // Define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // Init score
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

        // 60-sec play clock
        scoreConfig.fixedWidth = 0;
        /* Will delayedCall will trigger an event. The first parameter
        *  specifies how long will pass before the event is triggered, and the
        *  second is the callback function that will be run after the event is
        *  triggered. */

        // Game over flag
        this.gameOver = false;

        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, "Press (R) to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // Check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // Scroll backgrounds
        this.starfield.tilePositionX -= 2;
        this.yellowStarfield.tilePositionX -= 4;
        if(!this.gameOver) {
            // Run p1Rocket's update loop
            this.p1Rocket.update();
            // Run spaceships' update loops
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // Check for collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // Simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // Temp hide ship
        ship.alpha = 0;
        // Create explosion at ship's position
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.anims.play("explode");
        /* the .on method listens for events. The first parameter is the
            * event being listened for, and the second is the callback
            * function to be run when the event is heard. In this case, the
            * animation manager will trigger the animationcomplete event.*/
        boom.on("animationcomplete", () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        })
        // Add to score and update text
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play("sfx-explosion");
    }
}
