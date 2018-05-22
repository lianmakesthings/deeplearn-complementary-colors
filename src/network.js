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


        this.targetTensor = tf.layers.inputLayer({inputShape: [3]});

        this.addFullyConnectedLayer(64);
        this.addFullyConnectedLayer(32);
        this.addFullyConnectedLayer(16);

        this.addFullyConnectedLayer(3);
        this.optimizer = tf.train.sgd(this.learningRate);
    }

    setTrainingData(trainingData) {
        const shuffledInputProviderBuilder = new deeplearn.InCPUMemoryShuffledInputProviderBuilder(trainingData);
        const [inputProvider, targetProvider] = shuffledInputProviderBuilder.getInputProviders();

        this.feedEntries = [
            {tensor: this.inputTensor, data: inputProvider},
            {tensor: this.targetTensor, data: targetProvider}
        ];
    }

    trainBatch(shouldFetchCost) {
        // Train 1 batch.
        let costValue = -1;
        this.math.scope(() => {
            const cost = this.session.train(
                this.costTensor, this.feedEntries, this.batchSize, this.optimizer,
                shouldFetchCost ? deeplearn.CostReduction.MEAN : deeplearn.CostReduction.NONE);

            if (!shouldFetchCost) {
                // We only train. We do not compute the cost.
                return;
            }

            // Compute the cost (by calling get), which requires transferring data
            // from the GPU.
            costValue = cost.get();
        });
        return costValue;
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