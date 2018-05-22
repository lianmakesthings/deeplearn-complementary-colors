const colorHelper = require('./colorHelper');
const deeplearn = require('deeplearn');

const Network = require('./network');
const network = new Network();
network.setupNetwork();

const normalize = (array) => {
    return array.map(v => v / 255);
};

const denormalize = (array) => {
    return array.map(v => Math.round(v * 255));
};

const generateTrainingData = (size = 1e5) => {
    const inputData = [];
    const targetData = [];
    for(let i = 0; i < size; i++) {
        const inputColor = colorHelper.randomColorArray();
        const targetColor = colorHelper.computeComplementaryColor(inputColor);
        inputData.push(deeplearn.Array1D.new(normalize(inputColor)));
        targetData.push(deeplearn.Array1D.new(normalize(targetColor)))
    }
    return [inputData, targetData];
};
network.setTrainingData(generateTrainingData());
let cost = 1;

onmessage = function(e) {
    const start = e.data[0];
    let totalCost = 0;
    if (!start) {
        for (let i = 0; i < 24; i++) {
            totalCost = totalCost + network.trainBatch(true);
        }
    }
    const cost = totalCost / 25;
    let input = normalize(e.data[1]);
    let prediction = network.predict(input);
    input = denormalize(input);
    prediction = denormalize(prediction);

    postMessage({input, prediction, cost});
};

