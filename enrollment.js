var chemicalEngineering = [];
var civilEngineering = [];
var computerScience = [];
var electricalEngineering = [];
var mechanicalEngineering = [];

//2015 --> 2004
chemicalEngineering = [33.4,	33.1,	29.7,	30.5,	32.4,	31.3,	33.4,	37.1, 35.6,	31.4,	29.2,	34.4];
civilEngineering = [36,	33.9,	33.3,	35.8,	35.1,	33.9,	33.1,	29.9,	33.1,	29,	30.2,	31];
computerScience = [17.4,	16.9,	16.4,	16.2,	16.7,	15.1,	12.6,	10.6,	9.9,	13.2,	15.6,	19.6];
electricalEngineering = [18.2,	18.1,	16.6,	16.02,	14.6,	13.6,	13.3,	12.1,	11.3,	13.2,	13.3,	14.7];
mechanicalEngineering = [16.4,	15.2,	28.6,	13.04,	9.9,	12.4,	12.5,	11, 12.7,	14.5,	13.8,	15.4];

//2004 --> 2015
chemicalEngineering = chemicalEngineering.reverse();
civilEngineering = civilEngineering.reverse();
computerScience = computerScience.reverse();
electricalEngineering = electricalEngineering.reverse();
mechanicalEngineering = mechanicalEngineering.reverse();

//testing to see if it works
// console.log(chemicalEngineering);
// console.log(civilEngineering);
// console.log(computerScience);
// console.log(electricalEngineering);
// console.log(mechanicalEngineering);