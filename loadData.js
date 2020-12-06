function fileExists(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();
   
  return xhr.status !== 404;
}

async function loadData(participants) {
    
  let allData = {};

  for (let i = 0; i < participants.length; i++) {
    let id = participants[i]
    let summaryPath = "data/" + id + '/' + id + "_summary.csv"
    let sleepPath = "data/" + id + '/' + id + "_sleep.csv"
    let airPath = "data/" + id + '/' + id + "_daily_air.csv"

    let fitbitSummary = [];
    let sleepDetail = [];
    let airDetail = [];

    if (fileExists(summaryPath)) {
      fitbitSummary = await d3.csv(summaryPath, function(d) {
        if (d) {
          return {
            date: new Date(d.Steps_dateTime),
            sleepMinutes: parseInt(d.Sleep_Main_minutesAsleep) / 60.0,
            avgHeartRate: +d.HeartRate_value,
            steps: parseInt(d.Steps_duration),
          };
        }
      })

    }
    if (fileExists(sleepPath)) {
      sleepDetail = await d3.csv(sleepPath, function(d) {
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

    if (fileExists(airPath)) {
      dailyAir = await d3.csv(airPath, function(d) {
        if (d) {
          return {
            dateTime: new Date(d.Timestamp),
            temperature: parseFloat(d.Temperature),
            carbonDioxide: parseFloat(d.CO2),
            humidity: parseFloat(d.Humidity),
          };
        }
      })
    }
    
    allData[id] = {
      fitbitSummary: fitbitSummary,
      sleepDetail: sleepDetail,
      dailyAir: dailyAir,
    };

  }

  console.log(allData)

  return allData;
}