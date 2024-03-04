class Load extends Phaser.Scene {
    constructor() { 
        super('Load')
    }

    preload() { 
        this.load.video('aikeIntro', 'assets/Aikeintro.mp4', 'loadeddata', false, true)
    }

    create() { 
        this.video = this.add.video(200, 200, 'aikeIntro').setOrigin(0.5, 0.5)
        this.video.play()

        // Scale the video to fit within the 400x400 area without losing quality
        // Assuming the game area is 400x400 and video's original size is 1920x1080
        let scaleX = 400 / 1920;
        let scaleY = 400 / 1080;
        let scale = Math.min(scaleX, scaleY);
        this.video.setScale(scale);

        this.video.on('complete', function(video) {
            this.scene.start('mainMenu')
        }, this)        
    }
}
