$(function() {
	var Neuron = function(input) {
		this.nbInputs = parseInt(input);
		
		this.loadInit = function() {
			var loads = new Array();
			for( i = 0; i < this.nbInputs; i++ ) {
				loads[i] = parseInt( Math.random() * 100 ) / 100;
			}
			log( 'Loads : ' +loads );
			return loads;
		};
		
		this.loads	= this.loadInit();
		
		this.send = function() {
			if( arguments[0].constructor == Array ) {
				var calledArgs = new Array().slice.call( arguments[0] );
			} else {
				var calledArgs = new Array().slice.call( arguments );
			}
			
			var args = calledArgs.slice(0, this.nbInputs);
			this.inputs = args;
			
			var sum = this.loadSum();
			log( 'Sum : ' +sum );
			
			return this.activate( sum );
		};
		
		this.loadSum = function() {
			var sum = 0;
			if( this.inputs.constructor == Array ) {
				for( i = 0; i < this.nbInputs; i++ ) {
					sum += this.loads[i]*this.inputs[i];
				}
			}
			
			return sum;
		};
		
		this.activate = function(input) {
			function sig(x) {
				x = parseFloat(x);
				return 1 / ( 1 + Math.exp((-1) * x) );
			}
			return ( sig( input ) > 0.5 ? 1 : 0 );
		};
		
		this.learn = function(input, output) {
			var calledArgs = new Array().slice.call( input );
			var args = calledArgs.slice(0, this.nbInputs);
			
			// Learning rate
			var alpha = 0.2;
			
			var currentOutput = this.send(args);
			var desiredOutput = parseInt( output );
			
			for( i = 0; i < this.nbInputs; i++ ) {
				delta = alpha * ( desiredOutput - currentOutput ) * args[i];
				log( delta );
				this.loads[i] += delta;
				// log( this.loads[i] );
			}
		};
	};
	
	var neuron = new Neuron(2);
	neuron.learn([1, 1], 1);

	
	log( 'Output = ' +neuron.send([1, 1]) );
});

// Debugging tools

var output = document.getElementById('assert');

function assert( outcome, description ) {
    var li = document.createElement('li');
    li.className = outcome ? 'pass' : 'fail';
    li.appendChild( document.createTextNode( description ) );

    output.appendChild(li);
};

function log( content ) {
    var li = document.createElement('li');
    li.className = 'log';
    li.appendChild( document.createTextNode( content ) );

    output.appendChild(li);
};

function concatObject(obj) {
  str='';
  for(prop in obj)
  {
    str+=prop + " value :"+ obj[prop]+"\n";
  }
  return(str);
}