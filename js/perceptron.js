// Helpers

var log = (function(d) {
    var o = d.getElementById('assert'); 
    return function(c) {
        var li = d.createElement('li');
        li.className = 'log';
        li.appendChild(d.createTextNode(c));
        o.appendChild(li);
    }; 
})(document);

// Core

var Neuron = function(weights, threshold, learnRate) {
    this.weights      = weights || [];
    this.threshold    = threshold || 0;
    this.learnRate    = learnRate || 0.5;
    this.bias         = 1;
    this.biasWeight   = 1;
    this.nbInputs     = 0;
    this.sigmoid      = function(x) {
        return 1/ (1 - Math.exp(-1 * x));
    };
    
    
    this.init = function(nbInputs, callback) {
        if(this.weights.length !== 0) {
            return;
        }
        
        if(this.weights.length === 0) {
            for(var i = 0; i < nbInputs; i++) {
                this.weights[i] = parseInt( ( Math.random() * 100 ) / 10 );
            }    
        }
        this.nbInputs = nbInputs;
        this.weights.push(this.biasWeight); 
        
        // Callback
        typeof callback === "undefined" || callback(this.weights, this.nbInputs);
        
        // Chaining
        return this;
    };
    
    
    this.send = function(inputs, callback) {
        this.init(inputs.length);
        
        inputs = inputs.slice(0, this.nbInputs);
        
        // Weighted sum of inputs
        var weightedSum = 0;
        for(var i = 0; i < inputs.length; i++) {
            weightedSum += inputs[i] * this.weights[i];
        }
        weightedSum += this.bias * this.biasWeight;
        
        // Callback
        typeof callback === "undefined" || callback(inputs, weightedSum);
        
        // Convert 'true' to 1, and 'false' to 0
        return ![]+ (weightedSum >= this.threshold);
        // return Math.round(this.sigmoid(weightedSum));
    };
    
    
    this.learn = function(data) {
        this.init(data[0][0].length);
        
        for (var i = 0; i < data.length; i++) {
            currentOutput = this.send(data[i][0]);
            providedOutput = data[i][1];
            
            for(var j = 0; j < this.nbInputs; j++) {
                this.weights[j] += this.learnRate * (providedOutput - currentOutput) * data[i][0][j];
                this.biasWeight = this.biasWeight + (providedOutput - currentOutput);
            }
        }
        
        return this;
    };
};

// Network test

var sample = [
        [[-2, -3], 0],
        [[-1, -1], 0],
        [[-1, 0], 0],
        [[-2, 1], 0],
        [[0, 1], 0],
        [[0, 2], 0],
        [[1, 3], 0],
        [[2, 5], 0],
        [[-2, -5], 1],
        [[-1, -3], 1],
        [[0, -1], 1],
        [[2, -2], 1],
        [[1, 1], 1],
        [[2, 3], 1],
        [[2, 1], 1],
    ],
    test = [-5, 5],
    neuron = new Neuron().learn(sample);

var output = neuron.send(test, log);
log('Output : ' + output);


// Canvas graph
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');
    
// Axes
ctx.strokeStyle = "#ddd";
ctx.moveTo(200, 0);
ctx.lineTo(200, 400);
ctx.stroke();
ctx.moveTo(0, 200);
ctx.lineTo(600, 200);
ctx.stroke();
    
// Separate
ctx.moveTo(100, 0);
ctx.lineTo(300, 400);
ctx.stroke();

// Samples
for(var i = 0, len = sample.length; i < len; i++) {
    ctx.fillStyle = sample[i][1] === 1 ? "#FF1C0A" : "#00A308";
    ctx.beginPath();
    ctx.arc((sample[i][0][0]+20)*10, (sample[i][0][1]+20)*10, 1, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
}

// Test
ctx.fillStyle = output === 1 ? "#FF1C0A" : "#00A308";
ctx.beginPath();
ctx.arc((test[0] +20)*10, (test[1] +20)*10, 2, 0, Math.PI*2, true); 
ctx.closePath();
ctx.fill();
