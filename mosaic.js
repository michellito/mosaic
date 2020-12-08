// ---------------- global formatting vars -----------------//

let width = document.getElementById("main").offsetWidth * .8;
let height = window.innerWidth;
let paddingLeft = 100;
let paddingRight = 75;

// set up svg canvas
let svg = d3.select("#main")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// --------------------- initialize data ---------------------//

let allParticipants = [
  'S001', 'S002', 'S003', 'S004', 'S005',
  'S006', 'S007', 'S008', 'S009', 'S010',
  'S011', 'S012', 'S013', 'S014', 'S015',
  'S016', 'S017', 'S018', 'S019', 'S020',
  'S021', 'S022', 'S023', 'S024', 'S025',
  'S026', 'S027', 'S028', 'S029', 'S030',
]

let allAttributes = ['sleep', 'steps', 'carbon dioxide', 'humidity', 'temperature']
let avg = []
let avgExtents = {}

let selectedParticipants = ['S001', 'S002', 'S003']
let selectedAttributes = ['sleep']

// this var will hold the charts in order from top to bottom
let charts = [];

for (let i = 0; i < selectedParticipants.length; i++) {
  for (let j = 0; j < selectedAttributes.length; j++) {
    charts.push({id: selectedParticipants[i], attribute: selectedAttributes[j]});
  }
}

loadData(selectedParticipants).then(function(response) {
  selectedParticipantData = response;
  setScales(selectedParticipantData);
  drawCharts();

  // set participant & attrib select to initial values
  participantSelect.set(selectedParticipants);
  attributeSelect.set(selectedAttributes);
});

loadData(allParticipants).then(function(response) {
  getAvg(response);
});

// ------- up -------------//

function drawCharts() {

  console.log(charts)
  svg.selectAll(".chart")
    .data(charts, d => d.attribute + d.id)
    .join(
      function(enter) {
        let group = enter.append("g")
          .attr("class", "chart")
          .attr("transform", function(d, i) {
            return `translate(${0}, ${100 + (i * 80)})`
          })
          .each(function(d) {
            drawData(d3.select(this), d)
            drawAxes(d3.select(this), d)
          })
      },
      function(update) {
        let group = update
          .transition()
          .duration(1000)
          .attr('transform', (d,i) => `translate(${0}, ${100 + (i * 80)})`)
          .each(function(d) {
            updateData(d3.select(this), d)
            updateAxes(d3.select(this), d)
          })
      },
      function(exit) {
        exit.remove();
      }
    );
}

// -------------- handle initial drawing of data -------------- //

function drawData(group, d) {

  let attribute = d.attribute;
  let scale, colorScale, tooltip;
  
  if (attribute === 'sleep') {
    scale = sleepMinutesScale;
    colorScale = sleepMinutesColorScale;
    tooltip = sleepTooltip;
    attrib_name = 'sleepMinutes';
    dataLocation = 'fitbitSummary';
    chartType = 'bar'
  } else if (attribute === 'steps') {
    scale = stepsScale;
    colorScale = stepsColorScale;
    tooltip = stepsTooltip;
    attrib_name = 'steps';
    dataLocation = 'fitbitSummary';
    chartType = 'bar'
  } else if (attribute === 'carbon dioxide') {
    scale = carbonDioxideScale;
    colorScale = carbonDioxideColorScale;
    tooltip = stepsTooltip;
    attrib_name = 'carbonDioxide';
    dataLocation = 'dailyAir';
    chartType = 'line'
    lineColor = 'darkslateblue';
  } else if (attribute === 'humidity') {
    scale = humidityScale;
    colorScale = humidityColorScale;
    tooltip = stepsTooltip;
    attrib_name = 'humidity';
    dataLocation = 'dailyAir';
    chartType = 'line';
    lineColor = 'mediumseagreen';
  } else if (attribute === 'temperature') {
    scale = temperatureScale;
    colorScale = temperatureColorScale;
    tooltip = stepsTooltip;
    attrib_name = 'temperature';
    dataLocation = 'dailyAir';
    chartType = 'line';
    lineColor = 'sienna'
  }

  let data = selectedParticipantData[d.id][dataLocation];

  if (chartType === 'bar') {
    drawBarChart(group, data, scale, colorScale, tooltip, attrib_name);
  } else if (chartType === 'line') {
    drawLineChart(group, data, scale, colorScale, tooltip, attrib_name, lineColor);
  }
}

function drawLineChart(group, data, scale, colorScale, tooltip, attrib_name, lineColor) {

  let line = d3.line()
    .defined(d => !isNaN(d[attrib_name]))
    .x(function(d) { return timeScale(d.dateTime) })
    .y(function(d) {
      return scale(d[attrib_name]);
    })
  
  group.append("path")
    .datum(data.filter(line.defined()))
    .attr("class", "missingPath")
    .attr("stroke", "#ccc")
    .attr("fill", "none")
    .attr("d", line);

  group.append("path")
    .datum(data)
    .attr("class", "dataPath")
    .attr("fill", "none")
    .attr("stroke", lineColor)
    .attr("stroke-width", 2)
    .attr("d", line);
}

function drawBarChart(group, data, scale, colorScale, tooltip, attrib_name) {
  let rects = group.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return timeScale(d.date);
    })
    .attr("y", function(d, i) {
      return scale(d[attrib_name]);
    })
    .attr("width", 10)
    .attr("height", function(d, i) {
      return 50 - scale(d[attrib_name]);
    })
    .attr("fill", function(d, i) {
      return colorScale(d[attrib_name])
    });
  
  // call tooltip only if data exists for participant (other throws error)
  if (data.length) {
    rects.call(tooltip)
    .on('mouseover', function(event,d) {
      tooltip.show(event, d)
    })
    .on('mouseout', tooltip.hide)
  }
    
}

function drawAxes(group, d) {

  let attribute = d.attribute;
  let axis, label;
  
  if (attribute === 'sleep') {
    axis = sleepMinutesAxis;
    className = 'sleepAxis';
    label = 'Sleep (hrs/day)';
  } else if (attribute === 'steps') {
    axis = stepsAxis;
    className = 'stepsAxis';
    label = 'Steps';
  } else if (attribute === 'carbon dioxide') {
    axis = carbonDioxideAxis;
    className = 'carbonDioxideAxis';
    label = 'CO2'
  } else if (attribute === 'humidity') {
    axis = humidityAxis;
    className = 'humidityAxis';
    label = 'CO2'
  } else if (attribute === 'temperature') {
    axis = temperatureAxis;
    className = 'temperatureAxis';
    label = 'CO2'
  }

  group.append("text")   
    .text(function(d) {
      return d.id
    })

  group.append("g")
    .attr("class", "timeAxis")
    .call(timeAxis)
    .attr("transform", `translate(${0}, ${50})`)
  
  group.append("g")
    .attr("class", className)
    .call(axis)
    .attr("transform", `translate(${paddingLeft}, ${0})`)
}

// --------------------- handle data update ------------------ //

function updateData(group, d) {
  let attribute = d.attribute;
  let scale, colorScale;
  
  if (attribute === 'sleep') {
    scale = sleepMinutesScale;
    colorScale = sleepMinutesColorScale;
    attrib_name = 'sleepMinutes';
    chartType = 'bar'
    dataLocation = 'fitbitSummary';
  } else if (attribute === 'steps') {
    scale = stepsScale;
    colorScale = stepsColorScale;
    attrib_name = 'steps';
    chartType = 'bar'
    dataLocation = 'fitbitSummary';
  } else if (attribute === 'carbon dioxide') {
    scale = carbonDioxideScale;
    colorScale = carbonDioxideColorScale;
    attrib_name = 'carbonDioxide';
    chartType = 'line'
    dataLocation = 'dailyAir';
  } else if (attribute === 'humidity') {
    scale = humidityScale;
    colorScale = humidityColorScale;
    attrib_name = 'humidity';
    chartType = 'line'
    dataLocation = 'dailyAir';
  } else if (attribute === 'temperature') {
    scale = temperatureScale;
    colorScale = temperatureColorScale;
    attrib_name = 'temperature';
    chartType = 'line'
    dataLocation = 'dailyAir';
  }
  
  
  if (chartType === 'bar') {
    group.selectAll("rect")
      .transition()
      .duration(1000)
      .attr("x", function(d, i) {
        return timeScale(d.date);
      })
      .attr("y", function(d, i) {
        return scale(d[attrib_name]);
      })
      .attr("width", 10)
      .attr("height", function(d, i) {
        return 50 - scale(d[attrib_name]);
      })
      .attr("fill", function(d, i) {
        return colorScale(d[attrib_name])
      })
  } else if (chartType === 'line') {
    let data = selectedParticipantData[d.id][dataLocation];
    
    let line = d3.line()
      .defined(d => !isNaN(d[attrib_name]))
      .x(function(d) { return timeScale(d.dateTime) })
      .y(function(d) {
        return scale(d[attrib_name]);
      })

    group.select(".missingPath")
      .datum(data.filter(line.defined()))
      .transition()
      .duration(1000)
      .attr("d", line);

    group.select(".dataPath")
      .datum(data)
      .transition()
      .duration(1000)
      .attr("d", line);
  }
}

function updateAxes(group, d) {

  let attribute = d.attribute;
  let axis, label;
  
  if (attribute === 'sleep') {
    axis = sleepMinutesAxis;
    className = 'sleepAxis';
  } else if (attribute === 'steps') {
    axis = stepsAxis;
    className = 'stepsAxis';
  } else if (attribute === 'carbon dioxide') {
    axis = carbonDioxideAxis;
    className = 'carbonDioxideAxis';
  } else if (attribute === 'humidity') {
    axis = humidityAxis;
    className = 'humidityAxis';
  } else if (attribute === 'temperature') {
    axis = temperatureAxis;
    className = 'temperatureAxis';
  }
 
  group.select(".timeAxis")
    .call(timeAxis)
  
  group.select("." + className)
    .call(axis)

}

// ------- setup sidebar menu & interactions ------------- //

function buildCharts() {
  let updatedCharts = [];
  if (orderSelect.selected() === 'Attribute') {
    for (let i = 0; i < selectedAttributes.length; i++) {
      for (let j = 0; j < selectedParticipants.length; j++) {
        updatedCharts.push({
          id: selectedParticipants[j],
          attribute: selectedAttributes[i]
        });
      }
    }
  } else {
    for (let i = 0; i < selectedParticipants.length; i++) {
      for (let j = 0; j < selectedAttributes.length; j++) {
        updatedCharts.push({
          id: selectedParticipants[i],
          attribute: selectedAttributes[j]
        });
      }
    }
  }
  charts = updatedCharts;
  drawCharts();
}

let orderSelect = new SlimSelect({
  select: '#orderSelect',
  showSearch: false,
  data: [
    {text: 'Participant'},
    {text: 'Attribute'}
  ],
  onChange: (info) => {
    buildCharts();
  }
})

let participantSelect = new SlimSelect({
  select: '#participantSelect',
  placeholder: 'Select Participants',
  data: 
    allParticipants.map(function(participant) {
      return {text: participant}
    }),
  closeOnSelect: false,
  onChange: (info) => {
    selectedParticipants = participantSelect.selected();
    loadData(selectedParticipants).then(function(response) {
      selectedParticipantData = response;
      setScales(selectedParticipantData);
      buildCharts();
    })
  }
})

let attributeSelect = new SlimSelect({
  select: '#attributeSelect',
  placeholder: 'Select Attributes',
  data: 
    allAttributes.map(function(attribute) {
      return {text: attribute}
    }),
  onChange: (info) => {
    selectedAttributes = attributeSelect.selected();
    buildCharts();
  }
})

d3.select("#filter-avg").on("click", function() {
  let minSteps = document.getElementById("minSteps").value;
  let maxSteps = document.getElementById("maxSteps").value;

  let filteredSteps = avg;

  if (minSteps) {
    filteredSteps = _.pickBy(filteredSteps, function(value, key) {
      return value.steps >= minSteps;
    })
  }

  if (maxSteps) {
    filteredSteps = _.pickBy(filteredSteps, function(value, key) {
      return value.steps <= maxSteps;
    })
  }

  selectedParticipants = Object.keys(filteredSteps);
  participantSelect.set(selectedParticipants);
  
  loadData(selectedParticipants).then(function(response) {
    selectedParticipantData = response;
    setScales(selectedParticipantData);
    buildCharts();
  })
});