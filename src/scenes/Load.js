//Purpose: dedicated for loading in sprites,backrounds, and mainMenu

class Load extends Phaser.Scene {
    constructor() { 
        super('Load')
    }

    preload(){ 

        //loading bar
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })
        

        this.load.on('progress', (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50)
        })

        //mainMenu title,controls, and backround

        
        //these backrounds will be changed as the player progresses through the game and reaches a higher level in the game


        //music and sound effects

        //these images will be the "Player" sprites (NEED TO ADD JUMP SPRITE ASAP) 
        this.load.spritesheet('ROY', 'assets/ROYsprite.png',{
            frameWidth:32,
            frameWidth:32
        })


    }

    create() { 
        this.scene.start('mainMenu')
        
    }


}