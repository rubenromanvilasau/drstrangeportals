// When the DOM is ready
document.addEventListener("DOMContentLoaded", function(event) {
    var peer_id;
    var username;
    var conn;

    //192.168.1.89 escritorio windows
    //192.168.1.2 mac
    var peer = new Peer({
        // host: "localhost",
        // port: 9000,
        path: '/',
        debug: 3,
        config: {
            'iceServers': [
                { url: 'stun:stun1.l.google.com:19302' },
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                }
            ]
        }
    });

    // Once the initialization succeeds:
    // Show the ID that allows other user to connect to your session.
    peer.on('open', function () {
       document.getElementById("peer-id-label").innerHTML = peer.id;
        console.log("ID DE LA SESIÓN",peer.id);
    });

    // When someone connects to your session:
    peer.on('connection', function (connection) {
        conn = connection;
        peer_id = connection.peer;

        console.log('ALGUIEN SE HA CONECTADO');
        console.log('EL ID PEER ES: ' + peer_id);
        document.getElementById("connected_peer").innerHTML = 'User';

    });

    peer.on('error', function(err){
        alert("An error ocurred with peer: " + err);
        console.error(err);
    });

    /**
     * Handle the on receive call event
     */
    peer.on("call", function (call) {
        //Answer the call
        call.answer(window.localStream);
        
        //On call
        call.on("stream", function (stream) {
            // Store a global reference of the other user stream
            window.peer_stream = stream;
            // Display the stream of the other user in the peer-camera video element !
            onReceiveStream(stream, "peer-camera");
            window.remoteAudio.srcObject = stream;
            window.remoteAudio.autoplay = true;
          });

    /**
     * Starts the request of the camera and microphone
     *
     * @param {Object} callbacks
     */
    function requestLocalVideo(callbacks) {
        // Monkeypatch for crossbrowser geusermedia
       navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

        // Request audio an video
        navigator.getUserMedia({ audio: true, video: true }, callbacks.success , callbacks.error);
    }
    /**
     * Handle the providen stream (video and audio) to the desired video element
     *
     * @param {*} stream
     * @param {*} element_id
     */
    function onReceiveStream(stream, element_id) {
        // Retrieve the video element according to the desired
        var video = document.getElementById(element_id);
        // Set the given stream as the video source
        video.srcObject = stream;

        // Store a global reference of the stream
        window.peer_stream = stream;
    }
    /**
     * On click the connect button, initialize connection with peer
     */
    document.getElementById("connect-to-peer-btn").addEventListener("click", function(){
        peer_id = document.getElementById("peer_id").value;

        if (peer_id) {
            conn = peer.connect(peer_id);
            var call = peer.call(peer_id, window.localStream);
         call.on('stream', function (stream) {
             window.peer_stream = stream;
             onReceiveStream(stream, 'peer-camera');
             document.getElementById("connected_peer").innerHTML = 'Hola';

         })
        }else{
            alert("You need to provide a peer to connect with !");
            return false;
        }
        //Hide the form
       // document.getElementById("connection-form").className += " hidden";
    }, false);

    /**
     * Initialize application by requesting your own video to test !
     */
    requestLocalVideo({
        success: function(stream){
            window.localStream = stream;
            onReceiveStream(stream, 'my-camera');
        },
        error: function(err){
            alert("Cannot get access to your camera and video !");
            console.error(err);
        }
    });
}, false);
})