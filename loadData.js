function fileExists(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();
   
  return xhr.status !== 404;
}

async function loadSummaryData(participants) {
    
  let allData = {};

  for (let i = 0; i < participants.length; i++) {
    let id = participants[i]
    let path = "data/" + id + '/' + id + "_summary.csv"
    let sleep_path = "data/" + id + '/' + id + "_sleep.csv"

    let summaryData = [];
    let sleepDetail = [];

    if (fileExists(path)) {
      summaryData = await d3.csv(path, function(d) {
        if (d) {
          return {
            date: new Date(d.Steps_dateTime),
            sleepMinutes: +d.Sleep_Main_minutesAsleep / 60.0,
            avgHeartRate: +d.HeartRate_value,
            steps: +d.Steps_duration,
          };
        }
      })

    }
    if (fileExists(sleep_path)) {
      sleepDetail = await d3.csv(sleep_path, function(d) {
        if (d) {
          return {
            date: new Date(d.date),
            dateTime: new Date(d.dateTime),
            level: d.level,
            seconds: +d.seconds,
          };
  
        }
        
      })
    }
    
    allData[id] = {summaryData: summaryData, sleepDetail: sleepDetail};

  }

  return allData;
}