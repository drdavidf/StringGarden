
class Welcome extends Phaser.Scene {

    constructor () {
        super('Welcome');

		this.cursors = 0;
    }

    init() {
        // Used to prepare data
    }

    preload() {
        // Used for preloading assets into your scene, such as
        // • images
        // • sounds

    }

    create(data) {
    
		this.cursors = this.input.keyboard.createCursorKeys();

		this.add.text(400, 300, 'STRING GARDEN', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);    
		this.add.text(400, 348, 'A REGULAR EXPRESSION ADVENTURE', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);    
    }

    update(time, delta) {

		if (this.cursors.space.isDown) {
			this.scene.start('Levels');
		}
        // Used to update your game. This function runs constantly
    }
}

