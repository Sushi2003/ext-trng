import { useEffect, useState } from 'react';
import './App.css';
import OpenAiExtractor from "./Open-Ai-Extractor/Open-Ai-Extractor";


function App() {


  return (
     <div className={'w-full py-2 px-2 bg-transparent'}>
       <OpenAiExtractor />
     </div>
  );
}


export default App;