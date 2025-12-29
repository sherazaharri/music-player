import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.jsx'
import MusicPlayer from './components/musicplayer.jsx'
import Songlist from './components/Songlist.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='playScreen'>
      <MusicPlayer className='musicPlayer'></MusicPlayer>
      <Songlist></Songlist>
    </div>
  </StrictMode>,
)
