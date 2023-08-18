import React, { useEffect } from 'react';

function AudioStreamingComponent({ voiceId, xiApiKey }) {
  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let sourceNode;

    const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

    const data = {
        text: 'Some very long text to be read by the voice. Some very long text to be read by the voice. Some very long text to be read by the voice.Some very long text to be read by the voice. Some very long text to be read by the voice. Some very long text to be read by the voice'
    };
    fetch(ttsUrl, {
        headers: {
            'Content-Type': 'application/json',
            'xi-api-key': xiApiKey, // Replace with your actual API key
        },
        method: "POST",
        body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response;
      })
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        return audioContext.decodeAudioData(arrayBuffer);
      })
      .then(buffer => {
        sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.connect(audioContext.destination);
        sourceNode.onended = () => {
          console.log('Audio playback ended.');
        };
        sourceNode.start(); // Start the audio source
      })
      .catch(error => {
        console.error('Fetch or decoding error:', error);
      });

    // Clean up when component unmounts
    return () => {
      if (sourceNode) {
        sourceNode.stop();
      }
      audioContext.close();
    };
  }, [voiceId, xiApiKey]);

  return (
    <div>
      <p>Real-time audio streaming example</p>
    </div>
  );
}

export default AudioStreamingComponent;
