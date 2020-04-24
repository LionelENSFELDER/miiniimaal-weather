function init(){
    const input = document.getElementById('location')
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            getLocation();
        }
    })
}

window.addEventListener("DOMContentLoaded", () => {
    init();
})

function getLocation() {
    let name = document.getElementById('location').value;
    getWeather(name);
}

const getWeather = async function(arg){
    let location = arg;
    let url = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&units=metric&appid=f61845cc2a438aef2ac2289b15f69307";
    let response = await fetch(url);
    if(response.ok){
        let data = await response.json();
        //console.log(data);
        hydrateWeatherCard(data);
        setIcon(data);
    }else{
        let error = response.status;
        //createNotification(error);
        alert("Not found this city in our database. The server response with : " + response.status);
    }
};


function hydrateWeatherCard(data){
    name = data.name + ", ";
    country = data.sys.country;
    temp = data.main.temp + "°";
    document.getElementById("temp").textContent = temp;
    document.getElementById("name").textContent = name;
    document.getElementById("country").textContent = country;
    document.getElementById("weather-card").classList.remove("d-none");
}

function setIcon(data){
    let conditions = data.weather[0].main;
    const icon = document.getElementById('icon');
    let classes = icon.classList;
    let iconClass = "";

    //Regex pattern to match when itérate on icon.classList Object
    var pattern1 = new RegExp("wi-[a-z]*");
    var pattern2 = new RegExp("wi-[a-z]*-[a-z]*");
    
    for(let value of classes){
        var result1 = pattern1.test(value);
        var result2 = pattern2.test(value);
        
        if(result1 === true || result2 === true){
            icon.classList.remove(value);
        }
    }
    
    const conditionsArray = {
        'Clear': 'wi-day-sunny',
        'Clouds': 'wi-cloud',
        'Rain': 'wi-rain',
        'Snow': 'wi-snowflake-cold',
        'Thunderstorm': 'wi-lightning',
        'Mist': 'wi-fog'
    }

    for(let key in conditionsArray){
        if(key == conditions){
            iconClass = conditionsArray[key];
            icon.classList.add(iconClass);
        }
    }
}

class Toast{
    constructor(error){ 
        this.error = error;
        this.print();
    }
    
    print(){
        const html = `
        <div id="toast" role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-autohide="false" style="position: absolute; right: 20px; top: 20px;">
        <div class="toast-header">
        <strong class="mr-auto">Warning !!</strong>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="toast-body">
            <p>
            impossible to find the location. Check it and retry.
            </p>
        </div>
        </div>
        `
        document.body.innerHTML += html;
    }
}

function createNotification(error){
    let toast = new Toast(error);
    $('#toast').toast('show');
    init();
}