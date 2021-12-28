//Global Variables
var pageContentEl = document.querySelector("body");
var formTextEl = document.querySelector("#city-search-text");
var weeklyWeatherEl = document.querySelectorAll(".weekly-weather");

searchForCity(formTextEl.value);

function searchForCity(cityName){

    if(document.querySelector(".error-text") != null || document.querySelector(".error-text") != undefined){
        document.querySelector(".error-text").remove();
    }

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=d6d30e15f062a8b6733a48e8507340b5")
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&units=metric&exclude=minutely,hourly&appid=d6d30e15f062a8b6733a48e8507340b5").then(function(response2){
                    if(response2.ok){
                        response2.json().then(function(data2){
                            console.log(data2);
                            currentCityData(cityName,data2.current)
                            weeklyForcast(data2);
                        })
                    }
                })
            }
        )}
        else{
            if(document.querySelector(".error-text") === null || document.querySelector(".error-text") === undefined){
                var errorNoticeEl = document.createElement("div");
                errorNoticeEl.innerHTML = "<p class='error-text'><span>" + cityName + " </span>is not a valid city. Please try again!</p>"
                document.querySelector("form").appendChild(errorNoticeEl);
            }
        }
    });

};

function currentCityData(cityName,data){
    
    var cityDataEl = document.querySelector(".city-data");
    var currentDate = new Date(data.dt * 1000);
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;
    var currentDay = currentDate.getDate();

    cityDataEl.innerHTML = "<h2>" +  cityName + " " + "("+ currentYear + "/" + currentMonth + "/" + currentDay + ")" +"</h2>";
    cityDataEl.innerHTML += "<p> Temp: " +  data.temp + "C</p>";
    cityDataEl.innerHTML += "<p> Wind: " +  data.wind_speed + "MPH</p>";
    cityDataEl.innerHTML += "<p> Humidity: " +  data.humidity + "%</p>";
    cityDataEl.innerHTML += "<p> UV Index: " +  data.uvi + "</p>";

};

function weeklyForcast(data){
    console.log(data);
    for(var i=0;i < weeklyWeatherEl.length;i++){

        var currentDate = new Date(data.daily[i+1].dt * 1000);
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth() + 1;
        var currentDay = currentDate.getDate();
        var currentIcon = "http://openweathermap.org/img/wn/" + data.daily[i+1].weather[0].icon +".png";

        weeklyWeatherEl[i].innerHTML = "<p><span>" + "("+ currentYear + "/" + currentMonth + "/" + currentDay + ")" +"</span></p>";
        weeklyWeatherEl[i].innerHTML += "<img src=" + currentIcon + ">";
        weeklyWeatherEl[i].innerHTML += "<p> Temp: " +  data.daily[i+1].temp.day + "C</p>";
        weeklyWeatherEl[i].innerHTML += "<p> Wind: " +  data.daily[i+1].wind_speed + "MPH</p>";
        weeklyWeatherEl[i].innerHTML += "<p> Humidity: " +  data.daily[i+1].humidity + "%</p>";
    }

};

var buttonHandler = function(event){
    
    event.preventDefault();

    var clickEvent = event.target;
    if(clickEvent.matches("#city-search-button")){
        searchForCity(formTextEl.value);
    }
    else if(clickEvent.matches(".saved-city")){
        searchForCity(clickEvent.textContent);
    }

};


pageContentEl.addEventListener("click",buttonHandler);