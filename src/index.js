import Worker from './network.worker.js';
const colorHelper = require('./colorHelper');
let batchCount = 0;

const appendPrediction = (input, target, predicted) => {
    input = 'rgb(' + input.join(',') + ')';
    target = 'rgb(' + target.join(',') + ')';
    predicted = 'rgb('+ predicted.join(',')+')';

    const predictionHTML = `<div>
    <p>Batch No ${batchCount}</p>
    <div class="unit">
            <p>Input</p>
            <div id="colorBox" class="box" style="background-color: ${input}"></div>
        </div>
        <div class="unit">
            <p>Complementary</p>
            <div id="complementaryBox" class="box" style="background-color: ${target}"></div>
        </div>
        <div class="unit">
            <p>Predicted</p>
            <div id="predictedBox" class="box" style="background-color: ${predicted}"></div>
        </div>
    </div>`;

    const div = document.getElementById('prediction');
    div.insertAdjacentHTML( 'beforeend', predictionHTML);
};

if (window.Worker) {
    const worker = new Worker();
    let inputColor = colorHelper.randomColorArray();
    worker.postMessage(inputColor);

    worker.onmessage = function (e) {
        batchCount++;
        let inputColor = e.data.input;
        const prediction = e.data.prediction;
        appendPrediction(inputColor, colorHelper.computeComplementaryColor(inputColor), prediction);

        if (batchCount < 10) {
            inputColor = colorHelper.randomColorArray();
            worker.postMessage(inputColor);
        }
    }
}


