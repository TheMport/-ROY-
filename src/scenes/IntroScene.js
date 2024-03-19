class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' })
    this.textIndex = 0
    this.narrativeTexts = [
      'Control Roy with the arrow keys',
      'Click to interact with prompts',
      '*Note this game is satire*',
      'Hello there...',
      'Your life as you know it...',
      'Is gone...',
      'Welcome to your new world... Roy.'
    ]
  }

  preload() {
    this.load.image('roySC1', 'assets/roySC1.png')
  }

  create() {
    this.cameras.main.fadeIn(2000, 0, 0, 0)
    this.roySC1 = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'roySC1').setOrigin(0.5, 0.5)
  
    // Reset the text index every time the scene is created, enabling restart functionality
    this.textIndex = 0
  
    const textBoxY = this.roySC1.y + this.roySC1.height * 0.5 + 50
    this.drawTextBox(this.cameras.main.centerX, textBoxY, 300, 150)
  
    // Display the first text from narrativeTexts array
    this.storyTextBox = this.add.text(this.cameras.main.centerX, textBoxY + 10, this.narrativeTexts[this.textIndex], { font: '16px Pokemon GB', fill: '#000000', wordWrap: { width: 280, useAdvancedWrap: true } }).setOrigin(0.5, 0)
  
    this.input.on('pointerdown', () => {
      this.updateText()
    })
  }

  drawTextBox(x, y, width, height) {
    this.textBox = this.add.graphics()
    this.textBox.clear()
    this.textBox.fillStyle(0xFFFFFF, 1)
    this.textBox.fillRoundedRect(x - width / 2, y, width, height, 5) 
  }

  updateText() {
    this.textIndex++
    if (this.textIndex < this.narrativeTexts.length) {
      // Update the text to the next one in the array
      this.storyTextBox.setText(this.narrativeTexts[this.textIndex])
    } else {
      // All texts have been shown go to the next scene
      this.transitionToNextScene()
    }
  }

  transitionToNextScene() {
    this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
      if (progress === 1) {
        this.scene.start('beginStory') 
      }
    })
  }
}
