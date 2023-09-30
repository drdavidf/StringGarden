
class Play extends Phaser.Scene {

    constructor () {
        super('Play');
		this.moved = false;
    }

    init(data) {
		this.player_x = data.player_x;
		this.movingToNextLevel = false;
		this.movingToPrevLevel = false;
		this.eating = false;
		this.weeding = false;
    }

    preload() {
    }

    create(data) {

		this.doorNext = this.physics.add.sprite(732, 520, 'door', 1);

		this.doorPrev = this.physics.add.sprite(32, 520, 'door', 2);

		this.weedKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
	
		this.player = this.physics.add.sprite(this.player_x, 520, 'marvin');
	
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.cursors = this.input.keyboard.createCursorKeys();
	
		var n = model.strings().length;
	
		var step = (800-16*2) / n;
	
		var scene = this;
	
		var i = 0;
	
		this.fruits = model.strings().map(function (child) {
	
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

		this.physics.add.overlap(this.player, this.doorNext, this.openDoorNext, null, this);
		this.physics.add.overlap(this.player, this.doorPrev, this.openDoorPrev, null, this);
	
	
		this.levelText = this.add.text(16, 16, 'level: ' + (model.currentIndex+1), { fontSize: '16px', fill: '#FFF' });
	
		this.roundText = this.add.text(128, 16, 'round: ' + (model.round+1), { fontSize: '16px', fill: '#FFF' });
	
		this.scoreText = this.add.text(232, 16, 'score: ' + model.score(), { fontSize: '16px', fill: '#FFF' });
	
		this.regexText = this.add.text(128,64, 'regex: ' + model.regex(), { fontSize:'32px', fill:'#FFF' });
	
		this.mistakeText = this.add.text(360,64, '', { fontSize:'32px', fill:'#FFF' });
	
		this.doorPrev.visible = ! model.first();
		this.doorNext.visible = ! model.last(); 
	}

	toxic(fruit) {
	
		return model.strings()[fruit.index][1].length > 0;
	}

	update () {

		if (this.cursors.left.isDown)
		{
		    this.player.setVelocityX(-160);

		    this.player.anims.play('left', true);

			this.moved = true;
		}
		else if (this.cursors.right.isDown)
		{
		    this.player.setVelocityX(160);

		    this.player.anims.play('right', true);
			this.moved = true;
		}
		else if (this.cursors.down.isDown)
		{
		    this.player.setVelocityY(160);

		    this.player.anims.play('left', true);
			this.moved = true;
		}
		else if (this.cursors.up.isDown)
		{
		    this.player.setVelocityY(-160);
		    this.player.anims.play('right', true);
			this.moved = true;
		}
		else 
		{
		    this.player.setVelocityX(0);
		    this.player.setVelocityY(0);

			if (this.moved) {
				this.player.anims.play('stand', true);
				this.moved = false;
			}
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

		if (this.movingToNextLevel == true) {
			model.nextLevel();
			this.movingToNextLevel = false;
			this.scene.start('Play', {player_x:96});
		}
		if (this.movingToPrevLevel == true) {
			model.prevLevel();
			this.movingToPrevLevel = false;
			this.scene.start('Play', {player_x:732-64});
		}
	}

	eatFruit(player, fruit) {

		if (!this.eating && !this.weeding) return;

		if (fruit.body.enable == false) return;

		if (this.eating) {

			if (this.toxic(fruit)) {
				model.decScore(); 
				this.mistakeText.setText('mismatch: ' + model.strings()[fruit.index][0] + '>' + model.strings()[fruit.index][1] + '<');
				player.on('animationcomplete', () => { player.setFrame(8); } );
			} else {
				model.incScore();
				this.mistakeText.setText('');
				player.on('animationcomplete', () => { player.setFrame(0); } );
			}
		}

		if (this.weeding) {

			if (this.toxic(fruit)) {
				model.incScore();
				this.mistakeText.setText('');
				player.on('animationcomplete', () => { player.setFrame(0); } );
			}
			else {
				model.decScore();
				this.mistakeText.setText('match: ' + model.strings()[fruit.index][0]);
				player.on('animationcomplete', () => { player.setFrame(8); } );
			}
		}

		this.scoreText.setText('score: ' + model.score()); 

		fruit.body.enable=false;
		fruit.body.gameObject.visible = false;

		model.consume();

		console.log('done = ' + model.done());
		console.log('lastRound = ' + model.lastRound());

		if (model.done() && ! model.lastRound()) {
			model.nextRound();
			this.scene.start('Play', {player_x:96});
		}
	}

	openDoorNext(player, door) {
		
		if (door.visible == false) return;

	    door.anims.play('open',true);
		
		door.on('animationcomplete', () => { this.movingToNextLevel = true; });
	}

	openDoorPrev(player, door) {

		if (door.visible == false) return;
		
		door.anims.play('open',true);

		door.on('animationcomplete', () => { this.movingToPrevLevel = true; });
	}
}

