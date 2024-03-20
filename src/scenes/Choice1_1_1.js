class Choice1_1_1 extends Phaser.Scene {
    constructor() {
        super('Choice1_1_1')
        this.textIndex = 0
        this.gotBall = false
        this.touchDirt = false
        this.displayedDirtNarrative = false
        this.footballDGettingBall = false
        this.royKnockedOut = false
        this.narrativeTriggered = false
        this.footballDMovedPastBounds = false
        this.narrativeTexts = [
            '*You suddenly wake up*',
            'Caster: AND THERES A FUMBLE ON THE PLAY',
            'Caster: "WHO WILL GET THE BALL"'
        ]

        this.narrativeChoice = {
            getTheBall: [
                '',
                'Caster: "Roy gets the ball and he is running for the end zone"',
                'Caster: "He is at the 50, the 40, the 30, the 20, the 10"',
                'Caster: "TOUCHDOWN ROY THE ROCKET!!!!"'
            ],
            dontGetTheBall: [
                '',
                'Caster: "Roy does not get the ball"',
                'Caster: "THE OTHER TEAM WINS"',
                'Caster: "WHAT A SCREW UP"',
                'Caster: "That kids career is definitely over"'
            ],
            ballFailure: [
                '',
                'Caster: "ROY GOT THE BALL BUT IMMEDIATLY TACKLED"',
                'Caster: "WHAT A FAILURE"',
                'Caster: "ROYS TEAM LOSES'
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
                this.load.spritesheet('footballD', 'footballD.png', {
                    frameWidth: 32,
                    frameHeight: 32
                })
                this.load.image('football', 'football.png')
                this.load.image('outdoorTile', 'anotherStuff.png')
                this.load.image('indoorTiles', 'indTiles.png')
                this.load.tilemapTiledJSON('footballFieldJSON', 'footballField.json')
    }

    create() {
        //create text box
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        const gameHeight = 480 
        const textBoxWidth = 280
        const textBoxHeight = 100
        const textBoxX = this.cameras.main.centerX 
        const textBoxY = gameHeight - textBoxHeight / 2 - 20 // above the bottom edge
        
        // Consistent text box creation as in Choice1_1
        this.drawTextBox(this.cameras.main.centerX, this.cameras.main.centerY - 100, 280, 100);

        // Adding narrative text on top of the text box, making sure settings are consistent
        this.storyTextBox = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, this.narrativeTexts[this.textIndex], {
            font: '16px Pokemon GB',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: 260 }
        }).setOrigin(0.5);

        this.storyTextBox.setDepth(10); 

        // Modified to ensure consistency in handling user interactions
        this.input.on('pointerdown', () => {
            this.updateText();
        })

        //tilemap objects
        const map = this.add.tilemap('footballFieldJSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('insideStuff', 'indoorTiles')

        const dirtArea = map.findObject('dirtArea', obj => obj.name === 'dirtArea')
        const dirt = map.createLayer('dirt',tileset,0,0)
        const houseBgLayer = map.createLayer('Background', tileset, 0, 0)

        //add Spawns
        const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')
        const footballD = map.findObject('footballD', obj => obj.name === 'footballD')

        const footballSpawn = map.findObject('footballSpawn', obj => obj.name === 'footballSpawn')
        this.football = this.physics.add.sprite(footballSpawn.x,footballSpawn.y, 'football', 0)

        //create ROY
        this.ROY = this.physics.add.sprite(roySpawn.x,roySpawn.y, 'ROY', 0)
        console.log(this.ROY.x, this.ROY.y)
        this.ROY.body.setCollideWorldBounds(true)

        //create football defense
        this.footballD = this.physics.add.sprite(footballD.x,footballD.y, 'footballD', 0)
        //conosole.log(this.footballD.x, this.footballD.y)
        this.footballD.body.setCollideWorldBounds(false)
    
        //ROY animation
        //FIX
        this.anims.create({
            key: 'walkAnimation',
            frames: this.anims.generateFrameNumbers('ROY', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
        this.ROY.play('walkAnimation')

        //football defense animation
        this.anims.create({
            key: 'footballDAnimation',
            frames: this.anims.generateFrameNumbers('footballD', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
        this.footballD.play('footballDAnimation')
    
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    
        //ROYs input
        this.cursors = this.input.keyboard.createCursorKeys()

        // Override the pointerdown event to start moving footballD towards the football after the narrative texts
        this.input.on('pointerdown', () => {
            if (!this.gotBall) {
                if (this.textIndex < this.narrativeTexts.length) {
                    this.updateText()
                } else {
                    // Once narrative texts are done make footballD move towards the football
                    this.footballDGettingBall = true
                }
            }
        })

        this.physics.add.overlap(this.ROY, this.football, () => {
            if (!this.narrativeTriggered) { // Check if the narrative has already been triggered
                this.football.setVisible(false) // Hide the football
                this.gotBall = true // Ball as picked up
                this.pickUpBall() // Triggers the narrative change upon picking up the ball
                this.narrativeTriggered = true
            }
        }, null, this)

        // Adjusted footballD behavior after ROY gets the ball
        this.physics.add.overlap(this.footballD, this.football, () => {
            if (!this.gotBall && !this.narrativeTriggered) {
                this.narrativeTexts = this.narrativeChoice.dontGetTheBall
                this.textIndex = 0
                this.displayAllNarrativeTexts()
                this.football.setVisible(false)
                //this.footballD.setVisible(false)
                this.narrativeTriggered = true // Ensure narrative is only displayed once
            }
        }, null, this)

        if (!this.footballDMovedPastBounds && this.gotBall) {
            // Allow footballD to move past bounds if not done already
            this.footballD.body.setCollideWorldBounds(false)
            this.physics.moveTo(this.footballD, this.football.x + 1000, this.football.y) // Move towards an off-screen target
            this.footballDMovedPastBounds = true // Ensure it happens only once
        }


        // add a camera that follows ROY?
    }

    update() { 

        //comeback to this???

        if (this.royKnockedOut || this.touchDirt) {
            return // Skip the rest of the update method if ROY is knocked out or has touched the dirt
        }
        // Movement speed of ROY
        const speed = 100

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

        // Move footballD towards the football if activated
        if (this.footballDGettingBall && !this.gotBall) {
            this.physics.moveToObject(this.footballD, this.football, 100)
            if (Phaser.Math.Distance.Between(this.footballD.x, this.footballD.y, this.football.x, this.football.y) < 10) {
                // Stop footballD near the football, preventing overlap callback from constant triggering
                this.footballD.body.setVelocity(0)
            }
        }
    
    }
    drawTextBox(x, y, width, height) {
        if (!this.textBox) {
            this.textBox = this.add.graphics();
        }
        this.textBox.clear();
        this.textBox.fillStyle(0xFFFFFF, 1);
        this.textBox.fillRoundedRect(x - width / 2, y - height / 2, width, height, 5);
        this.textBox.setVisible(true)
    }

    updateText() {
        if (this.textIndex < this.narrativeTexts.length) {
            this.storyTextBox.setText(this.narrativeTexts[this.textIndex++])
        }

    }

    touchDirtArea() {
        this.touchDirt = true // Assuming this.touchDirt indicates ROY has touched the dirt area
    
        this.time.delayedCall(5, () => {
            this.sceneTransition('footballStar')
        }, [], this)
    }

    pickUpBall() {
        if (this.gotBall && !this.displayedDirtNarrative) { // Check if the ball is picked up and narrative hasn't been displayed yet
            // If the ball is picked up, regardless of whether ROY touched the dirt
            this.narrativeTexts = this.narrativeChoice.getTheBall // Change the narrative to 'getTheBall'
            this.textIndex = 0 // Reset text index to start from the beginning
            this.displayAllNarrativeTexts() // Call the method to display all narrative texts
            this.displayedDirtNarrative = true // Mark the narrative as displayed to avoid repetition
        } else if (!this.gotBall && this.touchDirt && !this.displayedDirtNarrative) {
            // If the ball is not picked up, and ROY touched the dirt, and the narrative hasn't been displayed yet
            // This part can either be left as is or removed if you want the narrative to only depend on picking up the football
            this.narrativeTexts = this.narrativeChoice.dontGetTheBall // Keep this branch if you need a narrative for not picking up the ball
            this.textIndex = 0 // Reset text index
            this.displayAllNarrativeTexts()
            this.displayedDirtNarrative = true // Mark the narrative as displayed
        }
    }

    // Adjusted displayAllNarrativeTexts to include delayed scene transition for dontGetTheBall scenario
    displayAllNarrativeTexts() {
        if (this.narrativeTexts.length > 0) {
            this.storyTextBox.setText(this.narrativeTexts[this.textIndex++])
        }

        // Set up a timed event to display the rest and possibly transition scenes
        this.time.addEvent({
            delay: 1500, // Delay in ms between texts
            repeat: this.narrativeTexts.length - 1, // Number of additional texts to display
            callback: () => {
                if (this.textIndex < this.narrativeTexts.length) {
                    this.storyTextBox.setText(this.narrativeTexts[this.textIndex++])
                    if (this.textIndex === this.narrativeTexts.length) {
                        // After the last narrative text is shown, wait 5ms before transitioning
                        this.time.delayedCall(4000, () => {
                            // Determine which scene to transition based on narrative chosen
                            if (this.gotBall) {
                                this.sceneTransition('footballStar')
                            } else {
                                this.sceneTransition('endRestart')
                            }
                        }, [], this)
                    }
                }
            },
            callbackScope: this
        })
    }

    sceneTransition(nextScene) {
        this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(nextScene)
            }
        })
    }
}