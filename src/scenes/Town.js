class Town extends Phaser.Scene {
    constructor() {
        super('Town')
    }

    init(){
        this.VEL = 100
    }

    preload() {

        this.load.path = './assets/'
        this.load.spritesheet('ROY', 'spritesheet.png', {
            frameWidth: 32,
            frameHeight: 32
        })
    }
    

    create() {

        // add roy
        this.ROY = this.physics.add.sprite(config.x, config.y, 'ROY', 0)
        this.ROY.body.setCollideWorldBounds(true)

        // ROY animation
        this.anims.create({
            key: 'walkAnimation',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('ROY'),
            start: 0,
            end: 3
        })
        this.ROY.play('walkAnimation')
        // input
        this.cursors = this.input.keyboard.createCursorKeys()


    }


update() {
            // ROY movement
            this.direction = new Phaser.Math.Vector2(0)
            if(this.cursors.left.isDown) {
                this.direction.x = -1
            } else if(this.cursors.right.isDown) {
                this.direction.x = 1
            }
    
            if(this.cursors.up.isDown) {
                this.direction.y = -1
            } else if(this.cursors.down.isDown) {
                this.direction.y = 1
            }
    
            this.direction.normalize()
            this.ROY.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y)
        }
}

















