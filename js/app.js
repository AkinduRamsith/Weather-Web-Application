
const weatherTable = document.getElementById("weather-data");
const nowDate = document.getElementById("current-date");


const loactionName = $("#locationName");
const tempertaure = $("#tempertaure");
const weatherType = $("#live-d");
const tempP=$("#temp-p");

const calendar=document.getElementById("calendar");
const btnSubmit=document.getElementById("his-btnSubmit");
;
var d=Last7Days();

let tblBody = '';
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
const daylist = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let forecastday;


const date = new Date();

let currentDay = String(date.getDate()).padStart(2, '0');

let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

let currentYear = date.getFullYear();



let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
nowDate.textContent = currentDate;


function loc() {
  const successs = (position1) => {
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

   
    map.fitBounds(circle.getBounds());
    marker.setLatLng([latitude, longitude]).update();
    map.setView([latitude, longitude]);




    const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;


    
    $.ajax({
      method: "GET",
      url: geoApiUrl,
      success: (resp) => {
        loactionName.text(resp.locality)
      }
    })
    getLocation(latitude, longitude);
  }


  const error = () => {
    console.log("yusdhsjd");
  }
  navigator.geolocation.getCurrentPosition(successs, error);
}

loc();




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
  "https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=2023-5-6&q=";





async function getLocation(lat, lng) {
  const alt = lat;
  const long = lng;

  const search = await fetch(searchUrl + alt.toString() + "," + long.toString());
  const cityData = await search.json();

  city = cityData[0].name;

  setWeather(city)
}

async function setWeather(cityName) {
  try {
    const weatherResponse = await $.ajax({
      method: "GET",
      url: apiUrl + cityName,
    });


    const weatherResponseForecast = await fetch(forecastUrl + cityName);
    const forecastWeatherData = await weatherResponseForecast.json();

    loactionName.text(weatherResponse.location.name)
    tempertaure.text(Math.round(weatherResponse.current.temp_c))
    imgBox.attr("src", weatherResponse.current.condition.icon);
    weatherType.text(weatherResponse.current.condition.text)




    // hourly forecast---------------------------------------------
  
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
 
    
   
      const historyUrl0 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result1}&q=`;
    
      $.ajax({
        method: "GET",
        url: historyUrl0 + cityName,
        success: (resp) => {
          document.querySelector("#temp-p0").innerText=resp.forecast.forecastday[0].date;
          document.querySelector("#temp-icon0").src=resp.forecast.forecastday[0].day.condition.icon;
          document.querySelector("#temp-val0").innerText=Math.round(resp.forecast.forecastday[0].day.avgtemp_c)+"℃";
          document.querySelector("#temp-hum0").innerText=resp.forecast.forecastday[0].day.avghumidity+"%";
          document.querySelector("#temp-perc0").innerText=Math.round(resp.forecast.forecastday[0].day.totalprecip_mm)+" mm";
          document.querySelector("#temp-ws0").innerText=Math.round(resp.forecast.forecastday[0].day.maxwind_kph)+" kph";


        }
      })
      const historyUrl1 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result2}&q=`;
    
      $.ajax({
        method: "GET",
        url: historyUrl1 + cityName,
        success: (resp) => {
          document.querySelector("#temp-p1").innerText=resp.forecast.forecastday[0].date;
          document.querySelector("#temp-icon1").src=resp.forecast.forecastday[0].day.condition.icon;
          document.querySelector("#temp-val1").innerText=Math.round(resp.forecast.forecastday[0].day.avgtemp_c)+"℃";
          document.querySelector("#temp-hum1").innerText=resp.forecast.forecastday[0].day.avghumidity+"%";
          document.querySelector("#temp-perc1").innerText=Math.round(resp.forecast.forecastday[0].day.totalprecip_mm)+" mm";
          document.querySelector("#temp-ws1").innerText=Math.round(resp.forecast.forecastday[0].day.maxwind_kph)+" kph";
        }
      })
      const historyUrl2=
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result3}&q=`;
    
      $.ajax({
        method: "GET",
        url: historyUrl2 + cityName,
        success: (resp) => {
          document.querySelector("#temp-p2").innerText=resp.forecast.forecastday[0].date;
          document.querySelector("#temp-icon2").src=resp.forecast.forecastday[0].day.condition.icon;
          document.querySelector("#temp-val2").innerText=Math.round(resp.forecast.forecastday[0].day.avgtemp_c)+"℃";
          document.querySelector("#temp-hum2").innerText=resp.forecast.forecastday[0].day.avghumidity+"%";
          document.querySelector("#temp-perc2").innerText=Math.round(resp.forecast.forecastday[0].day.totalprecip_mm)+" mm";
          document.querySelector("#temp-ws2").innerText=Math.round(resp.forecast.forecastday[0].day.maxwind_kph)+" kph";
        }
      })
      const historyUrl3 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result4}&q=`;
    
      $.ajax({
        method: "GET",
        url: historyUrl3 + cityName,
        success: (resp) => {
          document.querySelector("#temp-p3").innerText=resp.forecast.forecastday[0].date;
          document.querySelector("#temp-icon3").src=resp.forecast.forecastday[0].day.condition.icon;
          document.querySelector("#temp-val3").innerText=Math.round(resp.forecast.forecastday[0].day.avgtemp_c)+"℃";
          document.querySelector("#temp-hum3").innerText=resp.forecast.forecastday[0].day.avghumidity+"%";
          document.querySelector("#temp-perc3").innerText=Math.round(resp.forecast.forecastday[0].day.totalprecip_mm)+" mm";
          document.querySelector("#temp-ws3").innerText=Math.round(resp.forecast.forecastday[0].day.maxwind_kph)+" kph";
        }
      })
      const historyUrl4 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result5}&q=`;
    
      $.ajax({
        method: "GET",
        url: historyUrl4 + cityName,
        success: (resp) => {
          document.querySelector("#temp-p4").innerText=resp.forecast.forecastday[0].date;
          document.querySelector("#temp-icon4").src=resp.forecast.forecastday[0].day.condition.icon;
          document.querySelector("#temp-val4").innerText=Math.round(resp.forecast.forecastday[0].day.avgtemp_c)+"℃";
          document.querySelector("#temp-hum4").innerText=resp.forecast.forecastday[0].day.avghumidity+"%";
          document.querySelector("#temp-perc4").innerText=Math.round(resp.forecast.forecastday[0].day.totalprecip_mm)+" mm";
          document.querySelector("#temp-ws4").innerText=Math.round(resp.forecast.forecastday[0].day.maxwind_kph)+" kph";
        }
      })
      const historyUrl5 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result6}&q=`;
    
      $.ajax({
        method: "GET",
        url: historyUrl5 + cityName,
        success: (resp) => {
          document.querySelector("#temp-p5").innerText=resp.forecast.forecastday[0].date;
          document.querySelector("#temp-icon5").src=resp.forecast.forecastday[0].day.condition.icon;
          document.querySelector("#temp-val5").innerText=Math.round(resp.forecast.forecastday[0].day.avgtemp_c)+"℃";
          document.querySelector("#temp-hum5").innerText=resp.forecast.forecastday[0].day.avghumidity+"%";
          document.querySelector("#temp-perc5").innerText=Math.round(resp.forecast.forecastday[0].day.totalprecip_mm)+" mm";
          document.querySelector("#temp-ws5").innerText=Math.round(resp.forecast.forecastday[0].day.maxwind_kph)+" kph";
        }
      })
      const historyUrl6 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result7}&q=`;
    
      $.ajax({
        method: "GET",
        url: historyUrl6 + cityName,
        success: (resp) => {
          document.querySelector("#temp-p6").innerText=resp.forecast.forecastday[0].date;
          document.querySelector("#temp-icon6").src=resp.forecast.forecastday[0].day.condition.icon;
          document.querySelector("#temp-val6").innerText=Math.round(resp.forecast.forecastday[0].day.avgtemp_c)+"℃";
          document.querySelector("#temp-hum6").innerText=resp.forecast.forecastday[0].day.avghumidity+"%";
          document.querySelector("#temp-perc6").innerText=Math.round(resp.forecast.forecastday[0].day.totalprecip_mm)+" mm";
          document.querySelector("#temp-ws6").innerText=Math.round(resp.forecast.forecastday[0].day.maxwind_kph)+" kph";
        }
      })
      


  } catch (error) {
    console.error("Error fetching weather data:", error);

  }


}
function Last7Days () {

  var today = new Date();
  var oneDayAgo = new Date(today);
  var twoDaysAgo = new Date(today);
  var threeDaysAgo = new Date(today);
  var fourDaysAgo = new Date(today);
  var fiveDaysAgo = new Date(today);
  var sixDaysAgo = new Date(today);
  var sevenDaysAgo = new Date(today);

  oneDayAgo.setDate(today.getDate() - 1);
  twoDaysAgo.setDate(today.getDate() - 2);
  threeDaysAgo.setDate(today.getDate() - 3);
  fourDaysAgo.setDate(today.getDate() - 4);
  fiveDaysAgo.setDate(today.getDate() - 5);
  sixDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setDate(today.getDate() - 7);

  var result0 = formatDate(today);
  var result1 = formatDate(oneDayAgo);
  var result2 = formatDate(twoDaysAgo);
  var result3 = formatDate(threeDaysAgo);
  var result4 = formatDate(fourDaysAgo);
  var result5 = formatDate(fiveDaysAgo);
  var result6 = formatDate(sixDaysAgo);
  var result7 = formatDate(sevenDaysAgo);

  var result = {result1,result2,result3,result4,result5,result6,result7};

  return(result);
}

function formatDate(date){
  var dd = date.getDate();
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear();
  if(dd<10) {dd='0'+dd}
  if(mm<10) {mm='0'+mm}
  date = yyyy+'-'+mm+'-'+dd;
  return date
 }

// ------------------------History--------------------------------------------------
btnSubmit.addEventListener("click",(e)=>{
  const pickDate=calendar.value;
  console.log(pickDate);
})


