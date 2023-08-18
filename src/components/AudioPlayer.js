// import React, { useEffect, useRef } from 'react';

// const AudioPlayer = () => {
//   const audioRef = useRef();
//   let ws = useRef();

//   useEffect(() => {
//     ws.current = new WebSocket('ws://localhost');
//     ws.current.binaryType = 'arraybuffer'; // handle received data as ArrayBuffer
//     ws.current.onmessage = (event) => {
//       const objectURL = URL.createObjectURL(new Blob([event.data], { type: 'audio/mpeg' })); // set the Blob's MIME type to 'audio/mpeg'
//       audioRef.current.src = objectURL;
//       audioRef.current.play();
//     };
//     return () => {
//       ws.current.close();
//     };
//   }, );

//   const sendText = (text) => {
//     ws.current.send(text);
//   };

//   return (
//     <div>
//       <audio ref={audioRef} controls />
//       <button onClick={() => sendText("My name is Nav I am from NavWebDev. I noticed that you don't have a website. I am offering to create a website for your business for competely free. I want to know if you are interested")}>Synthesize</button>
//     </div>
//   );
// };

// export default AudioPlayer;

// import React from 'react'

// const AudioPlayer = () => {

//   const makeRequest = (text) =>{
//     const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/CYw3kZ02Hs0563khs1Fj/stream'; // Replace <voice-id> with the actual voice ID
//     const apiKey = '2fa3058213be8b237bfc2baa596480c8'; // Replace <xi-api-key> with your XI API key
    
//     const textToConvert = text;
//     const modelId = "eleven_monolingual_v1";
//     const stability = 0.5;
//     const similarityBoost = 0.5;
    
//     const requestData = {
//       text: textToConvert,
//       model_id: modelId,
//       voice_settings: {
//         stability: stability,
//         similarity_boost: similarityBoost
//       }
//     };
    
//     fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         'accept': 'audio/mpeg',
//         'xi-api-key': apiKey,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(requestData)
//     })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`);
//       }
    
//       const reader = res.body.getReader();
    
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1); // Adjust buffer size as needed
    
//       let audioBuffer = new Float32Array(); // Accumulator for audio data
    
//       scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
//         const outputBuffer = audioProcessingEvent.outputBuffer;
//         const channelData = outputBuffer.getChannelData(0);
    
//         if (audioBuffer.length < channelData.length) {
//           // Not enough data accumulated yet, fill with zeros
//           channelData.fill(0);
//         } else {
//           // Copy the accumulated audio buffer to the output buffer
//           channelData.set(audioBuffer.subarray(0, channelData.length));
    
//           // Remove the copied data from the accumulated buffer
//           audioBuffer = audioBuffer.subarray(channelData.length);
//         }
//       };
    
//       scriptProcessor.connect(audioContext.destination);
    
//       // Start reading and processing audio data
//       reader.read().then(function process({ done, value }) {
//         if (done) {
//           console.log("End of audio data");
//           audioContext.close(); // Close the audio context when done
//           return;
//         }
    
//         console.log("Fetching");
//         console.log(value);
    
//         // Convert Uint8Array to Float32Array for audio processing
//         const float32Data = new Float32Array(value.buffer);
        
//         // Append the new audio data to the accumulated buffer
//         audioBuffer = new Float32Array([...audioBuffer, ...float32Data]);
    
//         // Continue reading the next chunk of audio data
//         reader.read().then(process);
//       });
//     })
//     .catch((error) => {
//       console.error("Fetch error:", error);
//     });
    
    
    
    
//   }
//   return (
//         <div>
//           {/* <audio ref={audioRef} controls /> */}
//           <button onClick={() => makeRequest("My name is Nav I am from NavWebDev. I noticed that you don't have a website. I am offering to create a website for your business for competely free. I want to know if you are interested")}>Convert</button>
//         </div>
//       );
// }

// export default AudioPlayer

// import React, { useEffect } from 'react';

// const AudioPlayer = () => {
//   const apiKey = '2fa3058213be8b237bfc2baa596480c8'; // Replace with your actual XI API key
//   const apiUrl = 'wss://api.elevenlabs.io/v1/text-to-speech/CYw3kZ02Hs0563khs1Fj/stream';

//   useEffect(() => {
//     const ws = new WebSocket(apiUrl);

//     ws.onopen = () => {
//       console.log('WebSocket connection opened');
      
//       const requestData = {
//         text: "Hello, this is a streaming test.",
//         model_id: "eleven_monolingual_v1",
//         voice_settings: {
//           stability: 0.5,
//           similarity_boost: 0.5
//         }
//       };
      
//       const requestPayload = {
//         headers: {
//           'accept': 'audio/mpeg',
//           'xi-api-key': apiKey,
//           'Content-Type': 'application/json'
//         },
//         requestData: requestData
//       };
    
//       ws.send(JSON.stringify(requestPayload));
//     };
    
//     ws.onmessage = (event) => {
//       const receivedData = JSON.parse(event.data);
//       const audioBlob = new Blob([receivedData.audioData], { type: 'audio/mpeg' });
//       const objectURL = URL.createObjectURL(audioBlob);
//       const audioElement = new Audio(objectURL);
//       audioElement.play();
//     };
    
//     ws.onclose = () => {
//       console.log('WebSocket connection closed');
//     };
    
//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <div>
//       <p>Click the button to start audio streaming:</p>
//       <button onClick={() => {
//         // Code to initiate audio streaming (WebSocket connection setup) when button is clicked
//       }}>
//         Start Streaming
//       </button>
//     </div>
//   );
// };

// export default AudioPlayer;
// import React, { useEffect, useRef } from 'react';

// function AudioPlayer() {
//     const audioRef = useRef(null);
//     const mediaSourceRef = useRef(null);

//     useEffect(() => {
//         const audio = audioRef.current;
//         const mediaSource = mediaSourceRef.current = new MediaSource();
//         audio.src = URL.createObjectURL(mediaSource);
//         // audio.play();

//         mediaSource.addEventListener("sourceopen", sourceOpen);
//     }, );

//     function sourceOpen() {
//         const mediaSource = mediaSourceRef.current;
//         const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");

//         fetch("http://localhost:3001/api/stream", {
//             method: 'POST',
//             body: JSON.stringify({
//                 "data": "On the client-side in React.js, you could use the Media Source Extensions (MSE) API to handle the chunks of audio data as they come in:"
//             }),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }).then(response => {
//             // response.body.getReader().read().then(function processChunk({ done, value }) {
//             //     if (done) {
//             //         sourceBuffer.endOfStream();
//             //         return;
//             //     }

//             //     sourceBuffer.appendBuffer(value);
//             //     return response.body.getReader().read().then(processChunk);
//             // });
//         });
//     }

//     return <audio ref={audioRef} />;
// }

// export default AudioPlayer;


import React, { useEffect } from 'react';
import axios from 'axios';


const AudioPlayer = () => {
  const handlePlay = () => {
    const url = "https://api.elevenlabs.io/v1/text-to-speech/CYw3kZ02Hs0563khs1Fj/stream";
    
    const headers = {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": "2fa3058213be8b237bfc2baa596480c8"
    };
    
    const data = {
      "text": "My name is Nav I am from NavWebDev. I noticed that you don't have a website. I am offering to create a website for your business for competely free. I want to know if you are interested",
      "model_id": "eleven_monolingual_v1",
      "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.5
      }
    };
    
    const mediaSource = new MediaSource();
    const audioURL = URL.createObjectURL(mediaSource);
    
    const audioElement = new Audio(audioURL);
    
    audioElement.controls = true; // Display audio controls
    
    document.body.appendChild(audioElement);
    
    axios.post(url, data, {
      headers: headers,
      responseType: 'arraybuffer'
    })
    .then(response => {
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
      sourceBuffer.appendBuffer(response.data);
    
      mediaSource.addEventListener('sourceopen', () => {
        sourceBuffer.timestampOffset = 0;
      });
    
      audioElement.play();
    })
    .catch(error => {
      console.error('Error playing streaming audio:', error);
    });
  };

  return (
    <div>
      <button onClick={handlePlay}>Play Audio</button>
      {/* The audio player will be displayed here */}
    </div>
  );
};

export default AudioPlayer;
