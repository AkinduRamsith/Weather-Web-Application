const day = document.getElementById("live-d");
const weatherTable = document.getElementById("weather-data");
const nowDate = document.getElementById("current-date");
const tempP = document.getElementById("temp-p");


const loactionName=$("#locationName");
const mapLo=$("#google-map");


let tblBody = '';
// let geoApiUrl;
function refreshTime() {
  const timeDisplay = document.getElementById("live-t");
  const dateString = new Date().toLocaleTimeString();
  const formattedString = dateString.replace(", ", " - ");
  timeDisplay.textContent = formattedString;
}
setInterval(refreshTime, 1000);

const datetime = new Date().getDay();
console.log(datetime);
const daylist = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
day.textContent = daylist[datetime];
let forecastday;

function forecast() {
  for (let i = 0; i < 5; i++) {
    forecastday = new Date().getDay();
    const count = forecastday + i + 1;

    if (count < 7) {
      tblBody += `<tr><td>${daylist[count]}</td></tr>`;
    } else {
      const count2 = count - 7;
      tblBody += `<tr><td>${daylist[count2]}</td></tr>`;
    }
  }
  weatherTable.innerHTML = tblBody;
}
forecast();

// Date object
const date = new Date();

let currentDay = String(date.getDate()).padStart(2, '0');

let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

let currentYear = date.getFullYear();



let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
nowDate.textContent = currentDate;
tempP.textContent = currentDate;
console.log("The current date is " + currentDate);


function loc() {
  const successs = (position1) => {
    console.log(position1);
    const latitude = position1.coords.latitude;
    const longitude = position1.coords.longitude;
    console.log(latitude);
    console.log(longitude);
initMap(latitude,longitude)
    const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;


    // fetch(geoApiUrl)
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data);
    //   })
    $.ajax({
      method : "GET",
      url: geoApiUrl,
      success:(resp)=>{
        console.log(resp);
        loactionName.text(resp.locality)
      }
    })
  }
 

  const error = () => {
    console.log("yusdhsjd");
  }
  navigator.geolocation.getCurrentPosition(successs, error);
}

loc();

function initMap(lati, long) {
  var location = { lat: lati, lng: long };
  var map = new google.maps.Map(document.getElementById("google-map"), {
    zoom: 4,
    center: location,
  });
  var marker=new google.maps.Marker({
    position: location,
    map:map
  })
}


