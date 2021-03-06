var app = require('./app.js');

var PROTO_PATH = __dirname + '/../protos/app.proto';

var PORT = process.env.APP_RPC_PORT || '34000';
var HOST = '0.0.0.0';
var grpc = require('grpc');
var proto = grpc.load(PROTO_PATH).app;

/**************** AppService RPC methods  *****************/

/*
 * Implements the GetInitialJukeboxState RPC method
 */
function getInitialJukeboxState(call, callback) {
  console.log('Received request with access token : '
      + call.request.access_token);
  app.getInitialJukeboxState(call.request.access_token).
    then(function(initialState) {
      console.log(initialState);
      callback(null, initialState);
    }, function(err) {
      console.log(err);
      callback(err, null);
    }); 
}  

/**************** HandshakeService RPC methods  *****************/

/*
 * Implements the Shake RPC method for testing purposes 
 */
function shake(call, callback) {
  console.log('Request received with name: ' + call.request.name);
  callback(null, {message: 'Successful handshake with ' + call.request.name}); 
}

/************************ Main methods **************************/


/* 
 * Starts an RPC server that receives requests for the Handshake service at the
 * specified port
 */
function main() {

  // Start up RPC server
  var server = new grpc.Server();

  // Register RPC services
  server.addProtoService(proto.HandshakeService.service, {shake: shake});
  server.addProtoService(proto.AppService.service, {getInitialJukeboxState: getInitialJukeboxState});

  // Bind server to host address and start server 
  server.bind(HOST + ":" + PORT, grpc.ServerCredentials.createInsecure());
  server.start();

  console.log("RPC Server starting at " + HOST + ":" + PORT + "\n");
}

/*
 * If run as a scrip, start the server
 */
if (require.main === module) {
  main();
}
