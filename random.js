

let Random = {};

Random.Default = null;	// Set this to Random.True or Random.Pseudo

Random.Base = class {
	intRange(min, max) {
		return Math.floor( this.randomFloat * (max - min) ) + min;
	}
	intBell(min, max) {
		let span = (max-min)/3;
		return min + Math.floor( this.randomFloat*span + this.randomFloat*span + this.randomFloat*span );
	}
	chance100(percent) {
		return this.floatRange(0,100) < percent;
	}
	floatRange(min, max) {
		return this.randomFloat*(max-min)+min;
	}
	floatBell(min, max) {
		let span = (max-min)/3;
		return min + this.randomFloat*span + this.randomFloat*span + this.randomFloat*span;
	}
	chance(fPercent) {
		return this.randomFloat < fPercent;
	}
}

Random.True = new class extends Random.Base {
	constructor() {
		super();
		this.trueRandom = Math.random;
		Math.random = ()=>console.assert(false);
	}
	get randomFloat() {
		return this.trueRandom();
	}
}


Random.Pseudo = new class extends Random.Base {
	constructor() {
		super();
		this.seedOriginal = null;
		this._seed = null;
	}
	seed(seed) {
		console.assert( Number.isInteger(seed) );
		this.seedOriginal = seed;
		this._seed = seed % 2147483647;
		if (this._seed <= 0) { this._seed += 2147483646; }
	}
	get randomMaxInt() {
		console.assert( this.seedOriginal !== null );
		this._seed = this._seed * 16807 % 2147483647;
		return this._seed;
	}
	get randomFloat() {
		return this.randomMaxInt / 2147483647;
	}
};

Random.shuffle = function(array,randomGenerator=Random.Psuedo) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = randomGenerator.intRange( 0, (i + 1) );
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

Random.shufflePairs = function(array,randomGenerator=Random.Psuedo) {
	for (let i = array.length/2 - 1; i > 0; i-=1) {
		let j = randomGenerator.intRange( 0, (i + 1) );
		[array[2*i+0],array[2*i+1], array[2*j+0],array[2*j+1]] = [array[2*j+0],array[2*j+1], array[2*i+0],array[2*i+1]];
	}
	return array;
}

