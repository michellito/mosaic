function brushed({selection}) {
    if (selection) {
      
      var startDate = xScale.invert(selection[0]);
      var endDate = xScale.invert(selection[1]);
      updateTimeRange([startDate, endDate]);
    }
  }

  function brushended({selection}) {
    if (!selection) {
      this.props.updateTimeRange();
    }
  }
  
  var updateTimeRange = this.props.updateTimeRange;
  var positionX = this.props.positionX;
  var positionY = this.props.positionY;
  
  var id = this.props.id;

  var paddingBottom = 20;
  var paddingLeft = 50;

  var width = this.props.width;
  var height = this.props.height;
  var data = this.props.data;

  var xScale = d3.scaleTime()
    .domain(this.props.timeRange)
    .range([paddingLeft, width])
  
  var xAxis = d3.axisBottom()
    .scale(xScale);

  var timelineGroup = d3.select("#main-container").select("svg")
    .append("g")
    .attr("id", id)
    .attr("transform", `translate (${positionX}, ${positionY})`);
  
  timelineGroup.append("rect")
    .attr("x", paddingLeft)
    .attr("y", 0)
    .attr("height", 30)
    .attr("width", width - paddingLeft)
    .style("stroke", d3.rgb(169,169,169))
    .style("stroke-width", "2")
    .style("fill", d3.rgb(211,211,211))
  
  var brush = d3.brushX()
    .extent([[paddingLeft, 0], [width, height]])
    .on("brush", brushed)
    .on("end", brushended);

  var defaultSelection = [xScale.range()[0], xScale.range()[1]];

  timelineGroup.append("g")
    .call(brush)
    .call(brush.move, defaultSelection);
  
    // append axes
  timelineGroup.append("g")
      .attr("transform", `translate(${0}, ${height - 20})`)
      .call(xAxis);