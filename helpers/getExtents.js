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
  
  for (const participant in participantData) {
    timeExtents.push(d3.extent(participantData[participant].summaryData.map(function(d) {
      return d.date;
    })))

    sleepExtents.push(d3.extent(participantData[participant].summaryData.map(function(d) {
      return d.sleepMinutes;
    })));

    stepExtents.push(d3.extent(participantData[participant].summaryData.map(function(d) {
      return d.steps;
    })));

  }

  timeRange = getExtent(timeExtents);
  stepRange = getExtent(stepExtents);
  sleepRange = getExtent(sleepExtents);

  return {
    time: timeRange,
    steps: stepRange,
    sleep: sleepRange
  }
}