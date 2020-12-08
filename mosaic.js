// ---------------- global formatting vars -----------------//

let width = 1100;
let height = window.innerWidth;
let paddingLeft = 120;
let paddingRight = 75;

// set up svg canvas
let svg = d3.select("#main")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

let timelineGroup = d3.select("#main").select("svg")
  .append("g")
  .attr("id", "timeline")
  .attr("transform", `translate (${0}, ${20})`);

timelineGroup.append("rect")
  .attr("x", paddingLeft)
  .attr("y", 0)
  .attr("height", 30)
  .attr("width", width - paddingLeft - paddingRight)
  .style("stroke", d3.rgb(169,169,169))
  .style("stroke-width", "2")
  .style("fill", d3.rgb(211,211,211))

function brushed({selection}) {
  // console.log('hi')
  if (selection) {
    var startDate = timeScale.invert(selection[0]);
    var endDate = timeScale.invert(selection[1]);
    // updateTimeRange([startDate, endDate]);
  }
}

function brushended({selection}) {
  // console.log('end')
  if (!selection) {
   
    // this.props.updateTimeRange();
  }
}
  
let brush = d3.brushX()
  .extent([[paddingLeft, 0], [width - paddingRight, 30]])
  .on("brush", brushed)
  .on("end", brushended);

let slider = document.getElementById('slider');

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

 

  var defaultSelection = [timeScale.range()[0], timeScale.range()[1]];

  timelineGroup.append("g")
    .call(brush)
    .call(brush.move, defaultSelection);

    // append axes
  timelineGroup.append("g")
      .attr("transform", `translate(${0}, ${30})`)
      .call(timeAxis);

});

loadData(allParticipants).then(function(response) {
  getAvg(response);
  

  noUiSlider.create(slider, {
      start: [Math.round(avgExtents['sleepMinutes'][0]), Math.round(avgExtents['sleepMinutes'][1])],
      tooltips: [true, true],
      connect: true,
      step: 1,
      range: {
          'min': Math.round(avgExtents['sleepMinutes'][0]),
          'max': Math.round(avgExtents['sleepMinutes'][1])
      }
  });
});

// ------- up -------------//

function drawCharts() {

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
    label = 'Sleep';
    units = '(hrs/day)'
  } else if (attribute === 'steps') {
    axis = stepsAxis;
    className = 'stepsAxis';
    label = 'Steps';
    units = '(steps/day)'
  } else if (attribute === 'carbon dioxide') {
    axis = carbonDioxideAxis;
    className = 'carbonDioxideAxis';
    label = 'CO₂ Level'
    units = '(ppm)'
  } else if (attribute === 'humidity') {
    axis = humidityAxis;
    className = 'humidityAxis';
    label = 'Humidity'
    units = '(%)'
  } else if (attribute === 'temperature') {
    axis = temperatureAxis;
    className = 'temperatureAxis';
    label = 'Temperature'
    units = '(°F)'
  }

  group.append("text")   
    .text(function(d) {
      return d.id
    })
    .attr("transform", `translate(${0}, ${15})`)
    .attr("class", "participant-label")
  
  group.append("text")   
    .text(function(d) {
      return label
    })
    .attr("transform", `translate(${0}, ${38})`)
    .attr("class", "attribute-label")
  
  group.append("text")   
    .text(function(d) {
      return units
    })
    .attr("transform", `translate(${0}, ${53})`)
    .attr("class", "unit-label")
    

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

let avgAttributeSelect = new SlimSelect({
  select: '#avgAttributeSelect',
  showSearch: false,
  data: allAttributes.map(function(attribute) {
    return {text: attribute}
  }),
  onChange: (info) => {
    let selectedAttribute = avgAttributeSelect.selected()
    let varMap = {
      'steps': 'steps',
      'sleep': 'sleepMinutes',
      'carbon dioxide': 'carbonDioxide',
      'humidity': 'humidity',
      'temperature': 'temperature',
    }
    slider.noUiSlider.updateOptions(
      { range: 
        { 
          'min': Math.round(avgExtents[varMap[selectedAttribute]][0]),
          'max': Math.round(avgExtents[varMap[selectedAttribute]][1])
        }
      },
      true // Boolean 'fireSetEvent'
    );

    slider.noUiSlider.set([Math.round(avgExtents[varMap[selectedAttribute]][0]), Math.round(avgExtents[varMap[selectedAttribute]][1])]);
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

  let varMap = {
    'steps': 'steps',
    'sleep': 'sleepMinutes',
    'carbon dioxide': 'carbonDioxide',
    'humidity': 'humidity',
    'temperature': 'temperature',
  }

  let attribute = varMap[avgAttributeSelect.selected()]
  let range = slider.noUiSlider.get()
  
  range = [+range[0], +range[1]]

  let filteredData = avg;

  if (range[0]) {
    filteredData = _.pickBy(filteredData, function(value, key) {
      return value[attribute] >= range[0];
    })
  }

  if (range[1]) {
    filteredData = _.pickBy(filteredData, function(value, key) {
      return value[attribute] <= range[1];
    })
  }

  selectedParticipants = Object.keys(filteredData);
  participantSelect.set(selectedParticipants);
  
  loadData(selectedParticipants).then(function(response) {
    selectedParticipantData = response;
    setScales(selectedParticipantData);
    buildCharts();
  })
});