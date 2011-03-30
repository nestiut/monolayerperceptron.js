// Helpers

var log = (function(d) {
    var o = d.getElementById('assert');
    return function() {
        [].slice.call(arguments).map(function(c) {
            var li = d.createElement('li');
            li.className = 'log';
            li.appendChild(d.createTextNode(c));
            o.appendChild(li);
        });
    }; 
})(document);

// Core

var Neuron = (function() {

    // Output object
    var Output = (function() {
        var Output = function(net, output, sent) {
            this.net = net;
            this.value = output;
            this.sent = sent;
        };
        
        Output.prototype = {
            toString: function() {
                return this.value;
            },
            network: function() {
                return this.net;
            },
            send: function(sample) {
                this.sent = sample || this.sent;
                this.value = this.net.send(this.sent);
                return this;
            },
            resend: function() {
                return this.send();
            },
            learn: function(result, times) {
                this.net.learn([[this.sent, ![]+result]], times);
                return this;
            }
        };
        
        return Output;
    })();

    // Neuron object
    var Neuron = function(learnRate, threshold, weights) {
        // Force new instance
        if(!(this instanceof arguments.callee)) {
            return new arguments.callee(arguments); 
        }
        
        
        this.weights      = weights || [];
        this.threshold    = threshold || 0.5;
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
                    this.weights[i] = parseInt(( Math.random() * 100 ) / 10);
                }    
            }
            this.nbInputs = nbInputs;
            this.weights.push(this.biasWeight); 
            
            // Callback
            typeof callback === "undefined" || callback(this.weights);
            
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
            
            // ![]+ Convert 'true' to 1, and 'false' to 0
            var result = ![]+ (this.sigmoid(weightedSum) >= this.threshold)
            
            // Callback
            typeof callback === "undefined" || callback(result);
            
            // Using the Output object :
            // Parameters : the network, the computed output, and the input used
            return new Output(this, result, inputs);
        };
        
        
        this.learn = function(data, times) {
            times = (times || 1) - 1;
            
            this.init(data[0][0].length);
            
            for (var i = 0; i < data.length; i++) {
                currentOutput = this.send(data[i][0]).value;
                providedOutput = data[i][1];
                
                for(var j = 0; j < this.nbInputs; j++) {
                    this.weights[j] += this.learnRate * (providedOutput - currentOutput) * data[i][0][j];
                    this.biasWeight = this.biasWeight + (providedOutput - currentOutput);
                }
            }
            
            // learn with the same data a few times
            times < 1 || this.learn(data, --times);
            
            return this;
        };
        
        
        this.reset = function() {
            this.weights        = [];
            this.biasWeight     = 1;
            this.init();
            
            return this;
        };
    };
    
    return Neuron;
})();

// Network test

var sample = [
        // Wrong side
        [[-2, -3], 0],
        [[-1, -1], 0],
        [[-1, 0], 0],
        [[-2, 1], 0],
        [[0, 1], 0],
        [[0, 2], 0],
        [[1, 3], 0],
        [[2, 5], 0],
        [[-2, 5], 0],
        // Right side
        [[3, -4], 1],
        [[-2, -5], 1],
        [[-1, -3], 1],
        [[0, -1], 1],
        [[2, -2], 1],
        [[1, 1], 1],
        [[2, 3], 1],
        [[2, 1], 1],
    ],
    test = [5, -5],
    output = new Neuron().learn(sample).send(test);

log('Is ' + test + ' on the right side? ' + !!output.value);


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
    ctx.fillStyle = sample[i][1] !== 1 ? "#FF1C0A" : "#00A308";
    ctx.beginPath();
    ctx.arc((sample[i][0][0]+20)*10, (sample[i][0][1]+20)*10, 1, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
}

// Test point
ctx.fillStyle = output.value !== 1 ? "#FF1C0A" : "#00A308";
ctx.beginPath();
ctx.arc((test[0] +20)*10, (test[1] +20)*10, 2, 0, Math.PI*2, true); 
ctx.closePath();
ctx.fill();

// Logical OR

var output = new Neuron().learn([
        [[0, 0], 0],
        [[1, 0], 1],
        [[1, 1], 1]
]).send([0,1]);

log(output.sent[0] + ' OR ' + output.sent[1] + ' = ' + output);
