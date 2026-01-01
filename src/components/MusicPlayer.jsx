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

function MusicPlayer() {
    const {songIndex, setSongIndex} = useContext(SongIndexContext);
    const currentSong = playlist[songIndex];

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

    /*volume control functions*/
    function handleVolumeChange(x){
        const audio = audioRef.current;

        setCurrentVolume(x.target.value);
        setTempVolume(x.target.value);
        audio.volume = x.target.value;
    }

    function changeIsPlaying(){ /*set state placed seperately to avoid asynchronous updates */
        setIsMute(prev => !prev);
    }

    useEffect(() => { /*handles muting and unmuting the audio*/
        const audio = audioRef.current;
        
        
        if(isMute == true){
            setCurrentVolume(0.0);
            audio.volume = 0.0;
            setMuteButton(mute);
        }else{
            setCurrentVolume(tempVolume);
            audio.volume = tempVolume;
            setMuteButton(volume);
        }
    }, [isMute])

    return(
        <div className='musicPlayer'>
            <p>Currently Playing:</p>
            <div className='currentSong'>
                <img src={currentSong.img}/>
                <h1>{currentSong.song}</h1>
                <p>{currentSong.artist}</p>
            </div>

            <div className='musicControl'>                                                 {/*onLoadedMetadata fires the event within once the metadata is loaded */}
                <audio ref={audioRef} src={currentSong.audio} onCanPlay={afterAudioLoaded} onLoadedMetadata={handleLoadedMetadata}></audio> {/*ref is for being able to access this DOM element to use within our script*/}
                <button onClick={handleGoPrev}>
                    <img src={prev} className='controlButton'/>
                </button>
                <button onClick={handleButtonClick}>
                    <img src={isPlaying ? pause : play} className='playButton'/> {/*simple way of checking boolean*/}
                </button>
                <button onClick={handleGoNext}>
                    <img src={next} className='controlButton'/>
                </button>
            </div>

            <div className='sliderControl'>
                <p>{formatDuration(currentTime)}</p>
                <input type="range" min="0" max={duration || 0} step="0.01" value={currentTime} className="seekSlider" onChange={handleSeek}/> {/*max is using an ifelse statement*/}
                <p>{formatDuration(duration)}</p>
            </div>
            
            <div className='volumeControl'>
                <button onClick={changeIsPlaying}>
                    <img src={muteButton} className='controlButton'></img>
                </button>
                <input className='volumeSlider' type='range' min='0.0' max='1.0' step='0.05' value={currentVolume} onChange={handleVolumeChange}/>
            </div>            
        </div>
    )
}

export default MusicPlayer
