import facts from './facts.js'
import {getRandomInt} from "./helpers.js";

export default function getRandomFact() {
    return facts[getRandomInt(facts.length)]
}
