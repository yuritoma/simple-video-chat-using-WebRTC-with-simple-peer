// Updated VideoChat.js

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const VideoChat = () => {
  const socket = io('http://localhost:5000');
  const userVideo = useRef();
  const partnerVideo = useRef();
  const [peer, setPeer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    const initWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        userVideo.current.srcObject = stream;

        const newPeer = new Peer({
          initiator: window.location.hash === '#init',
          trickle: false,
          stream: stream,
        });

        newPeer.on('signal', (data) => {
          socket.emit('sendSignal', data);
        });

        socket.on('receiveSignal', (data) => {
          newPeer.signal(data);
        });

        newPeer.on('stream', (stream) => {
          partnerVideo.current.srcObject = stream;
        });

        setPeer(newPeer);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initWebRTC();

    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  const toggleMute = () => {
    const audioTracks = userVideo.current.srcObject.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = !isMuted;
    });
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    const videoTracks = userVideo.current.srcObject.getVideoTracks();
    videoTracks.forEach((track) => {
      track.enabled = !isCameraOff;
    });
    setIsCameraOff(!isCameraOff);
  };

  const handleClose = () => {
    if (peer) {
      peer.destroy();
    }
    // Additional cleanup or navigation logic if needed
  };

  return (
    <div>
      <video ref={userVideo} autoPlay muted={!peer}></video>
      <video ref={partnerVideo} autoPlay></video>

      <div>
        <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
        <button onClick={toggleCamera}>{isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}</button>
        <button onClick={handleClose}>Close Call</button>
        {/* Add return button logic as needed */}
      </div>
    </div>
  );
};

export default VideoChat;
