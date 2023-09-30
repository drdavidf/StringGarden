
class Load extends Phaser.Scene {

    constructor () {
        super('Load');
    }

    init() {
    }

    preload() {

            var progressBar = this.add.graphics();
            var progressBox = this.add.graphics();
            progressBox.fillStyle(0x222222, 0.8);
            progressBox.fillRect(240, 270, 320, 50);
            
            var width = this.cameras.main.width;
            var height = this.cameras.main.height;
            var loadingText = this.make.text({
                x: width / 2,
                y: height / 2 - 50,
                text: 'Loading...',
                style: {
                    font: '20px monospace',
                    fill: '#ffffff'
                }
            });
            loadingText.setOrigin(0.5, 0.5);
            
            var percentText = this.make.text({
                x: width / 2,
                y: height / 2 - 5,
                text: '0%',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            percentText.setOrigin(0.5, 0.5);
            
            var assetText = this.make.text({
                x: width / 2,
                y: height / 2 + 50,
                text: '',
                style: {
                    font: '18px monospace',
                    fill: '#ffffff'
                }
            });
            assetText.setOrigin(0.5, 0.5);
            
            this.load.on('progress', function (value) {
                percentText.setText(parseInt(value * 100) + '%');
                progressBar.clear();
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(250, 280, 300 * value, 30);
            });
            
            this.load.on('fileprogress', function (file) {
                assetText.setText('Loading asset: ' + file.key);
            });
            this.load.on('complete', function () {
                progressBar.destroy();
                progressBox.destroy();
                loadingText.destroy();
                percentText.destroy();
                assetText.destroy();
            });
            
		this.load.json('levels', 'assets/sglevels.json');

		this.load.spritesheet('door', 'assets/door.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('marvin', 'assets/marvin.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {

		this.anims.create({
			key: 'open',
			frames: this.anims.generateFrameNumbers('door', { start:2, end:4 }), frameRate: 2 });

		this.anims.create({
			key: 'eat',
			frames: this.anims.generateFrameNumbers('marvin', { start: 6, end: 7 }),
			frameRate: 10,
			repeat:3 
		});

		this.anims.create({
			key: 'weed',
			frames: this.anims.generateFrameNumbers('marvin', { start: 4, end: 5 }),
			frameRate: 10,
			repeat:3 
		});

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('marvin', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: -1
		});
	
		this.anims.create({
			key: 'turn',
			frames: this.anims.generateFrameNumbers('marvin', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: -1
		});
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('marvin', { start: 2, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'stand',
			frames: this.anims.generateFrameNumbers('marvin', { start: 0, end: 0 }),
			frameRate: 10,
			repeat: -1
		});
		
		model.init(this.cache.json.get('levels'));

		this.scene.start('Welcome');
	}
}

