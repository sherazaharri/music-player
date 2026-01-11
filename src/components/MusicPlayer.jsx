import '../css/MusicPlayer.css'

import playlist from '../songs/songs.js'

import play from '../assets/buttons/play.png'
import next from '../assets/buttons/next.png'
import prev from '../assets/buttons/prev.png'
import pause from '../assets/buttons/pause.png'
import volume from '../assets/buttons/volume.png'
import mute from '../assets/buttons/mute.png'

import { useRef, useState, useEffect } from 'react';

import React, {useContext} from 'react'
import {SongIndexContext} from '../main.jsx'
import { SidebarCollapseContext } from '../main.jsx'

function MusicPlayer() {
    const {songIndex, setSongIndex} = useContext(SongIndexContext);
    const currentSong = playlist[songIndex];

    const {isOpen, setIsOpen} = useContext(SidebarCollapseContext);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [currentVolume, setCurrentVolume] = useState(0.5);
    const [tempVolume, setTempVolume] = useState(0.5);
    const [isMute, setIsMute] = useState(false); 
    const [muteButton, setMuteButton] = useState(volume);

    const audioRef = useRef(null);

    /*music slider functions */
    const handleLoadedMetadata = () => { /*gets the duration of the audio,gurantees it gets it because it only fires once metadata is loaded */
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => { /*for finding a specific time in the song*/
        audioRef.current.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);
    };

    function formatDuration(durationSeconds){ /*formatting time and duration */
        const minutes = Math.floor(durationSeconds/60);
        const seconds = Math.floor(durationSeconds%60);
        const formattedSeconds = seconds.toString().padStart(2, "0");
        return `${minutes}:${formattedSeconds}`;
    }

    useEffect(() => { /*for resetting the timeline when changing songs */
        const audio = audioRef.current;
        if (!audio) return;

        setCurrentTime(0);
        audio.currentTime = 0;

        if (isPlaying) {
            audio.play();
        }
    }, [songIndex]);

    useEffect(() => { /*for listening to 'timeupdate' events from the audio element and update the UI */
        const audio = audioRef.current;
        if (!audio) return;

        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate); /*for cleanup once the component unmounts*/
        };
    }, []);

    /*music player functions */
    function handleButtonClick(){
        setIsPlaying(prev => !prev);
    }

    useEffect(() => { /*for handling pause and play*/
        if (!audioRef.current) return; /*for if there is no audio */

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        } 
    }, [isPlaying]) /*Use state effect to avoid async state bug, because this will definitely active once the isPlaying value changes */

    function handleGoPrev(){
        if (songIndex == 0){
            const lastIndex = playlist.length - 1;
            setSongIndex(lastIndex);
        }
        else{
            setSongIndex(prev => prev-1);
        }
    }

    function handleGoNext(){
        const lastIndex = playlist.length - 1;
        if(songIndex == lastIndex){
            setSongIndex(0)
        }
        else{
            setSongIndex(prev => prev+1)
        }
    }

    const afterAudioLoaded = () => {
        if(isPlaying){
            audioRef.current.play();
        }
    }

    const handleAutoNext = () => {
        setSongIndex(prev => (prev+1) % playlist.length);
    }

    /*volume control functions*/
    function handleVolumeChange(e){
        const value = Number(e.target.value);
        const audio = audioRef.current;

        setCurrentVolume(value);
        audio.volume = value;

        if (value === 0) {
            setTempVolume(0.5);
        } else {
            setTempVolume(value);
        }
    }

    function toggleMute() {
        const audio = audioRef.current;

        if (currentVolume > 0) {
            setCurrentVolume(0);
            audio.volume = 0;
        } else {
            setCurrentVolume(tempVolume);
            audio.volume = tempVolume;
        }
    }

    useEffect(() => {
        setMuteButton(currentVolume === 0 ? mute : volume);
    }, [currentVolume]);

    return(
        <div className={'musicPlayer ' + (!isOpen ? 'tabClosedPlayer' : '')}>
            <p>Currently Playing:</p>
            <div className={'currentSong ' + (!isOpen ? 'tabClosedSong' : '')}>
                <img src={currentSong.img}/>
                <h1>{currentSong.song}</h1>
                <p>{currentSong.artist}</p>
            </div>

            <div className={'musicControl ' + (!isOpen ? 'tabClosedControl' : '')}>                                                 {/*onLoadedMetadata fires the event within once the metadata is loaded */}
                <audio ref={audioRef} src={currentSong.audio} onCanPlay={afterAudioLoaded} onLoadedMetadata={handleLoadedMetadata} onEnded={handleAutoNext}></audio> {/*ref is for being able to access this DOM element to use within our script*/}
                <button onClick={handleGoPrev}>
                    <img src={prev} className={'controlButton ' + (!isOpen ? 'tabClosedButtonControl' : '')}/>
                </button>
                <button onClick={handleButtonClick}>
                    <img src={isPlaying ? pause : play} className={'playButton ' + (!isOpen ? 'tabClosedButtonPlay' : '')}/> {/*simple way of checking boolean*/}
                </button>
                <button onClick={handleGoNext}>
                    <img src={next} className={'controlButton ' + (!isOpen ? 'tabClosedButtonControl' : '')}/>
                </button>
            </div>

            <div className={'sliderControl ' + (!isOpen ? 'tabClosedSlider' : '')}>
                <p>{formatDuration(currentTime)}</p>
                <input type="range" min="0" max={duration || 0} step="0.01" value={currentTime} className={'seekSlider ' + (!isOpen ? 'tabClosedSeekSlider' : '')} onChange={handleSeek}/> {/*max is using an ifelse statement*/}
                <p>{formatDuration(duration)}</p>
            </div>
            
            <div className={'volumeControl ' + (!isOpen ? 'tabClosedVolume' : '')}>
                <button onClick={toggleMute}>
                    <img src={muteButton} className={'controlButton ' + (!isOpen ? 'tabClosedButtonControl' : '')}></img>
                </button>
                <input className={'volumeSlider ' + (!isOpen ? 'tabClosedVolumeSlider' : '')} type='range' min='0.0' max='1.0' step='0.05' value={currentVolume} onChange={handleVolumeChange}/>
            </div>            
        </div>
    )
}

export default MusicPlayer
