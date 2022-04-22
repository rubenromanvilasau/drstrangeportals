var fs = require('fs');
var PeerServer = require('peer').PeerServer;

var server = PeerServer({
  port: 9000,
  path: "/",
  ssl: {
    key: fs.readFileSync("./../certificates/key.pem", "utf8"),
    cert: fs.readFileSync("./../certificates/cert.pem", "utf8"),
  },
}, ()=>{
    console.log("PEER SERVER LISTENING")
});