
document.querySelector(`[type="submit"]`).addEventListener("click", response);

const form = document.querySelector('#form-input');

let formInput = {};
// used for CURRENCY API URL
let currencyURL = " ";
//gets LAT & LON coordinates for city, state and country from OPEN WEATHER API
let URLCoords = '';
let homeState = " "; 
let USDXCLP = {};
const responseContainer = document.querySelector("#response-container");
const timeDiv = document.createElement('div');
const clTimeDiv = document.createElement('div');
const curDiv = document.createElement('div');
const convDiv = document.createElement('div');
const seasonUSADiv = document.createElement('div');
const seasonCLDiv = document.createElement('div');
responseContainer.append(curDiv, timeDiv, clTimeDiv, convDiv, seasonUSADiv, seasonCLDiv);

let dateCHILE = '';
let dateUSA = '';
let dateTimeCurrentLocation = new Date();
console.log(`current location time is ${dateTimeCurrentLocation}`);

//document.querySelector(`[type="submit"]`).addEventListener("click", getCurrencyValue);


//--------------FORM INPUT RESPONSE ------------------------------------------------

//----API KEY FOR OPEN WEATHER MAP ---------------------------
let locationAPIkey = '87777ca4cdeac88a2810d012d3dff954';
function response(e) {
    e.preventDefault()
    let name = document.querySelector(`[id="name"]`).value;
    let homeState = document.querySelector(`[id="homeState"]`).value;
    let homeCity = document.querySelector(`[id="homeCity"]`).value;
    let USShoeSize = parseFloat(document.querySelector(`[id="ShoeSize"]`).value);
    let height = parseFloat(document.querySelector(`[id="height"]`).value);
    let weight = parseFloat(document.querySelector(`[id="weight"]`).value);
    let waist = parseFloat(document.querySelector(`[id="waist"]`).value);
    let distance = parseFloat(document.querySelector(`[id="travel-distance"]`).value);
    let carSize = document.querySelector(`[id="carType"]`).value;
    let cash = document.querySelector(`[id="cash" ]`).value;
    let gender = document.querySelector(`[id="gender"]`).value;
    formInput = { name, homeState, homeCity, USShoeSize, height, weight, waist, distance, carSize, cash, gender };
    currencyURL =  `https://api.exchangerate.host/convert?from=USD&to=CLP&amount=${cash}&places=1`;
    getCurrencyValue(cash,currencyURL);
    URLCoords = `http://api.openweathermap.org/geo/1.0/direct?q=${homeCity},${homeState},US&limit=1&appid=${locationAPIkey}`; 
    getCoordinates(URLCoords);
    getUSTime(homeState);
    getCLTime();
    if(gender === "female") {
        return getConvertedUnitsWomen(formInput);
    }else{
        getConvertedUnitsMen(formInput);
    } 
    form.reset();  
}

//------------------------API currency exchange request -----------------------------------------------

async function getCurrencyValue(cash, currencyURL) {
const response = await fetch(currencyURL);
const data = await response.json();
let { info: { rate: X }, query: {amount: USD}, result: CLP } = data;
CLP = (Math.round(CLP));
CLP = CLP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
USD = USD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
USDXCLP = {USD, X, CLP}; 
//const newDiv = document.createElement("p");
let currencyResponse = `You have $${USD} in USD. The current exchange is equal to ${X} per dollar. Your spendable-cash is equal to ${CLP} Chilean pesos. Plan accordingly and save travels!`;
let currencyContent = document.createTextNode(currencyResponse);
curDiv.appendChild(currencyContent);
responseContainer.appendChild(curDiv)
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
    console.log(timeZoneData);
}

//----------------API REQUESTING TIME AND DATE BASED ON GIVEN LOCATION OF US HOME STATE---------------------------
const geoAPIKey = 'e000b03e24be4f11b13bba28df8da6fc'; //API KEY FOR IPGEOLOCATION  gets region time and date

async function getUSTime(homeState) {
let yourHomeState = homeState.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/\s/g, "%20");
const geoResponse = await fetch(`https://api.ipgeolocation.io/astronomy?apiKey=${geoAPIKey}&location=${yourHomeState},%20US`);
const geoData = await geoResponse.json();
//console.log(geoData);
let {current_time: USStateTime, date: USStateDate, location: { state, country }, sunrise, sunset } = geoData;
let dateUSA = USStateDate.slice(5).split("-").join('');
console.log(dateUSA)
let timeUSA = USStateTime.slice(0,5);
let seasonUSA = getSeason('', dateUSA);
let homeStateResponse = `In ${country}, ${state}, it is ${timeUSA}, and the date is ${USStateDate}. ${seasonUSA}.`;
let timeContent = document.createTextNode(homeStateResponse);
timeDiv.appendChild(timeContent);
responseContainer.append(timeDiv)
}

//----------------API REQUESTING TIME AND DATE BASED ON CHILE TIME---------------------------
async function getCLTime() {
const geoResponse = await fetch(`https://api.ipgeolocation.io/astronomy?apiKey=${geoAPIKey}&location=Chile,%20US`);
const chileGeoData = await geoResponse.json();
let {current_time: ChileTime, date: CLDate, sunrise, sunset } = chileGeoData;
let dateCHILE = CLDate.slice(5).split("-").join('');
let timeChile = ChileTime.slice(0,5)
let seasonChile = getSeason(dateCHILE,'')
let seasonInChileTextContent = document.createTextNode(`So plan accordingly and enjoy your trip!`);
seasonCLDiv.appendChild(seasonInChileTextContent);
let chileTimeResponse = `In Chile, it is ${timeChile}, and the date is ${CLDate}. ${seasonChile}`;
let CLTimeContent = document.createTextNode(chileTimeResponse);
clTimeDiv.appendChild(CLTimeContent);
responseContainer.append(clTimeDiv, seasonCLDiv)
}

//------------------------------------------------------------------------------------------------------------------


//---get season for USA or for CHILE takes MM/DD only---- 
function getSeason(monthDateChile= '', monthDateUSA='') {
    if(monthDateChile != '' && monthDateUSA == '') {
        if(monthDateChile >0320 && monthDateChile <= 0620) { return `It's Fall, Fall lasts from march 20th until June 20th`};
        if(monthDateChile >0621 && monthDateChile <= 0922) { return `It's Winter, Winter extends from June 21st until September 22nd`};
        if(monthDateChile >0923 && monthDateChile <= 1221){ return `It's Spring, Spring lasts from September 23rd until December 21st`};
        if(monthDateChile <= 0319 || 1222 <= monthDateChile ) { return `In chile it's Summer, Summer extends from December 22nd until March 19th`};
        }
    if(monthDateUSA != '' && monthDateChile == ''){
        if(monthDateUSA >0320 &&  monthDateUSA <= 0620){ return `It's Spring, Spring stretches from march 20th until June 20th`}
        if(monthDateUSA >0621 &&  monthDateUSA <= 0922){ return `It's Summer, Summer extends from June 21st until September 22nd`}
        if(monthDateUSA > 0923 && monthDateUSA <= 1221){ return `It's Fall, Fall lasts from September 23rd until December 21st`}
        if(monthDateUSA <= 0319 || 1222 <= monthDateUSA){ return `It's Winter, Winter extends from December 22nd until March 19th`}
        }
}     
 
//---------------------------------------------------------------------------------------------------------------------


//-------------------RUNS ALL UNIT CONVERSION FOR A WOMEN----------------------------------------------------------
function getConvertedUnitsWomen(formInput) {
    let { name: herName, homeState, USShoeSize: womenShoeSize, waist: womenWaist,
    height, weight, distance, carSize, cash } = formInput;  
    
    let herShoeSize = (getEUShoeSize(``,womenShoeSize));  
    let herWaistSize = (getHerWaistSize(womenWaist));

    let herWeight = (lbsToKg(weight, ``))
    let herHeight = (feetToMeters(height,``));
    let gasForCarSize = (getGasTankSize(carSize));
    let travelDistance = (milesToKilometers(distance,``));
    let carType = getGasTankSize(carSize, distance);
    
    const fragment = document.createDocumentFragment();

    let greet = document.createElement('h2');
        greet.textContent = `Hello ${herName}, Thank you for visiting CHILE!`;
    let whereYouFrom = document.createElement('p');
        whereYouFrom.textContent = `Your home state of ${homeState} is a few hours away from Chilean timezone`;
    let measures = document.createElement('p')
        measures.textContent= `${herShoeSize} and a ${herWaistSize}`;
    let weightHeight = document.createElement('p')
        weightHeight.textContent = `${herHeight}. ${herWeight}`;
    let travelingDistance = document.createElement('p')
        travelingDistance.textContent = `${travelDistance} ${carType}`;

    fragment.append(greet, whereYouFrom, measures, weightHeight, travelingDistance);
    convDiv.append(fragment);
    responseContainer.appendChild(convDiv);
}

//----------------------RUNS ALL UNIT CONVERSIONS FOR A MEN-------------------------------------------------------
function getConvertedUnitsMen(formInput) {
    let { name: hisName, homeState, USShoeSize, waist: menWaist,
    height, weight, distance, carSize, cash } = formInput;  
    
    let hisShoeSize = (getEUShoeSize(USShoeSize, ''));  
    let hisWaistSize = (getHerWaistSize(``,menWaist));

    let hisWeight = (lbsToKg(weight, ``))
    let hisHeight = (feetToMeters(height,``));
    let gasForCarSize = (getGasTankSize(carSize));
    let travelDistance = (milesToKilometers(distance,``));
    let carType = getGasTankSize(carSize, distance);
    
    const fragment = document.createDocumentFragment();
   // const hisDiv = document.createElement('div');

    let greet = document.createElement('h2');
        greet.textContent = `Hello ${hisName}, Thank you for visiting CHILE!`;
    let whereYouFrom = document.createElement('p');
        whereYouFrom.textContent = `Your home state of ${homeState} is a few hours away from Chilean timezone`;
    // whereYouFrom.textContent =`in your home state of ${homeState} it is `;
    let measures = document.createElement('p')
        measures.textContent= `${hisShoeSize} and a ${hisWaistSize}`;
    let weightHeight = document.createElement('p')
        weightHeight.textContent = `${hisHeight}. ${hisWeight}`;
    let travelingDistance = document.createElement('p')
        travelingDistance.textContent = `${travelDistance} ${carType}`;

    fragment.append(greet, whereYouFrom, measures, weightHeight, travelingDistance);
    theDiv.append(fragment);
    responseContainer.appendChild(theDiv);
}

//-----------INDIVIDUAL FUNCTIONS BELOW-------------------------------------------------------------------------

/* shoe size converter EU Women shoe size == U.S. women shoe size + 30 && EU Men shoe size == U.S. men shoe size + 31.5 */
function getEUShoeSize(USShoeSize = ``, womenShoeSize=``) {
     if(USShoeSize != ''&& womenShoeSize =='') { return `Your shoe size is ${USShoeSize + 31.5} in Chile`; }
     if(womenShoeSize != ''&& USShoeSize =='') { return `You shoe size is ${womenShoeSize + 30} in Chile`;}
}
//Takes in waist US waist size returns EU waist size
function getHerWaistSize(womenWaist = ``, menWaist= ``) {
    if(womenWaist !='' && menWaist == '') {return `your waist size is ${(womenWaist*2.54).toFixed(2)} cm. While shopping, use this as a starting point since actual size can vary between brands.`;}
    if(menWaist !='' && womenWaist == '') {return `Your waist size is ${menWaist*2.54} cm. When shopping for pants, knowing your cm waist size will come in handy.`;}
    
}
//Takes in ft or meters and returns the other. Where one ft = 0.3048 m or one meter = 3.28084 ft
function feetToMeters(feet=``, meter=``) {
    if(feet !='' && meter == ''){ return `Your height is measured in meters and weight in kilos here. You are ${(feet*0.3048).toFixed(2)} meters tall `; }
    if(meter != '' && feet == ''){ return `Your height is ${(meter*3.28084).toFixed(2)} feet tall`; } 
}

//lbs to kg converter
function lbsToKg(lbs= ``, kgs= ``) {
    if(lbs!=``&& kgs===``) { return `and weigh ${(lbs/2.205).toFixed(2)} kilos!`;}
    if(kgs!=``&& lbs===``){return `You weigh ${(kgs*.2,204).toFixed(2)} in lbs`;} 
}
 /*Takes in miles or Kilometers and returns the other. Where one mile = 1.60934 km    one kilometer == 0.621371 mi */
 function milesToKilometers(miles=``, kilometer = ``) {
    if(miles != '' && kilometer == ''){ return `Traveling ${miles} miles, is equivalent to ${(miles*1.60934).toFixed(2)} kilometers.`;}
    if(kilometer != '' && miles == ''){ return `Your travel distance is ${(kilometer*0.621371).toFixed(2)} miles`;} 
}
//returns liters needed for a given car size
function getGasTankSize (carSize, distance) {
    switch (carSize) {
        case 'small': return `On average, a small car has an mpg of 30 and a 12-gallon gas tank which is equivalent to a 45-liter tank.
         If you travel ${distance} miles you will need ${((distance/30)*3.78541).toFixed(2)} liters of gas. 
         To get to your destination and back you will need around ${(((distance/30)*3.78541)*2).toFixed(2)} liters of gas.`

        case 'medium': return `On average, a mid-size vehicle has an mpg of 23 and can hold anywhere between 53 to 60-liters of gas. 
        If you travel ${distance} miles you will need ${((distance/23)*3.78541).toFixed(2)} liters. To get to your destination and back you will need around ${(((distance/23)*3.78541)*2).toFixed(2)} liters of gas.` 

        case 'big': return `On average, an 8-cylinder vehicle has an mpg of 17 and it can hold between a 60-liter to 113-liters of gas. 
        To travel ${distance} you will need ${((distance/17)*3.78541).toFixed(2)} liters. To get to your destination AND back you will need ${(((distance/17)*3.78541)*2).toFixed(2)} liters of gas.`
    }
}

/* Fahrenheit to celsius formula = f - 32* .5556 (OR 5/9)
Celsius to Fahrenheit formula == c *1.8(OR 9/5) + 32 */
function FahrenheitToCelsius(Fahrenheit='', Celsius='') {
	if(Fahrenheit != '' && Celsius == ''){ return `${(Fahrenheit-32)* 5/9} celsius`; }
    if(Celsius != '' && Fahrenheit == ''){ return `${(Celsius*9/5) + 32} fahrenheit`; } 
}

/* gallons to liters formula where one gallon = 3.78541 liters && one liter = 0.264172 gallons */
function galToLiters (gallons= '', liters='') {
    if(gallons!= '' && liters == ''){  return `${(gallons*3.78541).toFixed(2)} liters`; }
    if(liters != '' && gallons == ''){return `${(liters*0.264172).toFixed(2)} gallons`; } 
}


//get home state time get Chile current location time. 
//function getTimeAndSeason () { return p class="time-season"}
//get current gas prices (in chile) --Find an API
//write get gasCashNeeded() function


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