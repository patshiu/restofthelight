/*
	restToSerial
	a node.js app to read take requests and send as serial data
	requires:
		* node.js (http://nodejs.org/)
		* serialport.js (https://github.com/voodootikigod/node-serialport)
	
	To launch this, type 'node index.js portname' on the commandline, where
	portname is the name of your serial port.
		
	Modified from Tom Igoe's restToSerial example https://github.com/tigoe/NetworkExamples/tree/master/nodeRestToSerial

*/

var serialport = require("serialport"),		// include the serialport library
	SerialPort  = serialport.SerialPort,	   // make a local instance of serial
	express = require('express'),		// include express
	app = express();
	bodyParser = require('body-parser')


//FOR TESTING
//ARRAY OF LIGHT STATES
var lightState = [
		1, 1, 1, 1,
		0, 0, 0, 0,
		1, 1, 1, 1,
		0, 0, 0, 0
	];

var lightID, state; 

// configure the server's behavior:

// respond to web GET requests for the index.html page:
// respond with "hello world" when a GET request is made to the homepage
//app.use(express.static('public'));
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/index.*', function(req, res) {
  res.send('hello');
});

app.get('/api/query/:lightID', function(req, res) {
	var id = req.params.lightID; 
	id++;
	if ( id > 0 && id <= lightState.length) {
		console.log("State of light " + req.params.lightID + " requested.");
		res.send('Light ' + id + ' is currently ' + lightState[req.params.lightID]);
	} else {
		res.send('Invalid light ID. Please address lights 1 through ' + lightState.length);
	}	
});

// take anything that begins with /output as a light request:
app.post('/api/setLights/', function(req, res){
	//sendToSerial(req);
	var lightID = req.body.lightID; 
	var state = req.body.state; 
	//res.send("POST Request recieved: lightID=" + req.body.lightID + " state=" + req.body.state);
	res.send(req.body)
	console.log("POST Request received. %s %s ");
	console.log("LightID: " + lightID);
	console.log("state: " + state);
	setLight(lightID, state);
	//send that to serial and update lights
});

var setLight = function(light, state){
	var id = light - 1; 
	if (id < lightState.length && state < 2 && state > -1){
		lightState[id] = state;
	}
	reportLights();
}


// now that everything is configured, start the server:
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
  reportLights();
});


var reportLights = function (){
  console.log('Current state of lights:');
  for(var r = 0; r < lightState.length; r = r + 4){
		console.log(lightState[r] + " , " + lightState[r+1] + " , " + lightState[r+2] + " , " + lightState[r+3]);
  }  
}
// // the third word of the command line command is serial port name:
// var portName = process.argv[2];				  
// // print out the port you're listening on:
// console.log("opening serial port: " + portName);	

// // open the serial port. Uses the command line parameter:
// var myPort = new SerialPort(portName, { 
// 	baudRate: 9600,
// 	// look for return and newline at the end of each data packet:
// 	parser: serialport.parsers.readline("\r\n") 
// });

/* The rest of the functions are event-driven. 
*/


function sendToSerial(request) {
  // get the parameters from the URL:
  var brightnessCommand = request.params.lightID + request.params.state;
  console.log("received "+ brightnessCommand);

  // send it out the serial port:
  //myPort.write(brightnessCommand);
  // send the data and close the connection:
  request.respond(brightnessCommand);
}