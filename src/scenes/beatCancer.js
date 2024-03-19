class beatCancer extends Phaser.Scene {
    constructor() {
        super('beatCancer')
        this.textIndex = 0
        this.narrativeTexts = [
            '*Roy & Lola walk in',
            'Guest: "Congratulations Roy!"',
            'Guest: "Cancer cant beat the rocket!"',
            'Roy: "Thank you everyone"',
            '*Room erupts in applause*'
        ]
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
    
        this.load.image('doctor', 'doctor.png')
        this.load.image('g1','guest1.png')
        this.load.image('g2','guest2.png')
        this.load.image('g3','guest3.png')
        this.load.image('Lola','royWife.png')
        this.load.image('outdoorTile', 'anotherStuff.png')
        this.load.image('carpetFix', 'carpetFix.png')
        this.load.tilemapTiledJSON('beatCancerJSON', 'beatCancer.json')
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
    
    
        //tilemap objects
        const map = this.add.tilemap('beatCancerJSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('carpetFix', 'carpetFix')
    
        //layers
        const houseBGLayer = map.createLayer('Background', tileset,0,0)
        const Stuff = map.createLayer('Stuff', tileset2,0,0)
    
        //collidables
        Stuff.setCollisionByProperty({collides:true})
    
        //add Spawns
        const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')
        const dSpawn = map.findObject('dSpawn', obj => obj.name === 'dSpawn')
        const g1Spawn = map.findObject('g1Spawn', obj => obj.name === 'g1Spawn')
        const g2Spawn = map.findObject('g2Spawn', obj => obj.name === 'g2Spawn')
        const g3Spawn = map.findObject('g3Spawn', obj => obj.name === 'g3Spawn')
        const wifeSpawn = map.findObject('wifeSpawn', obj => obj.name === 'wifeSpawn')
    
        //add ROY
        this.ROY =this.physics.add.sprite(roySpawn.x, roySpawn.y, 'ROY' )
        this.ROY.body.setCollideWorldBounds(true)
        //this.physics.add.collider(this.ROY, Stuff)
    
        this.anims.create({
            key: 'walkAnimation',
            frames: this.anims.generateFrameNumbers('ROY', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
    })
        this.ROY.play('walkAnimation')
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    
        //add doctor
        this.doctor = this.physics.add.sprite(dSpawn.x, dSpawn.y, 'doctor', 0)
        this.doctor.body.setCollideWorldBounds(true)
        this.doctor.setImmovable(true)
        this.physics.add.collider(this.ROY, this.doctor)

        //add guests
        this.g1 = this.physics.add.sprite(g1Spawn.x, g1Spawn.y, 'g1', 0)
        this.g1.body.setCollideWorldBounds(true)
        this.g1.setImmovable(true)
        this.physics.add.collider(this.ROY, this.g1)

        this.g2 = this.physics.add.sprite(g2Spawn.x, g2Spawn.y, 'g2', 0)
        this.g2.body.setCollideWorldBounds(true)
        this.g2.setImmovable(true)
        this.physics.add.collider(this.ROY, this.g2)

        this.g3 = this.physics.add.sprite(g3Spawn.x, g3Spawn.y, 'g3', 0)
        this.g3.body.setCollideWorldBounds(true)
        this.g3.setImmovable(true)
        this.physics.add.collider(this.ROY, this.g3)

        this.Lola = this.physics.add.sprite(wifeSpawn.x, wifeSpawn.y, 'Lola', 0)
        this.Lola.body.setCollideWorldBounds(true)
        this.Lola.setImmovable(true)
        this.physics.add.collider(this.ROY, this.Lola)
    
    
    
        this.physics.add.collider(this.ROY, Stuff)
    
        //roy input
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
    
        updateText() {
            this.textIndex++
            if (this.textIndex < this.narrativeTexts.length) {
                this.storyTextBox.setText(this.narrativeTexts[this.textIndex])
            } else {
                this.cameras.main.fadeIn(2000, 0, 0, 0)
                this.scene.start('carpetStore2')
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
    
    }