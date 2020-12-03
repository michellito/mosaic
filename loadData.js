
async function loadSummaryData(participants) {
    
  var allData = [];

  for (var i = 0; i < participants.length; i++) {
    var id = participants[i]
    var path = "data/" + id + '/' + id + "_summary.csv"
    var sleep_path = "data/" + id + '/' + id + "_sleep.csv"

    var summaryData = await d3.csv(path, function(d) {
      return {
        date: new Date(d.Steps_dateTime),
        sleepMinutes: +d.Sleep_Main_minutesAsleep,
        avgHeartRate: +d.HeartRate_value,
        steps: +d.Steps_duration,
      };
    })

    var sleepDetail = await d3.csv(sleep_path, function(d) {
      return {
        date: new Date(d.date),
        dateTime: new Date(d.dateTime),
        level: d.level,
        seconds: +d.seconds,
      };
    })
    
    allData[id] = {summaryData: summaryData, sleepDetail: sleepDetail};

  }

  console.log(allData)

  return allData;
}