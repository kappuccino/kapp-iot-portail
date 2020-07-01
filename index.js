require('dotenv').config()
const awsIot = require('aws-iot-device-sdk')

const client_id = process.env.CLIENT_ID
const endpoint = process.env.AWS_ENDPOINT
const topic = process.env.MQTT_TOPIC

const cert = process.env.AWS_CERT
const key = process.env.AWS_KEY
const ca_file = process.env.AWS_ROOT

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
var device = awsIot.device({
	keyPath: key,
	certPath: cert,
	caPath: ca_file,
	clientId: client_id,
	host: endpoint
})

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
device
	.on('connect', function() {
		console.log('Connected');
		device.subscribe(topic)
	})

device
	.on('message', function(topic, payload) {
		console.log('New Message', topic, payload.toString());
		if(topic === 'portail') portail()
	})

function portail(){
	const { exec } = require('child_process')

	const ls = exec('./portail.sh', function (error, stdout, stderr) {
		if (error) {
			console.log(error.stack);
			console.log('Error code: '+error.code);
			console.log('Signal received: '+error.signal);
		}
		console.log('Child Process STDOUT: '+stdout);
		console.log('Child Process STDERR: '+stderr);
	});

	ls.on('exit', function (code) {
		console.log('Child process exited with exit code '+code);
	});
}
