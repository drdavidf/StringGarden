
class Play extends Phaser.Scene {

    constructor () {
        super('Play');
		this.freeFruits = [];
		this.score = 0;
    }

    init(level) {
        this.level = 0;
        this.round = 0;
    }

    preload() {
		this.load.json('levels', 'assets/sglevels.json');
		this.load.spritesheet('marvin', 'assets/marvin.png', { frameWidth: 64, frameHeight: 64 });
    }

    create(data) {

		this.weedKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
	
		this.eating = false;
		this.weeding = false;
	
		this.player = this.physics.add.sprite(100, 450, 'marvin');
	
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);
	
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
		
		this.cursors = this.input.keyboard.createCursorKeys();
	
		this.levels = this.cache.json.get('levels');
	
		this.regex = this.levels[this.level].rounds[this.round].regex;
	
		this.strings = this.levels[this.level].rounds[this.round].strings;
	
		var n = this.strings.length;
	
		var step = (800-16*2) / n;
	
		var scene = this;
	
		var i = 0;
	
		this.fruits = this.strings.map(function (child) {
	
			var fruit = scene.add.text(16+i*step, 92 + Phaser.Math.Between(0,600-92-32), child[0]+child[1], { fontSize:'16px', fill: '#FFF' });
	
			fruit.index = i;
	
			i = i + 1;
	
			return fruit;	
	
		});
	
		this.fruits.forEach(function(each) {
	
			scene.physics.world.enable(each);
			each.body.immovable = true;
		});
	
		this.physics.add.overlap(this.player, this.fruits, this.eatFruit, null, this);
	
	
		this.levelText = this.add.text(16, 16, 'level: ' + (this.level+1), { fontSize: '16px', fill: '#FFF' });
	
		this.roundText = this.add.text(128, 16, 'round: ' + (this.round+1), { fontSize: '16px', fill: '#FFF' });
	
		this.scoreText = this.add.text(232, 16, 'score: 0', { fontSize: '16px', fill: '#FFF' });
	
		this.regexText = this.add.text(128,64, 'regex: ' + this.regex, { fontSize:'32px', fill:'#FFF' });
	
		this.mistakeText = this.add.text(360,64, '', { fontSize:'32px', fill:'#FFF' });
	
		this.time.addEvent({delay:3000, callback: this.onTimeout, callbackScope: this,loop: true});
	}

	onTimeout() {

		if (this.freeFruits.length == 0) return;

		var fruit = this.freeFruits.pop();

		var x = fruit.x;

		fruit.y = 92 + Phaser.Math.Between(0,600-92-32);
		fruit.x = x;

		var i = Phaser.Math.Between(0, this.strings.length-1);

		this.physics.world.remove(fruit.body);

		fruit.body = null;

		fruit.setText(this.strings[i][0] + this.strings[i][1]);

		this.physics.world.enable(fruit);

		fruit.index = i;
		fruit.body.enable=true;
		fruit.body.gameObject.visible = true;
	}

	toxic(fruit) {
	
		return this.strings[fruit.index][1].length > 0;
	}

	update () {

		if (this.cursors.left.isDown)
		{
		    this.player.setVelocityX(-160);

		    this.player.anims.play('left', true);
		}
		else if (this.cursors.right.isDown)
		{
		    this.player.setVelocityX(160);

		    this.player.anims.play('right', true);
		}
		else if (this.cursors.down.isDown)
		{
		    this.player.setVelocityY(160);

		    this.player.anims.play('turn', true);
		}
		else if (this.cursors.up.isDown)
		{
		    this.player.setVelocityY(-160);
		    this.player.anims.play('turn', true);
	}
		else 
		{
		    this.player.setVelocityX(0);
		    this.player.setVelocityY(0);

		    //this.player.anims.play('turn');
		}

		if (this.cursors.space.isDown) {
			this.eating = true;
		    this.player.anims.play('eat',true);
		}
		else {
			this.eating = false;
		}
	
		if (this.weedKey.isDown) {
	
			this.weeding = true;
		    this.player.anims.play('weed',true);
		}
		else {
			this.weeding = false;
		}
		
	}

	eatFruit(player, fruit) {

		if (!this.eating && !this.weeding) return;

		if (fruit.body.enable == false) return;

		if (this.eating) {

			if (this.toxic(fruit)) {
				this.score = this.score - 1;
				this.mistakeText.setText('mismatch: ' + this.strings[fruit.index][0] + '>' + this.strings[fruit.index][1] + '<');
			} else {
				this.score = this.score + 1;
				this.mistakeText.setText('');
			}
		}

		if (this.weeding) {

			if (this.toxic(fruit)) {
				this.score = this.score + 1;
				this.mistakeText.setText('');
			}
			else {
				this.score = this.score + 1;
				this.mistakeText.setText('match: ' + this.strings[fruit.index][0]);
			}
		}

		this.scoreText.setText('score: ' + this.score); 

		fruit.body.enable=false;
		fruit.body.gameObject.visible = false;
		this.freeFruits.push(fruit);
	}
}

