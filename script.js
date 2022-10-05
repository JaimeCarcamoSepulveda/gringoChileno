/*
FUNCTIONS TO BUILD

1st-feet to meters,
2nd- miles to kilometers,
3rd -degrees to Fahrenheit, 
4th- gasoline gallons to liters
5th--*shoe size converter

*season converter (if its spring in Chile its... blank in (INPUT STATE))

**dollar to peso 


*/


/*Takes in ft or meters and returns the other. 
 1 ft == 0.3048 meter,   1 meter == 3.28084 ft */

function feetToMeters(feet=``, meter=``) {
    if(feet !='' && meter == ''){
        return `${feet*0.3048} meters`; 
    }
    if(meter != '' && feet == ''){
        return `${meter*3.28084} feet`;
    }else return;
}

 /*Takes in miles or Kilometers and returns the other
 1 mile == 1.60934 kilometer    1 kilometer == 0.621371 miles */

function milesToKilometers(miles=``, kilometer = ``) {
    if(miles != '' && kilometer == ''){
        return `${miles*1.60934} kilometers`;
    }
    if(kilometer != '' && miles == ''){
        return `${kilometer*0.621371} miles`;
    } else return;
}


/* Fahrenheit to celsius formula == f - 32* .5556 (OR 5/9)
Celsius to Fahrenheit formula == c *1.8(OR 9/5) + 32 */

function FahrenheitToCelsius(Fahrenheit='', Celsius='') {
	if(Fahrenheit != '' && Celsius == ''){
        return `${(Fahrenheit-32)* 5/9} celsius`;
    }
    if(Celsius != '' && Fahrenheit == ''){
        return `${(Celsius*9/5) + 32} fahrenheit`;
    } else return;
}

/* gallons to liters formula == 1 gallons == 3.78541 liters
1 liter == 0.264172 gallons */

function galToLiters (gallons= '', liters='') {
    if(gallons!= '' && liters == ''){
        return `${gallons*3.78541} liters`;
    }
    if(liters != '' && gallons == ''){
        return `${liters*0.264172} gallons`;
    } else return;
}

/* shoe size converter 
men to women shoe size converter
US Women size == men size + 1.5
US Men size == women size - 1.5

EU Women shoe size == U.S. men size + 1.5 + 30 || U.S. women shoe size + 30
EU Men shoe size == women size - 1.5 + 30 || U.S. men shoe size + 31.5 */

function USShoeSize(menShoeSize = '', womenShoeSize='') {
    if(menShoeSize != ''&& womenShoeSize =='') {
    return `You are a ${menShoeSize + 1.5} in U.S Women shoe size`; }
    if(womenShoeSize != ''&& menShoeSize =='') {
    return `You are a ${womenShoeSize - 1.5} in U.S men shoe size`;
    }
}


//let display = document.getElementById('display').textContent;

/*
function feetToMeters (display) {
    let answer = "you are right"
    return display.textContent = answer;
}

*/