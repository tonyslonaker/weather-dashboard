var getWeatherData = function(event) {

    event.preventDefault();

    // get value from input element git 
    var searchByCity = searchByCityEl.value.trim().toLowerCase();
    console.log("The selected by user is: " + searchByCity);

    // If field is emtpy dp not fetch any data
    if (searchByCity == "") {
        alert("Please do not leave city name blank");
        searchByCityEl.value = "";
        return 
    }

    // Global variable that will take then input of city and converte it to lowercase and pass it as the query to OpenWeather API.
    // Hardcoded let openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + "scarborough" + "&appid=32a27c42260b02de3ba5e1466def4861";
    let openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchByCity + "&appid=32a27c42260b02de3ba5e1466def4861&units=imperial";
    console.log(openWeatherApiUrl);

    // Get array from local storage
    let citiesLocalStorage = JSON.parse(localStorage.getItem("savedCities"));

    // City exist or not. 0 = not, 1 = yes
    let cityExist = 0;


    // Check if array is null and create new one again.
    if (citiesLocalStorage === null) {
        citiesSearched =  new Array();
        console.log("new array craeted");
        
    } else { // Assign the localStorage values to new (array), not a reference
        citiesSearched = citiesLocalStorage;
        console.log("Values from local Storage are: " + citiesSearched);
    };


    fetch(openWeatherApiUrl).then(function(response) {

        if(response.ok) { // Check if ther response is ok, meaning a HTTP 200 response.

            
                response.json().then(function(jsonData) {
                console.log("json city returned is: " + jsonData.name); // City Name
                // console.log("Date") use moment.js for now
                
                getDate(jsonData.dt);
               // alert("full day is" + fullDayDaily);
                jsonData.weather[0].icon;
                console.log(jsonData.weather[0].icon); // Icon 
                let tempImperial = jsonData.main.temp
               // let fahrenheitTemp = ( (kelvinTemp - 273.15) * (9/5) + 32 ); // Converted to fahrenheit temperature
              //  console.log("Temperature: " + fahrenheitTemp.toFixed(1) + " °F"); // Fahrenheit temperature
               console.log("Temperature:" + tempImperial + " °F");
                let humidity = jsonData.main.humidity + "%"
                console.log(humidity);
                let metersPerSecSpeed = jsonData.wind.speed
                let mphWindSpeed = Math.round(metersPerSecSpeed * 2.237) + " MPH"; // Convert meters per second to miles per hour
                console.log(mphWindSpeed);
        
                // Get lon and lat for the uv
                let latNum = jsonData.coord.lat;
                let lonNum = jsonData.coord.lon;
                
                console.log("latitude" + latNum);
                console.log("longitud" + lonNum);
           
                // Function call to get the uv information.
                // Passed the lonNum and latNum parameters as arguments to bne used. 
                getUVNumber(latNum, lonNum); // replaced by the one call.
                getFiveDayForcast(latNum, lonNum);

                // Add the sucessful api call city to the local storage.
                for (i=0; i < citiesSearched.length; i++) {
                    if (searchByCity === citiesSearched[i].toLowerCase()) {
                        console.log("city " + citiesSearched[i] + "already exist in array")
                        cityExist =1
                        break;
                    } 
                }

                // if the city is new it will add it because the lenght of the array was 0, then add to local storage
                // if it is the second city and is not new then add to local storage
                if (cityExist === 0) {
                    alert("city has been pushed" + ( searchByCity.charAt(0).toUpperCase() + searchByCity.slice(1) ));
                   // citiesLocalStorage=[];
                    //citiesSearched = []; 
                      // localStorage.setItem("savedCities", JSON.stringify(citiesLocalStorage));
                    citiesSearched.push( searchByCity.charAt(0).toUpperCase() + searchByCity.slice(1) ) ;
                    localStorage.setItem("savedCities", JSON.stringify(citiesSearched));
                }
                 populateSavedCities(); // Second call after a push has been done.

            })

       
        } else { // Any other response like 400 500 will display the error.
            window.alert("Error: " + response.statusText + "\nPlease re-enter a valid city");
            // Clear the input parameter from the user
            searchByCityEl.value = "";
            return;
        }
    }).catch(function(error) { // fetch api way of handling network errors.
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to OpenWeather");
        return;
      });
};


