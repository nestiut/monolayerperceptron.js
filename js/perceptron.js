// Debugging tools

var output = document.getElementById('assert');

function assert( outcome, description ) {
    var li = document.createElement('li');
    li.className = outcome ? 'pass' : 'fail';
    li.appendChild( document.createTextNode( description ) );

    output.appendChild(li);
}

function log( content ) {
    var li = document.createElement('li');
    li.className = 'log';
    li.appendChild( document.createTextNode( content ) );

    output.appendChild(li);
}

function concatObject(obj) {
  str='';
  for(prop in obj)
  {
    str+=prop + " value :"+ obj[prop]+"\n";
  }
  return(str);
}

$(function() {

	var Maths = function() {
		this.sigmoid = function(x) {
			return 1/ (1 - Math.exp(-1 * x));
		};
	};
	
    var Neuron = function(weights, threshold, learnRate) {
        this.weights 	= weights || [];
        this.threshold 	= threshold || 0;
        this.learnRate 	= learnRate || 0.5;
		this.bias 		= 1;
		this.biasWeight = 1;
        this.nbInputs 	= 0;
		var maths = new Maths();
		
		this.init = function(nb) {
			if( this.weights.length == 0) {
				this.initWeights(nb);
			}
		};
		
		this.initWeights = function(nbInputs) {
			if( this.weights.length == 0 ) {
				for( var i = 0; i < nbInputs; i++ ) {
					this.weights[i] = parseInt( ( Math.random() * 100 ) / 10 );
				}	
			}
			this.nbInputs = nbInputs;
			this.weights.push( this.biasWeight );
			log( this.weights );
			
			return this;
		};
		
		this.send = function(inputs) {
			this.init(inputs.length);
			
			inputs = inputs.slice(0, this.nbInputs);
			log( inputs );
			
			// Weighted sum of inputs
			var weightedSum = 0;
			for( var i = 0; i < inputs.length; i++) {
				weightedSum += ( inputs[i]*this.weights[i] );
			}
			weightedSum += ( this.bias * this.biasWeight );
			
			// return weightedSum >= this.threshold ? 1 : 0;
			return Math.round( maths.sigmoid(weightedSum) );
		};
		
		this.learn = function(data) {
			this.init(data[0][0].length);
			
			for ( var i = 0; i < data.length; i++ ) {
				currentOutput = this.send(data[i][0]);
				providedOutput = data[i][1];
				
				for( var j = 0; j < this.nbInputs; j++) {
					this.weights[j] = this.weights[j] + ( this.learnRate * (providedOutput - currentOutput) * data[i][0][j] );
					this.biasWeight = this.biasWeight + (providedOutput - currentOutput);
				}
			}
			return this;
		};
	};
	
	var neuron = new Neuron();
	neuron.learn([
					[[-2, -3], 0],
					[[-1, -2], 0],
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
					[[0, 1], 1],
					[[1, 1], 1],
					[[2, 3], 1],
					[[2, 1], 1],
				 ]);
				 
	log( 'Output : ' +neuron.send([-10, 12]) );
});