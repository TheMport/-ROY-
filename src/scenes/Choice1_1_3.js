class Choice1_1_3 extends Phaser.Scene {
    constructor() {
        super('Choice1_1_3')
        this.textIndex = 0
        this.narrativeTexts = [
            '*It is now the year 2066*',
            '*Roy has been on the run for 50 years since he was 16*',
            '*Ever since he hacked into the government mainframe his life has never been the same*',
            'Roy: "On the run for 50 years, I wonder if I should have been a football player instead"',
            'Roy: "Or even a trouble maker"',
            'Roy: "Whatever its too late now but now I have to make a choice"',
            'Roy: "I dont think I can keep running for much longer"',
            'Roy: "I need to make a choice"'
        ]

        this.narrativeChoice = {
            keepRunning: [
                '',
                '*Roy sits in silence for a brief moment*',
                'Roy: F it, I\'m going to keep running'
                
            ],
            turnYourselfIn: [
                '',
                '*Roy sits in silence for a brief moment*',
                'Roy: "I should probably turn myself in..."',
                'Roy: "I\'m tired of running"',
                'Roy: "I want to go home"',
                'Roy: "NOT!!!!"',
                'Roy: "I will never turn myself in!"'
            ]
        }
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
        this.load.image('outdoorTile', 'anotherStuff.png')
        this.load.image('indoorTiles', 'indTiles.png')
        this.load.tilemapTiledJSON('messWithComputersJSON', 'messWithComputers.json')
    }

    create() {
        //create text box
        const textBoxY = this.cameras.main.centerY
        this.drawTextBox(this.cameras.main.centerX, textBoxY, 280, 100)

        // Add narrative text on top of the text box graphics.
        this.storyTextBox = this.add.text(this.cameras.main.centerX, textBoxY, this.narrativeTexts[this.textIndex], {
            font: '16px Pokemon GB',
            fill: '#000000',
            align: 'center', // Ensure text alignment is centered
            wordWrap: { width: 260 } // Slightly less than the text box width to ensure padding
        }).setOrigin(0.5)

        // Setting a high depth value to ensure it renders on top of the tilemap and other objects.
        this.storyTextBox.setDepth(10); this.input.on('pointerdown', () => {
            if(!this.choicesMade){
            this.updateText()
        }})

        //tilemap objects
        const map = this.add.tilemap('messWithComputersJSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('insideStuff', 'indoorTiles')

        const houseBgLayer = map.createLayer('Background', tileset, 0, 0)

        //add Spawns
        const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')
        this.ROY = this.physics.add.sprite(roySpawn.x,roySpawn.y, 'ROY', 0)

        //create ROY
        this.ROY = this.physics.add.sprite(0, 0, 'ROY', 0)
        console.log(this.ROY.x, this.ROY.y)
        this.ROY.body.setCollideWorldBounds(true)
    
        //ROY animation
        this.anims.create({
            key: 'walkAnimation',
            frames: this.anims.generateFrameNumbers('ROY', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
        this.ROY.play('walkAnimation')
    
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    
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
        this.textBox.fillRoundedRect(x - width / 2, y - height / 2, width, height, 5)
    }

    updateText() {
        if (this.textIndex < this.narrativeTexts.length) {
            this.storyTextBox.setText(this.narrativeTexts[this.textIndex])
            this.textIndex++
        } else if (!this.choicesMade) {
            this.displayChoices()
        }
    }

    handleChoice(choice) {
        switch(choice) {
            case 'keepRunning':
                this.processChoice(this.narrativeChoice.keepRunning, 'hackerAndEntreEnding')
                break
            case 'turnYourselfIn':
                this.processChoice(this.narrativeChoice.turnYourselfIn, 'hackerAndEntreEnding')
                break

        }
    }

    processChoice(narrativeTexts, nextScene) {
        this.narrativeText = narrativeTexts

        const displayNextOrTransition = () => {
            if (this.textIndex < this.narrativeText.length) {
                this.storyTextBox.setText(this.narrativeText[this.textIndex]).setVisible(true)
                this.textIndex++
            } else {
                this.sceneTransition(nextScene)
            }
        }

        //reset for displaying choice texts
        this.textIndex = 0
        this.storyTextBox.setVisible(false)

        //display the first text in the sequence
        displayNextOrTransition()

        //Adjust the input event listener to display next text or transition to the next scene
        this.input.on('pointerdown', () => {
            displayNextOrTransition()
        
        })
            //indicate that choices have been processed
            this.choicesMade = true
        
    }


    displayChoices() {
        // Hide the current narrative text
        this.storyTextBox.setVisible(false)
        
        // Choice 1: keep runnning
        const choice1 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, 'Keep Running', {
            font: '16px Pokemon GB',
            fill: '#000000',
            backgroundColor: '#FFFFFF'
        }).setInteractive().setOrigin(0.5)
    
        // Choice 2: Turn yourself in
        const choice2 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 20, 'Turn Yourself In', {
            font: '16px Pokemon GB',
            fill: '#000000',
            backgroundColor: '#FFFFFF'
        }).setInteractive().setOrigin(0.5)

    
        // Enable interactivity and add click events for each choice
        choice1.on('pointerdown', () => {
            this.handleChoice('keepRunning')
            choice1.setVisible(false) // Hide choice1 once selected
            choice2.setVisible(false) // Hide choice2 once selected
        })
        choice2.on('pointerdown', () => {
            this.handleChoice('turnYourselfIn')
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
