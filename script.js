/*
FUNCTIONS TO BUILD
5th--*shoe size converter
6th *season converter (if its spring in Chile its... blank in (INPUT STATE))
gas price in real-time chile
USD to Clp exchange rate in real-time 



*/

document.querySelector(`[type="submit"]`).addEventListener("click", response);
let formInput = {}

function response(e) {
    e.preventDefault()
    let name = document.querySelector(`[id="name"]`).value;
    let homeState = document.querySelector(`[id="homeState"]`).value;

    let USShoeSize = document.querySelector(`[id="ShoeSize"]`).value;
    let height = document.querySelector(`[id="height"]`).value;
    let waist = document.querySelector(`[id="waist"]`).value;
    let carSize = document.querySelector(`[id="carType"]`).value;
    let cash = document.querySelector(`[id="cash" ]`).value;
    let gender = document.querySelector(`[id="gender"]`).value;
   let { name: yourName, homeState: yourHomeState, height: yourHeight, carSize: yourCarSize, cash: yourCash, gender: yourGender, USShoeSize: yourShoeSize, waist: yourWaist } = formInput;

    //let yourHeight = feetToMeters(height);
   // let yourShoeSize = USShoeSize(USShoeSize)
   
        console.log(`you are a ${gender}`)

    //const gender = document.querySelector(``).value;
    
    //console.log(`hello ${name} from ${homeState} with shoe size of ${USShoeSize} with height of ${height} feet and available spending cash of ${cash}`);

}

//returns adjusted input for correct gender
/*
getGender(yourGender){
    if(yourGender == "female") {
       yourShoeSize = womenShoeSize;
       waist = womenWaist; 
    }
};
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
