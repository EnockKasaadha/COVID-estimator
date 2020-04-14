const data = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};


const impact = {};
const severeImpact = {};


const covid19ImpactEstimator = (data) => {
  // CHALLENGE ONE

  // number of estimated infected people given the reported cases in the data
  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;

  // estimation of number of infections in a given period
  var factor, days;

  if (data.periodType === 'days') {
    factor = Math.floor(data.timeToElapse / 3);
    days = data.timeToElapse;
  } else if (data.periodType === 'weeks') {
    days = data.timeToElapse * 7;
    factor = Math.floor(days / 3);
  } else if (data.periodType === 'months') {
    days = data.timeToElapse * 30;
    factor = Math.floor(days / 3);
  }

  impact.infectionsByRequestedTime =
    impact.currentlyInfected * Math.pow(2, factor);
  severeImpact.infectionsByRequestedTime =
    severeImpact.currentlyInfected * Math.pow(2, factor);

  // CHALLENGE TWO
  // determine the number of severe cases
  impact.severeCasesByRequestedTime = 0.15 * impact.infectionsByRequestedTime;
  severeImpact.severeCasesByRequestedTime =
    0.15 * severeImpact.infectionsByRequestedTime;

  // comparing the beds available with number of severe cases
  var bedsAvailable = 0.35 * data.totalHospitalBeds;
  impact.hospitalBedsByRequestedTime =
    bedsAvailable - impact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime =
    bedsAvailable - severeImpact.severeCasesByRequestedTime;

  // CHALLENGE THREE
  // cases that need ICU services
  impact.casesForICUByRequestedTime = 0.05 * impact.infectionsByRequestedTime;
  severeImpact.casesForICUByRequestedTime =
    0.05 * severeImpact.infectionsByRequestedTime;

  // ventilators needed
  impact.casesForVentilatorsByRequestedTime =
    0.02 * impact.infectionsByRequestedTime;
  severeImpact.casesForVentilatorsByRequestedTime =
    0.02 * severeImpact.infectionsByRequestedTime;

  // impact on the economy
  impact.dollarsInFlight = (
    impact.infectionsByRequestedTime *
    data.region.avgDailyIncomePopulation *
    data.region.avgDailyIncomeInUSD *
    days
  ).toFixed(2);
  severeImpact.dollarsInFlight = (
    severeImpact.infectionsByRequestedTime *
    data.region.avgDailyIncomePopulation *
    data.region.avgDailyIncomeInUSD *
    days
  ).toFixed(2);

  return { data, impact, severeImpact };
};

covid19ImpactEstimator(data);


export default covid19ImpactEstimator;
