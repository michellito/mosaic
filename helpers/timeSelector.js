function brushed({selection}) {
  if (selection) {
    var startDate = timeScale.invert(selection[0]);
    var endDate = timeScale.invert(selection[1]);
    // updateTimeRange([startDate, endDate]);
  }
}

function brushended({selection}) {
  if (!selection) {
    // this.props.updateTimeRange();
  }
}

let timelineGroup = d3.select("#main").select("svg")
  .append("g")
  .attr("id", "timeline")
  .attr("transform", `translate (${paddingLeft}, ${10})`);

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

var defaultSelection = [timeScale.range()[0], timeScale.range()[1]];

timelineGroup.append("g")
  .call(brush)
  .call(brush.move, defaultSelection);

  // append axes
timelineGroup.append("g")
    .attr("transform", `translate(${0}, ${height - 20})`)
    .call(timeAxis);