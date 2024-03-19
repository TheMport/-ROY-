class doctorOffice extends Phaser.Scene {
constructor() {
    super('doctorOffice')
    this.textIndex = 0
    this.narrativeTexts = [
        '*Roy walks into the doctor\'s office*',
        'Doctor: "Hello Roy"',
        'Doctor: "I have some bad news."',
        'Doctor: "You have cancer"',
        'Doctor: "If we had caught it sooner..."',
        'Doctor: "Well hiensight its 2020 Roy"',
        'Doctor: "Whats important is we move quickly"'
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
    this.load.image('outdoorTile', 'anotherStuff.png')
    this.load.image('carpetFix', 'carpetFix.png')
    this.load.tilemapTiledJSON('docOfficeJSON', 'docOffice.json')
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

    //camera zoom
    this.cameras.main.setZoom(1)

    //tilemap objects
    const map = this.add.tilemap('docOfficeJSON')
    const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
    const tileset2 = map.addTilesetImage('carpetFix', 'carpetFix')

    //layers
    const houseBGLayer = map.createLayer('Background', tileset,0,0)
    const doctorEq = map.createLayer('doctorEq', tileset2,0,0)

    //collidables
    doctorEq.setCollisionByProperty({collides:true})

    //add Spawns
    const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')
    const doctorSpawn = map.findObject('doctorSpawn', obj => obj.name === 'doctorSpawn')

    //add ROY
    this.ROY =this.physics.add.sprite(roySpawn.x, roySpawn.y, 'ROY' )
    this.ROY.body.setCollideWorldBounds(true)
    this.physics.add.collider(this.ROY, doctorEq)

    this.anims.create({
        key: 'walkAnimation',
        frames: this.anims.generateFrameNumbers('ROY', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
})
    this.ROY.play('walkAnimation')
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    //add doctor
    this.doctor = this.physics.add.sprite(doctorSpawn.x, doctorSpawn.y, 'doctor', 0)
    this.doctor.body.setCollideWorldBounds(true)
    this.doctor.setImmovable(true)
    this.physics.add.collider(this.ROY, this.doctor)



    this.physics.add.collider(this.ROY, doctorEq)

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
            this.scene.start('LorD') // Assuming 'LorD' is the key for the next scene
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