
// This supports only integer ranges. The values can be anything.
Random.IntegerRangePickerFast = class {
	constructor() {
		this.choiceList = null;
	}
	// The rangelist must contain an array of [ {count,value} ]
	// where count is the number of values you want to generate, and value is what
	// value to return when a number in that range is picked.
	populate(rangeList) {
		this.choiceList = [];
		console.assert( Array.isArray(rangeList) );
		for( let i=0 ; i<rangeList.length ; ++i ) {
			let validCount = Number.isInteger(rangeList[i].count) && rangeList[i].count > 0;
			let validUpTo  = Number.isInteger(rangeList[i].upTo) && rangeList[i].upTo > 0;
			console.assert( validCount || validUpTo );
			let count = validCount ? rangeList[i].count : rangeList[i].upTo - (i<=0?0:rangeList[i-1].upTo);
			console.assert( rangeList[i].value !== undefined );
			for( let j=0 ; j<count ; ++j ) {
				this.choiceList.push( rangeList[i].value );
			}
		}
		console.log( 'Picker got '+this.choiceList.length+' options.' );
	}
	pickRandom(rng=Random.Default) {
		let n = rng.intRange(0,this.choiceList.length);
		return this.choiceList[n];
	}
	select(index) {
		console.assert( index >= 0 && index < choiceList.length );
		return this.choiceList[n];
	}
}

Random.VisitProvider = class {
	constructor() {
		this.visitList = [];
		this.day = 0;
	}
	// For example 2 visits among 7 days worth of potential visits
	populate(visits,opportunities,rng=Random.Default) {
		console.assert( visits > 0 && Number.isInteger(visits) );
		console.assert( visits<=opportunities && Number.isInteger(opportunities) );
		for( let i=0 ; i<opportunities ; ++i ) {
			this.visitList.push( i < visits );
		}
		Random.shuffle(this.visitList,rng);
		this.day = 0;
	}
	getNextAndWrapAround() {
		let value = this.visitList[this.day];
		this.day = (this.day+1) % this.visitList.length;
		return value;
	}
}
