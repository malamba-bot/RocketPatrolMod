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
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1000);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1000);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1000);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1000);

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
        // Game over flag
        this.gameOver = false;
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: `${fontSize}px`,
            backgroundColor: Colors.PINK,
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 50
        }
        // PLAY MUSIC
        this.sound.play("space-song", {volume: 0.5});
        // TIMERS ----------------------------------------------------------
        /* Start a timer that will trigger a callback function which will end
            * the game */
            this.timer = this.time.addEvent({
                delay: game.settings.gameTimer,
                callback: () => {this.endGame(textConfig)},
                loop: false,
            });
        // Timer to reset the background color of time remaining
        this.timeColorChange = this.time.addEvent({
            delay: 500,  
            callback: () => {
                // Pause this timer (which has reset)
                this.timeColorChange.paused = true;
                this.timeLeft.style.backgroundColor = Colors.PINK;
            },
            paused: true,
            loop: true
        });
        // Init score
        this.p1Score = 0;
// TEXT --------------------------------------------------------------------

        // Add timer text to center
        this.timeLeft = this.add.text(game.config.width / 2, borderUISize + borderPadding * 2, game.settings.gameTimer, textConfig).setOrigin(0.5, 0);
        // Changed fixed width and background color for score
        textConfig.backgroundColor = Colors.ORANGE; 
        textConfig.fixedWidth = 100; 
        
        // Current and high score text 
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, textConfig);
        this.highScore = this.add.text(game.config.width - (borderUISize + borderPadding + textConfig.fixedWidth), borderUISize + borderPadding * 2, highScore, textConfig);
        textConfig.fixedWidth = 0;
        this.HI = this.add.text(this.highScore.x - fontSize, borderUISize + borderPadding * 2, "HI:", textConfig);
        // Create particle EMITTER for the ship explosion
        this.explosion = this.add.particles(0, 0, 'explosion', {
            anim: 'explode',
            lifespan: 533,
            scale:{min: 0.3, max: 1},
            emitZone:
            {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, 0, 50, 50),
            },            
            emitting: false
        });
        // Rocket and debris collision
        this.debrisGroup = this.add.group();
        this.physics.add.collider(this.debrisGroup, this.p1Rocket, (debris, rocket) => {
            this.explosion.emitParticle(8, rocket.x, rocket.y);
            this.sound.play("sfx-explosion");
            debris.destroy();
            rocket.destroy();
            this.endGame(textConfig);
        })
    }

    update() {
        // Update timer text
        this.timeLeft.text = Math.ceil(this.timer.getRemainingSeconds());
        // Check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.sound.stopByKey('space-song');
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.stopByKey('space-song');
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
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // Temp hide ship
        ship.alpha = 0;
        // Stop ship
        ship.moving = false;
        // Create explosion at ship's position
        /* emitParticle(x....) emits x number of particles specified by the
            * emitter it is called on rather than switching the emitter on */
        this.explosion.emitParticle(15, ship.x, ship.y);
            // Create two new debris pieces
        this.time.delayedCall(300, () => {
            new Debris(this, ship.x, ship.y);
            new Debris(this, ship.x, ship.y);
            ship.reset();
            ship.alpha = 1;
            ship.moving = true;
        })
        // DEBRIS -------------------------------------
        //---------------------------------------------
        // Add to score and timer, and update text
        this.p1Score += ship.points;
        this.timer.delay += game.settings.timeAdj;
        this.scoreLeft.text = this.p1Score;
        // Update highscore if needed
        if (this.p1Score > highScore) {
            highScore = this.p1Score;
            this.highScore.text = highScore;    
        }

        // Play sound
        this.sound.play("sfx-explosion");

        // Change timer backgroundColor
        this.timeLeft.style.backgroundColor = Colors.BLUE;
        this.timeColorChange.paused = false;
    }

    endGame(textConfig) {
        this.add.text(game.config.width/2, game.config.height/2 + 64, "Press (R) to Restart or ← for Menu", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", textConfig).setOrigin(0.5);
        this.gameOver = true;
    }
}
