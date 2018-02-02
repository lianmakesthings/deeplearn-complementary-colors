const colorHelper = require('./colorHelper');
const Network = require('./network');
const deeplearn = require('deeplearn');

const network = new Network();
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

network.setupNetwork();
network.setTrainingData(generateTrainingData());
network.trainBatch();

const inputColor = colorHelper.randomColorArray();
const colorString = 'rgb(' + inputColor.join(',') + ')';
const complementaryString = 'rgb(' + colorHelper.computeComplementaryColor(inputColor).join(',') + ')';
const prediction = network.predict(inputColor);
console.log('prediction', prediction);
const predictedString = 'rgb('+prediction.join(',')+')';

document.getElementById("colorBox").style.backgroundColor = colorString;
document.getElementById("complementaryBox").style.backgroundColor = complementaryString;
document.getElementById("predictedBox").style.backgroundColor = predictedString;
