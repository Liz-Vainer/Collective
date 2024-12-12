const display = document.querySelector('input');
const numbers = document.getElementsByClassName('numbers');



function clearDisplay(){
    display.value = "";
}
function appendDisplay(input) {
    if (display.value === "Cannot divide by zero!" || display.value === "Invalid input for factorial!" ) {
        clearDisplay();
    }
    display.value += input;
}
function evaluate() {
    try {
        const result = eval(display.value);
        if (result === Infinity || result === -Infinity){
            throw new Error("Cannot divide by zero!");
        }     
        display.value = result ;   
    }
    catch (error) {
        display.value = error.message;   //error.message - prints what i throw before
    }
} 
function factorial(){
    try {
        const num = Number(display.value);
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
            throw new Error("Invalid input for factorial!");
        }
        let sum = 1;
        for (let i = 1; i <= num; i++){
            sum = sum * i;
        }
        display.value = sum;
    }
    catch (error) {
        display.value = error.message;   ////error.message - prints what i throw before
    }
}
for (let i = 0; i < numbers.length; i++){
    numbers[i].addEventListener('click',function(event){       //event is basically 'this' in c++ (event --> numbers[i] --> the button)
        const buttonText = event.target.textContent;  //get the clicked button's text
        if (buttonText === "clear"){
            clearDisplay()
        }
        else if (buttonText === '='){
            evaluate();
        }
        else if (buttonText === 'x!'){
            factorial();
        }
        else {
            appendDisplay(buttonText);
        }
    })
}









