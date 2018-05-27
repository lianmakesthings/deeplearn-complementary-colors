import colorHelper from "./colorHelper";
import * as tf from "@tensorflow/tfjs/dist/index";

class Data {
    constructor(size) {
        this.data = this.generateData(size);
    }
    generateData(size = 500) {
        const inputLayer = [];
        const targetLayer = [];
        for(let i = 0; i < size; i++) {
            const inputColor = colorHelper.randomColorArray();
            const targetColor = colorHelper.computeComplementaryColor(inputColor);
            inputLayer.push(Data.normalize(inputColor));
            targetLayer.push(Data.normalize(targetColor));
        }
        return {input: tf.tensor2d(inputLayer, [size, 3]), target:  tf.tensor2d(targetLayer, [size, 3])};
    };
    
    get input() {
        return this.data.input;
    }
    
    get target() {
        return this.data.target;
    }


    static normalize(array) {
        return array.map(v => v / 255);
    };

    static denormalize(array) {
        return array.map(v => Math.round(v * 255));
    };
}

export default Data;

