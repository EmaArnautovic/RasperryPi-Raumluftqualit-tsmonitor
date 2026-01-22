const data = {
  labels: ['Temperatur', 'Luftfeuchte','CO2','IAQ', 'PM 2.5'],
  values: ['1','1','1','1','1','1'],
  maxDataValue: [50,100,5000,500,250]
};

function setDatetime(datetime){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '.' + mm + '.' + yyyy +'  '+ today.getHours() + ":"
        + today.getMinutes() + ":" + today.getSeconds();
    const date = document.querySelector("#datetime");
    date.textContent = `Gemessen am: ` + datetime;
}

const fetchData = async () => {
    try {
        const response = await fetch('/api/data');
        const databaseValues = await response.json();
        data.values = [];
        for (const [key, value] of Object.entries(databaseValues[0])) {
            data.values.push(value)
        }
        datetime = data.values.shift();
        setDatetime(datetime);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

async function fetchDataAndUpdate() {
  await fetchData();
  drawChart();
  colorBackground();
}

fetchDataAndUpdate(); 

setInterval(fetchDataAndUpdate, 60000);

function generateColors(labelName, value) {
  let color;
  switch (labelName) {
      case 'Temperatur':
          if (value < 20) {
              color = "#00ff00";
          } else if (value < 30) {
              color = "#e6e600";
          } else if (value < 40) {
              color = "#eb8f34";
          } else if (value < 50) {
              color = "red";
          } else {
              color = "dark red";
          }
          break;

      case 'Luftfeuchte':
          if (value < 20) {
              color = "#00ff00";
          } else if (value < 45) {
              color = "#e6e600";
          } else if (value < 65) {
              color = "#eb8f34";
          } else if (value < 85) {
              color = "red";
          } else {
              color = "dark red";
          }
          break;

      case 'CO2':
          if (value < 450) {
              color = "#00ff00";
          } else if (value < 650) {
              color = "#66ff8c";
          } else if (value < 800) {
              color = "#e6e600";
          } else if (value < 1500) {
              color = "#eb8f34";
          } else if (value < 3000) {
              color = "red";
          } else {
              color = "dark red";
          }
          break;

      case 'IAQ':
          if (value < 50) {
              color = "#00ff00";
          } else if (value < 100) {
              color = "#66ff8c";
          } else if (value < 200) {
              color = "#e6e600";
          } else if (value < 300) {
              color = "#eb8f34";
          } else if (value < 400) {
              color = "red";
          } else {
              color = "dark red";
          }
          break;

      case 'PM 2.5':
          if (value < 30) {
              color = "#00ff00";
          } else if (value < 60) {
              color = "#66ff8c";
          } else if (value < 90) {
              color = "#e6e600";
          } else if (value < 120) {
              color = "#eb8f34";
          } else if (value < 250) {
              color = "red";
          } else {
              color = "dark red";
          }
          break;
  }
  return color;
}


function colorBackground(){
  let iaq = data.values[3];
  let color;

  if(iaq<50){
    color = "#00ff00";
  }else if(iaq<100){
    color="#66ff8c"
  }else if(iaq<200){
    color = "#BBC50F"
  }else if(iaq<300){
    color="#eb8f34"
  }else if(iaq<400){
    color="red"
  }else{
    color="dark red"
  }

  document.body.style.transition = "3s";
  document.body.style.backgroundColor = color;

  if(color=="#eb8f34"){
    alert("Warnung: Luftqualität hat sich deutlich verschlechtert.")
  }

  if (color=="red" | color=="dark red"){
    alert("Gefahr! Die Luftqualität ist gefährlich für Ihre Gesundheit!")
  }
}

function drawChart() {
  console.log(data);
    const bars = document.querySelectorAll('.bar');
    const labels = document.querySelectorAll('.label');

    bars.forEach((bar, index) => {
        const value = data.values[index];
        const barHeight = (value / data.maxDataValue[index]) * 100;
        bar.style.height = barHeight + '%'; 
        bar.style.backgroundColor = generateColors(data.labels[index], data.values[index]);
    });

    labels.forEach((label, index) => {
        label.textContent = data.labels[index];
    });
}
