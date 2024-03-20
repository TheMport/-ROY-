class hackerAndEntreEnding extends Phaser.Scene {
    constructor() {
        super('hackerAndEntreEnding');
        this.textIndex = 0;
        this.allowControl = true;
        this.finishedNarrativeOutcome = false;
        // Adjusted narrative texts to mirror the structure and style from the troubleMaker ending
        this.narrativeTexts = [
            'Roy: "I think I finally escaped!"',
            'Roy: "I can finally be free now that I\'m in Cuba!"',
            '*Roy suddenly gets the chills*',
            '*He feels like he is being watched*',
            'Roy: "Is anyone there?"'
        ];
        // Renamed narrativeOutcome to match the original's structure more closely
        this.narrativeOutcome = {
            HandEending: [
                '*DUN DUN DUN*',
                '*Batman APPEARS*',
                'Roy: "OH NO IT CANT BE',
                'Roy: "Batman?!?!?!"',
                'Batman: "Roy, I have finally found you"',
                'Roy: "You know who I am?',
                'Batman: "Yes, I know who you are"',
                'Batman: "You\'re a bad guy"',
                'Batman: "Stealing other people\'s money & what not"',
                'Roy: "It was an accident I swear"',
                '*Roy quickly tries to prepare himself to fight*',
                '*Then suddenly',
                '*Batman throws a batarang at Roy*'
            ]
        };
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
        this.load.spritesheet('Batman', '32batman.png', {
            frameWidth: 32,
            frameHeight: 32
        
        })

        this.load.image('outdoorTile', 'anotherStuff.png')
        this.load.image('indoorTiles', 'indTiles.png')
        this.load.tilemapTiledJSON('troubleMakerEndingJSON', 'Choice1_troubleMakerEnding.json')
    }

    create() {

        //create text box
        const gameHeight = this.cameras.main.height
        const textBoxWidth = 280
        const textBoxHeight = 100
        const textBoxX = this.cameras.main.centerX
        const textBoxY = gameHeight - textBoxHeight / 2 - 20
        this.drawTextBox(textBoxX, textBoxY, textBoxWidth, textBoxHeight)

        // Add narrative text on top of the text box graphics
        this.storyTextBox = this.add.text(textBoxX, textBoxY, this.narrativeTexts[this.textIndex], {
            font: '16px Pokemon GB',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: 260 }
        }).setOrigin(0.5).setDepth(100)

        //tilemap objects
        const map = this.add.tilemap('troubleMakerEndingJSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('insideStuff', 'indoorTiles')

        const houseBgLayer = map.createLayer('Background', tileset, 0, 0)

    


        //add Spawns
        const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')
        this.ROY = this.physics.add.sprite(roySpawn.x,roySpawn.y, 'ROY', 0)
        this.ROY.body.setCollideWorldBounds(true)

        // Initially, position Batman off-screen to the right
        this.Batman = this.physics.add.sprite(this.cameras.main.width + 100, roySpawn ? roySpawn.y : 0, 'Batman').setVisible(false)
       //this.Batman.setVisible(false)
       this.Batman.body.setCollideWorldBounds(true)


        //ROY animation
        this.anims.create({
            key: 'walkAnimation',
            frames: this.anims.generateFrameNumbers('ROY', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
        this.ROY.play('walkAnimation')

        //Batman animation
        this.anims.create({
            key: 'BatmanEnter',
            frames: this.anims.generateFrameNumbers('Batman', { start: 0, end: 10 }),
            frameRate: 10,
            repeat: -1
        })

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    
        //ROY's input
        this.cursors = this.input.keyboard.createCursorKeys()

        //update text
        this.updateText()

        this.input.on('pointerdown', (event) => {
            this.handleInput() // Adjusted to handle any keydown as a trigger for simplicity
        })

    }

    update() {

        if(this.allowControl) {
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
        }}
    }

    drawTextBox(x, y, width, height) {
        if (this.textBox) {
            this.textBox.clear()
        } else {
            this.textBox = this.add.graphics()
        }
        this.textBox.fillStyle(0xFFFFFF, 1)
        this.textBox.fillRoundedRect(x - width / 2, y - height / 2, width, height, 5)
        this.textBox.setDepth(5)
    }

    updateText() {
        if (this.textIndex < this.narrativeTexts.length) {
            // Displaying initial narrative texts
            this.storyTextBox.setText(this.narrativeTexts[this.textIndex])
            this.textIndex++
        } else {
            // Once all narrativeTexts are displayed, handle Batman's entrance and transition to narrative outcomes
            this.allowControl = false // Disable ROY's movement
            if (!this.Batman.visible) {
                this.Batman.setVisible(true) // Make Batman visible and start his entrance
                this.makeBatmanEnter()
            } else {
                // If Batman is already visible and in place, start displaying narrativeOutcome texts
                this.updateNarrativeOutcome()
            }
        }
    }

    handleInput() {
        if (this.textIndex < this.narrativeTexts.length) {
            // Continue displaying narrative texts
            this.updateText()
        } else if (this.allowControl) {
            // If narrative texts are done but Batman's entrance hasn't started, trigger it
            this.makeBatmanEnter()
        } else {
            // If narrative texts are done and Batman's entrance has completed, display narrativeOutcome texts
            this.updateNarrativeOutcome()
        }
    }


    updateNarrativeOutcome() {
        if (this.finishedNarrativeOutcome) {
            return; // Exit if the narrative outcome has already been processed
        }
        
        if (this.textIndex < this.narrativeOutcome.HandEending.length) {
            this.storyTextBox.setText(this.narrativeOutcome.HandEending[this.textIndex]);
            this.textIndex++;
        } else {
            // Ensuring the transition occurs after the last narrativeOutcome text is displayed
            this.finishedNarrativeOutcome = true;
            this.sceneTransition('endRestart');
        }
    }

    makeBatmanEnter() {
        this.Batman.setVisible(true);
        // Batman enters the scene moving towards ROY
        this.tweens.add({
            targets: this.Batman,
            x: this.ROY.x - 50, // Position Batman near ROY
            ease: 'Power1',
            duration: 2000,
            onStart: () => {
                this.Batman.play('BatmanEnter', true);
            },
            onComplete: () => {
                // Do not reset textIndex here; directly proceed to update narrative outcome
                this.updateNarrativeOutcome(); // Start displaying narrativeOutcome
            }
        });
    }

    sceneTransition(endRestart) {
        console.log('Attempting to transition to scene:', endRestart); // Debugging
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(endRestart);
        });
    }

}