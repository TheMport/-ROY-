// Purpose: Main menu scene for the game (this is what the player is met with as soon as he loads into the game after seeing 
// the loading bar
class mainMenu extends Phaser.Scene {
    constructor() { 
        super('mainMenu')
    }

    create() { 

        //Add the main menu backround title and instructions
        // TODO: Add code to add main menu background title and instructions
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Main Menu', { font: '32px Pokemon GB', fill: '#fff' }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Press Space to Play', { font: '24px Pokemon GB', fill: '#fff' }).setOrigin(0.5);

    }

    update() {
        
        if(this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 1000)){
            this.scene.start('IntroScene')
        }


    }

}