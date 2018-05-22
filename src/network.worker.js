const colorHelper = require('./colorHelper');
import * as tf from '@tensorflow/tfjs';

const Network = require('./network');
const network = new Network();
network.setupNetwork();

const normalize = (array) => {
    return array.map(v => v / 255);
};

const denormalize = (array) => {
    return array.map(v => Math.round(v * 255));
};

const generateData = (size = 1e5) => {
    const inputLayer = [];
    const targetLayer = [];
    for(let i = 0; i < size; i++) {
        const inputColor = colorHelper.randomColorArray();
        const targetColor = colorHelper.computeComplementaryColor(inputColor);
        inputLayer.push(tf.tensor1d(normalize(inputColor)));
        targetLayer.push(tf.tensor1d(normalize(targetColor)));
    }
    return {inputLayer, targetLayer};
};
network.setData(generateData());

onmessage = function(e) {
    const start = e.data[0];
    let totalCost = 0;
    if (!start) {
        for (let i = 0; i < 24; i++) {
            totalCost = totalCost + network.train();
        }
    }
    const cost = totalCost / 25;
    let input = normalize(e.data[1]);
    let prediction = network.predict(input);
    input = denormalize(input);
    prediction = denormalize(prediction);

    postMessage({input, prediction, cost});
};

