// Purpose: Main menu scene for the game (this is what the player is met with as soon as he loads into the game after seeing 
// the loading bar
class mainMenu extends Phaser.Scene {
    constructor() { 
        super('mainMenu')
    }

    preload() {
        this.load.image('mainMenuCover', 'assets/mainMenuCover.png');
    }
    create() { 
        this.cameras.main.fadeIn(2000, 0, 0, 0);
        this.mainMenuCover = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'mainMenuCover').setOrigin(0.5, 0.5)

    }

    update() {
        
        this.input.on('pointerdown', function() {
            this.scene.start('IntroScene')
        }, this)


    }

}