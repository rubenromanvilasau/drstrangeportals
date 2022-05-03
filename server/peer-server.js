var fs = require('fs');
var PeerServer = require('peer').PeerServer;

const customGenerationFunction = () => (Math.random().toString(5).substring(2, 3) + Math.random().toString(5).substring(2, 5))

var server = PeerServer({
  port: 9000,
  path: "/peerjs",
  generateClientId: customGenerationFunction,
  ssl: {
    key: fs.readFileSync("./../certificates/key.pem", "utf8"),
    cert: fs.readFileSync("./../certificates/cert.pem", "utf8"),
  },
}, ()=>{
    console.log("PEER SERVER LISTENING")
});