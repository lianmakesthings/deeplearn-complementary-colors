import * as tf from '@tensorflow/tfjs';

class Network {
    constructor() {
        this.learningRate = 0.042;
        this.batchSize = 32;
    }
    addFullyConnectedLayer(sizeOfThisLayer) {
        this.model.add(tf.layers.dense({
            units: sizeOfThisLayer,
//            activation: "relu",
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

    train(iterations) {
        return this.model.fit(
            this.trainingData.inputLayer,
            this.trainingData.targetLayer,
            {
                batchSize: this.batchSize,
                epochs: iterations
            }
        ).then(history => {
            console.log('trained batch', history);
            const loss = history.history.loss[0];
            const accuracy = history.history.acc[0];
            return {loss, accuracy}
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