//Global Variables
var pageContentEl = document.querySelector("body");
var formTextEl = document.querySelector("#city-search-text");
var weeklyWeatherEl = document.querySelectorAll(".weekly-weather");
var dataSection = document.querySelector(".data-section");
dataSection.style.display = "none";
var searchHistory = [];

//Check for saved history on load
loadSavedSearchHistory();

//load history
function loadSavedSearchHistory(){
    searchHistory = JSON.parse(localStorage.getItem("savedSearches")); 
    
    //if there is history to load, do so
    if(searchHistory){
        for(var i = 0; i < searchHistory.length; i++){
            var tempEl = document.createElement("h3");
            tempEl.className ="saved-city";
            tempEl.innerHTML = searchHistory[i];
            document.querySelector(".search-section").appendChild(tempEl);
        }

    }

    //otherwise, don't do anything
    else{
        return;
    }

}

//fetch the weather api and get data based on city name
function searchForCity(cityName){

    //if there is an error message, remove it
    if(document.querySelector(".error-text") != null || document.querySelector(".error-text") != undefined){
        document.querySelector(".error-text").remove();
    }

    //get api data
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=d6d30e15f062a8b6733a48e8507340b5")
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //if there were no issue with getting data, display
                dataSection.style.display = "block";
                processSearchSaveHistory(data.name);
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
        //if there were issues, let the user know via a message
        else{
            if(document.querySelector(".error-text") === null || document.querySelector(".error-text") === undefined){
                if(cityName === ""){
                    var errorNoticeEl = document.createElement("div");
                    errorNoticeEl.innerHTML = "<p class='error-text'>You must enter a city name when searching.</p>"
                    document.querySelector("form").appendChild(errorNoticeEl);
                }
                else{
                    var errorNoticeEl = document.createElement("div");
                    errorNoticeEl.innerHTML = "<p class='error-text'><span>" + cityName + " </span>is not a valid city. Please try again!</p>"
                    document.querySelector("form").appendChild(errorNoticeEl);
                }
            }
        }
    });

};

//process displaying current days data as HTML elements
function currentCityData(cityName,data){
    
    var cityDataEl = document.querySelector(".city-data");
    var currentDate = new Date(data.dt * 1000);
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;
    var currentDay = currentDate.getDate();
    var currentIcon = "http://openweathermap.org/img/wn/" + data.weather[0].icon +".png";

    cityDataEl.innerHTML = "<h2>" +  cityName.charAt(0).toUpperCase() + cityName.slice(1) + " " + "("+ currentYear + "/" + currentMonth + "/" + currentDay + ")" +"</h2>";
    cityDataEl.innerHTML += "<img src=" + currentIcon + ">";
    cityDataEl.innerHTML += "<p> Temp: " +  data.temp + "C</p>";
    cityDataEl.innerHTML += "<p> Wind: " +  data.wind_speed + "MPH</p>";
    cityDataEl.innerHTML += "<p> Humidity: " +  data.humidity + "%</p>";
    cityDataEl.innerHTML += "<p class='uvi'> UV Index: " +  data.uvi + "</p>";
    
    setUVIColor(data.uvi);

};

//Set the color of the uv text element based on wha the city's UV is
function setUVIColor(uviData){
    if(uviData < 3){
        document.querySelector('.uvi').style.color ="green";
    }
    else if(uviData < 6){
        document.querySelector('.uvi').style.color ="yellow";
    }
    else{
        document.querySelector('.uvi').style.color ="red";
    }
}

//process displaying weekly data as HTML elements
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

//process what is currently displayed in the history tab
function processSearchSaveHistory(searchedName){
    
    if(searchHistory===null){
        searchHistory = [searchedName];
        console.log(searchHistory);
        var tempEl = document.createElement("h3");
        tempEl.className="saved-city";
        tempEl.innerText = searchedName;
        document.querySelector(".search-section").appendChild(tempEl);
    }

    else{

        var IsInList = false;
        for(var i = 0; i < searchHistory.length; i++){
            if(searchHistory[i] === searchedName){
                searchHistory[i] = searchedName;
                IsInList = true;
            }
        }

        if(IsInList === false){
            searchHistory.push(searchedName);
            var tempEl = document.createElement("h3");
            tempEl.className="saved-city";
            tempEl.innerText = searchedName;
            document.querySelector(".search-section").appendChild(tempEl);
        }
    }

    

    saveHistory();
}

//save data to local storage
function saveHistory(){
    localStorage.setItem("savedSearches",JSON.stringify(searchHistory));
}

//handle button input
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