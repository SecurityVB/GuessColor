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
            cnt.removeEventListener("pointerdown")
        } else {
            updateDisplay();
        }
    }, 10);
}

function updateDisplay() {
    let seconds = secondsLeft.toFixed(2);
    tmr.textContent = seconds;
}

function changeColor(newColor="") {
    color = newColor ? newColor : randomHexColor()
    root.style.setProperty('--main-color', color);
    tmr.textContent = 'Countdown Over!';
}

const cnt = document.getElementById("cnt");
const tmr = document.getElementById("tmr");
// cnt.addEventListener("pointerdown", startCountdown);


const sliders = {
    hue: document.getElementById('hue-slider'),
    white: document.getElementById('white-slider'),
    black: document.getElementById('black-slider')
};

const cols = {
    white: document.getElementById('white-col'),
    black: document.getElementById('black-col')
};

function fitSliders() {
    Object.values(sliders).forEach(slider => {
        const parent = slider.parentElement;
        const h = parent.offsetHeight;
        const w = parent.offsetWidth;

        slider.style.width = h + 'px'; 
        slider.style.height = w + 'px';
    });
}

function update() {
    const h = parseInt(sliders.hue.value);
    const s_val = parseInt(sliders.white.value);
    const v_val = parseInt(sliders.black.value);

    const baseColor = `hsl(${h}, 100%, 50%)`;
    
    cols.white.style.background = `linear-gradient(to bottom, #ffffff, ${baseColor})`;
    cols.black.style.background = `linear-gradient(to bottom, #000000, ${baseColor})`;

    const s = s_val; 
    const v = v_val;

    const finalHex = hsvToHex(h, s, v);
    
    console.clear();
    console.log(`%c   `, `background: ${finalHex}; border: 1px solid #000; padding: 5px 15px;`);
    console.log("Финальный HEX:", finalHex);
    changeColor(finalHex)
}

function hsvToHex(h, s, v) {
    s /= 100; v /= 100;
    const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    const rgb = [f(5), f(3), f(1)].map(x => Math.round(x * 255).toString(16).padStart(2, '0'));
    return `#${rgb.join('')}`.toUpperCase();
}

Object.values(sliders).forEach(el => el.addEventListener('input', update));
window.addEventListener('resize', fitSliders);
fitSliders(); 
update();