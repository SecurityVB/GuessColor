const root = document.querySelector(':root');
const rootStyles = getComputedStyle(root);
const mainColor = rootStyles.getPropertyValue('--main-color').trim();
const container = document.querySelector('.color-picker-container');
const btn = document.getElementById("enter");
const txtLoser = document.getElementById("louser");
let secondsLeft = 5.00;
let timerInterval;
let targetColor = [];
let currentColor = [];
let flagEvent = true;

function randomHsvColor() {
  const h = Math.floor(Math.random() * 361);
  const s = Math.floor(Math.random() * 101);
  const v = Math.floor(Math.random() * 101);
  return [h, s, v];
}

function percent(c1,c2) {
    if (c1<c2) {
        return c1/c2*100;
    } else {
        return c2/c1*100;
    }
}

function colorSimilarity(hsv1, hsv2) {
    let diffH = Math.abs(hsv1[0] - hsv2[0]);
    if (diffH > 180) diffH = 360 - diffH;
    let hScore = (1 - diffH / 180) * 100;

    let sScore = percent(hsv1[1] + 1, hsv2[1] + 1);
    let vScore = percent(hsv1[2] + 1, hsv2[2] + 1);

    return (hScore + sScore + vScore) / 3;
}

function startCountdown() {
    if (timerInterval) return;

    let c = randomHsvColor();

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
        if (colorSimilarity(currentColor, targetColor) > 80) {
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

function changeColor(newColor) {
    const colorStr = hsvToCss(newColor);
    root.style.setProperty('--main-color', colorStr);
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
    const s = parseInt(sliders.white.value);
    const v = parseInt(sliders.black.value);

    const baseColor = `hsl(${h}, 100%, 50%)`;
    
    cols.white.style.background = `linear-gradient(to bottom, #ffffff, ${baseColor})`;
    cols.black.style.background = `linear-gradient(to bottom, #000000, ${baseColor})`;

    const finalHSV = [h,s,v];
    
    changeColor(finalHSV);
    currentColor = finalHSV;
}

function hsvToCss(hsvArray) {
    let [h, s, v] = hsvArray;
    h = h / 360;
    s = s / 100;
    v = v / 100;

    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    const color = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    return color;
}

Object.values(sliders).forEach(el => el.addEventListener('input', update));
window.addEventListener('resize', fitSliders);
fitSliders(); 
update();
container.style.display = 'none';
btn.style.display = 'none';