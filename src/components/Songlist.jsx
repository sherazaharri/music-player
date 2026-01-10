import playlist from '../songs/songs.js'
import '../css/Songlist.css'

import { useRef, useState, useEffect, createContext } from 'react';

import React, {useContext} from 'react'
import {SongIndexContext} from '../main.jsx'
import {SidebarCollapseContext} from '../main.jsx';

import close from '../assets/buttons/close.png'
import open from '../assets/buttons/open.png'

function Songlist(){
    const {songIndex, setSongIndex} = useContext(SongIndexContext);
    const {isOpen, setIsOpen} = useContext(SidebarCollapseContext);
    
    const handleChangeSongButton = (playlist) => {
        setSongIndex(playlist.id);
    }

    const handleCollapse = () => {
        setIsOpen(prev => !prev);
    }

    return(
        <div className={'fullTab ' + (!isOpen ? '' : 'mobileOpenedTab')}>
            <button className='playlistCollapse' onClick={handleCollapse}>
                <img src={isOpen ? close : open}></img>
            </button>

            {isOpen ? (
                <div className='fullList'>
                    <p className='playlistHead'>Current Playlist:</p>
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
                ) : null
            }
        </div>
    )
}

export default Songlist