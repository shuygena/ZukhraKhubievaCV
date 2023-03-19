import Renderer from "./Renderer.js";
import {updateCanvasSize} from "./helpers.js";
import Eye from "./Eye.js";
import getRandomFact from './factsGenerator.js'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const renderer = new Renderer();
const eyes = [];

const avatar = document.querySelector('.avatar')
const factTextBlock = document.querySelector('.fact__text');
const factButton = document.querySelector('.fact__button');

let isActive = false;
let isStop = true;

avatar.addEventListener('mouseenter', startActivity)
avatar.addEventListener('mouseleave', stopActivity)
factButton.addEventListener('click', setNewFact)
setNewFact()

eyes.push(new Eye({ x: 240, y: 160, maxY: window.innerHeight }))
eyes.push(new Eye({ x: 195, y: 160, maxY: window.innerHeight }))

let lastTime = Date.now()

function update() {
    if (!isStop) requestAnimationFrame(update)
    /////////////////////////////////
    updateCanvasSize(canvas)

    const dt = Date.now() - lastTime;
    lastTime = Date.now();

    if (isActive) eyes.forEach(eye => eye.spawnSparks(1, 3))
    eyes.forEach(eye => eye.nextTick(dt))
    renderer.render(ctx, eyes)

    let sumSparks = 0;
    eyes.forEach(eye => sumSparks += eye._sparks.length)
    if (sumSparks === 0) stop(); else start();
}

function start() {
    if (isStop) {
        isStop = false;
        update()
    }
}

function stop() {
    isStop = true;
}

function toggleActivity(activity) {
    isActive = activity
    if (isActive) {
        start()
    }
}

function startActivity() {
    toggleActivity(true)
}

function stopActivity() {
    toggleActivity(false)
}

function setNewFact() {
    factTextBlock.innerText = getRandomFact()
}
