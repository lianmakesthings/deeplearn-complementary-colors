import Worker from './network.worker.js';
import colorHelper from './colorHelper';
const appendPrediction = (input, target, predicted, cost, accuracy) => {
    input = 'rgb(' + input.join(',') + ')';
    target = 'rgb(' + target.join(',') + ')';
    predicted = 'rgb('+ predicted.join(',')+')';

    const predictionHTML = `<tr>
        <td>${currentIteration}</td>
        <td class="box" style="background-color: ${input}">${input}</td>
        <td class="box" style="background-color: ${target}">${target}</td>
        <td class="box" style="background-color: ${predicted}">${predicted}</td>
        <td style="color: ${cost.color}">${cost.value.toFixed(5)}</td>
        <td style="color: ${accuracy.color}">${accuracy.value.toFixed(4)}</td>
    </tr>`;

    const tbody = document.getElementById('predictionBody');
    tbody.insertAdjacentHTML( 'beforeend', predictionHTML);
};

let iterations;
let epochs;
let currentIteration = 0;

if (window.Worker) {
    let shouldTrain;
    const worker = new Worker();
    const inputColor = [222, 165, 255];

    document.getElementById("start").onclick = function() {
        document.getElementById('predictionBody').innerHTML = '';

        epochs = parseInt(document.getElementById("epochs").value);
        
        const configuration = {
            learningRate: parseFloat(document.getElementById("learningRate").value),
            trainingData: parseInt(document.getElementById("trainingData").value),
            batchSize: parseInt(document.getElementById("batchSize").value),
            epochs: epochs,
        };
        iterations = parseInt(document.getElementById("iterations").value);
        worker.postMessage([configuration, inputColor]);
        shouldTrain = true;
    };

    document.getElementById("stop").onclick = function() {
        shouldTrain = false;
    };

    let lastCost = 1;
    let lastAccurcay = 0;
    worker.onmessage = function (e) {
        let inputColor = e.data.input;
        const prediction = e.data.prediction;
        const cost = {
            value: e.data.loss,
        };
        cost.color = (cost.value <= lastCost) ? 'green' : 'red';
        lastCost = cost.value;
        const accuracy = {
            value: e.data.accuracy,
        };
        accuracy.color = (accuracy.value >= lastAccurcay) ? 'green' : 'red';
        lastAccurcay = accuracy.value;

        appendPrediction(inputColor, colorHelper.computeComplementaryColor(inputColor), prediction, cost, accuracy);

        window.scrollTo(0,document.body.scrollHeight);
        //window.scrollTo(0, window.scrollMaxY);
        if (currentIteration < iterations && shouldTrain) {
            console.log('continue training');
            currentIteration++;
            worker.postMessage([false, inputColor]);
        }
    };
}
