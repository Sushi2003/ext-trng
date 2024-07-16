import { useEffect, useState } from 'react';
import './App.css';
import GmailLeadExtractor from "./gmail-lead-extractor/gmail-lead-extractor";
import {useDispatch} from "react-redux";
import {addMessage} from "./redux/features/gmail_messages/gmail_message_slice";
import {queryLlamaJSON} from "./llm-apis/ollama";
import { promptIsInitialReachout } from "./llm-apis/classifier"

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [emailDetails, setEmailDetails] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    // Send message to content script to get search query
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('message', message);
      setEmailDetails(message.emailDetails);

      dispatch(addMessage({
        messageId: message.messageId,
        messageDetails: {...message}
      }))
    });

    //turning the email details received into string.
    const getEmailDetailsAsString = () => {
      if (!emailDetails) return '';

      const from = emailDetails.metadata.from;
      const date= emailDetails.metadata.date;
      const body = emailDetails.body;


      return `From: ${from} \n Date: ${date} \n\nBody:\n${body}`;
    };
    const email_retrieved= getEmailDetailsAsString();
    // console.log(email_retrieved);




//making api call to llama3
    (async function () {
      if (email_retrieved) {
        try {
          const res = await queryLlamaJSON({ prompt: promptIsInitialReachout(email_retrieved) });
          console.log('response is ', res);
        } catch (ex) {
          console.log(":(");
          console.log('exception:', ex);
        }
      }
    })();

  }, [emailDetails]);

  return (
     <div className={'w-full py-2 px-2 bg-transparent'}>
       <GmailLeadExtractor />
     </div>
  );
}


export default App;