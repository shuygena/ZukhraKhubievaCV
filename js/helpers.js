import colors from './colors.js';

export class Point {
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

export class Vector2 {
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

export function updateCanvasSize(canvas) {
    const pixelSize = new Point(canvas.width, canvas.height);
    const realSize = new Point(canvas.clientWidth, canvas.clientHeight);

    if (!Point.isEqual(pixelSize, realSize)) {
        canvas.width = realSize.x;
        canvas.height = realSize.y;
    }
}

export function getFromRange(start, end, progress) {
    return start + (end - start) * progress
}

export function getStringRgb(obj) {
    const { r, g, b } = obj
    return `rgb(${r}, ${g}, ${b})`
}

export function getColor(progress) {
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
