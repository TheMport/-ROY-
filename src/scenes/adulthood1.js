class adulthood1 extends Phaser.Scene {
    constructor() {
        super('adulthood1' )
        this.textIndex = 0
        this.clickToC =[
            '*Click wife when ready*'
        ]
        this.narrativeTexts = [
            '*Your life has just gone downhill since*',
            '*Welcome to reality*',
            'Lola: "I think its time to be realistic."',
            'Lola: "Have you talked to my parents about the carpet store?',
            '*Roy sits there in despair*',
            'Lola: "Roy?"'

        ]
        this.dialogueStarted = false

    }
    preload() {
        //debug tools
        console.log(this.sys.game.renderer.gl.getParameter(this.sys.game.renderer.gl.MAX_TEXTURE_SIZE))

        this.load.on('filecomplete', (key, type, data) => {
            console.log(`Asset loaded: ${key}`)
            if (type === 'image') {
                const texture = this.textures.get(key)
                if (texture.source[0].width > 2048 || texture.source[0].height > 2048) {
                    console.warn(`Texture ${key} might be too large: ${texture.source[0].width}x${texture.source[0].height}`)
                }
            }
        })

        this.load.on('loaderror', (file) => {
            console.error(`Error loading asset: ${file.key}`)
        })

        //load assets
        this.load.path = './assets/'
        this.load.spritesheet('ROY', '32ROY.png', {
            frameWidth: 32,
            frameHeight: 32
        })

        this.load.image('royWife', 'royWife.png')
        this.load.image('outdoorTile', 'anotherStuff.png')
        this.load.image('indoorTiles', 'realIndoor.png')
        this.load.tilemapTiledJSON('adultHood1JSON', 'footballAfterMath.json')
}
    create() {

        //text box
        const gameHeight = 480
        const textBoxWidth = 280
        const textBoxHeight = 100
        const textBoxX = this.cameras.main.centerX
        const textBoxY = gameHeight - textBoxHeight / 2 - 20
        this.drawTextBox(textBoxX, textBoxY, textBoxWidth, textBoxHeight)

        //add narrative text on top of text box
    // Initialize the narrative text on top of the text box but make it invisible initially
        this.storyTextBox = this.add.text(textBoxX, textBoxY, this.clickToC[0], {
            font: '16px Pokemon GB',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: 260 }
        }).setOrigin(0.5).setDepth(100)

        //add high depth
        this.storyTextBox.setDepth(10)
        this.time.addEvent({
            delay: 4000,
            repeat: this.narrativeTexts.length - 1,
            callback: this.updateText,
            callbackScope: this
        })

        //tilemap objects
        const map = this.add.tilemap('adultHood1JSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('realIndoor', 'indoorTiles')

        //layers
        const houseBGLayer = map.createLayer('Background', tileset,0,0)
        const kitchenStuff = map.createLayer('kitchenStuff', tileset2,0,0)
        const moreStuff = map.createLayer('moreStuff', tileset2,0,34)

        //collidables
        kitchenStuff.setCollisionByProperty({collides:true})
        moreStuff.setCollisionByProperty({collides:true})


        //add spawns
        const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')
        const wifeSpawn = map.findObject('wifeSpawn', obj => obj.name === 'wifeSpawn')
        //const sonSpawn = map.findObject('sonSpawn', obj => obj.name === 'sonSpawn')

        //add wife & kid
        this.royWife = this.add.sprite(wifeSpawn.x, wifeSpawn.y, 'royWife').setInteractive()

        //add Roy
        this.ROY = this.physics.add.sprite(roySpawn.x, roySpawn.y, 'ROY')
        this.ROY.setCollideWorldBounds(true)
        this.physics.add.collider(this.ROY, kitchenStuff)
        this.physics.add.collider(this.ROY, moreStuff)
        this.physics.add.collider(this.ROY, this.royWife)

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('ROY', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
    })
    this.ROY.play('walk')
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)


    // Instead of creating a new text element for clickPrompt, we will use storyTextBox to display the initial message
    // and make it visible here
    // Show the initial clickToC text and hide after 3000ms
    this.storyTextBox.setText(this.clickToC[0])
    this.textBox.visible = true // Make sure this line correctly sets the visibility to 'visible' not 'visable'
    this.storyTextBox.visible = true

    // Hide both the text and the box after 3000ms
    this.time.delayedCall(3000, () => {
        this.storyTextBox.visible = false
        this.textBox.visible = false
    }, [], this)


    // Add click event listener for royWife to start the dialogue
    this.royWife.on('pointerdown', () => {
        if (!this.dialogueStarted) {
            this.dialogueStarted = true
            this.storyTextBox.visible = true // Make the text box visible again for dialogue
            this.textBox.visible = true // Ensure the graphic text box is visible for dialogue

            // Start the dialogue from the first narrative text
            this.textIndex = 0 // Reset the textIndex to 0 to start from the first narrative text
            this.updateText() // Call updateText to show the first narrative text immediately

            // Set up a repeating timed event to cycle through narrative texts
            this.time.addEvent({
                delay: 3000,
                repeat: this.narrativeTexts.length - 1,
                callback: this.updateText,
                callbackScope: this
            })
        }
    })

    //ROY's input
    this.cursors = this.input.keyboard.createCursorKeys()

}

update() {
    // Movement speed of ROY
    const speed = 160

    // Stop any previous movement from the last frame
    this.ROY.body.setVelocity(0)

    // Horizontal movement
    if (this.cursors.left.isDown) {
        this.ROY.body.setVelocityX(-speed)
    } else if (this.cursors.right.isDown) {
        this.ROY.body.setVelocityX(speed)
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
        this.ROY.body.setVelocityY(-speed)
    } else if (this.cursors.down.isDown) {
        this.ROY.body.setVelocityY(speed)
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
        this.ROY.anims.play('walkAnimation', true)
        this.ROY.flipX = true // Flip sprite to left
    } else if (this.cursors.right.isDown) {
        this.ROY.anims.play('walkAnimation', true)
        this.ROY.flipX = false // Normal sprite orientation
    } else if (this.cursors.up.isDown || this.cursors.down.isDown) {
        this.ROY.anims.play('walkAnimation', true)
    } else {
        this.ROY.anims.stop()
        this.ROY.setFrame(0) // Stop animation and set to first frame when not moving
    }
}

    drawTextBox(x, y, width, height) {
        this.textBox = this.add.graphics()
        this.textBox.clear()
        this.textBox.fillStyle(0xFFFFFF, 1)
        // Adjusted to correctly position the text box based on its center.
        this.textBox.fillRoundedRect(x - width / 2, y - height / 2, width, height, 5)

        this.textBox.setDepth(5)
    }

    updateText() {
        if (this.dialogueStarted) {
            this.storyTextBox.setText(this.narrativeTexts[this.textIndex++])

            if (this.textIndex >= this.narrativeTexts.length) {
                this.sceneTransition() // Assuming this method transitions to the next scene
            }
        }
    }

    sceneTransition() {
        this.scene.start('carpetStore1') // Transition to the next scene
    }

}
