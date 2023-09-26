// const day = document.getElementById("live-d");
const weatherTable = document.getElementById("weather-data");
const nowDate = document.getElementById("current-date");
const tempP = document.getElementById("temp-p");


const loactionName = $("#locationName");
const tempertaure = $("#tempertaure");
const weatherType = $("#live-d");
// const map = $("#map");


let tblBody = '';
// let geoApiUrl;
function refreshTime() {
  const timeDisplay = document.getElementById("live-t");
  const options = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const dateString = new Date().toLocaleTimeString('en-US', options);
  timeDisplay.textContent = dateString;
}

setInterval(refreshTime, 1000);

const datetime = new Date().getDay();
console.log(datetime);
const daylist = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// day.textContent = daylist[datetime];
let forecastday;

// function forecast() {
//   for (let i = 0; i < 5; i++) {
//     forecastday = new Date().getDay();
//     const count = forecastday + i + 1;

//     if (count < 7) {
//       tblBody += `<tr><td>${daylist[count]}</td></tr>`;
//     } else {
//       const count2 = count - 7;
//       tblBody += `<tr><td>${daylist[count2]}</td></tr>`;
//     }
//   }
//   weatherTable.innerHTML = tblBody;
// }
// forecast();

// Date object
const date = new Date();

let currentDay = String(date.getDate()).padStart(2, '0');

let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

let currentYear = date.getFullYear();



let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
nowDate.textContent = currentDate;
tempP.textContent = currentDate;
console.log("The current date is " + currentDate);

// let zoomed;
function loc() {
  const successs = (position1) => {
    console.log(position1);
    const latitude = position1.coords.latitude;
    const longitude = position1.coords.longitude;
    const accuracy = position1.coords.accuracy;


    var map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const marker = L.marker([latitude, longitude]).addTo(map);
    const circle = L.circle([latitude, longitude], { radius: accuracy }).addTo(map);

    // if(!zoomed){
    //   zoomed=map.fitBounds(circle.getBounds());
    // }
    map.fitBounds(circle.getBounds());
    marker.setLatLng([latitude, longitude]).update();
    map.setView([latitude, longitude]);



    // if(marker){
    //   map.removeLayer(marker);
    //   map.removeLayer(circle);
    // }
    const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;


    // fetch(geoApiUrl)
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data);
    //   })
    $.ajax({
      method: "GET",
      url: geoApiUrl,
      success: (resp) => {
        console.log(resp);
        loactionName.text(resp.locality)
      }
    })
    getLocation(latitude, longitude);
  }


  // console.log(loactionName.text());


  const error = () => {
    console.log("yusdhsjd");
  }
  navigator.geolocation.getCurrentPosition(successs, error);
}

loc();

// function initMap(lati, long) {
//   var location = { lat: lati, lng: long };
//   var map = new google.maps.Map(document.getElementById("google-map"), {
// <<<<<<< HEAD
//     zoom: 12,
// =======
//     zoom: 4,
// >>>>>>> dca2f3032757da602b79a1408dcd710c5e6369ae
//     center: location,
//   });
//   var marker=new google.maps.Marker({
//     position: location,
//     map:map
//   })
// }


// --------------------------Weather API-----------------------------------------------------------//
const searchBox = $("#search-bar");
const searchBtn = $("#search-btn");
const imgBox = $("#current-weathe-icon");

const humidity = $("#humidity-val");
const precipitation = $("#precipitation-val");
const windspeed = $("#windspeed-val");
const uv = $("#uv-val");
const visibility = $("#visibility-val");
const pressure = $("#pressure-val");

let city;

const apiKey = "4073aa7ff37349c3a1f110844232009";
var apiUrl = "https://api.weatherapi.com/v1/current.json?key=4073aa7ff37349c3a1f110844232009&q=";


const forecastUrl =
  "https://api.weatherapi.com/v1/forecast.json?key=4073aa7ff37349c3a1f110844232009&days=6&q=";

const searchUrl =
  "https://api.weatherapi.com/v1/search.json?key=4073aa7ff37349c3a1f110844232009&q=";

const historyUrl =
  "https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f1108442320095&q=";


async function getLocation(lat, lng) {
  const alt = lat;
  const long = lng;
  console.log("Show", alt, long);

  const search = await fetch(searchUrl + alt.toString() + "," + long.toString());
  const cityData = await search.json();

  city = cityData[0].name;

  console.log(city);
  setWeather(city)
}

async function setWeather(cityName) {
  try {
    const weatherResponse = await $.ajax({
      method: "GET",
      url: apiUrl + cityName,
    });
    console.log(weatherResponse);


    const weatherResponseForecast = await fetch(forecastUrl + cityName);
    const forecastWeatherData = await weatherResponseForecast.json();
    console.log(forecastWeatherData);

    loactionName.text(weatherResponse.location.name)
    tempertaure.text(Math.round(weatherResponse.current.temp_c))
    imgBox.attr("src", weatherResponse.current.condition.icon);
    weatherType.text(weatherResponse.current.condition.text)




    // hourly forecast---------------------------------------------
    // for (let i = 0; i <= 23; i++) {
    // console.log(forecastWeatherData.forecast.forecastday[0].hour[i]);
    document.getElementById("hour6").innerText = forecastWeatherData.forecast.forecastday[0].hour[6].time;
    document.getElementById("img6").src = forecastWeatherData.forecast.forecastday[0].hour[6].condition.icon;

    document.getElementById("hour12").innerText = forecastWeatherData.forecast.forecastday[0].hour[12].time;
    document.getElementById("img12").src = forecastWeatherData.forecast.forecastday[0].hour[12].condition.icon;

    document.getElementById("hour17").innerText = forecastWeatherData.forecast.forecastday[0].hour[17].time;
    document.getElementById("img17").src = forecastWeatherData.forecast.forecastday[0].hour[17].condition.icon;

    document.getElementById("hour22").innerText = forecastWeatherData.forecast.forecastday[0].hour[22].time;
    document.getElementById("img22").src = forecastWeatherData.forecast.forecastday[0].hour[22].condition.icon;
    // }
    document.getElementById("img").src = weatherResponse.current.condition.icon;
    document.getElementById("forecast-para-set").innerText = forecastWeatherData.forecast.forecastday[0].hour[10].condition.text;

    humidity.text(weatherResponse.current.humidity + " %");
    precipitation.text(weatherResponse.current.precip_mm + " mm");
    windspeed.text(weatherResponse.current.wind_kph + " kph");
    uv.text(weatherResponse.current.uv);
    visibility.text(weatherResponse.current.vis_km + " km");
    pressure.text(weatherResponse.current.pressure_mb + " hpa");


    for (let i = 1; i < 6; i++) {

      document.querySelector(`#date${i}`).innerText = forecastWeatherData.forecast.forecastday[i].date;
      document.querySelector(`#img${i}`).src = forecastWeatherData.forecast.forecastday[i].day.condition.icon;
      document.querySelector(`#temp${i}`).innerText = Math.round(forecastWeatherData.forecast.forecastday[i].day.avgtemp_c) + " ℃";
      document.querySelector(`#hum${i}`).innerText = "H : " + forecastWeatherData.forecast.forecastday[i].day.avghumidity + "%";
      document.querySelector(`#w-s${i}`).innerText = "W/S : " + Math.round(forecastWeatherData.forecast.forecastday[i].day.maxwind_kph) + " kph";
    }
    let currentDateForPrevious = forecastWeatherData.forecast.forecastday[0].date;
    // console.log(new Date(mili).getFullYear());


    var leapMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var leapNDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];



    // var leapNMonth=[1,2,3,4,5,6,7,8,9,10,11,12];
    var leapDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let now = new Date(currentDateForPrevious);
    console.log(now);
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth()+1;
    let nowDate = now.getDate();

    let prevYear;
    let prevMonth;
    let prevDate;
    console.log(nowDate);
    // console.log(nowMonth);
    if (nowYear % 4 == 0 && nowYear % 100 != 0 || nowYear % 400 == 0) {
      let tempMonth;
      for (let i = 0; i < leapMonth.length; i++) {
        // console.log(nowMonth);
        if (nowMonth === leapMonth[i]) {
          tempMonth = leapMonth[i];
          // console.log(nowMonth);
          let tempDate = nowDate - 7;
          if (tempDate > 0) {
            prevYear = nowYear;
            prevMonth = tempMonth;
            prevDate = tempDate;
          } else {
            let minusMonth = tempMonth - 1;
            if (minusMonth > 0) {
              let minusDate = leapDays[i - 1] + tempDate;
              
              prevYear = nowYear;
              prevMonth = minusMonth;
              prevDate = minusDate;
            } else {
              prevYear=nowYear-1;
              prevMonth=12;
              prevDate=31+tempDate;
            }
          }
        }
      }

    }else{
      // console.log(nowMonth);
      let tempMonth1;
      for (let i = 0; i < leapMonth.length; i++) {
        if (nowMonth === leapMonth[i]) {
          tempMonth1 = leapMonth[i];
          console.log(tempMonth1);
          let tempDate1 = nowDate - 7;
          console.log(tempDate1);

          if (tempDate1 > 0) {
            prevYear = nowYear;
            prevMonth = tempMonth1;
            prevDate = tempDate1;
          } else {
            let minusMonth1 = tempMonth1 - 1;
            console.log("M :"+minusMonth1);
            if (minusMonth1 > 0) {
              let minusDate1 = leapNDays[i - 1] + tempDate1;
              console.log("MD :"+minusDate1);
              prevYear = nowYear;
              prevMonth = minusMonth1;
              prevDate = minusDate1;
            } else {
              prevYear=nowYear-1;
              prevMonth=12;
              prevDate=31+tempDate1;
            }
          }
        }
      }
    }
    

    let toDate=prevYear+"-"+prevMonth+"-"+prevDate;
    console.log(toDate);
    // console.log(nowDate);


  } catch (error) {
    console.error("Error fetching weather data:", error);

  }


}