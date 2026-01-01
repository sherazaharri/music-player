import playlist from '../songs/songs.js'
import '../css/Songlist.css'

import { useRef, useState, useEffect, createContext } from 'react';

import React, {useContext} from 'react'
import {SongIndexContext} from '../main.jsx'

function Songlist(){
    const {songIndex, setSongIndex} = useContext(SongIndexContext);
    
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
        </div>
    )
}

export default Songlist