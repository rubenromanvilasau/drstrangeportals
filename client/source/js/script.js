// When the DOM is ready
document.addEventListener("DOMContentLoaded", function(event) {
    var peer_id;
    var conn;

    var peer = new Peer({
        host: "romandev.cl",
        port: 9000,
        path: '/peerjs',
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
    peer.on('open', function () {
      //Play portal video
      setTimeout(function () {
        document.getElementById("drstrangeportal").play();
      }, 5000);

      //Show the session id
      document.getElementById("peer-id-label").innerHTML = peer.id;
      console.log("ID DE LA SESIÓN", peer.id);
    });

    // When someone connects to your session:
    peer.on('connection', function (connection) {
        conn = connection;
        peer_id = connection.peer;
        console.log('EL ID PEER ES: ' + peer_id);
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
         //Hide the form
         document.getElementById("form").style.display = "none";
        
        //On call
        call.on("stream", function (stream) {
            // Store a global reference of the other user stream
            window.peer_stream = stream;
            // Display the stream of the other user in the peer-camera video element !
            onReceiveStream(stream, "peer-camera");
            window.remoteAudio.srcObject = stream;
            window.remoteAudio.autoplay = true;
          });
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
             document.getElementById("form").style.display = "none";
             peer.on("disconnected", function () {
                peer.reconnect();
            })
         })
        }else{
            alert("You need to provide a peer to connect with !");
            return false;
        }
    }, false);

    /**
     * Initialize application by requesting your own video to test !
     */
    requestLocalVideo({
        success: function(stream){
            window.localStream = stream;
           // onReceiveStream(stream, 'my-camera');
        },
        error: function(err){
            alert("Cannot get access to your camera and video !");
            console.error(err);
        }
    });
}, false);