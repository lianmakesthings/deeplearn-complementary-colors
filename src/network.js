import * as tf from '@tensorflow/tfjs';

class Network {
    constructor(learningRate, batchSize, epochs) {
        this.learningRate = learningRate;
        this.batchSize = batchSize;
        this.epochs = epochs;
    }
    addFullyConnectedLayer(sizeOfThisLayer) {
        this.model.add(tf.layers.dense({
            units: sizeOfThisLayer,
            useBias: true
        }));
    };

    setupNetwork() {
        this.model = tf.sequential();
        this.inputTensor = tf.layers.dense({units: 3, inputDim: 3, kernelInitializer: "randomNormal"});
        this.model.add(this.inputTensor);

        this.addFullyConnectedLayer(64);
        this.addFullyConnectedLayer(32);
        this.addFullyConnectedLayer(16);

        this.model.add(tf.layers.dense({
            units: 3,
            activation: "relu",
            useBias: true
        }));
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
            this.trainingData.input,
            this.trainingData.target,
            {
                batchSize: this.batchSize,
                epochs: this.epochs
            }
        ).then(history => {
            console.log('trained batch', history);
            const losses = history.history.loss;
            const avgLoss = losses.reduce((acc, val) => acc+val, 0) / losses.length;

            const accuracies = history.history.acc;
            const avgAccuracy = accuracies.reduce((acc, val) => acc+val, 0) / accuracies.length;
            return {loss : avgLoss, accuracy: avgAccuracy}
        })
            .catch(err => console.log('err', err))
    }

    predict(input) {
        const output = this.model.predict(tf.tensor2d([input], [1, 3]));
        return output.data()
            .then(data => {
                return data.map(
                    v => Math.max(Math.min(v, 1), 0)
                );
            });
    }

    setLearningRate(learningRate) {
        this.learningRate = learningRate;
        this.optimizer.setLearningRate(learningRate);
    }
}

export default Network;