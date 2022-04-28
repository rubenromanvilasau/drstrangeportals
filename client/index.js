var fs     = require('fs');
var http   = require('http');
var https  = require('https');
var path   = require("path");

// Certificates for HTTPS connection
var privateKey  = fs.readFileSync('./../certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('./../certificates/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
const port = process.env.PORT || 8443;

// Allow access from all the devices of the network (as long as connections are allowed by the firewall)
var LANAccess = "0.0.0.0";

// For http
//httpServer.listen(8080, LANAccess);

// For https
httpsServer.listen(port, LANAccess, ()=>{
    console.log('Server listening on port ' + port);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

// Expose the css and js resources as "resources"
app.use('/resources', express.static('./source'));