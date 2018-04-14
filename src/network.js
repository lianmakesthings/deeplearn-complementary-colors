const deeplearn = require('deeplearn');
class Network {
    constructor() {
        this.learningRate = 0.042;
        this.batchSize = 100;
        this.math = deeplearn.ENV.math;
    }
    createFullyConnectedLayer(graph, inputLayer, layerIndex, sizeOfThisLayer, includeRelu = true, includeBias = true) {
        return graph.layers.dense(
            'fully_connected_' + layerIndex, inputLayer, sizeOfThisLayer,
            includeRelu ? (x) => graph.relu(x) : undefined, includeBias);
    };

    setupNetwork() {
        const graph = new deeplearn.Graph();
        this.inputTensor = graph.placeholder('input RGB value', [3]);
        this.targetTensor = graph.placeholder('output RGB value', [3]);

        let fullyConnectedLayer = this.createFullyConnectedLayer(graph, this.inputTensor, 0, 64);
        fullyConnectedLayer = this.createFullyConnectedLayer(graph, fullyConnectedLayer, 1, 32);
        fullyConnectedLayer = this.createFullyConnectedLayer(graph, fullyConnectedLayer, 2, 16);

        this.predictionTensor = this.createFullyConnectedLayer(graph, fullyConnectedLayer, 3, 3);
        this.costTensor = graph.meanSquaredCost(this.targetTensor, this.predictionTensor);

        this.session = new deeplearn.Session(graph, this.math);
        this.optimizer = new deeplearn.SGDOptimizer(this.learningRate);
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