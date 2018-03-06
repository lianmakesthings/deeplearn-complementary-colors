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

onmessage = function(e) {
    for (let i = 0; i < 19; i++) {
        network.trainBatch();
    }
    const cost = network.trainBatch(true);

    let input = normalize(e.data);
    let prediction = network.predict(input);
    input = denormalize(input);
    prediction = denormalize(prediction);

    postMessage({input, prediction, cost});
};

