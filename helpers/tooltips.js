sleepTooltip = d3.tip()
    .attr('class', 'd3-tip')
    .direction('n')
    .offset([-10, 0])
    .html(function(event ,d) {
      var formatTime = d3.timeFormat("%a, %b %e")
      return "<strong>" + formatTime(d.date) + "<br/></strong> <div style='margin-top:5px'>" + d.sleepMinutes + " hours</div>"
    });
