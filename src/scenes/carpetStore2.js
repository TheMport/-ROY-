class carpetStore2 extends Phaser.Scene {
    constructor(){
        super('carpetStore2')
        this.textIndex =0

        this.taskTexts = [
            '*Roy is remembering his past at work*',
            'Boss: "Roy can you get the boxes from the top shelf for me?"',
            'Roy: "Which one?"',
            'Boss: "The boxes towards the front"'
        ]

        this.narrativeTexts = [
            '*You climbed the ladder to get to the boxes*',
            '*You suddenly feel something off*',
            '*You look down and suddenly*'
        ]
        this.showTaskText = true
        this.enteredfallDie = false
        this.canMove = true
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
        this.load.image('boxCarp', 'carpBox.png')
        this.load.image('fixCarpet', 'carpetFix.png')
        this.load.tilemapTiledJSON('carpetStore2JSON', 'carpetStore2.json')
}

    create(){
        this.cameras.main.fadeIn(2000, 0, 0, 0)

        const gameHeight = 480 // Assuming the height of the game area is 480px
        const textBoxWidth = 280
        const textBoxHeight = 100
        const textBoxX = this.cameras.main.centerX // Center the text box horizontally
        const textBoxY = gameHeight - textBoxHeight / 2 - 20 // Position it 20px above the bottom edge
        this.drawTextBox(textBoxX, textBoxY, textBoxWidth, textBoxHeight)

        // Conditionally display taskTexts or narrativeTexts based on state
        let textsToShow = this.showTaskText ? this.taskTexts : this.narrativeTexts
        this.storyTextBox = this.add.text(this.cameras.main.centerX, textBoxY, textsToShow[this.textIndex], {
            font: '16px Pokemon GB',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: 260 }
        }).setOrigin(0.5).setDepth(100)

        // Modified to accommodate the initial display of task texts and then the narrative texts
        this.time.addEvent({
            delay: 4000,
            callback: () => {
                if (this.showTaskText) {
                    this.textIndex++
                    if (this.textIndex >= this.taskTexts.length) {
                        this.textIndex = 0 // Reset for narrative texts
                        this.showTaskText = false // Change state to stop showing task texts
                        this.storyTextBox.setVisible(false) // Hide story text
                        this.textBox.setVisible(false) // Hide the text box graphics
                    } else {
                        this.storyTextBox.setText(this.taskTexts[this.textIndex])
                    }
                } else if (this.enteredfallDie) {
                    this.textIndex++
                    if (this.textIndex < this.narrativeTexts.length) {
                        this.storyTextBox.setText(this.narrativeTexts[this.textIndex])
                        this.storyTextBox.setVisible(true) // Show story text
                        this.textBox.setVisible(true) // Make sure the text box graphics is visible
                    } else {
                        this.scene.start('gameOver') // Transition to the doctorOffice scene
                    }
                }
            },
            callbackScope: this,
            repeat: -1 // Keep cycling through texts
        })


        //tilemap objects
        const map = this.add.tilemap('carpetStore2JSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('carpetFix', 'fixCarpet')
        const tileset3 = map.addTilesetImage('carpBox', 'boxCarp')

        //create layers
        const Background = map.createLayer('Background', tileset,0,0)
        const carpetsR = map.createLayer('carpetsR', tileset2,0,0)
        const carpFall = map.createLayer('carpFall', tileset3,0,0)
        const carpetBoxFall = map.createLayer('carpetBoxFall', tileset3,0,0)

        //add spawns
        const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')

        //add designated task area
        const fallDie = map.findObject('fallDie', obj => obj.name === 'fallDie')

        // Create an invisible sprite at the fallDie location
        this.fallDie = this.physics.add.sprite(fallDie.x, fallDie.y, null)
        this.fallDie.setSize(fallDie.width, fallDie.height) // Adjust the size as necessary
        this.fallDie.setOrigin(0, 0) // Adjust if your object's origin is not top-left
        this.fallDie.setVisible(false) // Make the sprite invisible

        //add collidables
        carpetsR.setCollisionByProperty({collides:true})
        carpFall.setCollisionByProperty({collides:true})
        carpetBoxFall.setCollisionByProperty({collides:true})

        //create ROY
        this.ROY = this.physics.add.sprite(roySpawn.x,roySpawn.y, 'ROY', 0)
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

        //ROY's input
        this.cursors = this.input.keyboard.createCursorKeys()

        //physics collider
        this.physics.add.collider(this.ROY, carpetsR)
        this.physics.add.collider(this.ROY, carpFall)
        this.physics.add.collider(this.ROY, carpetBoxFall)


    // Overlap check for ROY entering the fallDie area
    this.physics.add.overlap(this.ROY, this.fallDie, () => {
        if (!this.enteredfallDie) {
            this.enteredfallDie = true
            this.showTaskText = false // Ensure task text won't show again
            this.textIndex = 0 // Start narrative texts from the beginning
            this.storyTextBox.setVisible(true).setText(this.narrativeTexts[this.textIndex]) // Show narrative text box
            // Make sure to also manage visibility of textBox if necessary
            this.textBox.setVisible(true) // Also make the text box graphics visible again
        }
    }, null, this)

    }

    update() { 
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
    
    }

    
    drawTextBox(x, y, width, height) {
        // Check if textBox already exists, clear if it does
        if (this.textBox) {
            this.textBox.clear()
        } else {
            // Create a new graphics object if it doesn't exist
            this.textBox = this.add.graphics()
        }
        
        this.textBox.fillStyle(0xFFFFFF, 1)
        this.textBox.fillRoundedRect(x - width / 2, y - height / 2, width, height, 5)
        this.textBox.setDepth(5)
    }






}