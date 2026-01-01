import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import Songlist from './components/Songlist.jsx'

import { useRef, useState, useEffect, createContext } from 'react';

export const SongIndexContext = createContext();

function Root(){
  const [songIndex, setSongIndex] = useState(0);

  return(
    <div className='playScreen'>
      <SongIndexContext.Provider value = {{songIndex, setSongIndex}}>
        <MusicPlayer className='musicPlayer'></MusicPlayer>
        <Songlist></Songlist>
      </SongIndexContext.Provider> 
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root></Root>
  </StrictMode>,
)
