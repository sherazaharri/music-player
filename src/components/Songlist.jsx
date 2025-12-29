import playlist from '../songs/songs.js'
import '../css/Songlist.css'

import { useRef, useState, useEffect } from 'react';

function Songlist(){
    const [songIndex, setSongIndex] = useState(0);
    
    const handleChangeSongButton = (playlist) => {
        setSongIndex(playlist.id);
    }

    return(
        <div className='fullList'>
            <p>Current Playlist:</p>
            {
                playlist.map(
                    playlist =>
                        <button className='songButton' onClick={() => handleChangeSongButton(playlist)} key={playlist.id}>
                            <div className='songImage'>
                                <img src={playlist.img}/>
                            </div>
                            <div className='songInfo'>
                                <h1>{playlist.song}</h1>
                                <p>{playlist.artist}</p>
                            </div>
                            
                        </button>
                )
            }
            <p>Current Index: {songIndex}</p>
            
        </div>
    )
}

export default Songlist