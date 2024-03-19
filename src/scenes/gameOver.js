class gameOver extends Phaser.Scene {
    constructor() {
        super('gameOver')
    }

    preload() {
        this.load.image('GOS', 'assets/gameOverScreen.png')
    }

    create() {
        this.cameras.main.fadeIn(2000, 0, 0, 0)
        this.GOS = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'GOS').setOrigin(0.5, 0.5)


        // Create a key input listener
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        // Check if the 'R' key is pressed and then restart the game
        this.restartKey.on('down', () => {
            // Here you can reset any necessary global state before restarting

            // Start the mainMenu scene
            this.scene.start('mainMenu')
        })
    }
}
