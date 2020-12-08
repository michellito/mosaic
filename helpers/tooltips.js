function bisect(mx) {
  const bisect = d3.bisector(d => d.date).left;
  return mx => {
    const date = x.invert(mx);
    const index = bisect(data, date, 1);
    const a = data[index - 1];
    const b = data[index];
    return b && (date - a.date > b.date - date) ? b : a;
  };
}

let sleepTooltip = d3.tip()
	.attr('class', 'd3-tip')
	.direction('n')
	.offset([-10, 0])
	.html(function(event ,d) {
		var formatTime = d3.timeFormat("%a, %b %e")
		return "<strong class='tooltip-text'>" + formatTime(d.date) + "<br/></strong> <div class='tooltip-text'>" + d.sleepMinutes + " hours</div>"
	});

let stepsTooltip = d3.tip()
	.attr('class', 'd3-tip')
	.direction('n')
	.offset([-10, 0])
	.html(function(event ,d) {
		var formatTime = d3.timeFormat("%a, %b %e")
		return "<strong class='tooltip-text'>" + formatTime(d.date) + "<br/></strong> <div class='tooltip-text'>" + d.steps + " steps</div>"
  });
  
let carbonDioxideTooltip = d3.tip()
	.attr('class', 'd3-tip')
	.direction('n')
	.offset([-10, 0])
	.html(function(event ,d) {
		var formatTime = d3.timeFormat("%a, %b %e")
		return "<strong class='tooltip-text'>" + formatTime(d.date) + "<br/></strong> <div class='tooltip-text'>" + d.carbonDioxide + " units</div>"
	});
