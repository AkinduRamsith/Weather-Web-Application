const day=document.getElementById("live-d");
const weatherTable=document.getElementById("weather-data");
const nowDate=document.getElementById("current-date");
const tempP=document.getElementById("temp-p");
let tblBody = '';
function refreshTime() {
    const timeDisplay = document.getElementById("live-t");
    const dateString = new Date().toLocaleTimeString();      
    const formattedString = dateString.replace(", ", " - ");
    timeDisplay.textContent = formattedString;
  }
    setInterval(refreshTime, 1000);

    const datetime = new Date().getDay();
console.log(datetime); // it will represent date in the console of developers tool
// document.getElementById("time").textContent = datetime; //it will print on html page
const daylist=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
day.textContent=daylist[datetime];
let forecastday;

function forecast(){
    for (let i = 0; i < 5; i++) {
        forecastday = new Date().getDay();
        const count = forecastday + i+1; 
    
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

let currentDay= String(date.getDate()).padStart(2, '0');

let currentMonth = String(date.getMonth()+1).padStart(2,"0");

let currentYear = date.getFullYear();



let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
nowDate.textContent=currentDate;
tempP.textContent=currentDate;
console.log("The current date is " + currentDate); 
