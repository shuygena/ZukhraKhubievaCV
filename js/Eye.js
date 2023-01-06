import {getFromRange, Point} from "./helpers.js";
import Spark from "./Spark.js";

export default class Eye {
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
