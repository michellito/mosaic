function getAvg(data) {

    for (const id in data) {
      let participant = data[id];
      if (!avg[id]) {
        avg[id] = {}
        let steps_avg = d3.mean(participant.summaryData.map(function(data) {
          return data.steps;
        }));
        avg[id]['steps'] = steps_avg;
        let sleep_avg = d3.mean(participant.summaryData.map(function(data) {
          return data.sleepMinutes;
        }));
        avg[id]['sleepMinutes'] = sleep_avg;
      }
    }
  
    sleepAvg = []
    stepsAvg = []
  
    _.forOwn(avg, function(value, key) { 
      sleepAvg.push(value.sleepMinutes)
      stepsAvg.push(value.steps)
    } );
    
    avgExtents['steps'] = d3.extent(stepsAvg)
    avgExtents['sleepMinutes'] = d3.extent(sleepAvg)
    console.log(avg)
  }