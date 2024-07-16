import { useEffect, useState } from 'react';
import './App.css';
import GmailLeadExtractor from "./gmail-lead-extractor/gmail-lead-extractor";
import {useDispatch} from "react-redux";
import {addMessage} from "./redux/features/gmail_messages/gmail_message_slice";
import {queryLlamaJSON} from "./llm-apis/ollama";

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    // Send message to content script to get search query
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('message', message);

      dispatch(addMessage({
        messageId: message.messageId,
        messageDetails: {...message}
      }))
    });

    // make a queryLLAMA JSON Call to verify it is working
    (async function () {
      try {
        const res = await queryLlamaJSON({prompt: "Why is the sky blue?"});
        console.log('response is ', res.data);
      } catch (ex) {
        console.log(":(");
        console.log('exception:', ex);
      }

    }())

  }, []);

  return (
     <div className={'w-full py-2 px-2 bg-transparent'}>
       <GmailLeadExtractor />
     </div>
  );
}


export default App;