// Purpose: Main menu scene for the game (this is what the player is met with as soon as he loads into the game after seeing 
// the loading bar
class mainMenu extends Phaser.Scene {
    constructor() { 
        super('mainMenu')
    }

    create() { 

        //Add the main menu backround title and instructions
        // TODO: Add code to add main menu background title and instructions
        this.add.text(400, 300, 'Main Menu', { fontSize: '32px', fill: '#fff' });
        this.add.text(400, 350, 'Press Space to Play', { fontSize: '24px', fill: '#fff' });

    }

    update() {
        
        if(this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 1000)){
            this.scene.start('Town')
        }


    }

}