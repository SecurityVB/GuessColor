const root = document.querySelector(':root');
const rootStyles = getComputedStyle(root);
const mainColor = rootStyles.getPropertyValue('--main-color').trim();
const container = document.querySelector('.color-picker-container');
const btn = document.getElementById("enter");
const txtLoser = document.getElementById("louser");
let secondsLeft = 5.00;
let timerInterval;
let targetColor;
let currentColor;
let flagEvent = true;

function randomHexColor() {
  let randomNum = Math.floor(Math.random() * 16777215);
  let hexCode = randomNum.toString(16); 
  let fullHexCode = "#" + hexCode.padStart(6, '0'); 

  return fullHexCode;
}

function colorSimilarity(hex1, hex2) {
    const c1 = parseInt(hex1.slice(1), 16);
    const c2 = parseInt(hex2.slice(1), 16);

    if (c1<c2) {
        return c1/c2*100;
    } else {
        return c2/c1*100;
    }
}

function startCountdown() {
    if (timerInterval) return;

    let c = randomHexColor();

    changeColor(c);
    targetColor = c;

    timerInterval = setInterval(function () {
        secondsLeft -= 0.01;
            
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            secondsLeft = 5.00;
            flagEvent = false;
            cnt.removeEventListener("pointerdown", startCountdown);
            container.style.display = 'flex';
            btn.style.display = 'inline-block';
            Object.values(sliders).forEach(el => el.addEventListener('input', update));
            update();
        } else {
            container.style.display = 'none';
            txtLoser.textContent = "";
            updateDisplay();
        }
    }, 10);

}

function guessColor() {
    if (!(flagEvent)) {
        flagEvent = true;
        cnt.addEventListener("pointerdown", startCountdown);
        btn.style.display = 'none';
        console.log(colorSimilarity(currentColor, targetColor));
        if (colorSimilarity(currentColor, targetColor) > 78) {
            document.body.style.backgroundColor = "green";
            txtLoser.textContent = "GOOD JOB BRO";
        } else {
            document.body.style.backgroundColor = "red";
            txtLoser.textContent = "FUCKING LOOOSER";
        }
    }
}

function updateDisplay() {
    let seconds = secondsLeft.toFixed(2);
    tmr.textContent = seconds;
}

function changeColor(newColor="") {
    color = newColor ? newColor : randomHexColor()
    root.style.setProperty('--main-color', color);
    tmr.textContent = '0.00';
}

const cnt = document.getElementById("cnt");
const tmr = document.getElementById("tmr");
cnt.addEventListener("pointerdown", startCountdown);
btn.onclick = guessColor;

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
    if (timerInterval) return;

    const h = parseInt(sliders.hue.value);
    const s_val = parseInt(sliders.white.value);
    const v_val = parseInt(sliders.black.value);

    const baseColor = `hsl(${h}, 100%, 50%)`;
    
    cols.white.style.background = `linear-gradient(to bottom, #ffffff, ${baseColor})`;
    cols.black.style.background = `linear-gradient(to bottom, #000000, ${baseColor})`;

    const s = s_val; 
    const v = v_val;

    const finalHex = hsvToHex(h, s, v);
    
    // console.clear();
    // console.log(`%c   `, `background: ${finalHex}; border: 1px solid #000; padding: 5px 15px;`);
    // console.log(`%c   `, `background: ${targetColor}; border: 1px solid #000; padding: 5px 15px;`);
    changeColor(finalHex);
    currentColor = finalHex;
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
container.style.display = 'none';
btn.style.display = 'none';