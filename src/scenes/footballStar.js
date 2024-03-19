class footballStar extends Phaser.Scene {
    constructor(){
        super('footballStar')
        this.textIndex = 0
        
        this.narrativeTexts = [
            'Caster: "ROY THE ROCKET IS THE STAR PLAYER"',
            'Caster: "Who would you like to thank for your success?"',
            'Roy: "I would like to my Mom and Dad for their support"',
            'Roy: "But most of all"',
            'Roy: I would like to thank my girlfriend Lola, for always being there for me"',
            'Roy: "I love you all!!!"',
            'Roy: "GO RAMS!!!"'
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
        this.load.spritesheet('footballD', 'footballD.png', {
            frameWidth: 32,
            frameHeight: 32
        })
        this.load.image('podium', 'podium.png') //aka outdoorTiles
        this.load.image('outdoorTile', 'anotherStuff.png') //aka outdoorTiles
        this.load.image('flowerFix', 'flowerFix.png')  //aka indoorTiles
        this.load.tilemapTiledJSON('footballStarJSON', 'footballStar.json')
    }

    create() {
        const gameHeight = 480 // Assuming the height of the game area is 480px
        const textBoxWidth = 280
        const textBoxHeight = 100
        const textBoxX = this.cameras.main.centerX // Center the text box horizontally
        const textBoxY = gameHeight - textBoxHeight / 2 - 20 // Position it 20px above the bottom edge
        this.drawTextBox(textBoxX, textBoxY, textBoxWidth, textBoxHeight)

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
        const map = this.add.tilemap('footballStarJSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('flowerFix', 'flowerFix')
        const tileset3 = map.addTilesetImage('podium', 'podium')

        //layers
        const houseBgLayer = map.createLayer('Background', tileset,0,0)
        const flowers = map.createLayer('flowers', tileset2,0,0)
        const podium = map.createLayer('podium', tileset3,0,0)

        //add spawns
        const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')

        //add ROY
        this.ROY = this.physics.add.sprite(roySpawn.x, roySpawn.y, 'ROY',0)
        this.ROY.setCollideWorldBounds(true)

        this.anims.create({
            key: 'celebrate',
            frames: this.anims.generateFrameNumbers('ROY', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1

        })
        this.ROY.play('celebrate')
        this.physics.world.setBounds(0,0, map.widthInPixcels, map.heightInPixels)

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
        this.storyTextBox.setText(this.narrativeTexts[this.textIndex++])

        if (this.textIndex >= this.narrativeTexts.length) { // After displaying all texts, transition to the next scene
            this.time.addEvent({ // Added delay before transitioning to the next scene
                delay: 4000, // Wait for the last text to be displayed for 4000ms
                callback: () => {
                    this.sceneTransition('adulthood1') // Replace 'adulthood1' with the actual scene name
                },
                callbackScope: this,
                repeat: 0 // Do not repeat
            })
        }
    }

    sceneTransition(nextScene) {
        this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(nextScene)
            }
        })
    }
}