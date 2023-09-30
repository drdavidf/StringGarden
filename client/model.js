
class GameModel {

	levels ;

	currentIndex ; 

	round;

	constructor() {

		this.currentIndex = 0;

		this.round = 0;
	}

	init(levels) {

		this.levels = levels.map(function(level) {
			return new GameLevel(level.rounds);
		});	

		this.levels[0].open = true;
	}

	nextLevel() {

		this.currentIndex = this.currentIndex + 1;

		this.round = 0;

		this.current().restart();
	}

	prevLevel() {

		this.currentIndex = this.currentIndex - 1;

		this.round = 0;

		this.current().restart();
	}

	nextRound() {

		this.round = this.round + 1;

	}

	incScore() {

		this.current().incScore();

		if (!this.last() && this.current().score >= 4) 
			this.levels[this.currentIndex+1].open = true;
	}

	decScore() {

		this.current().decScore();
	}

	consume() {

		this.current().consume();

	}
	
	current() {

		return this.levels[this.currentIndex];
	}

	score() {

		return this.current().score;
	}

	regex() {

		return this.current().regex(this.round);

	}

	strings() {

		return this.current().strings(this.round);
	}

	first() {

		return this.currentIndex == 0;
	}

	last() {

		return this.currentIndex == this.levels.length-1;
	}

	done() {

		return this.current().done(this.round);
	}

	lastRound() {

		return this.current().last(this.round);
	}

	nextLevelOpen() {

		return !this.last() && this.levels[this.currentIndex+1].open;
	}
}

