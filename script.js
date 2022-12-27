window.addEventListener("load", displayIntro);

function displayIntro () {
    setTimeout ( ()=>{
        const mapContainer = document.querySelector('.map-container')
        const hello = document.querySelector("#hello");
        const welcome = document.querySelector("#welcome");
        const introP = document.querySelector(".introduction p")
        hello.classList.add("visible")
        welcome.classList.add("visible")
        mapContainer.classList.add("visible")
        introP.classList.add("visible")
        //console.log("displayIntro is working!");
    }, 500)
}

//reset form button resetting form
const resetButton = document.querySelector(`[type="reset"]`);
resetButton.addEventListener("click", clearFormValues )
function clearFormValues() {
    //make button clear all inputs
    reload
    //console.log("clear input form values now");
}

//Toggles hamburger Menu 
const hamButton = document.getElementsByClassName("ham-button")[0]
const navList = document.getElementsByClassName("nav_list")[0]
hamButton.addEventListener("click", ()=> {
    navList.classList.toggle("display");
})



const submitFormButton = document.querySelector(`[type="submit"]`)
submitFormButton.addEventListener("click", response);
    



const form = document.querySelector('#form-input');

let formInput = {}; //holds all input values by user from form
let currencyURL = " "; // used for CURRENCY API URL
let URLCoords = '';//gets LAT & LON coordinates for city, state and country from OPEN WEATHER API
let homeState = " "; 
let USDXCLP = {};
let timeUSA = '';
let timeChile = '';
let locationAPIkey = '87777ca4cdeac88a2810d012d3dff954';//API KEY FOR OPEN WEATHER MAP 
let dateTimeCurrentLocation = new Date();
console.log(`current location time is ${dateTimeCurrentLocation}`);

//--------------------structure of response -----------------------------------------------------------------------------------
const responseContainer = document.querySelector("#response-container"); //all responses inserted into this container
const customResponse = document.querySelector(".custom-response");
    
    const introDiv = document.createElement('div');
    const measurementsDiv = document.createElement('div'); // contains (shoeWaist, weightHeight ) referenced in line 97 for Women and line 129 for Men
    const travelingDiv = document.createElement('div');  // contains (travelingDistance) referenced in line 103 for Women and  line 135 for Men
    const currencyDiv = document.createElement('div'); //contains (currencyContent) referenced in line 152
    const timeSeasonUSADiv = document.createElement('div'); //contains( timeUSAH3, timeContent) referenced in line 195
    const timeSeasonCLDiv = document.createElement('div'); //contains (timeChileH3, CLTimeContent) referenced in line 214
    const timeDifferenceDiv = document.createElement('div'); //contains (timeDifferenceH3, timeDifference) referenced in line 220
    const outroDiv =document.createElement('div'); //contains (outroSpan) referenced in line 224
customResponse.append(measurementsDiv, travelingDiv, currencyDiv, timeSeasonUSADiv, timeSeasonCLDiv, timeDifferenceDiv)
responseContainer.append(introDiv, customResponse, outroDiv);

//--------------FORM INPUT RESPONSE ------------------------------------------------
function response(e) {
    e.preventDefault()
    let name = document.querySelector(`[id="name"]`).value;
    homeState = document.querySelector(`[id="homeState"]`).value;
    let homeCity = document.querySelector(`[id="homeCity"]`).value;
    let USShoeSize = parseFloat(document.querySelector(`[id="ShoeSize"]`).value);
    let height = parseFloat(document.querySelector(`[id="height"]`).value);
    let weight = parseFloat(document.querySelector(`[id="weight"]`).value);
    let waist = parseFloat(document.querySelector(`[id="waist"]`).value);
    let distance = parseFloat(document.querySelector(`[id="travel-distance"]`).value);
    let carSize = document.querySelector(`[id="carType"]`).value;
    let tripCash = document.querySelector(`[id="cash" ]`).value;
    let gender = document.querySelector(`[id="gender"]`).value;
    formInput = { name, homeState, homeCity, USShoeSize, height, weight, waist, distance, carSize, tripCash, gender }; //contains form responses
    currencyURL =  `https://api.exchangerate.host/convert?from=USD&to=CLP&amount=${tripCash}&places=1`;
    getCurrencyValue(cash,currencyURL);
    URLCoords = `http://api.openweathermap.org/geo/1.0/direct?q=${homeCity},${homeState},US&limit=1&appid=${locationAPIkey}`; 
    const responseSectionVisible = document.querySelector(".response");
    responseSectionVisible.setAttribute("style", "display: visible");
    getCoordinates(URLCoords);
    getUSTime(homeState);
    //getCLTime(); <--is called after getUSTime async function is done
    if(gender === "female") {
        return getConvertedUnitsWomen(formInput);
    }else{
        getConvertedUnitsMen(formInput);
    } 
    form.reset();  
}

//-------------------RUNS ALL UNIT CONVERSION FOR A WOMEN---------------------------------------------------------------------
function getConvertedUnitsWomen(formInput) {
    let { name: herName, homeState, USShoeSize: womenShoeSize, waist: womenWaist,
    height, weight, distance, carSize, cash } = formInput;  
    let herShoeSize = (getEUShoeSize(``,womenShoeSize));  
    let herWaistSize = (getTheirWaistSize(womenWaist));
    //herName = herName.toUpperCase();
    let herWeight = (lbsToKg(weight, ``))
    let herHeight = (feetToMeters(height,``));
    let gasForCarSize = (getGasTankSize(carSize));
    let travelDistance = (milesToKilometers(distance,``));
    let carType = getGasTankSize(carSize, distance);

    let greet = document.createElement('h2');  //greet will go into another div
    greet.innerHTML = `Thank you for that information <span id="herName">${herName}</span>, <br> <span id="conversionsBelow">see your conversions below</span>`;
    introDiv.append(greet);

    let measurementsH3 = document.createElement('h3');
    measurementsH3.innerHTML = `Measurements<br>`
    let shoeWaist = document.createElement('p')
    shoeWaist.innerHTML= `${herShoeSize} <br> ${herWaistSize}`;
    let weightHeight = document.createElement('p')
    weightHeight.innerHTML = `Height is measured in meters and weight in kilos here. <br> ${herHeight}. <br> ${herWeight}`;
    measurementsDiv.append(measurementsH3, shoeWaist, weightHeight); // created in line 35

    let travelDistanceH3 = document.createElement('h3');
    travelDistanceH3.innerHTML = "Traveling Distance and Gas"
    let travelingDistance = document.createElement('p')
    travelingDistance.innerHTML = `${travelDistanceH3, travelDistance} ${carType}`;
    travelingDiv.append( travelDistanceH3, travelingDistance); //created in line 36
}

//----------------------RUNS ALL UNIT CONVERSIONS FOR A MEN------------------------------------------------------------------------
function getConvertedUnitsMen(formInput) {
    let { name: hisName, homeState, USShoeSize, waist: menWaist,
    height, weight, distance, carSize, cash } = formInput;  
    let hisShoeSize = (getEUShoeSize(USShoeSize, ''));  
    let hisWaistSize = (getTheirWaistSize(``,menWaist));
    //hisName = hisName.toUpperCase();
    let hisWeight = (lbsToKg(weight, ``))
    let hisHeight = (feetToMeters(height,``));
    let gasForCarSize = (getGasTankSize(carSize));
    let travelDistance = (milesToKilometers(distance,``));
    let carType = getGasTankSize(carSize, distance);
    
    let greet = document.createElement('h2');
    greet.innerHTML = `Thank you for that information <span id="hisName">${hisName}</span>, <br <span id="conversionsBelow">see your conversions below</span>`;
    introDiv.append(greet);

    let measurementsH3 = document.createElement('h3');  
    measurementsH3.innerHTML = `Measurements<br>`;
    let shoeWaist = document.createElement('p')
    shoeWaist.innerHTML= `${hisShoeSize} <br> ${hisWaistSize}`;
    let weightHeight = document.createElement('p')
    weightHeight.innerHTML = `Height is measured in meters and weight in kilos here. <br> ${hisHeight}. <br> ${hisWeight}`;
    measurementsDiv.append(measurementsH3, shoeWaist, weightHeight); //created in line 35

    let travelDistanceH3 = document.createElement('h3');
    travelDistanceH3.innerHTML = "Traveling Distance and Gas"
    let travelingDistance = document.createElement('p')
    travelingDistance.innerHTML = `${travelDistance} <br>${carType}`;
    travelingDiv.append(travelDistanceH3, travelingDistance); //created in line 36
}

//------------------------------API currency exchange request ------------------------------------------------------------------------------------------------

async function getCurrencyValue(cash, currencyURL) {
const response = await fetch(currencyURL);
const data = await response.json();
let { info: { rate: X }, query: {amount: USD}, result: CLP } = data;
CLP = (Math.round(CLP));
CLP = CLP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
USD = USD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
USDXCLP = {USD, X, CLP}; 
let currencyH3 = document.createElement('h3');
currencyH3.innerHTML = `Currency Exchange Rate`;
let currencyContent = document.createElement('p');
currencyContent.innerHTML = `You have <span class="highlight">$${USD} Dollars</span>.<br> The current exchange is equal to <span class="highlight">${X} per dollar</span>.<br> Your spendable-cash is equal to <span class="highlight">${CLP} Chilean pesos</span>.`;
currencyDiv.append( currencyH3, currencyContent); //created in line 37
} 


//----------------API FOR GETTING LATITUDE AND LONGITUDE LOCATION FROM CITY AND STATE IN US----------------------------------------------
let timeZoneURL = '';
let  timeZoneAPIKey = `9394eccb334f4a4ebcd46d9addf77f6a`

const getCoordinates = async (URLCoords) => {
   const response = await fetch(URLCoords);
   const coordinates = await response.json(); 
   const { 0: { lat, lon, country = 'US'}  } = coordinates;
   timeZoneURL =`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&type=postcode&format=json&apiKey=${timeZoneAPIKey}`;
   getTimeZone(timeZoneURL);
};
//------------------API FOR GETTING TIME ZONE OF HOME STATE IN US------------------------------------------------
async function getTimeZone(timeZoneURL) {
    const timeZoneResponse = await fetch(timeZoneURL);
    const timeZoneData = await timeZoneResponse.json();
    let { results: { 0: { timezone: { abbreviation_DST: DST, abbreviation_STD: STD, offset_DST, offset_STD } } } } = timeZoneData;
    console.log(`Daylight savings Time is ${DST}, Standard Time is ${STD}, 
    GMT/UTC offset for daylight savings time is ${offset_DST}, standard time offset is ${offset_STD}`);
}



//----------------API REQUESTING TIME AND DATE BASED ON GIVEN LOCATION OF US HOME STATE---------------------------
const geoAPIKey = 'e000b03e24be4f11b13bba28df8da6fc'; //API KEY FOR IPGEOLOCATION  gets region time and date

async function getUSTime(homeState) {
let yourHomeState = homeState.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/\s/g, "%20");
const geoResponse = await fetch(`https://api.ipgeolocation.io/astronomy?apiKey=${geoAPIKey}&location=${yourHomeState},%20US`);
const geoData = await geoResponse.json();
//console.log(geoData);
let {current_time: USStateTime, date: USStateDate, location: { state, country }, sunrise, sunset } = geoData; //need to use sunrise and sunset and ADD to response
dateUSA = USStateDate.slice(5).split("-").join('');
let timeUSAH3 = document.createElement(`h3`);
timeUSAH3.innerHTML = `Time and Season in Home-state`
timeUSA = USStateTime.slice(0,5);
let seasonUSA = getSeason('', dateUSA); // declare seasonUSA outside to append in a later time
let timeContent = document.createElement(`p`);
timeContent.innerHTML = `In ${country}, ${state}, it is ${timeUSA}, and the date is ${USStateDate}. <br>${seasonUSA}.`;
timeSeasonUSADiv.append(timeUSAH3, timeContent); //created in line 39
getCLTime(); //called after timeUSA is declared
}

//----------------API REQUESTING TIME AND DATE BASED ON CHILE TIME---------------------------
async function getCLTime() {
const geoResponse = await fetch(`https://api.ipgeolocation.io/astronomy?apiKey=${geoAPIKey}&location=Chile,%20US`);
const chileGeoData = await geoResponse.json();
let {current_time: ChileTime, date: CLDate, sunrise, sunset } = chileGeoData;
dateCHILE = CLDate.slice(5).split("-").join('');
timeChile = ChileTime.slice(0,5)
let seasonChile = getSeason(dateCHILE,'')
let timeUSASubtract = timeUSA.split(':').slice(0,1);
let timeChileSubtract = timeChile.split(':').slice(0,1);
let timeDifferenceIs = parseInt(timeChileSubtract - timeUSASubtract)
let timeChileH3 = document.createElement(`h3`);
timeChileH3.innerHTML = `Time and Season in Chile`;
let CLTimeContent = document.createElement(`p`);
CLTimeContent.innerHTML = `In Chile, it is ${timeChile}, and the date is ${CLDate}. <br>${seasonChile}`;
timeSeasonCLDiv.append(timeChileH3, CLTimeContent); //created in line 38

let timeDifferenceH3 = document.createElement(`h3`);
timeDifferenceH3.innerHTML = `Time Difference`;
let timeDifference = document.createElement('p');
timeDifference.innerHTML = `Chile is ahead by <span class="highlight">${timeDifferenceIs} hours </span>from your home state of <span class="highlight">${homeState}</span>. <br> Depending on the time of the year you are visiting Chile time can vary from three to five hours ahead of U.S. time`;
timeDifferenceDiv.append(timeDifferenceH3, timeDifference); //created in line 40

let outroSpan = document.createElement('span');
outroSpan.innerHTML = `Be sure to read our travel advise section below. Save travels and enjoy your trip!` //add link to section of non personalized functions
outroDiv.appendChild(outroSpan); // created in line 41
}

//---------------------------INDIVIDUAL FUNCTIONS BELOW------------------------------------------------------------------------------------------------------------------

//IF INPUT IS NOT SELECTED CLEAR IT! 
//Weight
const weightResponse = document.querySelector("#weightDiv div");
const  inputWeightLbs = document.querySelector("#weightLbs");
const inputWeightKgs = document.querySelector("#weightKgs");
    inputWeightLbs.addEventListener("input", (e)=>{
        inputWeightKgs.value = '';
        weightResponse.innerHTML = lbsToKg(`${e.target.value}`, '');
        if(e.data === null) { weightResponse.textContent = " " } //clears "undefined" when no number inside input
    })
    inputWeightKgs.addEventListener("input", (e)=>{
        inputWeightLbs.value = '';
        weightResponse.innerHTML = lbsToKg('', `${e.target.value}`);
        if(e.data === null) { weightResponse.textContent = " " } 
    })

//Height
const heightResponse = document.querySelector("#heightDiv div"); 
const inputHeightFt = document.querySelector("#heightFt");
const inputHeightM = document.querySelector("#heightM");
    inputHeightFt.addEventListener("input", (e)=>{
        inputHeightM.value ='';
        heightResponse.innerHTML = feetToMeters(`${e.target.value}`, "");
        if(e.data === null) { heightResponse.textContent = " " } 
    })
    inputHeightM.addEventListener("input", (e)=>{
        inputHeightFt.value ='';
        heightResponse.innerHTML = feetToMeters('', `${e.target.value}`);
        if(e.data === null) { heightResponse.textContent = " " } 
    })

//Temperature
const temperatureResponse = document.querySelector("#temperatureDiv div")
const inputFahrenheit = document.querySelector("#fahrenheit");
const inputCelsius = document.querySelector("#celsius");
    inputFahrenheit.addEventListener("input",(e)=>{
        inputCelsius.value = '';
        temperatureResponse.innerHTML = FahrenheitToCelsius(`${e.target.value}`, "");
        if(e.data === null) { temperatureResponse.textContent = " " } 
    })
    inputCelsius.addEventListener("input",(e)=>{
        inputFahrenheit.value = '';
        temperatureResponse.innerHTML = FahrenheitToCelsius("",`${e.target.value}`);
        if(e.data === null) { temperatureResponse.textContent = " " } 
    })

//Gas
const gasResponse = document.querySelector("#gasDiv div");
const inputGallons = document.querySelector("#gallons");
const inputLiters = document.querySelector("#liters");
    inputGallons.addEventListener("input",(e)=>{
        inputLiters.value = '';
        gasResponse.innerHTML = galToLiters(`${e.target.value}`, "");
        if(e.data === null) { gasResponse.textContent = " " } 
    }) 
    inputLiters.addEventListener("input",(e)=>{
        inputGallons.value = '';
        gasResponse.innerHTML = galToLiters("",`${e.target.value}`);
        if(e.data === null) { gasResponse.textContent = " " } 
    }) 

//Men Shoe Size
const menShoeSizeResponse = document.querySelector("#menShoeSizeDiv div");
const inputUSMenShoeSize = document.querySelector("#USMenShoeSize");
const inputEUMenShoeSize = document.querySelector("#EUMenShoeSize");

    inputUSMenShoeSize.addEventListener("input",(e)=>{
        inputEUMenShoeSize.value = '';
        menShoeSizeResponse.innerHTML = getEUShoeSize(`${e.target.value}`, ""); 
        if(e.data === null) { menShoeSizeResponse.textContent = " " } 
    })
    inputEUMenShoeSize.addEventListener("input",(e)=>{
        inputUSMenShoeSize.value = '';
        menShoeSizeResponse.innerHTML = getUSShoeSize(`${e.target.value}`, "");
        if(e.data === null) { menShoeSizeResponse.textContent = " " } 
    })

//Women Shoe size
const womenShoeSizeResponse = document.querySelector("#womenShoeSizeDiv div");
const inputUSWomenShoeSize = document.querySelector("#USWomenShoeSize");
const inputEUWomenShoeSize = document.querySelector("#EUWomenShoeSize");

    inputUSWomenShoeSize.addEventListener("input",(e)=>{
        inputEUWomenShoeSize.value = '';
        womenShoeSizeResponse.innerHTML = getEUShoeSize("", `${e.target.value}`); 
        if(e.data === null) { womenShoeSizeResponse.textContent = " " } 
    })
    inputEUWomenShoeSize.addEventListener("input",(e)=>{
        inputUSWomenShoeSize.value = '';
        womenShoeSizeResponse.innerHTML = getUSShoeSize( "",`${e.target.value}`);
        if(e.data === null) { womenShoeSizeResponse.textContent = " " } 
    })

//Distance
const distanceResponse = document.querySelector("#distanceDiv div");
const inputMiles = document.querySelector("#miles");
const inputKilometers = document.querySelector("#kilometers");
    inputMiles.addEventListener("input", (e)=> {
        inputKilometers.value = '';
        distanceResponse.innerHTML = milesToKilometers(`${e.target.value}`, "");
        if(e.data === null) { distanceResponse.textContent = " " }
    })
    inputKilometers.addEventListener("input", (e)=> {
        inputMiles.value = '';
        distanceResponse.innerHTML = milesToKilometers("",`${e.target.value}`);
        if(e.data === null) { distanceResponse.textContent = " " }
    })

//Season
const seasonResponse = document.querySelector("#seasonDiv div");
const inputSeasonUS = document.querySelector("#seasonUS");
const inputSeasonChile = document.querySelector("#seasonChile");
    inputSeasonUS.addEventListener("input", (e)=> {
        //if it inputs two numbers add to placeHolder a courtesy / so that date makes sense to user NEED TO DO ------------
        inputSeasonChile.value = '';
        seasonResponse.innerHTML = getSeason("",`${e.target.value}`);
        if(e.data === null) { seasonResponse.textContent = " " }
    })
    inputSeasonChile.addEventListener("input", (e)=> {
        inputSeasonUS.value = '';
        seasonResponse.innerHTML = getSeason(`${e.target.value}`,"");
        if(e.data === null) { seasonResponse.textContent = " " }
    })
//Waist size
const theirWaistSizeResponse = document.querySelector("#theirWaistSizeDiv div");
const inputUSWaist = document.querySelector("#USWaist");
const inputEUWaist = document.querySelector("#EUWaist");
    inputUSWaist.addEventListener("input", (e)=> {
        inputEUWaist.value = '';
        theirWaistSizeResponse.innerHTML = getWaistSize(`${e.target.value}`, "");
    if(e.data === null) { theirWaistSizeResponse.textContent = " " }
    })
    inputEUWaist.addEventListener("input", (e)=> {
        inputUSWaist.value = '';
        theirWaistSizeResponse.innerHTML = getWaistSize("",`${e.target.value}`);
        if(e.data === null) { theirWaistSizeResponse.textContent = " " }
    })
//Measured Size

const measuredResponse = document.querySelector("#measuredSizeDiv div");
const inputUSMeasure = document.querySelector("#USMeasure");
const inputEUMeasure = document.querySelector("#EUMeasure");
    inputUSMeasure.addEventListener("input", (e)=> {
        inputEUMeasure.value = '';
        measuredResponse.innerHTML = getMeasurementSize(`${e.target.value}`, "");
    if(e.data === null) { measuredResponse.textContent = " " }
    })
    inputEUMeasure.addEventListener("input", (e)=> {
        inputUSMeasure.value = '';
        measuredResponse.innerHTML = getMeasurementSize("",`${e.target.value}`);
        if(e.data === null) { measuredResponse.textContent = " " }
    })

//-----------------lbs to kg converter------------------------------------------------------------------------------
function lbsToKg(lbs= ``, kgs= ``) {
    if(lbs!=``&& kgs===``) { return `You weigh <span class="highlight">${(lbs/2.205).toFixed(2)} kilos! </span>`;}
    if(kgs!=``&& lbs===``){return `You weigh <span class="highlight">${(kgs* 2.204).toFixed(2)} in lbs </span>`;} 
}

//Takes in ft or meters and returns the other. Where one ft = 0.3048 m or one meter = 3.28084 ft
function feetToMeters(feet=``, meter=``) {
    if(feet !='' && meter == ''){ return `You are <span class="highlight">${(feet*0.3048).toFixed(2)} meters</span> tall.`; }
    if(meter != '' && feet == ''){ return `Your height is <span class="highlight">${(meter*3.28084).toFixed(2)} feet</span> tall.`; } 
}

/* ---- Fahrenheit to celsius formula = f - 32* .5556 (OR 5/9) ------------------------------------------------------------
Celsius to Fahrenheit formula == c *1.8(OR 9/5) + 32 */
function FahrenheitToCelsius(Fahrenheit='', Celsius='') {
	if(Fahrenheit != '' && Celsius == ''){ return `<span class="highlight">${((Fahrenheit-32)* 5/9).toFixed(2)} celsius</span>`; }
    if(Celsius != '' && Fahrenheit == ''){ return `<span class="highlight">${((Celsius*9/5) + 32).toFixed(2)} fahrenheit</span>`; } 
}

/* gallons to liters formula where one gallon = 3.78541 liters && one liter = 0.264172 gallons */
function galToLiters (gallons= '', liters='') {
    if(gallons!= '' && liters == ''){  return `<span class="highlight">${(gallons*3.78541).toFixed(2)} liters</span>`; }
    if(liters != '' && gallons == ''){return `<span class="highlight">${(liters*0.264172).toFixed(2)} gallons</span>`; } 
}

//-----shoe size converter EU Women shoe size ------------------------------------------------------
function getEUShoeSize(USShoeSize = ``, womenShoeSize=``) {
    if(USShoeSize != ''&& womenShoeSize =='') { return `Your shoe size is between <span class="highlight">${parseInt(USShoeSize) + 34}</span> and <span class="highlight">${parseInt(USShoeSize) + 32}</span>. `; }
    if(womenShoeSize != ''&& USShoeSize =='') { return `Your shoe size is between <span class="highlight">${parseInt(womenShoeSize) + 32}</span> and <span class="highlight">${parseInt(womenShoeSize) + 30}</span>.`;}
}


/* shoe size converter to US SHOE SIZE Women shoe size == U.S. women shoe size - 30 && US Men shoe size == EU men shoe size - 31.5 */

function getUSShoeSize(EUShoeSize = ``, EUWomenShoeSize=``) {
    if(EUShoeSize != ''&& EUWomenShoeSize =='') {
        let EnteredShoeSize = EUShoeSize;
        let cmSize = ((EnteredShoeSize - 2)/1.5).toFixed(2);
        let inchSize = Math.round((cmSize/2.54)*10)/10;
        let USSizeMen = (Math.round((((cmSize/2.54) * 3) - 22)/0.5)) *.5
         return `You are a size <span class="highlight">${EnteredShoeSize}</span> in Chile but in the U.S. you are a <span class="highlight">${USSizeMen}</span> <br>
          Your foot length is <span class="highlight">${inchSize}</span> in inches and <span class="highlight">${cmSize}</span> in centimeters`; 
        //return `Your shoe size is <span class="highlight"> ${((((EUShoeSize - 2)/1.5)/2.54)*3)-21}</span> in the U.S.`; 
    }
    if(EUWomenShoeSize != ''&& EUShoeSize =='') {
        let EnteredShoeSize = EUWomenShoeSize;
        let cmSize = ((EnteredShoeSize - 2)/1.5).toFixed(2);
        let inchSize = Math.round((cmSize/2.54)*10)/10;
        let USSizeWomen = (Math.round((((cmSize/2.54) * 3) - 21)/0.5)) *.5  
         return `You are a size <span class="highlight">${EnteredShoeSize}</span> in Chile but in the U.S. you are a <span class="highlight">${USSizeWomen}</span> <br>
          Your foot length is <span class="highlight">${inchSize}</span> in inches and <span class="highlight">${cmSize}</span> in centimeters`; 
        //return `Your shoe size is <span class="highlight"> ${EUWomenShoeSize + 30}</span> in the U.S.`;
    }
}

//---------------------------Traveling div response and functions ----------------------------------------------------------------------------------------
 /*Takes in miles or Kilometers and returns the other. Where one mile = 1.60934 km    one kilometer == 0.621371 mi */
 function milesToKilometers(miles=``, kilometer = ``) {
    if(miles != '' && kilometer == ''){ return `Traveling <span class="highlight">${miles} miles</span> is equivalent to <span class="highlight">${(miles*1.60934).toFixed(2)} kilometers</span>.`;}
    if(kilometer != '' && miles == ''){ return `Traveling <span class="highlight">${kilometer} kilometers</span> is equivalent to <span class="highlight">${(kilometer*0.621371).toFixed(2)} miles</span>`;} 
}


//-----------------GETS CORRECT SEASON DEPENDING ON TIME OF YEAR FOR CHILE OR U.S.A ----------------------------------------------------------------------

//---get season for USA or for CHILE takes MM/DD only---- 
function getSeason(monthDateChile= '', monthDateUSA='') {
    if(monthDateChile != '' && monthDateUSA == '') {
        if(monthDateChile >0320 && monthDateChile <= 0620) { return `It's <strong>Fall</strong>, <br> Fall lasts from <span class="highlight">March 20th until June 20th</span>`};
        if(monthDateChile >0621 && monthDateChile <= 0922) { return `It's <strong>Winter</strong>, <br> Winter extends from <span class="highlight">June 21st until September 22nd</span>`};
        if(monthDateChile >0923 && monthDateChile <= 1221){ return `It's <strong>Spring</strong>, <br> Spring lasts from <span class="highlight">September 23rd until December 21st</span>`};
        if(monthDateChile <= 0319 || 1222 <= monthDateChile ) { return `It's <strong>Summer</strong>, <br> Summer extends from <span class="highlight">December 22nd until March 19th</span>`};
        }
    if(monthDateUSA != '' && monthDateChile == ''){
        if(monthDateUSA >0320 &&  monthDateUSA <= 0620){ return `It's <strong>Spring</strong>, <br>Spring stretches from <span class="highlight">March 20th until June 20th</span>`}
        if(monthDateUSA >0621 &&  monthDateUSA <= 0922){ return `It's <strong>Summer</strong>, <br>Summer extends from <span class="highlight">June 21st until September 22nd</span>`}
        if(monthDateUSA > 0923 && monthDateUSA <= 1221){ return `It's <strong>Fall</strong>, <br>Fall lasts from <span class="highlight">September 23rd until December 21st</span>`}
        if(monthDateUSA <= 0319 || 1222 <= monthDateUSA){ return `It's <strong>Winter</strong>, <br>Winter extends from <span class="highlight">December 22nd until March 19th</span>`}
        }
}     


//Takes in waist US waist size returns EU waist size
function getWaistSize(USWaist = ``, EUWaist= ``) {
    if(USWaist !='' && EUWaist == '') {return `your pant size is <span class="highlight">${(parseInt(USWaist)+16)} EU</span>. <br> When shopping, use this measurement as a starting point since actual size can vary between brands.`;}
    if(EUWaist !='' && USWaist == '') {return `Your pant size in the U.S. is <span class="highlight">${(parseInt(EUWaist)-16)}</span> <br> When shopping in the U.S. use this measurement as a starting point since actual size can vary between brands`;}    
}

//Takes in inches or centimeters and converts it

function getMeasurementSize(USMeasurement = ``, EUMeasurement = ``) {
    if(USMeasurement !='' && EUMeasurement == '') {return `your measurement is <span class="highlight">${(USMeasurement*2.54).toFixed(2)} centimeters</span> <br>`;}
    if(EUMeasurement !='' && USMeasurement == '') {return `Your measurement in the U.S. is <span class="highlight">${(EUMeasurement/2.54).toFixed(0)} inches</span> <br>`;}    
}


//------------Takes in waist US waist size returns EU waist size used for personalized response in FORM ---------------------------------------------------------------------------
function getTheirWaistSize(womenWaist = ``, menWaist= ``) {
    if(womenWaist !='' && menWaist == '') {return `your waist size is <span class="highlight">${(womenWaist*2.54).toFixed(2)} cm</span>. <br> While shopping, use this measurement as a starting point since actual size can vary between brands.`;}
    if(menWaist !='' && womenWaist == '') {return `Your waist size is <span class="highlight">${(menWaist*2.54).toFixed(2)} cm.</span> <br> When shopping for pants knowing your cm waist size will come in handy so remember it!`;}    
}

//returns liters needed for a given car size
function getGasTankSize (carSize, distance) {
    switch (carSize) {
        case 'small': return `On average, a small car has an mpg of 30 and a 12-gallon gas tank which is equivalent to a 45-liter tank.
         If you travel <span class="highlight">${distance} miles</span> you will need <span class="highlight">${((distance/30)*3.78541).toFixed(2)} liters</span> of gas. 
         To get to your destination and back you will need around <span class="highlight">${(((distance/30)*3.78541)*2).toFixed(2)} liters</span> of gas.`

        case 'medium': return `On average, a mid-size vehicle has an mpg of 23 and can hold anywhere between 53 to 60-liters of gas. 
        If you travel <span class="highlight">${distance} miles</span> you will need <span class="highlight">${((distance/23)*3.78541).toFixed(2)} liters</span>. To get to your destination and back you will need around <span class="highlight">${(((distance/23)*3.78541)*2).toFixed(2)} liters</span> of gas.` 

        case 'big': return `On average, an 8-cylinder vehicle has an mpg of 17 and it can hold between a 60-liter to 113-liters of gas. 
        To travel <span class="highlight">${distance}</span> you will need <span class="highlight">${((distance/17)*3.78541).toFixed(2)} liters</span>. To get to your destination AND back you will need <span class="highlight">${(((distance/17)*3.78541)*2).toFixed(2)} liters</span> of gas.`
    }
}

/*
//get EU from US dress shirt converter

function dressShirt (USDressShirtSize= '', EUDressShirtSize = '') {
    if(USDressShirtSize != '' && EUDressShirtSize ==''){
    let exact= Math.round(USDressShirtSize*2.54)
    return `your dress shirt size in Chile is between ${exact-1} and ${exact + 1} start by trying on a size ${exact}` }
if(EUDressShirtSize != '' && USDressShirtSize =='') {
    let exact = EUDressShirtSize*.3889;
    return exact;   
    }
}
console.log(dressShirt('', 37))
*/