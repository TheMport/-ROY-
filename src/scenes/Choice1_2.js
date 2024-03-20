class Choice1_2 extends Phaser.Scene {
    constructor() {
        super('Choice1_2')
        this.textIndex = 0
        this.narrativeTexts = [
            '*LALALALALAA*',
            '*Roy is playing in the school courtyard*',
            '[You are now in control of Roy]',
            '[Use the arrow keys to move Roy]',
            'Roy: "What a nice day to be playing outside"',
            'Roy: " Now that I am in the second grade I need to figure out my life"',
            'Roy: "Hmmm, I wonder what I should aspire for?"'
        ]

        this.narrativeChoice = {
            footballStar: [
                //goes to Choice1_1_1
                '',
                'Roy: I wanna be a football player!',
                'Roy: "I\'m going to start training now!"'
            ],
            troubleMaker: [
                //goes to Choice1and2troubleMakerEnding
                '',
                'Roy: I wanna be a trouble maker!',
                'Roy: "I don\'t know what opioids are but I want to try them!"'
            ],
            messWithComputers: [
                //goes to Choice1_1_3
                '',
                'Roy: I wanna mess with computers!',
                'Roy: "I want to be a hacker!"'
            ]
        }
        this.choicesMade = false
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
        this.load.tilemapTiledJSON('part1JSON', 'part1.json')
    }

    create() {
        //create text box
        this.cameras.main.fadeIn(1000,0,0,0)


        const gameHeight = 480 
        const textBoxWidth = 280
        const textBoxHeight = 100
        const textBoxX = this.cameras.main.centerX 
        const textBoxY = gameHeight - textBoxHeight / 2 - 20 // above the bottom edge

        this.drawTextBox(this.cameras.main.centerX, textBoxY, 280, 100)

        this.storyTextBox = this.add.text(this.cameras.main.centerX, textBoxY, this.narrativeTexts[this.textIndex], {
            font: '16px Pokemon GB',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: 260 }
        }).setOrigin(0.5).setDepth(10);

        // Advance on click
        this.input.on('pointerdown', () => {
            if (!this.choicesMade) {
                this.updateText();
            }
        });

        //tilemap objects
        const map = this.add.tilemap('part1JSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('insideStuff', 'indoorTiles')

        const houseBgLayer = map.createLayer('Background', tileset, 0, 0)

        //add Spawns
        const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')
        this.ROY = this.physics.add.sprite(roySpawn.x,roySpawn.y, 'ROY', 0)

        //create ROY
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
        if (this.textBox) {
            this.textBox.clear();
        } else {
            this.textBox = this.add.graphics()
        }
        this.textBox.fillStyle(0xFFFFFF, 1);
        this.textBox.fillRoundedRect(x - width / 2, y - height / 2, width, height, 5);
        this.textBox.setDepth(5);
    }

    updateText() {
        // Updated to match beginStory's logic for handling narrative progression and choices
        if (this.textIndex < this.narrativeTexts.length) {
            this.storyTextBox.setText(this.narrativeTexts[this.textIndex]);
            this.textIndex++;
        } else if (!this.choicesMade) {
            this.displayChoices();
        }
    }

    handleChoice(choice) {
        switch(choice) {
            case 'footballStar':
                this.processChoice(this.narrativeChoice.footballStar, 'Choice1_1_1')
                break
            case 'troubleMaker':
                this.processChoice(this.narrativeChoice.troubleMaker, 'Choice1and2troubleMakerEnding')
                break
            case 'messWithComputers':
                this.processChoice(this.narrativeChoice.messWithComputers, 'Choice1_1_3')
                break
        }
    }

    processChoice(narrativeTexts, nextScene) {
        this.narrativeText = narrativeTexts

        const displayNextOrTransition = () => {
            if (this.textIndex < this.narrativeText.length) {
                this.storyTextBox.setText(this.narrativeText[this.textIndex]).setVisible(true)
                this.textBox.setVisible(true)
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
        this.textBox.setVisible(false)
        
        // Choice 1: Football Star
        const choice1 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, 'Football Star', {
            font: '16px Pokemon GB',
            fill: '#000000',
            backgroundColor: '#FFFFFF'
        }).setInteractive().setOrigin(0.5)
    
        // Choice 2: Trouble Maker
        const choice2 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 20, 'Join the Darkside', {
            font: '16px Pokemon GB',
            fill: '#000000',
            backgroundColor: '#FFFFFF'
        }).setInteractive().setOrigin(0.5)

        const choice3 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 60, 'Hacker man', {
            font: '16px Pokemon GB',
            fill: '#000000',
            backgroundColor: '#FFFFFF'
        }).setInteractive().setOrigin(0.5)
    
        // Enable interactivity and add click events for each choice
        choice1.on('pointerdown', () => {
            this.handleChoice('footballStar')
            choice1.setVisible(false) // Hide choice1 once selected
            choice2.setVisible(false) // Hide choice2 once selected
            choice3.setVisible(false)
        })
        choice2.on('pointerdown', () => {
            this.handleChoice('troubleMaker')
            choice1.setVisible(false) // Hide choice1 once selected
            choice2.setVisible(false) // Hide choice2 once selected
            choice3.setVisible(false)
        })
        choice3.on('pointerdown', () => {
            this.handleChoice('messWithComputers')
            choice1.setVisible(false)
            choice2.setVisible(false)
            choice3.setVisible(false)
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
