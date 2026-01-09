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

  return(
    <div className={'playScreen ' + (!isOpen ? 'tabClosed' : '')}>
      <SongIndexContext.Provider value = {{songIndex, setSongIndex}}>
        <SidebarCollapseContext.Provider value = {{isOpen, setIsOpen}}>
          <MusicPlayer className='musicPlayer'></MusicPlayer>
          <Songlist className='songList'></Songlist>
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
