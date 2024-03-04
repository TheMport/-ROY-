class beginStory extends Phaser.Scene { 
    constructor(){
        super('beginStory')
        this.textIndex = 0
        this.prefaceText = [
            '*BLINK* *BLINK*',
            'Where am I?',
            'What is this place?',
            'Wait what is this sudden feeling I feel?!'
          ]
    }


preload(){

    this.load.on('filecomplete', function (key, type, data) {
        console.log(`Asset loaded: ${key}`);
    })
    
    this.load.on('loaderror', function (file) {
        console.error(`Error loading asset: ${file.key}`);
    })

    this.load.path = './assets/'
    this.load.spritesheet('ROY', '32ROY.png',{
        frameWidth: 32,
        frameHeight: 32
    })

    this.load.image('tileSet', 'pokemonTiles.png')
    this.load.image('indoorTile', 'pokeInterTile.png')
    this.load.tilemapTiledJSON('beginStoryRoomJSON', 'beginStory.json')
}

create() {
    //Creates blinking affect at the beginning of the scene
    this.cameras.main.fadeIn(1000,0,0,0)
    this.cameras.main.fadeOut(1000,0,0,0)
    this.cameras.main.fadeIn(1000,0,0,0)
    this.cameras.main.fadeOut(1000,0,0,0)
    this.cameras.main.fadeIn(1000,0,0,0)

    //tilemap objects
    const map = this.add.tilemap('beginStoryRoomJSON')
    const tileset = map.addTilesetImage('tileSet', 'indoorTile')

    const houseBgLayer = map.createLayer('Background', tileset, 0, 0)
    const houseItemsLayer = map.createLayer('houseObjects', tileset , 0, 0)

    //create ROY
    this.ROY = this.physics.add.sprite(32,32, 'ROY', 0)
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

    //ROYS input
    this.cursors = this.input.keyboard.createCursorKeys()

}






}
