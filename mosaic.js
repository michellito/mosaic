// ---------------- global formatting vars -----------------//

let width = 800;
let height = window.innerWidth;
let paddingLeft = 50;



let svg = d3.select("#main")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// ------- data loading and calculating scales -------------//

let allParticipants = ['S001', 'S002', 'S003', 'S004', 'S005', 'S007']

let initialParticipants = ['S001', 'S002', 'S003']
let initialAttributes = ['sleep']

// this var will hold the charts at each screen position
// let charts = ["S001", "S002", "S003"]
let charts = [];

for (let i = 0; i < initialParticipants.length; i++) {
  for (let j = 0; j < initialAttributes.length; j++) {
    charts.push({id: initialParticipants[i], attribute: initialAttributes[j]});
  }
}




loadSummaryData(allParticipants).then(function(response) {
  let extents = getExtents(response);
  let timeDomain = extents.time;

  participantData = response;
  // console.log(participantData)

  timeScale = d3.scaleTime()
    .domain(timeDomain)
    .range([paddingLeft, width])

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

  drawSleepChart();

  let select = new SlimSelect({
    select: '#multiple',
    placeholder: 'Select Participants',
    onChange: (info) => {
      // console.log(select.selected());
      let selected = select.selected();
      let updatedCharts = [];
      for (let i = 0; i < selected.length; i++) {
        for (let j = 0; j < initialAttributes.length; j++) {
          updatedCharts.push({id: selected[i], attribute: initialAttributes[j]});
        }
      }
      charts = updatedCharts;
      console.log(charts)
      drawSleepChart();
      
    }
  })
  
  select.set(initialParticipants);
});


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

function drawSleepChart () {

  console.log('Draw sleep chart')

  svg.selectAll(".chart")
    .data(charts, d => d.id)
    .join(
      function(enter) {
        let group = enter.append("g")
          .attr("class", "chart")
          .attr("transform", function(d, i) {
            return `translate(${0}, ${100 + (i * 80)})`
          })
          .each(function(d) {
            drawSleepRects(d3.select(this), d)
          })
        group.append("text")
          .text(function(d) {
            return d.id
          })
        group.append("g").call(timeAxis)
          .attr("transform", `translate(${0}, ${50})`)
        group.append("g").call(sleepMinutesAxis)
          .attr("transform", `translate(${50}, ${0})`)
      },
      function(update) {
        console.log(update)
        update
          .transition()
          .duration(1000)
          .attr('transform', (d,i) => `translate(${0}, ${100 + (i * 80)})`)
      },
      function(exit) {
        console.log('exit')
        return exit.remove();
      }
    )
}

function drawSleepRects(group, d) {

  console.log(d)

  let data = participantData[d.id].summaryData;

  group.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return timeScale(d.date);
    })
    .attr("y", function(d, i) {
      return sleepMinutesScale(d.sleepMinutes);
    })
    .attr("width", 10)
    .attr("height", function(d, i) {
      return 50 - sleepMinutesScale(d.sleepMinutes);
    })
    .attr("fill", function(d, i) {
      return sleepMinutesColorScale(d.sleepMinutes)
    })
}


d3.select("#swap").on("click", function() {
  // swap index of selected dimension
  console.log('hey')
  // charts.pop()
  charts.push({id: 'S004', attribute: 'sleep'})

  // var i = 0;

  // var swapValue = charts[i + 1];
  // charts[i + 1] = charts[i];
  // charts[i] = swapValue;

  drawSleepChart()

});