
class Levels extends Phaser.Scene {

    constructor () {
        super('Levels');

		this.cursors = 0;

		this.index = 0;

		this.NLEVEL = 3;

		this.levels = [];
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

		this.levels.push(this.add.text(400, 200, 'BEGINNER', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5));   
		this.levels.push(this.add.text(400, 248, 'SKILLED', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5));
		this.levels.push(this.add.text(400, 296, 'EXPERT', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5)); 
    }

    update(time, delta) {

		if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
			this.index = (this.index + 1) % this.NLEVEL; 
		}
		else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
			this.index = (this.index - 1) % this.NLEVEL;
		}

		if (this.cursors.space.isDown) {
			this.scene.start('Play', this.index);
		}

		for(var i = 0; i < this.NLEVEL; i++) {
			if (i == this.index)
				this.levels[i].setColor('white');
			else
				this.levels[i].setColor('gray');
		}
    }
}

