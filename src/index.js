import Worker from './network.worker.js';
import colorHelper from './colorHelper';
const appendPrediction = (input, target, predicted, cost) => {
    input = 'rgb(' + input.join(',') + ')';
    target = 'rgb(' + target.join(',') + ')';
    predicted = 'rgb('+ predicted.join(',')+')';

    const predictionHTML = `<tr>
        <td>${currentIteration}</td>
        <td class="box" style="background-color: ${input}">${input}</td>
        <td class="box" style="background-color: ${target}">${target}</td>
        <td class="box" style="background-color: ${predicted}">${predicted}</td>
        <td>${cost}</td>
    </tr>`;

    const tbody = document.getElementById('predictionBody');
    tbody.insertAdjacentHTML( 'beforeend', predictionHTML);
};

let iterations;
let epochs;
let currentIteration = 0;

if (window.Worker) {
    let stopTraining;
    const worker = new Worker();
    const inputColor = [222, 165, 255];

    document.getElementById("start").onclick = function() {
        document.getElementById('predictionBody').innerHTML = '';

        epochs = parseInt(document.getElementById("iterations").value);
        
        const configuration = {
            learningRate: parseFloat(document.getElementById("learningRate").value),
            trainingData: parseInt(document.getElementById("trainingData").value),
            batchSize: parseInt(document.getElementById("batchSize").value),
            epochs: epochs,
        };
        iterations = parseInt(document.getElementById("iterations").value);
        worker.postMessage([configuration, inputColor]);
        stopTraining = false;
    };

    document.getElementById("stop").onclick = function() {
        stopTraining = true;
    };

    worker.onmessage = function (e) {
        let inputColor = e.data.input;
        const prediction = e.data.prediction;
        const cost = e.data.loss;
        appendPrediction(inputColor, colorHelper.computeComplementaryColor(inputColor), prediction, cost);

        window.scrollTo(0,document.body.scrollHeight);
        //window.scrollTo(0, window.scrollMaxY);
        if (currentIteration <= iterations && !stopTraining) {
            console.log('continue training');
            currentIteration++;
            worker.postMessage([false, inputColor]);
        }
    };
}
