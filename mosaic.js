// ---------------- global formatting vars -----------------//

let width = document.getElementById("main").offsetWidth * .7;
let height = window.innerWidth;
let paddingLeft = 50;
let paddingRight = 50;

// set up svg canvas
let svg = d3.select("#main")
  .append("svg")
  .attr("width", width)
  .attr("height", height)



// ------- data loading and calculating scales -------------//

let allParticipants = [
  'S001', 'S002', 'S003', 'S004', 'S005',
  'S006', 'S007', 'S008', 'S009', 'S010',
  'S011', 'S012', 'S013', 'S014', 'S015',
  'S016', 'S017', 'S018', 'S019', 'S020',
  'S021', 'S022', 'S023', 'S024', 'S025',
  'S026', 'S027', 'S028', 'S029', 'S030',
]

let allAttributes = ['sleep', 'steps']

let initialParticipants = ['S001', 'S002', 'S003']
let initialAttributes = ['sleep']

// this var will hold the charts in order from top to bottom
let charts = [];

for (let i = 0; i < initialParticipants.length; i++) {
  for (let j = 0; j < initialAttributes.length; j++) {
    charts.push({id: initialParticipants[i], attribute: initialAttributes[j]});
  }
}

let participantSelect = new SlimSelect({
  select: '#participant-select',
  placeholder: 'Select Participants',
  data: 
    allParticipants.map(function(participant) {
      return {text: participant}
    })
  ,
  closeOnSelect: false,
  onChange: (info) => {
    let selected = participantSelect.selected();
    console.log(selected)
    loadSummaryData(selected).then(function(response) {
      participantData = response;
      setScales(response);

      let updatedCharts = [];
      for (let i = 0; i < selected.length; i++) {
        for (let j = 0; j < initialAttributes.length; j++) {
          updatedCharts.push({id: selected[i], attribute: initialAttributes[j]});
        }
      }

      charts = updatedCharts;
      drawCharts();
    })
  }
})

let attributeSelect = new SlimSelect({
  select: '#attribute-select',
  placeholder: 'Select Attributes',
  data: 
    allAttributes.map(function(attribute) {
      return {text: attribute}
    })
  ,
  closeOnSelect: false,
  onChange: (info) => {
    let selected = attributeSelect.selected();
    // console.log(selected)
    // loadSummaryData(selected).then(function(response) {
    //   participantData = response;
    //   setScales(response);

    //   let updatedCharts = [];
    //   for (let i = 0; i < selected.length; i++) {
    //     for (let j = 0; j < initialAttributes.length; j++) {
    //       updatedCharts.push({id: selected[i], attribute: initialAttributes[j]});
    //     }
    //   }

    //   charts = updatedCharts;
    //   drawCharts();
    // })
  }
})



function setScales(data) {
  let extents = getExtents(data);
  let timeDomain = extents.time;

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
  console.log(extents.sleep)
}


loadSummaryData(initialParticipants).then(function(response) {
  
  participantData = response;
  setScales(response);
  drawCharts();
  participantSelect.set(initialParticipants);
  attributeSelect.set(initialAttributes);

});

function drawCharts() {

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
        group.append("g")
          .attr("class", "timeAxis")
          .call(timeAxis)
          .attr("transform", `translate(${0}, ${50})`)
        group.append("g")
          .attr("class", "sleepAxis")
          .call(sleepMinutesAxis)
          .attr("transform", `translate(${50}, ${0})`)
        
      },
      function(update) {
        console.log('update')
        let group = update
          .transition()
          .duration(1000)
          .attr('transform', (d,i) => `translate(${0}, ${100 + (i * 80)})`)
          .each(function(d) {
            console.log(d.id)
            updateSleepRects(d3.select(this), d)
          })
        group.select(".timeAxis").call(timeAxis)
        group.select(".sleepAxis").call(sleepMinutesAxis)
          
      },
      function(exit) {
        console.log('exit')
        exit.remove();
      }
    )
}

function updateSleepRects(group, d) {
  group.selectAll("rect")
    .transition()
    .duration(1000)
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
    .call(sleepTooltip)
    .on('mouseover', function(event,d) {
      sleepTooltip.show(event, d)
    })
    .on('mouseout', sleepTooltip.hide)
}