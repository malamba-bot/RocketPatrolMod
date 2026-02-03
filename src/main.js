/*
    * Max Kinet
    * Rocket Patrol: Fallen Ships
    * 15 hours
    * Mods:
    *   1. HIGH SCORE - 1 point
    *   2. Background music - 1 point
    *   3. Parallax scrolling - 3 points
    *   4. Scoring mechanism that adds time on successful hits and substracts time on misses - 5 points
    *   5. Particle explosion when ships are hit (self-made animation btw) - 5 points
    *   6. Personal Mod: Ships produce deadly debris when they are hit - 5 points
    *       Information + implementation details
    *           The game ends if the rocket is hit by debris. This was implemented using arcade physics.
    *           The debris are produced on hit and added to a group, which is checked against the rocket's
    *           position using a collider. 
    *   TOTAL: 20 points
    */

let config = {
    // Type of graphics renderer used
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
    },
    // Add scenes using the names of the class files
    scene: [Menu, Play],
}

let game = new Phaser.Game(config);

// Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// Reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT;

// Define some color values for text
let Colors = {
    ORANGE: '#F3B141',
    PINK: '#FACADE',
    BLUE: '#3479D3',
    RED: '#EA4B4B',
}

//Globals
let highScore = 0;
let fontSize = 28;
