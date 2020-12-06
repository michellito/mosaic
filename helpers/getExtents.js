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

  }

  timeRange = getExtent(timeExtents);
  stepRange = getExtent(stepExtents);
  sleepRange = getExtent(sleepExtents);
  carbonDioxideRange = getExtent(carbonDioxideExtents);

  return {
    time: timeRange,
    steps: stepRange,
    sleep: sleepRange,
    carbonDioxide: carbonDioxideRange,
  }
}