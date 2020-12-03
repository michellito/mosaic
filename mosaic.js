// ---------------- global formatting vars -----------------//

var width = 800;
var height = window.innerWidth;
var paddingLeft = 50;

var svg = d3.select("#main")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// ------- data loading and calculating scales -------------//


let initialParticipants = ['S001', 'S002', 'S003']
let initialAttributes = ['sleep']

// this var will hold the charts at each screen position
const charts = ["S001", "S002", "S003"]

// for (let i = 0; i < initialParticipants.length; i++) {
//   for (let j = 0; j < initialAttributes.length; j++) {
//     charts.push({id: initialParticipants[i], attribute: initialAttributes[j]});
//   }
// }

// console.log(charts)

loadSummaryData(initialParticipants).then(function(response) {
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

function drawAxes() {

}

function drawSleepChart () {

  console.log('Draw sleep chart')

  svg.selectAll(".chart")
    .data(charts)
    .join(
      function(enter) {
        console.log(enter)
        return enter.append("g")
          .attr("class", "chart")
          .attr("transform", function(d, i) {
            return `translate(${0}, ${100 + i * 80})`
          })
          .append("text")
          .text(function(d) {
            return d
          })
      },
      function(update) {
        return update;
      },
      function(exit) {
        console.log(exit)
        return exit.remove();
      }
    )
}

function drawRects(group, d) {
  // console.log(d);
  let data = participantData[d.id].summaryData;
  // console.log(data)

  group.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      // console.log(this.xScale(d.date))
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

  // for (var i = 0; i < participantData.length; i++) {
  //   let id = participantData[i].id;
    
  //   var sleepGroup = svg.append("g")
  //     .attr("id", id)
  //     .attr("transform", `translate (${50}, ${100 + (i * 70)})`);

  //   sleepGroup.selectAll("rect")
  //     .data(participantData[i].data)
  //     .enter()
  //     .append("rect")
  //     .attr("x", function(d, i) {
  //       // console.log(this.xScale(d.date))
  //       return timeScale(d.date);
  //     })
  //     .attr("y", function(d, i) {
  //       return sleepMinutesScale(d.sleepMinutes);
  //     })
  //     .attr("width", 10)
  //     .attr("height", function(d, i) {
  //       return 50 - sleepMinutesScale(d.sleepMinutes);
  //     })
  //     .attr("fill", function(d, i) {
  //       return sleepMinutesColorScale(d.sleepMinutes)
  //     })
  //     // .on('mouseover', function(event,d) {
  //     //   tooltip.show(event, d)
  //     // })
  //     // .on('mouseout', tooltip.hide)
    
  //     // append axes
  //   sleepGroup.append("g")
  //     .attr("class", "xAxis")
  //     .attr("transform", `translate(${0}, ${(i * 50)})`)
  //     .call(timeAxis);
  
  //   sleepGroup.append("g")
  //     .attr("transform", `translate(${paddingLeft}, ${0})`)
  //     .call(sleepMinutesAxis);
    
  // }


  d3.select("#swap").on("click", function() {
    // swap index of selected dimension
    console.log('hey')
    charts.pop()
    // charts.push('S004')


    // var i = 0;

    // var swapValue = charts[i + 1];
    // charts[i + 1] = charts[i];
    // charts[i] = swapValue;

    console.log(charts)


    
  });