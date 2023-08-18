
import { Link } from 'react-router-dom';
import '../styles.css';
import {useEffect, useState} from "react"
import { useNavigate } from 'react-router-dom';
import AudioStreamingComponent from "../components/AudioStreamingComponent"
import AudioPlayer from '../components/AudioPlayer';

function CallList() {
  const [calls, setCalls] = useState()
  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = useState("")
  const [callName, setCallName] = useState("")
  
  const fetchCalls = async() =>{
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/getCalls`)
    const data = await res.json()
    setCalls(data)
}

const handleNewCall = async ()=>{
    if(businessInfo !== "" && callName !== "" ){
    
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/newCall`, {
        method:"POST",
        body: JSON.stringify({
            businessInfo,
            callName
        }),
         
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      })

      const data = await res.json()
      if(res.status === 200){
        navigate(`/calls/${data._id}`);
      }else{
        console.log("Something Went Wrong")
      }
    }

  }

  const testingStream = () =>{
    const voiceId = 'CYw3kZ02Hs0563khs1Fj';
const xiApiKey = '2fa3058213be8b237bfc2baa596480c8';

const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('xi-api-key', xiApiKey);


const data = {
    text: 'Some very long text to be read by the voice. Some very long text to be read by the voice. Some very long text to be read by the voice.Some very long text to be read by the voice. Some very long text to be read by the voice. Some very long text to be read by the voice'
};


fetch(ttsUrl, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data)
})
.then(response => {
  if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Use response.arrayBuffer() to read the response body as an ArrayBuffer
  return response.arrayBuffer();
})
.then(arrayBuffer => {
  // Convert the ArrayBuffer to a Blob
  const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });

  // Convert the Blob to a URL
  const audioUrl = URL.createObjectURL(audioBlob);

  // Create an Audio element
  const audioElement = new Audio();
  audioElement.src = audioUrl; // Set the audio source

  // Listen for the 'canplay' event to ensure the audio is ready to play
  audioElement.addEventListener('canplay', () => {
      // Play the audio
      audioElement.play()
          .catch(error => {
              console.error('Audio playback error:', error);
          });
  });

  // Listen for errors during audio playback
  audioElement.addEventListener('error', event => {
      console.error('Audio element error:', event);
  });
})
.catch(error => {
  console.error('Fetch error:', error);
});

  }
  
  useEffect(()=>{
    fetchCalls()
  }, [])
  return (
    <div className="callList">
        <div className='callListHeader'>
            <h2>Start a new Call</h2>
            <input className='input' placeholder='Enter Call Name' value={callName} onChange={(e)=>setCallName(e.target.value)}/>
            <input className='input' placeholder='Enter Business Owner Details' value={businessInfo} onChange={(e)=> setBusinessInfo(e.target.value)}/>
            <button onClick={handleNewCall} className='button callButton'><i className='bx bxs-phone' ></i></button>
        </div>
        {/* <AudioStreamingComponent voiceId="CYw3kZ02Hs0563khs1Fj" xiApiKey='2fa3058213be8b237bfc2baa596480c8'/> */}
        <AudioPlayer/>
        <h2 className='heading2'>Older Calls</h2>
     {calls && calls.map((call, i)=> (
      <div className='callCard' key={i}>
        <h1>{call.callName}</h1>
        <div className="callCardActions">
          <Link to={`/calls/${call._id}`}>
          <i className='bx bx-show icon'></i>
          </Link>
        </div>
      </div>
     ))}
    </div>
  );
}

export default CallList;
