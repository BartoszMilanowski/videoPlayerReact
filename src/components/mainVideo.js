import { useEffect, useRef } from 'react';
import mainVideo from '../videos/przykladowe.mp4';

export const MainVideoArea = () => {

    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current,
            container = document.querySelector('.video-container'),
            progressBar = container.querySelector('.progress-bar'),
            videoTimeline = container.querySelector('.video-timeline'),
            currentVidTime = container.querySelector('.current-time'),
            videoDuration = container.querySelector('.video-duration'),
            playPauseBtn = container.querySelector('.play-pause i'),
            skipBackwardBtn = container.querySelector('.skip-backward i'),
            skipForwardBtn = container.querySelector('.skip-forward i'),
            volumeBtn = container.querySelector('.volume i'),
            volumeSlider = container.querySelector('.left input'),
            speedOptions = container.querySelector('.speed-options'),
            speedBtn = container.querySelector('.playback-speed span'),
            picInPicBtn = container.querySelector('.pic-in-pic span'),
            fullscreenBtn = container.querySelector('.fullscreen i');
        let timer;
        //Toggle controls

        const hideControls = () => {
            if (video.paused) return;
            timer = setTimeout(() => {
                container.classList.remove('show-controls');
            }, 3000);
        }

        const showControls = () => {
            container.classList.add('show-controls');
        }

        hideControls();

        container.addEventListener('mousemove', () => {
            showControls();
            clearTimeout(timer);
            hideControls();
        })

        //Format time

        const formatTime = (time) => {
            let seconds = Math.floor(time % 60),
                minutes = Math.floor(time / 60) % 60,
                hours = Math.floor(time / 3600);

            seconds = seconds < 10 ? `0${seconds}` : seconds;
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            hours = hours < 10 ? `0${hours}` : hours;

            if (hours == 0) {
                return `${minutes}:${seconds}`;
            }
            return `${hours}:${minutes}:${seconds}`;
        }

        //Move progress bar
        video.addEventListener('timeupdate', e => setProgressBar(e));

        const setProgressBar = (e) => {
            let { currentTime, duration } = e.target;
            let percent = (currentTime / duration) * 100;
            progressBar.style.width = `${percent}%`;
            currentVidTime.innerHTML = formatTime(currentTime);
        }

        //Set video duration

        video.addEventListener('loadeddata', e => {
            videoDuration.innerHTML = formatTime(e.target.duration);
        })

        //Skip by timeline

        videoTimeline.addEventListener('click', e => {
            let timelineWidth = e.target.clientWidth;
            video.currentTime = (e.offsetX / timelineWidth) * video.duration
        })

        const draggableProgressBar = e => {
            let timelineWidth = e.target.clientWidth;
            progressBar.style.width = `${e.offsetX}px`
            video.currentTime = (e.offsetX / timelineWidth) * video.duration
            currentVidTime.innerHTML = formatTime(video.currentTime);
        }

        videoTimeline.addEventListener('mousedown', () => {
            videoTimeline.addEventListener('mousemove', draggableProgressBar);
        })

        document.addEventListener('mouseup', () => {
            videoTimeline.removeEventListener('mousemove', draggableProgressBar);
        })

        videoTimeline.addEventListener('mousemove', e => {
            const progressTime = videoTimeline.querySelector('span');
            let offsetX = e.offsetX;
            progressTime.style.left = `${offsetX}px`;
            let timelineWidth = e.target.clientWidth;
            let percent = (e.offsetX / timelineWidth) * video.duration;
            progressTime.innerText = formatTime(percent);
        })

        //Play-pause proceed
        playPauseBtn.addEventListener('click', () => playPauseVid());
        video.addEventListener('click', () => playPauseVid());

        video.addEventListener('play', () => {
            playPauseBtn.classList.replace('fa-play', 'fa-pause');
            hideControls();
        });

        video.addEventListener('pause', () => {
            playPauseBtn.classList.replace('fa-pause', 'fa-play');
            showControls();
        });

        const playPauseVid = () => {
            video.paused ? video.play() : video.pause();
        }

        //Skip video
        const skipBackwardFunc = () => video.currentTime -= 5;
        const skipForwardFunc = () => video.currentTime += 5;

        skipBackwardBtn.addEventListener('click', () => skipBackwardFunc());
        skipForwardBtn.addEventListener('click', () => skipForwardFunc());

        //Mute and unmute video
        const muteUnmuteVid = () => {
            if (!volumeBtn.classList.contains('fa-volume-high')) {
                video.volume = 0.5
                volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
            } else {
                video.volume = 0.0;
                volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
            }
            volumeSlider.value = video.volume;
        };

        volumeBtn.addEventListener('click', () => muteUnmuteVid());


        //Change volume level
        volumeSlider.addEventListener('input', e => handleVolumeSlider(e))

        const handleVolumeSlider = (e) => setVolume(parseFloat(e.target.value));

        const changeVolume = (delta) => {
            let currentVolume = parseFloat(video.volume);
            let newVolume = Math.min(Math.max(currentVolume + delta, 0), 1);
            setVolume(newVolume);
        }

        const setVolume = (newVolume) => {

            video.volume = newVolume;
            volumeSlider.value = newVolume;

            updateVolumeIcon(newVolume);
        };

        const updateVolumeIcon = (volume) => {
            if (volume === 0) {
                volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
            } else {
                volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
            }
        };

        //Change video speed

        speedBtn.addEventListener('click', () => {
            speedOptions.classList.toggle('show');
        })

        document.addEventListener('click', e => {
            if (e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
                speedOptions.classList.remove('show');
            }
        })

        speedOptions.querySelectorAll('li').forEach(option => {
            option.addEventListener('click', () => {
                video.playbackRate = option.dataset.speed;
                speedOptions.querySelector('.active').classList.remove('active');
                option.classList.add('active');
            })
        })

        //Picture in picture

        picInPicBtn.addEventListener('click', () => picInPic());

        const picInPic = () => {
            !document.pictureInPictureElement ? video.requestPictureInPicture() : document.exitPictureInPicture()
        }

        //Fullscreen

        fullscreenBtn.addEventListener('click', () => fullscreen())

        const fullscreen = () => {
            container.classList.toggle('fullscreen');
            if (document.fullscreenElement) {
                fullscreenBtn.classList.replace('fa-compress', 'fa-expand');
                return document.exitFullscreen();
            }
            fullscreenBtn.classList.replace('fa-expand', 'fa-compress');
            container.requestFullscreen();
        }

        //Proceed by keyboard
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'Space':
                    playPauseVid();
                    break;
                case 'ArrowLeft':
                    skipBackwardFunc();
                    break;
                case 'ArrowRight':
                    skipForwardFunc();
                    break;
                case 'KeyM':
                    muteUnmuteVid();
                    break;
                case 'ArrowUp':
                    changeVolume(0.1);
                    break;
                case 'ArrowDown':
                    changeVolume(-0.1);
                    break;
                case 'KeyP':
                    picInPic();
                    break;
                case 'KeyF':
                    fullscreen();
                    break;
                default:
                    break;
            }
        })

    }, []);

    return (
        <><div class="main-video">
            <div class="video-container show-controls">
                <div class="wrapper">
                    <div class="video-timeline">
                        <div class="progress-area">
                            <span>00:00</span>
                            <div class="progress-bar"></div>
                        </div>
                    </div>
                    <ul class="video-controls">
                        <li class="options left">
                            <button class="volume"><i class="fa-solid fa-volume-high"></i></button>
                            <input type="range" min="0" max="1" step="any" value={0.5} />
                            <div class="video-timer">
                                <p class="current-time">00:00</p>
                                <p class="separator"> / </p>
                                <p class="video-duration">00:00</p>
                            </div>
                        </li>
                        <li class="options center">
                            <button class="skip-backward"><i class="fas fa-backward"></i></button>
                            <button class="play-pause"><i class="fas fa-play"></i></button>
                            <button class="skip-forward"><i class="fas fa-forward"></i></button>
                        </li>
                        <li class="options right">
                            <div class="playback-content">
                                <button class="playback-speed">
                                    <span class="material-symbols-rounded">slow_motion_video</span>
                                </button>
                                <ul class="speed-options">
                                    <li data-speed="2" >2x</li>
                                    <li data-speed="1.5" >1.5x</li>
                                    <li data-speed="1" class="active">Normal</li>
                                    <li data-speed="0.75" >0.75x</li>
                                    <li data-speed="0.5">0.5x</li>
                                </ul>
                            </div>
                            <button class="pic-in-pic">
                                <span class="material-symbols-rounded">picture_in_picture_alt</span>
                            </button>
                            <button class="fullscreen"><i class="fa-solid fa-expand"></i></button>
                        </li>
                    </ul>
                </div>
                <video ref={videoRef} volume={0.5}>
                    <source src={mainVideo} type='video/mp4'></source>
                </video>
            </div>
            <h3 class="title">01. Video Title</h3>
        </div></>
    )
}