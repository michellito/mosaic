function getAvg(data) {

    for (const id in data) {
      let participant = data[id];
      if (!avg[id]) {
        avg[id] = {}
        
        let stepsAvg = d3.mean(participant.fitbitSummary.map(function(data) {
          return data.steps;
        }));
        avg[id]['steps'] = stepsAvg;
        
        let sleepAvg = d3.mean(participant.fitbitSummary.map(function(data) {
          return data.sleepMinutes;
        }));
        avg[id]['sleepMinutes'] = sleepAvg;
        
        let carbonDioxideAvg = d3.mean(participant.dailyAir.map(function(data) {
          return data.carbonDioxide;
        }));
        avg[id]['carbonDioxide'] = carbonDioxideAvg;

        let humidityAvg = d3.mean(participant.dailyAir.map(function(data) {
          return data.humidity;
        }));
        avg[id]['humidity'] = humidityAvg;

        let temperatureAvg = d3.mean(participant.dailyAir.map(function(data) {
          return data.temperature;
        }));
        avg[id]['temperature'] = temperatureAvg;
      }
    }
  
    sleepAvg = []
    stepsAvg = []
    carbonDioxideAvg = []
    humidityAvg = []
    temperatureAvg = []

    _.forOwn(avg, function(value, key) { 
      sleepAvg.push(value.sleepMinutes)
      stepsAvg.push(value.steps)
      carbonDioxideAvg.push(value.carbonDioxide)
      humidityAvg.push(value.humidity)
      temperatureAvg.push(value.temperature)
    });
    
    avgExtents['steps'] = d3.extent(stepsAvg)
    avgExtents['sleepMinutes'] = d3.extent(sleepAvg)
    avgExtents['carbonDioxide'] = d3.extent(carbonDioxideAvg)
    avgExtents['humidity'] = d3.extent(humidityAvg)
    avgExtents['temperature'] = d3.extent(temperatureAvg)

  }