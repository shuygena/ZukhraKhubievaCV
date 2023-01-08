import Renderer from "./Renderer.js";
import {updateCanvasSize} from "./helpers.js";
import Eye from "./Eye.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const renderer = new Renderer();
const eyes = [];

let isActive = false;
let isStop = true;

window.addEventListener('click', toggleActivity)

eyes.push(new Eye({ x: 200, y: 300, maxY: 700 }))
eyes.push(new Eye({ x: 300, y: 300, maxY: 700 }))

let lastTime = Date.now()

function update() {
    if (!isStop) requestAnimationFrame(update)
    /////////////////////////////////
    updateCanvasSize(canvas)

    const dt = Date.now() - lastTime;
    lastTime = Date.now();

    if (isActive) eyes.forEach(eye => eye.spawnSparks(1, 4))
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

function toggleActivity() {
    isActive = !isActive
    if (isActive) {
        start()
    }
}
