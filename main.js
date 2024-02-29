// Name: Miguel Comonfort 
// Date: February 26, 2024
//Game: "Roy"
//Purpose: game config file

// keep me honest
'use strict'

// define and configure main Phaser game object
let config = {
    parent: 'myGame',
    type: Phaser.AUTO,
    height: 500,
    width: 500,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    zoom: 2,
    scene: [Town]
}


// define game
const game = new Phaser.Game(config)

// define globals
