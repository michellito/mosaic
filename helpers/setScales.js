function setScales(data) {
  let extents = getExtents(data);
  let timeDomain = extents.time;

  timeScale = d3.scaleTime()
    .domain(timeDomain)
    .range([paddingLeft, width - paddingRight])

  timeAxis = d3.axisBottom()
    .scale(timeScale);

  stepsScale = d3.scaleLinear()
    .domain(extents.steps)
    .range([50, 0]);
  
  stepsAxis = d3.axisLeft()
    .scale(stepsScale)
    .ticks(3);
  
  stepsColorScale = d3.scaleSequential(d3.interpolatePurples)
    .domain(extents.steps)
  
  sleepMinutesScale = d3.scaleLinear()
    .domain(extents.sleep)
    .range([50, 0]);

  sleepMinutesAxis = d3.axisLeft()
    .scale(sleepMinutesScale)
    .ticks(3);
  
  sleepMinutesColorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain(extents.sleep)

}