function getExtents(participantData) {

  function getExtent(extents) {
    let min = extents[0][0]
    let max = extents[0][1]
  
    _.forEach(extents, function(extent) {
      if (extent[0] < min) {
        min = extent[0];
      }
        
      if (extent[1] > max) {
        max = extent[1]
      }
    });

    return [min, max];
  }
  
  let timeExtents = [];
  let sleepExtents = [];
  let stepExtents = [];
  let carbonDioxideExtents = [];
  let humidityExtents = []
  let temperatureExtents = [];
  
  for (const participant in participantData) {
    timeExtents.push(d3.extent(participantData[participant].fitbitSummary.map(function(d) {
      return d.date;
    })))

    sleepExtents.push(d3.extent(participantData[participant].fitbitSummary.map(function(d) {
      return d.sleepMinutes;
    })));

    stepExtents.push(d3.extent(participantData[participant].fitbitSummary.map(function(d) {
      return d.steps;
    })));

    carbonDioxideExtents.push(d3.extent(participantData[participant].dailyAir.map(function(d) {
      return d.carbonDioxide;
    })));

    humidityExtents.push(d3.extent(participantData[participant].dailyAir.map(function(d) {
      return d.humidity;
    })));

    temperatureExtents.push(d3.extent(participantData[participant].dailyAir.map(function(d) {
      return d.temperature;
    })));

  }

  timeRange = getExtent(timeExtents);
  stepRange = getExtent(stepExtents);
  sleepRange = getExtent(sleepExtents);
  carbonDioxideRange = getExtent(carbonDioxideExtents);
  humidityRange = getExtent(humidityExtents);
  temperatureRange = getExtent(temperatureExtents);

  return {
    time: timeRange,
    steps: stepRange,
    sleep: sleepRange,
    carbonDioxide: carbonDioxideRange,
    humidity: humidityRange,
    temperature: temperatureRange,
  }
}