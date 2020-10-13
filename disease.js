

let Illness = class {
	constructor() {
		this.isAsym = false;
		this.daysToSymptoms = 0;
		this.daysToContagious = 0;
	}
	begin( age, asymChance ) {
		let chance = asymChance.select(age);
		this.isAsym = Random.Default.chance( chance );
		this.daysToSymptoms = 
		this.daysToContagious = 3;
	}
}

function 
	initialize(asymChance,asymInfect) {
		this.asymChance = asymChance;
		this.asymInfect = asymInfect;
	}
	catchDisease(age) {

		let assymptomaticChance = age <= 20 ? 80 : 
	}
}

/*
Korean study on asymptomatic chances
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7409994/

Additional data on asymptomatic is here:
https://www.cebm.net/covid-19/covid-19-what-proportion-are-asymptomatic/
but we chose the CDC estimate, from 

Here is the CDC's official planning scenarios, from which we pulled 
our numbers:
https://www.cdc.gov/coronavirus/2019-ncov/hcp/planning-scenarios.html

CDC states 40% asymptomatic. The Korean study had 62% because they were testing
some people who later showed symptoms. So we adjust all the
values appropriately.
*/

let cdcAsym = 0.40;
let koreanAsym = 0.62;
let cdcAdjust = cdcAsym/koreanAsym;
let cdcAsymInfect = 0.75;

let asymData = [
	{ upTo: 19, value: 0.701*cdcAdjust }, // about 45%
	{ upTo: 29, value: 0.626*cdcAdjust }, 
	{ upTo: 39, value: 0.596*cdcAdjust }, 
	{ upTo: 49, value: 0.573*cdcAdjust }, // about 36%
	{ upTo: 59, value: 0.599*cdcAdjust }, 
	{ upTo: 69, value: 0.616*cdcAdjust }, 
	{ upTo: 119, value: 0.687*cdcAdjust },
];

/*
https://www.acc.org/latest-in-cardiology/journal-scans/2020/05/11/15/18/the-incubation-period-of-coronavirus-disease
Median incubation is 5 days 
97.5% of people who were infected exhibited symptoms by 11.5 days

Times to symptoms are shown in a graph here:
https://github.com/HopkinsIDD/ncov_incubation
*/

// This function is based on a reverse-engineered graph, so the x and y are pixel values.
function generateTimeToSymptoms() {
	let h = 283;
	let w = 512;
	// y was from the top of the chart, because screen space is top-to-bottom, and thus
	// the original x was inverted right-to-left. The x shown here is corrected left-to-right.
	//let y = [ 0, 14, 28, 42, 57, 71, 85, 99, 113, 127, 141, 156, 170, 184, 198, 212, 226, 240, 255, 268, 283 ];
	let x = [ 64, 75, 85, 91, 97, 104, 110, 117, 123, 130, 137, 144, 153, 162, 172, 185, 203, 223, 268, 339 ];
	// Note that the final value of x is 339, because if we pick the highest percentile we don't actually
	// want to choose the longest possible value on the chart (20 days). Instead 13 days is the longest realistic maximum.
	let maxDays = 20;	// coincidence that this is the same as steps. The graph just used 20 days

	let steps = 20;
	console.assert( y.length==steps && x.length==steps );
	let n = [];
	for( let i=0 ; i<steps ; ++i ) {
		let upTo  = Math.floor( (i+1)/steps*100 ); // roughly (h-y[i])/h * 0.05 or 5% per slot
		let days  = ( x[i] / w ) * maxDays;
		n.push({
			upTo: upTo,
			value: days
		});
	}
	return n;
}

let asymChancePicker = new Random.IntegerRangePickerFast( asymData );
let durationPicker   = new Random.IntegerRangePickerFast( generateTimeToSymptoms() );

