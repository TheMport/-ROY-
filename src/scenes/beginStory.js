class beginStory extends Phaser.Scene { 
    constructor(){
        super('beginStory')
        this.textIndex = 0
        this.narrativeTexts = [
            '*BLINK* *BLINK*',
            'Where am I?',
            'What is this place?',
            'Wait what is that noise?',
            'voices?',
            'Mom: "I hate when you do this you always make me so upset!"',
            'Dad: "I dont know why you always have to be so difficult"',
            'Mom: "I bet you have been drinking again!"',
            'Dad: "I have not been drinking, I just dont want to deal with you right now!"',
            'Mom: "I am so tired of this all the time!"',
            'Dad: "I am tired of you too!"'
          ]

        this.narrativeChoice = {
            startCrying: [
                'Roy starts to cry',
                'Mom & Dad stop arguing and look at Roy',
                'They then start walking over to Roy',
                'Mom: "We are sorry for yelling Roy, we love you"',
                'Dad: "Im sorry too Roy, we love you."',
                'Dad: "We are just having a hard time right now and I want to apologize to both of you, I love you both."'

            ],

            throwBabyFood: [
                'Dad: See what you did now?! YOU MADE ROY CRY!',
                'Mom: "I AM SO TIRED OF YOU ALWAYS BLAMING ME FOR EVERYTHING!"',
                'Dad: "THATS IT IM LEAVING!"',
                'Mom: "FINE LEAVE!"',
                'Dad: "I WILL',
                '*DAD SLAMS THE DOOR LEAVING*',
                'Mom: "I am so sorry Roy, I love you. I am sorry for yelling."',
                '*Mom starts to cry*'

            ]

        }
        this.choicesMade = false 
        }


preload(){

    //debug tools
    /*
    console.log(this.sys.game.renderer.gl.getParameter(this.sys.game.renderer.gl.MAX_TEXTURE_SIZE))

    /*
    this.load.on('filecomplete', function (key, type, data) {
        console.log(`Asset loaded: ${key}`)
        if (type === 'image') {
            const texture = this.textures.get(key)
            if (texture.source[0].width > 2048 || texture.source[0].height > 2048) {
                console.warn(`Texture ${key} might be too large: ${texture.source[0].width}x${texture.source[0].height}`)
            }
        }
    }, this)
    

    this.load.on('filecomplete', function (key, type, data) {
        console.log(`Asset loaded: ${key}`)
    })
    
    this.load.on('loaderror', function (file) {
        console.error(`Error loading asset: ${file.key}`)
    })*/

    //load assets
    //comeback to load assets

    this.load.path = './assets/'
    this.load.spritesheet('ROY', '32ROY.png',{
        frameWidth: 32,
        frameHeight: 32
    })

    this.load.spritesheet('MOM', '32mom.png',{
        frameWidth: 32,
        frameHeight: 32
    })

    this.load.spritesheet('DAD', '32dad.png',{
        frameWidth: 32,
        frameHeight: 32
    })

    this.load.image('outdoorTile', 'anotherStuff.png')
    this.load.image('indoorTiles', 'indTiles.png')
    this.load.tilemapTiledJSON('beginStoryRoomJSON', 'beginStory.json')
}

create() {
    this.cameras.main.fadeIn(1000,0,0,0)


    const gameHeight = 480 
    const textBoxWidth = 280
    const textBoxHeight = 100
    const textBoxX = this.cameras.main.centerX 
    const textBoxY = gameHeight - textBoxHeight / 2 - 20 // above the bottom edge
    
    this.drawTextBox(textBoxX, textBoxY, textBoxWidth, textBoxHeight)

    this.storyTextBox = this.add.text(this.cameras.main.centerX, textBoxY, this.narrativeTexts[this.textIndex], {
        font: '16px Pokemon GB',
        fill: '#000000',
        align: 'center',
        wordWrap: { width: 260 }
    }).setOrigin(0.5).setDepth(100)

    // Advance on click
    this.input.on('pointerdown', () => {
        if(!this.choicesMade){
            this.updateText()
        }
    })

    //tilemap objects
    const map = this.add.tilemap('beginStoryRoomJSON')
    const tileset = map.addTilesetImage('anotherStuff', 'outdoorTile')
    const tileset2 = map.addTilesetImage('insideStuff', 'indoorTiles')

    const houseBgLayer = map.createLayer('Background', tileset, 0, 0)
    //const houseItemsLayer = map.createLayer('insideStuff', tileset2 , 0, 0)



    //add Spawns
    const roySpawn = map.findObject('roySpawn', obj => obj.name === 'roySpawn')
    const momSpawn = map.findObject('momSpawn', obj => obj.name === 'momSpawn')
    const dadSpawn = map.findObject('dadSpawn', obj => obj.name === 'dadSpawn')

    //spawn MOM
    this.MOM = this.physics.add.sprite(momSpawn.x, momSpawn.y, 'MOM', 0)
    this.MOM.body.setCollideWorldBounds(true)

    //spawn DAD
    this.DAD = this.physics.add.sprite(dadSpawn.x, dadSpawn.y, 'DAD', 0)
    this.DAD.body.setCollideWorldBounds(true)

    //create ROY
    this.ROY = this.physics.add.sprite(roySpawn.x,roySpawn.y, 'ROY', 0)
    console.log(this.ROY.x, this.ROY.y)
    this.ROY.body.setCollideWorldBounds(true)

    //ROY animation
    this.anims.create({
        key: 'walkAnimation',
        frameRate: 10,
        repeat: -1,
        frames: this.anims.generateFrameNumbers('ROY'),
        start: 0,
        end: 3
    })
    //this.ROY.play('walkAnimation')

    //this.camera.main.setBounds(0,0, map.widthInPixels, map.heightInPixels)
    //this.camera.main.startFollow(this.ROY,true,0.25,0.25)

    this.physics.world.setBounds(0,0,map.widthInPixels, map.heightInPixels)


    //ROYS input
    this.cursors = this.input.keyboard.createCursorKeys()

}

initiateParentsMovement() {
    // Move MOM to a new location after narrative choices
    this.tweens.add({
        targets: this.MOM,
        x: 380, 
        y: 384, 
        ease: 'Power1',
        duration: 5000, 
    })

    // Move DAD to a new location after narrative choices
    this.tweens.add({
        targets: this.DAD,
        x: 416, 
        y: 350, 
        ease: 'Power1',
        duration: 5000, 
    })
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
    // Check if more narrative texts exist and display them
    if (this.textIndex < this.narrativeTexts.length) {
        this.storyTextBox.setText(this.narrativeTexts[this.textIndex])
        this.textIndex++
    } else if (!this.choicesMade) {
        // Once the initial narrative texts are done give choices
        this.displayChoices()
    }
}

handleChoice(choice) {
    switch(choice) {
        case 'startCrying':
            this.processChoice(this.narrativeChoice.startCrying, 'Choice1_1')
            break
        case 'throwBabyFood':
            this.processChoice(this.narrativeChoice.throwBabyFood, 'Choice1_2')
            break
    }

    this.delayParentsMovement()
}


delayParentsMovement() {
    const delayTime = this.narrativeTexts.length 

    this.time.delayedCall(delayTime, () => {
        this.initiateParentsMovement()
    })
}

processChoice(narrativeTexts, nextScene) {
    // Set the narrative texts to the chosen array
    this.narrativeTexts = narrativeTexts

    const displayNextOrTransition = () => {
        if (this.textIndex < this.narrativeTexts.length) {
            this.storyTextBox.setText(this.narrativeTexts[this.textIndex]).setVisible(true)
            // Show the textBox graphics again when displaying narrative texts after choice
            this.textBox.setVisible(true) 
            this.textIndex++
        } else {
            this.sceneTransition(nextScene)
        }
    }

    this.textIndex = 0
    this.storyTextBox.setVisible(false)

    displayNextOrTransition()

    this.input.on('pointerdown', () => {
        displayNextOrTransition()
    })

    this.choicesMade = true
}


displayChoices() {
    // Hide the current narrative text
    this.storyTextBox.setVisible(false)
    this.textBox.setVisible(false)
    
    // Choice 1: startCrying
    const choice1 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, 'Start Crying', {
        font: '16px Pokemon GB',
        fill: '#000000',
        backgroundColor: '#FFFFFF'
    }).setInteractive().setOrigin(0.5)

    // Choice 2: throwBabyFood
    const choice2 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 20, 'Throw Baby Food', {
        font: '16px Pokemon GB',
        fill: '#000000',
        backgroundColor: '#FFFFFF'
    }).setInteractive().setOrigin(0.5)

    // Enable interactivity and add click events for each choice
    choice1.on('pointerdown', () => {
        this.handleChoice('startCrying')
        choice1.setVisible(false) 
        choice2.setVisible(false) 
    })
    choice2.on('pointerdown', () => {
        this.handleChoice('throwBabyFood')
        choice1.setVisible(false) 
        choice2.setVisible(false) 
    })

    this.choicesMade = true 

}



sceneTransition(nextScene) {
    this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
        if (progress === 1) {
            this.scene.start(nextScene)
        }
    })

}
}
