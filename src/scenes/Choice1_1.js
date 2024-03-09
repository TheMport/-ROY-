class Choice1_1 extends Phaser.Scene {
    constructor() {
        super('Choice1_1')
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
                'Roy: I wanna be a football player!',
                'Roy: "I\'m going to start training now!"'
            ],
            
            troubleMaker: [
                'Roy: I wanna be a trouble maker!',
                'Roy: "I don\'t know what opioids are but I want to try them!"'
            ],

            messWithComputers: [
                'Roy: I wanna mess with computers!',
                'Roy: "I want to be a hacker!"'
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
        this.load.spritesheet('ROY', '32ROY.png',{
            frameWidth: 32,
            frameHeight: 32
        })

        this.load.image('outdoorTile', 'anotherStuff.png')
        this.load.image('indoorTiles', 'indTiles.png')
        this.load.tilemapTiledJSON('part1JSON', 'part1.json')
    }

    create() {
        //create text box
        const textBoxY = this.cameras.main.centerY
        this.drawTextBox(this.cameras.main.centerX, textBoxY, 280, 100)

        if (this.storyTextBox) {
            this.storyTextBox.setDepth(10)
        }
        this.input.on('pointerdown', () => {
            if (!this.choicesMade) {
                this.updateText()
            }
        })

        //tilemap objects
        const map = this.add.tilemap('part1JSON')
        const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
        const tileset2 = map.addTilesetImage('insideStuff', 'indoorTiles')

        const houseBgLayer = map.createLayer('Background', tileset, 0, 0)

        //add Spawns
        const roySpawn = map.findObject('Objects', obj => obj.name === 'roySpawn')

        //create ROY
        this.ROY = this.physics.add.sprite(0, 0, 'ROY', 0)
        console.log(this.ROY.x, this.ROY.y)
        this.ROY.body.setCollideWorldBounds(true)
    
        //ROY animation
        this.anims.create({
            key: 'walkAnimation',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ROY', { start: 0, end: 3 })
        })
        this.ROY.play('walkAnimation')
    
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    
        //ROYS input
        this.cursors = this.input.keyboard.createCursorKeys()
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
        switch(choice){
            case 'footballStar':
                this.processChoice(this.narrativeChoice.footballStar, 'Choice1_1_1')
                break
            case 'troubleMaker':
                this.processChoice(this.narrativeChoice.troubleMaker, 'Choice1_1_2')
                break
            case 'messWithComputers':
                this.processChoice(this.narrativeChoice.messWithComputers, 'Choice1_1_3')
                break
        }
    }

    processChoice(narrativeTexts, nextScene){
        this.narrativeText = narrativeTexts

        const displayNextOrTransition = () => {
            if (this.textIndex < this.narrativeTexts.length){
                this.storyTextBox.setText(this.narrativeTexts[this.textIndex]).setVisible(true)
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
        
            //indicate that choices have been processed
            this.choicesMade = true
        })
    }

    displayChoices() {
        // Implementation for displaying choices would go here
    }

    sceneTransition(nextScene) {
        this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
            if (progress === 1) {
                this.scene.start(nextScene)
            }
        })
    }
}
