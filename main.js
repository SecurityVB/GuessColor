const root = document.querySelector(':root');
const rootStyles = getComputedStyle(root);
const mainColor = rootStyles.getPropertyValue('--main-color').trim();
let secondsLeft = 5.00;
let timerInterval;

function randomHexColor() {
  let randomNum = Math.floor(Math.random() * 16777215);
  let hexCode = randomNum.toString(16); 
  let fullHexCode = "#" + hexCode.padStart(6, '0'); 

  return fullHexCode;
}

function startCountdown() {
    if (timerInterval) return;

    timerInterval = setInterval(function () {
        secondsLeft -= 0.01;
        
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            secondsLeft = 5.00;
            changeColor();
        } else {
            updateDisplay();
        }
    }, 10);
}

function updateDisplay() {
    let seconds = secondsLeft.toFixed(2);
    cnt.textContent = seconds;
}

function changeColor(newColor) {
    root.style.setProperty('--main-color', randomHexColor());
    cnt.textContent = 'Countdown Over!';
}

const cnt = document.getElementById("cnt")
cnt.addEventListener("pointerdown", startCountdown)