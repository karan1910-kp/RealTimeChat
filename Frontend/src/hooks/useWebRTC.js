import { useRef } from "react";
import createPeerConnection from "../webrtc/peer";

function useWebRTC() {
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);

    // Get local camera and microphone
    const getLocalStream = async () => {
        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });

        localStreamRef.current = stream;

        return stream;
    };

    // Create WebRTC connection
    const createConnection = async () => {
        const peerConnection = createPeerConnection();

        peerConnectionRef.current = peerConnection;

        const stream = await getLocalStream();

        stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
        });

        return peerConnection;
    };

    // Mute or unmute microphone
    const toggleMicrophone = () => {
        const audioTrack =
            localStreamRef.current?.getAudioTracks()[0];

        if (!audioTrack) {
            return null;
        }

        audioTrack.enabled = !audioTrack.enabled;

        return audioTrack.enabled;
    };
    const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];

    if (!videoTrack) {
        return null;
    }

    videoTrack.enabled = !videoTrack.enabled;

    return videoTrack.enabled;
};

    return {
        createConnection,
        peerConnectionRef,
        getLocalStream,
        localStreamRef,
        toggleMicrophone,
        toggleCamera
    };
}

export default useWebRTC;