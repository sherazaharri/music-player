import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'
import Songlist from './components/Songlist.jsx'

import { useRef, useState, useEffect, createContext } from 'react';

export const SongIndexContext = createContext();
export const SidebarCollapseContext = createContext();

function Root(){
  const [songIndex, setSongIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const screenRef = useRef(null);

  useEffect(() => {
    screenRef.current.classList.toggle('tabClosed', !isOpen);
  }, [isOpen])

  return(
    <div className='playScreen' ref={screenRef}>
      <SongIndexContext.Provider value = {{songIndex, setSongIndex}}>
        <MusicPlayer className='musicPlayer'></MusicPlayer>
        <SidebarCollapseContext.Provider value = {{isOpen, setIsOpen}}>
          <Songlist></Songlist>
        </SidebarCollapseContext.Provider>
      </SongIndexContext.Provider> 
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root></Root>
  </StrictMode>,
)
