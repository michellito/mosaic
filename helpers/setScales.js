function setScales(data) {
  let extents = getExtents(data);
  let timeDomain = extents.time;

  console.log(extents)

  // time scales
  timeScale = d3.scaleTime()
    .domain(timeDomain)
    .range([paddingLeft, width - paddingRight])

  timeAxis = d3.axisBottom()
    .scale(timeScale);


  // daily steps scale
  stepsScale = d3.scaleLinear()
    .domain(extents.steps)
    .range([50, 0]);
  
  stepsAxis = d3.axisLeft()
    .scale(stepsScale)
    .ticks(3);
  
  stepsColorScale = d3.scaleSequential(d3.interpolatePurples)
    .domain(extents.steps)
  
  // daily sleep scale
  sleepMinutesScale = d3.scaleLinear()
    .domain(extents.sleep)
    .range([50, 0]);

  sleepMinutesAxis = d3.axisLeft()
    .scale(sleepMinutesScale)
    .ticks(3);
  
  sleepMinutesColorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain(extents.sleep)

  // CO2 scales
  carbonDioxideScale = d3.scaleLinear()
    .domain(extents.carbonDioxide)
    .range([50, 0]);

  carbonDioxideAxis = d3.axisLeft()
    .scale(carbonDioxideScale)
    .ticks(3);
  
  carbonDioxideColorScale = d3.scaleSequential(d3.interpolateGreens)
    .domain(extents.carbonDioxide)

  // humidity scales
  humidityScale = d3.scaleLinear()
    .domain(extents.humidity)
    .range([50, 0]);

  humidityAxis = d3.axisLeft()
    .scale(humidityScale)
    .ticks(3);
  
  humidityColorScale = d3.scaleSequential(d3.interpolateGreens)
    .domain(extents.humidity)

  // temperature scales
  temperatureScale = d3.scaleLinear()
    .domain(extents.temperature)
    .range([50, 0]);

  temperatureAxis = d3.axisLeft()
    .scale(temperatureScale)
    .ticks(3);
  
  temperatureColorScale = d3.scaleSequential(d3.interpolateGreens)
    .domain(extents.temperature)

}