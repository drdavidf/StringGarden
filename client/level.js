
class GameLevel {

	rounds ;

	score ; 

	highScore ;

	consumed ;

	open ; 

	constructor(rounds) {

		this.open = false;

		this.rounds = rounds;

		this.score = 0;

		this.highScore = 0;

		this.consumed = 0;

	}

	restart() {

		this.score = 0;

		this.consumed = 0;
	}

	consume() {

		this.consumed = this.consumed + 1;

	}

	done(round) {

		return this.consumed == this.rounds[round].strings.length;

	}

	last(round) {

		return round == this.rounds.length-1;
	}

	incScore() {

		this.score = this.score + 1;
	}	

	decScore() {

		this.score = this.score - 1;

	}

	regex(round) {

		return this.rounds[round].regex;

	}

	strings(round) {

		return this.rounds[round].strings;
	}

}

