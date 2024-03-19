class LorD extends Phaser.Scene {
    constructor(){
        super('LorD')
        this.textIndex = 0
        this.narrativeTexts = [
            '*A YEAR LATER*',
            'Roy: "I dont know what to do anymore..."',
            'Roy: "I dont know if I can handle this pain anymore..."',
            'Lola: "Dont say that Roy..."',
            'Lola: "We will get through this together..."',
            'Lola: "roy... ROY!!!']
        
        this.narrativeChoice = {
            Live: [
                'Roy: "Im not ready to die"',
                'Lola: "Your not going to...'
            ],
            Die: [
                'Im ready to die..."',
                'Lola: "No Roy, dont say that..."'
            ]

        }
        this.choicesMade = false

}

preload() {
    //debug tools
    console.log(this.sys.game.renderer.gl.getParameter(this.sys.game.renderer.gl.MAX_TEXTURE_SIZE))

    this.load.on('filecomplete', (key, type, data) => {
        console.log(`Asset loaded: ${key}`);
        if (type === 'image') {
            const texture = this.textures.get(key);
            if (texture.source[0].width > 2048 || texture.source[0].height > 2048) {
                console.warn(`Texture ${key} might be too large: ${texture.source[0].width}x${texture.source[0].height}`);
            }
        }
    })

    this.load.on('loaderror', (file) => {
        console.error(`Error loading asset: ${file.key}`);
    })

    //load assets
    this.load.path = './assets/';
    this.load.spritesheet('ROY', '32ROY.png', {
        frameWidth: 32,
        frameHeight: 32
    })

    this.load.image('royWife', 'royWife.png')
    this.load.image('outdoorTile', 'anotherStuff.png')
    this.load.image('carpetFix', 'carpetFix.png')
    this.load.tilemapTiledJSON('LorDJSON', 'LorD.json')
}

    create(){
        this.cameras.main.fadeIn(1000,0,0,0)

        //text box
        const gameHeight = 480
        const textBoxWidth = 280
        const textBoxHeight = 100
        const textBoxX = this.cameras.main.centerX
        const textBoxY = gameHeight - textBoxHeight / 2 - 20
        this.drawTextBox(textBoxX, textBoxY, textBoxWidth, textBoxHeight)

        //add narrative text on top of text box
        // Initialize the narrative text on top of the text box but make it invisible initially
            //add narrative text on top of text box
            this.storyTextBox = this.add.text(this.cameras.main.centerX,textBoxY, this.narrativeTexts[this.textIndex],{
                font: '16px Pokemon GB',
                fill: '#000000',
                allign: 'center',
                wordWrap: {width:260}
            }).setOrigin(0.5).setDepth(100)

        //add high depth
        this.storyTextBox.setDepth(10)
        this.time.addEvent({
            delay: 4000,
            repeat: this.narrativeTexts.length - 1,
            callback: this.updateText,
            callbackScope: this
        })

        // Setting a high depth value to ensure it renders on top of the tilemap and other objects.
        this.storyTextBox.setDepth(10); this.input.on('pointerdown', () => {
        if(!this.choicesMade){
        this.updateText()
        }})

        //tilemap objects
        const map = this.add.tilemap('LorDJSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('carpetFix', 'carpetFix')

        //layers
        const houseBGLayer = map.createLayer('Background',tileset,0,0)
        const Bedroom = map.createLayer('Bedroom',tileset2,0,0)

        //collidables
        Bedroom.setCollisionByProperty({collides:true})

        //add spawns
        const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')
        const wifeSpawn = map.findObject('wifeSpawn', obj => obj.name === 'wifeSpawn')

        //add ROY
        this.ROY =this.physics.add.sprite(roySpawn.x, roySpawn.y, 'ROY' )
        this.ROY.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.ROY, Bedroom)

        //ROY animation
        this.anims.create({
            key: 'walkAnimation',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ROY'),
            start: 0,
            end: 3
        })
        this.ROY.play('walkAnimation')
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        //add wife
        this.royWife = this.physics.add.sprite(wifeSpawn.x,wifeSpawn.y, 'royWife',0)
        this.royWife.setCollideWorldBounds(true)
        this.royWife.setImmovable(true)
        this.physics.add.collider(this.ROY, this.royWife)

        //collidables
        this.physics.add.collider(this.ROY, Bedroom)
    

        //roy input
        this.cursors = this.input.keyboard.createCursorKeys()

        
    }

    update() {
        // Movement speed of ROY
        const speed = 160;
    
        // Stop any previous movement from the last frame
        this.ROY.body.setVelocity(0);
    
        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.ROY.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.ROY.body.setVelocityX(speed);
        }
    
        // Vertical movement
        if (this.cursors.up.isDown) {
            this.ROY.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.ROY.body.setVelocityY(speed);
        }
    
        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
            this.ROY.anims.play('walkAnimation', true);
            this.ROY.flipX = true; // Flip sprite to left
        } else if (this.cursors.right.isDown) {
            this.ROY.anims.play('walkAnimation', true);
            this.ROY.flipX = false; // Normal sprite orientation
        } else if (this.cursors.up.isDown || this.cursors.down.isDown) {
            this.ROY.anims.play('walkAnimation', true);
        } else {
            this.ROY.anims.stop();
            this.ROY.setFrame(0); // Stop animation and set to first frame when not moving
        }
    }

    drawTextBox(x, y, width, height) {
        this.textBox = this.add.graphics();
        this.textBox.clear();
        this.textBox.fillStyle(0xFFFFFF, 1);
        // Adjusted to correctly position the text box based on its center.
        this.textBox.fillRoundedRect(x - width / 2, y - height / 2, width, height, 5)

        this.textBox.setDepth(5)
    }
    
    updateText() {
        // Check if more narrative texts exist and display them
        if (this.textIndex < this.narrativeTexts.length) {
            this.storyTextBox.setText(this.narrativeTexts[this.textIndex])
            this.textIndex++
        } else if (!this.choicesMade) {
            // Once the initial narrative texts are done, display choices
            this.displayChoices()
        }
    }
    
    handleChoice(choice) {
        // Correct handling of choices
        switch(choice) {
            case 'Live':
                this.processChoice(this.narrativeChoice.Live, 'beatCancer')
                break
            case 'Die':
                this.processChoice(this.narrativeChoice.Die, 'endRestart')
                break
        }

    }

    processChoice(narrativeTexts, nextScene) {
        // Set the narrative texts to the chosen array
        this.narrativeTexts = narrativeTexts
    
        // Function to display the next narrative text or transition to the next scene
        const displayNextOrTransition = () => {
            if (this.textIndex < this.narrativeTexts.length) {
                // Display the next narrative text
                this.storyTextBox.setText(this.narrativeTexts[this.textIndex]).setVisible(true)
                this.textIndex++
            } else {
                // If no more texts to display, transition to the next scene
                this.sceneTransition(nextScene)
            }
        }
    
        // Reset for displaying choice texts
        this.textIndex = 0
        this.storyTextBox.setVisible(false)
    
        // Display the first text or transition if there's none
        displayNextOrTransition()
    
        // Adjust the input event listener to display next text or transition
        this.input.on('pointerdown', () => {
            displayNextOrTransition()
        })
    
        // Indicate that choices have been processed
        this.choicesMade = true
    }
    
    
    displayChoices() {
        // Hide the current narrative text
        this.storyTextBox.setVisible(false)
        
        // Choice 1: Live
        const choice1 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, 'Im not ready to die', {
            font: '16px Pokemon GB',
            fill: '#000000',
            backgroundColor: '#FFFFFF'
        }).setInteractive().setOrigin(0.5)
    
        // Choice 2: Die
        const choice2 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 20, 'Im ready to die', {
            font: '16px Pokemon GB',
            fill: '#000000',
            backgroundColor: '#FFFFFF'
        }).setInteractive().setOrigin(0.5)
    
        // Enable interactivity and add click events for each choice
        choice1.on('pointerdown', () => {
            this.handleChoice('Live')
            choice1.setVisible(false) // Hide choice1 once selected
            choice2.setVisible(false) // Hide choice2 once selected
        })
        choice2.on('pointerdown', () => {
            this.handleChoice('Die')
            choice1.setVisible(false) // Hide choice1 once selected
            choice2.setVisible(false) // Hide choice2 once selected
        })
    
        this.choicesMade = true // Indicate that choices are now displayed
    
    }
    
    
    
    sceneTransition(nextScene) {
        this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(nextScene)
            }
        })
    
    }




}