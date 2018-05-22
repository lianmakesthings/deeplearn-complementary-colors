import colorHelper from './colorHelper';
import * as tf from '@tensorflow/tfjs';

import Network from './network';
const network = new Network();
network.setupNetwork();

const normalize = (array) => {
    return array.map(v => v / 255);
};

const denormalize = (array) => {
    return array.map(v => Math.round(v * 255));
};

const generateData = (size = 10) => {
    const inputLayer = [];
    const targetLayer = [];
    for(let i = 0; i < size; i++) {
        const inputColor = colorHelper.randomColorArray();
        const targetColor = colorHelper.computeComplementaryColor(inputColor);
        inputLayer.push(normalize(inputColor));
        targetLayer.push(normalize(targetColor));
    }
    return {inputLayer: tf.tensor2d(inputLayer, [size, 3]), targetLayer:  tf.tensor2d(targetLayer, [size, 3])};
};
network.setData(generateData());

const trainIfNeeded = (start) => {
    if (!start) {
        console.log('train');
        return network.train(1)
    } else {
        return Promise.resolve({loss: 0, accuracy: 0})
    }
};

onmessage = function(e) {
    let loss;
    let accuracy;
    let input;

    return trainIfNeeded(e.data[0])
        .then((result) => {
            console.log('training result', result)
            loss = result.loss;
            accuracy = result.accuracy;

            input = normalize(e.data[1]);
            return network.predict(input)
        })
        .then(prediction => {
            console.log('prediction', prediction)
            input = denormalize(input);
            prediction = denormalize(prediction);
            postMessage({input, prediction, loss});
        })
        .catch(err => {
            console.log('error', err);
        })

};

