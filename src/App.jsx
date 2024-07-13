import { useEffect, useState } from 'react';
import './App.css';
import GmailLeadExtractor from "./gmail-lead-extractor/gmail-lead-extractor";

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Send message to content script to get search query
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getSearchQuery' }, (response) => {
        if (response) {
          setSearchQuery(response.query);
        }
      });
    });

    // Listen for updates from the background script
    const handleMessage = (message) => {
      if (message.action === 'updateQuery') {
        setSearchQuery(message.query);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
     <div className={'w-full py-2 px-2 bg-transparent'}>
       <GmailLeadExtractor />
     </div>
  );
}


export default App;