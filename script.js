/*
FUNCTIONS TO BUILD

1st-feet to meters,
2nd- miles to kilometers,

3rd -degrees to Fahrenheit, 
function degreesToFahrenheit() {
	return 
}
// Fahrenheit to celcious formula == f - 32* .5556 (OR 5/9)
// Celsius to Fahrenheit formula == c *1.8(OR 9/5) + 32


	gasoline gallons to liters, 
function galToLiters (gallons) {
return 
}
//1 gallons == 3.78541 liters
//1 liter == 0.264172 gallons

*shoe size converter

*season converter (if its spring in Chile its... blank in (INPUT STATE))

**dollar to peso 


*/


/*Takes in ft or meters and returns the other. 
 1 ft == 0.3048 meter,   1 meter == 3.28084 ft */

function feetToMeters(feet=``, meter=``) {
    if(meter == ''){
        return `${feet*0.3048} meters`; 
    }
    if(feet == ''){
        return `${meter*3.28084} feet`;
    }
}

 /*Takes in miles or Kilometers and returns the other
 1 mile == 1.60934 kilometer    1 kilometer == 0.621371 miles */

function milesToKilometers(miles=``, kilometer = ``) {
    if(miles == ''){
        return `${kilometer*1.60934} miles`; 
    }
    if(kilometer == ''){
        return `${miles*0.621371} kilometers`;
    }
}






//let display = document.getElementById('display').textContent;

/*
function feetToMeters (display) {
    let answer = "you are right"
    return display.textContent = answer;
}

*/