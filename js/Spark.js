import {getColor, Point, Vector2} from "./helpers.js";

export default class Spark {
    constructor() {
        this._coord = new Point();
        this.color = '';
        this.velocity = Vector2.getRandomVec(50, 50);
        this._age = 0;
        this._angle = 0;
        this._dAngle = (Math.random() - .5) * Math.PI * 4
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

    _applyRotation(dt) {
        this._angle += this._dAngle * dt / 1000;
    }

    nextTick(dt) {
        this._applyAcc(dt)
        this._applyVelocity(dt)
        this._applyRotation(dt)
        this._inc()
        this._calculateColor()
    }

    _calculateColor() {
        this.color = getColor(1 - 1 / (this.age / 30 + 1))
    }

    isOutOfVisible(maxY) {
        return this.y > maxY
    }
}
