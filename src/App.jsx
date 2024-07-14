import { useEffect, useState } from 'react';
import './App.css';
import GmailLeadExtractor from "./gmail-lead-extractor/gmail-lead-extractor";
import {useDispatch} from "react-redux";
import {addMessage} from "./redux/features/gmail_messages/gmail_message_slice";

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

      // fire off the redux action..
    });
  }, []);

  return (
     <div className={'w-full py-2 px-2 bg-transparent'}>
       <GmailLeadExtractor />
     </div>
  );
}


export default App;