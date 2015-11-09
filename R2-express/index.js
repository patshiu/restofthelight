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

// configure the server's behavior:
app.port(8080);						// port number to run the server on
app.serveFiles("public");			// serve all static HTML files from /public


// respond to web GET requests for the index.html page:
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});



app.get('/index.*', function(req, res) {
  res.send('index.html');
});


//
// take anything that begins with /output as a light request:
app.post('/output/:lightID/:state', function(req, res){
	sendToSerial(req);
	res.send('POST msg recieved.');
	res.send('lightID : ' + lightID );
	res.send('state : ' + state );
});


// now that everything is configured, start the server:
console.log("Listening for new clients on port 8080");

 
// the third word of the command line command is serial port name:
var portName = process.argv[2];				  
// print out the port you're listening on:
console.log("opening serial port: " + portName);	

// open the serial port. Uses the command line parameter:
var myPort = new SerialPort(portName, { 
	baudRate: 9600,
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});

/* The rest of the functions are event-driven. 
   They only get called when the server gets incoming GET requests:
*/

// this function responds to a GET request with the index page:
function sendIndexPage(request) {
  request.serveFile('/index.html');
}

function sendToSerial(request) {
  // get the parameters from the URL:
  var brightnessCommand = request.params.lightID + request.params.state;
  console.log("received "+ brightnessCommand);

  // send it out the serial port:
  myPort.write(brightnessCommand);
  // send the data and close the connection:
  request.respond(brightnessCommand);
}