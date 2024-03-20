// Name: Miguel Comonfort 
// Date: February 26, 2024
//Game: "Roy"
//Purpose: game config file

// keep me honest
'use strict'

// define and configure main Phaser game object
let config = {
    type: Phaser.WEBGL,
    height: 480,
    width: 480,
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
    scene: [Load,mainMenu,IntroScene,beginStory,Choice1_1,Choice1_1_1,footballFailure,footballStar,Choice1_2,Choice1and2troubleMakerEnding,Choice1_1_3,hackerAndEntreEnding,adulthood1,carpetStore,doctorOffice,LorD,beatCancer,carpetStore2,endRestart,gameOver]
}


// define game
const game = new Phaser.Game(config)

// define globals
