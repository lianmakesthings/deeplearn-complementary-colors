import * as tf from '@tensorflow/tfjs';

class Network {
    constructor() {
        this.learningRate = 0.042;
        this.batchSize = 100;
        this.math = deeplearn.ENV.math;
    }
    addFullyConnectedLayer(sizeOfThisLayer) {
        this.model.add(tf.layers.dense({
            units: sizeOfThisLayer,
            activation: "relu",
            useBias: true,

        }));
    };

    setupNetwork() {
        this.model = tf.sequential();
        this.inputTensor = tf.layers.inputLayer({inputShape: [3]});
        this.model.add(this.inputTensor);

        this.addFullyConnectedLayer(64);
        this.addFullyConnectedLayer(32);
        this.addFullyConnectedLayer(16);

        this.addFullyConnectedLayer(3);
        this.optimizer = tf.train.sgd(this.learningRate);

        this.model.compile({
            optimizer: this.optimizer,
            loss: "meanSquaredError",
            metrics: ['accuracy'],
        });
    }

    setData(data) {
        this.trainingData = data;
    }

    train() {
        return this.model.fit(
            this.trainingData.inputLayer,
            this.trainingData.targetLayer,
            {
                batchSize: this.batchSize,
                epochs: 1
            }
        ).then(history => {
            const loss = history.history.loss[0];
            const accuracy = history.history.acc[0];
            return {loss, accuracy}
        });
    }

    predict(input) {
        let prediction = [];
        this.math.scope((keep, track) => {
            const mapping = [{
                tensor: this.inputTensor,
                data: deeplearn.Array1D.new(input),
            }];
            const evalOutput = this.session.eval(this.predictionTensor, mapping);
            const values = evalOutput.dataSync();
            const output = Array.prototype.slice.call(values);

            // Make sure the values are within range.
            prediction = output.map(
                v => Math.max(Math.min(v, 255), 0));
        });
        return prediction;
    }

    setLearningRate(learningRate) {
        this.learningRate = learningRate;
        this.optimizer.setLearningRate(learningRate);
    }


}
module.exports = Network;