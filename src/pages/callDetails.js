import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import "../styles.css"
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'



const CallDetails = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [loading, setLoading] = useState(false)
    const [lastProcessedResultIndex, setLastProcessedResultIndex] = useState(0);
    const [userMessage, setUserMessage] = useState("")
    const { listening, listen, stop, transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();


    const navigate = useNavigate();

    const { callId } = useParams();
    const [conversation, setConversation] = useState()
    const fetchConversation = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/getConversation/${callId}`)
        const data = await res.json()

        setConversation(data.conversation)

    }

    const handleSpeak = (messsage) => {
        if ('speechSynthesis' in window) {
            setIsSpeaking(true);

            const speech = new SpeechSynthesisUtterance(messsage);
            speech.onend = () => {
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(speech);
        } else {
            console.error('Speech synthesis is not supported in this browser.');
        }
    };

    const handleSubmit = async () => {
        if (userMessage !== "") {
            setLoading(true)
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/continueCall/${callId}`, {
                method: "POST",
                body: JSON.stringify({
                    userMessage
                }),

                // Adding headers to the request
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })

            const data = await res.json()
            if (res.status === 200) {
                
                // console.log(data.newMessage)
                // handleSpeak(data.newMessage)
                setUserMessage("")
                resetTranscript()
                const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/CYw3kZ02Hs0563khs1Fj'; // Replace <voice-id> with the actual voice ID
const apiKey = '2fa3058213be8b237bfc2baa596480c8'; // Replace <xi-api-key> with your XI API key

const textToConvert = data.newMessage;
const modelId = "eleven_monolingual_v1";
const stability = 0.5;
const similarityBoost = 0.5;

const requestData = {
  text: textToConvert,
  model_id: modelId,
  voice_settings: {
    stability: stability,
    similarity_boost: similarityBoost
  }
};

fetch(apiUrl, {
  method: 'POST',
  headers: {
    'accept': 'audio/mpeg',
    'xi-api-key': apiKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestData)
})
.then(response => {
  if (!response.ok) {
    setLoading(false)
    throw new Error(`Error requesting text-to-speech: ${response.statusText}`);
  }
  return response.blob();
})
.then(audioBlob => {
    setLoading(false)
  // Use the audioBlob for further processing or playback
  const audioElement = document.createElement('audio');

// Set the audio source to the Blob data
const audioUrl = URL.createObjectURL(audioBlob);
audioElement.src = audioUrl;

// Append the <audio> element to the DOM
document.body.appendChild(audioElement);

// Play the audio
audioElement.play();
})
.catch(error => {
    setLoading(false)
  console.error(error.message);
});

                fetchConversation()
            } else {
                setLoading(false)
                console.log("Something Went Wrong")
            }
        }
    }

    const handleCallEnd = async () =>{
        setUserMessage("*Call Ended* Please point out my mistakes, good points with solution for this converstaion")
       handleSubmit()
    }

    // const startListening = () =>{
    //     SpeechRecognition.startListening({continuous: true})
    // }

    const handleToggleListening = () => {
        if (listening) {
          SpeechRecognition.stopListening()
        } else {
            SpeechRecognition.startListening()
        //   listen();
        }
      };


  if (!browserSupportsSpeechRecognition) {
    console.log("Error")
  }
  
    

    useEffect(() => {
        fetchConversation()
       setUserMessage(transcript)
       console.log(listening)
       
    }, [transcript])

    return (
        <div className='callDetail'>
            {conversation && conversation.map((item, i) => (
                <div className='message' key={i}>
                    {item.role == "assistant" && (
                        <h3 className='role assistant'>{item.role}</h3>
                    )}
                    {item.role == "user" && (
                        <h3 className='role user'>{item.role}</h3>
                    )}
                    <p className='content'>{item.content}</p>
                </div>
            ))}
            <div className='inputContainer'>
                <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} className='textarea'></textarea>
                <div className='buttonContainer'>
                {/* {isListening ? 'Stop Listening' : 'Start Listening'} */}
                {loading ? (

                    <div className='button' >
                        
                        <i className='bx bx-loader-circle bx-spin' ></i>
                    </div>
                ) : (
                    <div className='button' onClick={handleSubmit}>
                        <i className='bx bx-send'></i>
                    </div>

                )}
                    {listening ? (
        <div className='button' onClick={handleToggleListening} style={{ backgroundColor: 'red' }}>
          Stop
          <i className='bx bx-microphone'></i>
        </div>
      ) : (
        <div className='button' onClick={handleToggleListening} style={{ backgroundColor: 'green' }}>
          Start
          <i className='bx bx-microphone'></i>
        </div>
      )}
                    <div className='button buttonDiff' onClick={handleCallEnd}>
                        End Call
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CallDetails