const colorHelper = require('./colorHelper');
const deeplearn = require('deeplearn');

const Network = require('./network');
const network = new Network();
network.setupNetwork();

const generateTrainingData = (size = 1e5) => {
    const inputData = [];
    const targetData = [];
    for(let i = 0; i < size; i++) {
        const inputColor = colorHelper.randomColorArray();
        const targetColor = colorHelper.computeComplementaryColor(inputColor);
        inputData.push(deeplearn.Array1D.new(inputColor));
        targetData.push(deeplearn.Array1D.new(targetColor))
    }
    return [inputData, targetData];
};

onmessage = function(e) {
    network.setTrainingData(generateTrainingData());
    network.trainBatch();

    const input = e.data;
    const prediction = network.predict(input);
    postMessage({input, prediction});
};


