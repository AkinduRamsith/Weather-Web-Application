
const weatherTable = document.getElementById("weather-data");
const nowDate = document.getElementById("current-date");


const loactionName = $("#locationName");
const tempertaure = $("#tempertaure");
const weatherType = $("#live-d");
const tempP = $("#temp-p");
const calendar=$("#calendar");

// const calendar = document.getElementById("calendar");
const btnSubmit = document.getElementById("his-btnSubmit");
const btnSearch = document.getElementById("search-btn");
const searchBox1 = document.getElementById("search-bar");


var d = Last7Days();
var map = L.map('map').setView([0, 0], 13);
var marker;
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


    // var map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    marker = L.marker([latitude, longitude]).addTo(map);
    // const circle = L.circle([latitude, longitude], { radius: accuracy }).addTo(map);


    // map.fitBounds(circle.getBounds());
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
// const searchBox = $("#search-bar");
// const searchBtn = $("#search-btn");
const imgBox = $("#current-weathe-icon");

const humidity = $("#humidity-val");
const precipitation = $("#precipitation-val");
const windspeed = $("#windspeed-val");
const uv = $("#uv-val");
const visibility = $("#visibility-val");
const pressure = $("#pressure-val");

let city;

const apiKey = "4073aa7ff37349c3a1f110844232009";
var apiUrl = "https://api.weatherapi.com/v1/current.json?key=4073aa7ff37349c3a1f110844232009&alerts=yes&q=";


const forecastUrl =
  "https://api.weatherapi.com/v1/forecast.json?key=4073aa7ff37349c3a1f110844232009&days=4&alerts=yes&q=";

const searchUrl =
  "https://api.weatherapi.com/v1/search.json?key=4073aa7ff37349c3a1f110844232009&q=";






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
    console.log(forecastWeatherData);
    loactionName.text(weatherResponse.location.name)
    tempertaure.text(Math.round(weatherResponse.current.temp_c))
    imgBox.attr("src", weatherResponse.current.condition.icon);
    weatherType.text(weatherResponse.current.condition.text)

    const latitude = weatherResponse.location.lat;
    const longitude = weatherResponse.location.lon;
    console.log(latitude, longitude);

    // marker.setLatLng([latitude, longitude]).update();
    // map.setView([latitude, longitude], 13);
    setLocation(latitude, longitude);


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


    for (let i = 1; i < 4; i++) {

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
        document.querySelector("#temp-p0").innerText = resp.forecast.forecastday[0].date;
        document.querySelector("#temp-icon0").src = resp.forecast.forecastday[0].day.condition.icon;
        document.querySelector("#temp-val0").innerText = Math.round(resp.forecast.forecastday[0].day.avgtemp_c) + "℃";
        document.querySelector("#temp-hum0").innerText = resp.forecast.forecastday[0].day.avghumidity + "%";
        document.querySelector("#temp-perc0").innerText = Math.round(resp.forecast.forecastday[0].day.totalprecip_mm) + " mm";
        document.querySelector("#temp-ws0").innerText = Math.round(resp.forecast.forecastday[0].day.maxwind_kph) + " kph";


      }
    })
    const historyUrl1 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result2}&q=`;

    $.ajax({
      method: "GET",
      url: historyUrl1 + cityName,
      success: (resp) => {
        document.querySelector("#temp-p1").innerText = resp.forecast.forecastday[0].date;
        document.querySelector("#temp-icon1").src = resp.forecast.forecastday[0].day.condition.icon;
        document.querySelector("#temp-val1").innerText = Math.round(resp.forecast.forecastday[0].day.avgtemp_c) + "℃";
        document.querySelector("#temp-hum1").innerText = resp.forecast.forecastday[0].day.avghumidity + "%";
        document.querySelector("#temp-perc1").innerText = Math.round(resp.forecast.forecastday[0].day.totalprecip_mm) + " mm";
        document.querySelector("#temp-ws1").innerText = Math.round(resp.forecast.forecastday[0].day.maxwind_kph) + " kph";
      }
    })
    const historyUrl2 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result3}&q=`;

    $.ajax({
      method: "GET",
      url: historyUrl2 + cityName,
      success: (resp) => {
        document.querySelector("#temp-p2").innerText = resp.forecast.forecastday[0].date;
        document.querySelector("#temp-icon2").src = resp.forecast.forecastday[0].day.condition.icon;
        document.querySelector("#temp-val2").innerText = Math.round(resp.forecast.forecastday[0].day.avgtemp_c) + "℃";
        document.querySelector("#temp-hum2").innerText = resp.forecast.forecastday[0].day.avghumidity + "%";
        document.querySelector("#temp-perc2").innerText = Math.round(resp.forecast.forecastday[0].day.totalprecip_mm) + " mm";
        document.querySelector("#temp-ws2").innerText = Math.round(resp.forecast.forecastday[0].day.maxwind_kph) + " kph";
      }
    })
    const historyUrl3 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result4}&q=`;

    $.ajax({
      method: "GET",
      url: historyUrl3 + cityName,
      success: (resp) => {
        document.querySelector("#temp-p3").innerText = resp.forecast.forecastday[0].date;
        document.querySelector("#temp-icon3").src = resp.forecast.forecastday[0].day.condition.icon;
        document.querySelector("#temp-val3").innerText = Math.round(resp.forecast.forecastday[0].day.avgtemp_c) + "℃";
        document.querySelector("#temp-hum3").innerText = resp.forecast.forecastday[0].day.avghumidity + "%";
        document.querySelector("#temp-perc3").innerText = Math.round(resp.forecast.forecastday[0].day.totalprecip_mm) + " mm";
        document.querySelector("#temp-ws3").innerText = Math.round(resp.forecast.forecastday[0].day.maxwind_kph) + " kph";
      }
    })
    const historyUrl4 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result5}&q=`;

    $.ajax({
      method: "GET",
      url: historyUrl4 + cityName,
      success: (resp) => {
        document.querySelector("#temp-p4").innerText = resp.forecast.forecastday[0].date;
        document.querySelector("#temp-icon4").src = resp.forecast.forecastday[0].day.condition.icon;
        document.querySelector("#temp-val4").innerText = Math.round(resp.forecast.forecastday[0].day.avgtemp_c) + "℃";
        document.querySelector("#temp-hum4").innerText = resp.forecast.forecastday[0].day.avghumidity + "%";
        document.querySelector("#temp-perc4").innerText = Math.round(resp.forecast.forecastday[0].day.totalprecip_mm) + " mm";
        document.querySelector("#temp-ws4").innerText = Math.round(resp.forecast.forecastday[0].day.maxwind_kph) + " kph";
      }
    })
    const historyUrl5 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result6}&q=`;

    $.ajax({
      method: "GET",
      url: historyUrl5 + cityName,
      success: (resp) => {
        document.querySelector("#temp-p5").innerText = resp.forecast.forecastday[0].date;
        document.querySelector("#temp-icon5").src = resp.forecast.forecastday[0].day.condition.icon;
        document.querySelector("#temp-val5").innerText = Math.round(resp.forecast.forecastday[0].day.avgtemp_c) + "℃";
        document.querySelector("#temp-hum5").innerText = resp.forecast.forecastday[0].day.avghumidity + "%";
        document.querySelector("#temp-perc5").innerText = Math.round(resp.forecast.forecastday[0].day.totalprecip_mm) + " mm";
        document.querySelector("#temp-ws5").innerText = Math.round(resp.forecast.forecastday[0].day.maxwind_kph) + " kph";
      }
    })
    const historyUrl6 =
      `https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&dt=${d.result7}&q=`;

    $.ajax({
      method: "GET",
      url: historyUrl6 + cityName,
      success: (resp) => {
        document.querySelector("#temp-p6").innerText = resp.forecast.forecastday[0].date;
        document.querySelector("#temp-icon6").src = resp.forecast.forecastday[0].day.condition.icon;
        document.querySelector("#temp-val6").innerText = Math.round(resp.forecast.forecastday[0].day.avgtemp_c) + "℃";
        document.querySelector("#temp-hum6").innerText = resp.forecast.forecastday[0].day.avghumidity + "%";
        document.querySelector("#temp-perc6").innerText = Math.round(resp.forecast.forecastday[0].day.totalprecip_mm) + " mm";
        document.querySelector("#temp-ws6").innerText = Math.round(resp.forecast.forecastday[0].day.maxwind_kph) + " kph";
      }
    })



  } catch (error) {
    console.error("Error fetching weather data:", error);

  }


}
function Last7Days() {

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

  var result = { result1, result2, result3, result4, result5, result6, result7 };

  return (result);
}

function formatDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  if (dd < 10) { dd = '0' + dd }
  if (mm < 10) { mm = '0' + mm }
  date = yyyy + '-' + mm + '-' + dd;
  return date
}

// ------------------------History--------------------------------------------------
const sunrise=$("#lbl-sunrise");
const sunset=$("#lbl-sunset");
const moonrise=$("#lbl-moonrise"); 
const moonset=$("#lbl-moonset"); 
const pressureHis=$("#lbl-pressure"); 
const uvHis=$("#lbl-uv"); 
const chanceofrain=$("#lbl-chanceofrain"); 
const visibiltyHis=$("#lbl-visibilty"); 
const weatherdes=$("#weatherdes"); 
const weathericon=$("#weathericon"); 
const selectdateLbl=$("#selectdate-lbl"); 

const weatherHistory = document.querySelector(".weather-history");


const historyUrl =
 ` https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&q=${city}&dt=`;

btnSubmit.addEventListener("click", (e) => {
  const pickDate = calendar.val();
  $.ajax({
    method: "GET",
    url:  ` https://api.weatherapi.com/v1/history.json?key=4073aa7ff37349c3a1f110844232009&q=${city}&dt=` + pickDate,
    success: (resp) => {
      sunrise.text(resp.forecast.forecastday[0].astro.sunrise);
      sunset.text(resp.forecast.forecastday[0].astro.sunset);
      moonrise.text(resp.forecast.forecastday[0].astro.moonrise);
      moonset.text(resp.forecast.forecastday[0].astro.moonset);
      uvHis.text(resp.forecast.forecastday[0].day.uv);
      pressureHis.text(resp.forecast.forecastday[0].hour[0].pressure_in+" hPa");
      chanceofrain.text(resp.forecast.forecastday[0].hour[0].chance_of_rain);
      visibiltyHis.text(resp.forecast.forecastday[0].day.avgvis_km+" km");
      weatherdes.text(resp.forecast.forecastday[0].day.condition.text);
      selectdateLbl.text(resp.forecast.forecastday[0].date);

      weathericon.attr("src",resp.forecast.forecastday[0].day.condition.icon);

      if (weatherHistory) {
        weatherHistory.style.display = "block";
      }
      
    }
  })
  // const cityNa=city;
  console.log(city);
  console.log(pickDate);
})
function btnSearchOnEnter(event) {
  if (event.key === "Enter") {
    const city = searchBox1.value;
    console.log(city);
    setWeather(city);
  }
}

searchBox1.addEventListener("keyup", btnSearchOnEnter);
btnSearch.addEventListener("click", () => {
  city = searchBox1.value;
  console.log(city);
  setWeather(city);
})




// ------------------------------Set Location Map-------------------------
async function setLocation(lati, long) {
  marker.setLatLng([lati, long]).update();
  map.setView([lati, long]);
  const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lati}&longitude=${long}&localityLanguage=en`;
}

//  -----------------dark theme------------------------------------------------------------
let themeChange = document.getElementById("theme-change");
let lightNavbar = document.getElementsByClassName("light-navbar");
let lightNavbar1 = document.getElementsByClassName("light-navbar1");
let lightNavbar2 = document.getElementsByClassName("light-navbar2");
let lightNavbar3 = document.getElementsByClassName("light-navbar3");
let lightForecast = document.getElementsByClassName("light-forecast");
let lightForecastH3 = document.getElementsByClassName("light-forecast-h3");
let lightHf = document.getElementsByClassName("light-hf");
let lightWeatherR = document.getElementsByClassName("light-weather-r");
let lightPreviousWeather = document.getElementsByClassName("light-previous-weather");
let lightDatePicker = document.getElementsByClassName("light-date-picker");
let lightBtnSubmit = document.getElementsByClassName("light-btn-submit");
let lightWeatherDes = document.getElementsByClassName("light-weather-des");
let lightWeatherHis = document.getElementsByClassName("light-weather-his");
let lightFree = document.getElementsByClassName("light-free");
let lightPremiumStrong = document.getElementsByClassName("light-premium-strong");
let lightPlaceholder = document.getElementsByClassName("light-placeholder");
const land = document.getElementsByClassName("land")[0];
// let ligntLand=document.getElementsByClassName("light-land");

let selector = 0;

themeChange.addEventListener("click", () => {

  themeChanger();
});

function themeChanger() {
  if (selector % 2 === 0) {
    themeChange.src = "assests/moon.png";
    document.body.style.backgroundColor = "rgb(225, 226, 219)";
    for (let i = 0; i < lightNavbar.length; i++) {
      lightNavbar[i].style.color = "#000";
    }
    for (let i = 0; i < lightNavbar1.length; i++) {
      lightNavbar1[i].style.color = "#000000";
    }
    for (let i = 0; i < lightNavbar3.length; i++) {
      lightNavbar3[i].style.color = "#000";
      lightNavbar3[i].style['mix-blend-mode'] = "normal";
      lightNavbar3[i].style.background = " rgba(255, 255, 255,)";
    }
    for (let i = 0; i < lightForecast.length; i++) {
      lightForecast[i].style.background = "linear-gradient(143.86deg, #F2E5E7 1.34%, #B091B3 97.09%)";
      lightForecast[i].style['mix-blend-mode'] = "darken";
      lightForecast[i].style.color = "#070101 !important";
      // lightForecast[i].style.background= "transparent";
      // lightForecast[i].style['mix-blend-mode'] = "color-dodge";
    }
    for (let i = 0; i < lightForecastH3.length; i++) {
      lightForecastH3[i].style.cssText = "color: #130202 !important;";

    }
    for (let i = 0; i < lightNavbar2.length; i++) {
      lightNavbar2[i].style.color = "#fff";
      lightNavbar2[i].style.backgroundColor = "#000";
    }
    for (let i = 0; i < lightHf.length; i++) {
      lightHf[i].style.color = "#00000087"
      lightHf[i].style['mix-blend-mode'] = "overlay";
    }
    for (let i = 0; i < lightWeatherR.length; i++) {
      lightWeatherR[i].style.color = "#00000087"
      lightWeatherR[i].style.background = " rgba(246, 246, 246, 0.14)"
    }
    for (let i = 0; i < lightPreviousWeather.length; i++) {
      lightPreviousWeather[i].style.color = "#00000087"
      lightPreviousWeather[i].style.background = " rgba(246, 246, 246)"
      lightPreviousWeather[i].style.border = " none"
    }
    for (let i = 0; i < lightDatePicker.length; i++) {
      lightDatePicker[i].style.color = "#fff"
      lightDatePicker[i].style.background = " rgba(0, 0, 0, 0.54)"
      lightDatePicker[i].style.border = " none"
    }
    for (let i = 0; i < lightBtnSubmit.length; i++) {
      lightBtnSubmit[i].style.color = "#fff"
      lightBtnSubmit[i].style.background = " rgba(0, 0, 0,)"
      lightBtnSubmit[i].style.border = " none"


    }
    for (let i = 0; i < lightWeatherDes.length; i++) {
      lightWeatherDes[i].style['border-bottom'] = "0.02px solid rgba(0, 0, 0, 0.130)";
      lightWeatherDes[i].style.width = "180%";
      lightWeatherDes[i].style['align-items'] = " center";
      lightWeatherDes[i].style['margin-left'] = "-40%";
    }
    for (let i = 0; i < lightWeatherHis.length; i++) {
      lightWeatherHis[i].style['border-bottom'] = "0.02px solid rgba(0, 0, 0, 0.130)";
      // lightWeatherHis[i].style.width= "180%";
      // lightWeatherHis[i].style['margin-left']="-40%";
      lightWeatherHis[i].style['align-items'] = " center"
      lightWeatherHis[i].style.color = "#000";
    }


    if (land) {
      land.style.backgroundImage = "url('assests/Blue White Simple Cloud Photo Relax Phone Wallpaper (1980 × 1220px).png')";
    }

    for (let i = 0; i < lightFree.length; i++) {
      lightFree[i].style.color = "#fff"
      lightFree[i].style.background = "rgba(0, 0, 0, 0.12)"
      lightFree[i].style.opacity = "0.95"
      lightFree[i].style.border = " none"
    }
    for (let i = 0; i < lightPremiumStrong.length; i++) {
      lightPremiumStrong[i].style.color = "#Green";
      lightPremiumStrong[i].style['mix-blend-mode'] = "overlay";
      lightPremiumStrong[i].style.opacity = "100"
      lightPremiumStrong[i].style.border = " none"
    }



    selector++;
  } else {
    themeChange.src = "assests/sun.png";

    document.body.style.backgroundColor = "#090429f6";
    for (let i = 0; i < lightNavbar.length; i++) {
      lightNavbar[i].style.color = "#fff";
    }
    for (let i = 0; i < lightNavbar1.length; i++) {
      lightNavbar1[i].style.color = "#fff";
    }
    for (let i = 0; i < lightNavbar2.length; i++) {
      lightNavbar2[i].style.color = "#000";
      lightNavbar2[i].style.backgroundColor = "#fff";
    }
    if (land) {
      land.style.backgroundImage = "url('assests/Cloud Your Story (1980 × 1220px).png')";
    }
    for (let i = 0; i < lightForecast.length; i++) {
      lightForecast[i].style.background = "llinear-gradient(143.86deg, #f0f0f0  1.34%, #b091b3 97.09%)";
      lightForecast[i].style['mix-blend-mode'] = "color-dodge";
      lightForecast[i].style.color = "#fff";
      lightForecast[i].style.background = "transparent";
    }
    for (let i = 0; i < lightForecastH3.length; i++) {
      lightForecastH3[i].style.cssText = "color: #fff !important;";

    }
    for (let i = 0; i < lightHf.length; i++) {
      lightHf[i].style.color = "#fff"
    }
    for (let i = 0; i < lightPreviousWeather.length; i++) {
      lightPreviousWeather[i].style.color = "#fff"
      lightPreviousWeather[i].style.background = " rgba(255, 255, 255, 0.06)"
      lightPreviousWeather[i].style.border = " none"
    }
    for (let i = 0; i < lightDatePicker.length; i++) {
      lightDatePicker[i].style.color = "#000"
      lightDatePicker[i].style.background = "#fff"
      lightDatePicker[i].style.border = " none"
    }
    for (let i = 0; i < lightBtnSubmit.length; i++) {
      lightBtnSubmit[i].style.color = "#000"
      lightBtnSubmit[i].style.background = " rgba(f, f, f,)"
      lightBtnSubmit[i].style.border = " none"


    }
    for (let i = 0; i < lightWeatherDes.length; i++) {
      lightWeatherDes[i].style['border-bottom'] = "0.02px solid rgba(255, 252, 252, 0.100)";
      lightWeatherDes[i].style.width = "180%";
      lightWeatherDes[i].style['align-items'] = " center";
      lightWeatherDes[i].style['margin-left'] = "-40%";
    }

    for (let i = 0; i < lightWeatherHis.length; i++) {
      lightWeatherHis[i].style['border-bottom'] = "0.02px solid rgba(255, 252, 252, 0.100)";
      // lightWeatherHis[i].style.width= "180%";
      lightWeatherHis[i].style['align-items'] = " center"
      // lightWeatherHis[i].style['margin-left']="-40%";
      lightWeatherHis[i].style.color = "#fff";
    }

    for (let i = 0; i < lightFree.length; i++) {
      lightFree[i].style.color = "#fff"
      lightFree[i].style.background = "rgba(255, 255, 255, 0.12)"
      lightFree[i].style.opacity = "0.95"
      lightFree[i].style.border = " none"
    }
    for (let i = 0; i < lightPremiumStrong.length; i++) {
      lightPremiumStrong[i].style.color = "#fff";
      lightPremiumStrong[i].style['mix-blend-mode'] = "overlay";
      lightPremiumStrong[i].style.opacity = "100"
      lightPremiumStrong[i].style.border = " none"
    }
    selector++;
  }

}

// themeChange.onclick = function () {
//   document.documentElement.classList.toggle("darktheme");
//   lightNavbar.classList.toggle("nav-darktheme");
//   for (let i = 0; i < ligntLand.length; i++) {
//     ligntLand[i].classList.toggle("land-darktheme");
//   }
// }


// fro media queries---------------------------
const dDate = document.getElementById("d-date");
const dTemp = document.getElementById("d-temp");
const dHum = document.getElementById("d-hum");
const dPrec = document.getElementById("d-prec");
const dWs = document.getElementById("d-ws");


function updateTextBasedOnScreenWidth() {
  if (window.innerWidth < 500) {
    dDate.textContent = 'Date';
    dTemp.textContent = 'T';
    dHum.textContent = 'H';
    dPrec.textContent = 'P';
    dWs.textContent = 'W-S';
  } else {
    dDate.textContent = 'Date';
    dTemp.textContent = 'TEMPERATURE';
    dHum.textContent = 'HUMIDITY';
    dPrec.textContent = 'PRECIPITATION';
    dWs.textContent = 'WIND SPEED';
  }
}

updateTextBasedOnScreenWidth();

// Update text when the window is resized
window.addEventListener('resize', updateTextBasedOnScreenWidth);

document.addEventListener("DOMContentLoaded", function () {
  const iconNav = document.getElementById("icon-nav");
  const navdiv = document.querySelector(".navdiv");
  let isNavdivVisible = false;

  iconNav.addEventListener("click", () => {
    if (isNavdivVisible) {
      navdiv.style.left = "-270px";
    } else {
      navdiv.style.left = "200px";
    }

    isNavdivVisible = !isNavdivVisible;
  });
});