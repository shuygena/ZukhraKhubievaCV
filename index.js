class Renderer {
    constructor(opt) {
    }

    render(ctx, eyes) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        eyes.forEach(eye => {
            const globalZero = eye._coords.getCopy();
            eye._sparks.forEach(spark => {
                ctx.save()
                ctx.fillStyle = spark.color;
                ctx.strokeStyle = spark.color;
                const x = globalZero.x + spark.x;
                const y = globalZero.y + spark.y;

                const scale = .5;
                const sizeMax = 5 * scale;
                const sizeMin = 3 * scale;
                const offset = scale;
                const margin = 2 * scale;
                const smallStripSize = 3 * scale;
                const bigStripSize = 6 * scale;

                const sectorAngle = Math.PI / 3;


                ctx.beginPath();
                ctx.moveTo(x + sizeMin, y);
                for (let i = 0; i < 6; i++) {
                    const currentAngleMax = sectorAngle * i + sectorAngle / 2;
                    const currentAngleMin = sectorAngle * i + sectorAngle;
                    ctx.lineTo(Math.cos(currentAngleMax) * sizeMax + x, Math.sin(currentAngleMax) * sizeMax + y);
                    ctx.lineTo(Math.cos(currentAngleMin) * sizeMin + x, Math.sin(currentAngleMin) * sizeMin + y);
                }
                ctx.fill();



                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const currentAngle = i * sectorAngle;
                    const intermediateAngle = currentAngle + sectorAngle / 2;

                    ctx.moveTo(
                        x + (sizeMin + offset) * Math.cos(currentAngle),
                        y + (sizeMin + offset) * Math.sin(currentAngle)
                    );

                    ctx.lineTo(
                        x + (sizeMin + offset + smallStripSize) * Math.cos(currentAngle),
                        y + (sizeMin + offset + smallStripSize) * Math.sin(currentAngle)
                    );

                    ctx.moveTo(
                        x + (sizeMin + offset + smallStripSize + margin) * Math.cos(currentAngle),
                        y + (sizeMin + offset + smallStripSize + margin) * Math.sin(currentAngle)
                    );

                    ctx.lineTo(
                        x + (sizeMin + offset + smallStripSize * 2 + margin) * Math.cos(currentAngle),
                        y + (sizeMin + offset + smallStripSize * 2 + margin) * Math.sin(currentAngle)
                    );

                    ctx.moveTo(
                        x + (sizeMax + offset) * Math.cos(intermediateAngle),
                        y + (sizeMin + offset) * Math.sin(intermediateAngle)
                    );

                    ctx.lineTo(
                        x + (sizeMax + offset + bigStripSize) * Math.cos(intermediateAngle),
                        y + (sizeMin + offset + bigStripSize) * Math.sin(intermediateAngle)
                    );
                }
                ctx.stroke();

                ctx.restore();
            })
        })
    }
}
const colors = [
    { 'r': 255, 'g': 255, 'b': 255 },
    { 'r': 239, 'g': 209, 'b': 97 },
    { 'r': 233, 'g': 179, 'b': 45 },
    { 'r': 240, 'g': 150, 'b': 27 },
    { 'r': 228, 'g': 116, 'b': 53 },
    { 'r': 229, 'g': 114, 'b': 119 },
    { 'r': 213, 'g': 7, 'b': 45 },
    { 'r': 181, 'g': 7, 'b': 9 },
    { 'r': 155, 'g': 1, 'b': 1 },
    { 'r': 120, 'g': 4, 'b': 3 },
    { 'r': 69, 'g': 4, 'b': 2 },
]

class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    moveFor(x, y) {
        this.x += x;
        this.y += y;
    }

    applyDiff(vec2, dt) {
        this.x += vec2.x * dt;
        this.y += vec2.y * dt;
    }

    getCopy() {
        return new Point(this.x, this.y)
    }

    static isEqual(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }
}

class Vector2 {
    constructor(x = 0, y = 0) {
        this.endPoint = new Point(x, y);
    }

    get x() {
        return this.endPoint.x;
    }

    get y() {
        return this.endPoint.y;
    }

    applyDiff(vec2, dt) {
        this.endPoint.applyDiff(vec2, dt);
    }

    static getRandomVec(n, m) {
        return new Vector2(Math.random() * n * 2 - n, Math.random() * m * 2 - 2 * m)
    }
}

function updateCanvasSize(canvas) {
    const pixelSize = new Point(canvas.width, canvas.height);
    const realSize = new Point(canvas.clientWidth, canvas.clientHeight);

    if (!Point.isEqual(pixelSize, realSize)) {
        canvas.width = realSize.x;
        canvas.height = realSize.y;
    }
}

function getFromRange(start, end, progress) {
    return start + (end - start) * progress
}

function getStringRgb(obj) {
    const { r, g, b } = obj
    return `rgb(${r}, ${g}, ${b})`
}

function getColor(progress) {
    if (progress === 0) return getStringRgb(colors.shift())
    if (progress === 1) return getStringRgb(colors.pop())

    const n = colors.length;
    const stageRange = 1 / (n - 1);
    const stage = Math.floor(progress / stageRange);
    const localProgress = progress - stage * stageRange;

    const startColor = colors[stage];
    const endColor = colors[stage + 1];

    return  getStringRgb({
        r: getFromRange(startColor.r, endColor.r, localProgress),
        g: getFromRange(startColor.g, endColor.g, localProgress),
        b: getFromRange(startColor.b, endColor.b, localProgress),
    })
}

class Spark {
    constructor() {
        this._coord = new Point();
        this.color = '';
        this.velocity = Vector2.getRandomVec(50, 50);
        this._age = 0;
    }

    get age() {
        return this._age;
    }

    _inc() {
        this._age++;
    }

    get x() {
        return this._coord.x;
    }

    get y() {
        return this._coord.y;
    }

    _applyVelocity(dt) {
        this._coord.applyDiff(this.velocity, dt / 100)
    }

    _applyAcc(dt) {
        this.velocity.applyDiff(new Vector2(0, 10), dt / 100)
    }

    nextTick(dt) {
        this._applyAcc(dt)
        this._applyVelocity(dt)
        this._inc()
        this._calculateColor()
    }

    _calculateColor() {
        this.color = getColor(1 - 1 / (this.age / 80 + 1))
    }

    isOutOfVisible(maxY) {
        return this.y > maxY
    }
}

class Eye {
    constructor(opt) {
        this._coords = new Point(opt.x, opt.y)
        this._sparks = [];

        this._maxY = opt.maxY || 2500;
        this._forDelete = [];
    }

    addSpark() {
        this._sparks.push(new Spark())
    }

    nextTick(dt) {
        this._sparks.forEach(spark => {
            spark.nextTick(dt)
            if (spark.isOutOfVisible(this._maxY)) this._forDelete.push(spark)
        })

        this._deleteInvisibleSparks()
    }

    _deleteInvisibleSparks() {
        this._forDelete.forEach(spark => {
            this._sparks.splice(this._sparks.indexOf(spark), 1)
        })
        this._forDelete = [];
    }

    spawnSparks(min, max) {
        const n = getFromRange(min, max, Math.random());
        for (let i = 0; i < n; i++) this.addSpark();
    }
}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const renderer = new Renderer();
const eyes = [];

let isActive = false;
let isStop = true;

window.addEventListener('click', toggleActivity)

eyes.push(new Eye({ x: 500, y: 500, maxY: 700 }))

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
