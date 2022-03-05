const toggleDark = document.getElementById('toggle');
const movableButton = document.getElementsByClassName('ball')[0];
const background = document.getElementsByClassName('wrapper')[0];
const header = document.getElementsByClassName('header')[0];
const cancelCard = document.getElementsByClassName('fa-caret-down')[0];
const shuffle = document.getElementsByClassName('fa-random')[0];
const repeat = document.getElementsByClassName('fa-repeat')[0];
const play = document.getElementsByClassName('fa-pause')[0];
const previousSong = document.getElementsByClassName('fa-step-backward')[0];
const nextSong = document.getElementsByClassName('fa-step-forward')[0];
const body  = document.getElementsByTagName('body')[0];
const musicList = document.querySelectorAll('.song-title.music');
const musicCard = document.getElementById('music-card');
const audios = document.querySelectorAll('audio');
const audioSeeker  = document.getElementById('seeker');
const minimizedCard = document.getElementsByClassName('minimize')[0];
const mini = document.getElementsByClassName('mini')[0];
const img = document.getElementsByClassName('img')[0];
const songNameField = document.getElementsByTagName('h2')[0];
const artistField = document.getElementById('artist');
const musicTimeStart = document.getElementById('music-start');
const musicTimeEnd = document.getElementById('music-card-span');
let darkmode = false;
let minimize = false;
let lastSong = false;
let timer;
let indx;
let songName;
let artist;
let newArtist;
let newSongName;
let minimizedTime;
let duration;
let timeRange;
let minutes;
let seconds;
let endSong = false;
let playlistQueue = [];
let currentSong = [];
let playlist = [];
let imgIndex = ['A', 'B', 'C', 'D', 'E', 'A', 'C', 'B'];
audioSeeker.setAttribute('min', 0);
let num = 0
let songNo = 0;
let secondCount = 0;
let minuteCount = 0;
previousSong.disabled = true;


// Music click event from main page
musicList.forEach((music, index) => {
    // Push new song to playlist array
    playlist.push(audios[index]);
    if(!music.classList.contains('minimize'))
    music.addEventListener('click', () => {
        setTimeout(() => {
            // push new song to playlist queue
            playlistQueue.push(audios[index]);
            playlistQueue[playlistQueue.length-1].play();
            initialPlayControl(music, index);
            timerForInitialPlay(index);
            maximize();
            if (playlistQueue.length > 1) {
            playlistQueue[playlistQueue.length-2].pause();
               playlistQueue[playlistQueue.length-2].currentTime = 0;
            }
            if (playlistQueue.length > 2) {
               playlistQueue.shift();
            }
            if(playlistQueue[playlistQueue.length-2] == playlistQueue[playlistQueue.length-1]) {
               playlistQueue[playlistQueue.length-1].play();
            }
            if(playlistQueue[playlistQueue.length-1] == playlist[playlist.length-1]) {
                endSong = true;
                nextSong.classList.add('grey');
            }
            ///specify song index for use in next and previous controls
            indx = playlist.indexOf(playlistQueue[playlistQueue.length-1]);
        })
        // Stop song from playing while selecting a new song
        playlist[indx].pause();
        playlist[indx].currentTime = 0;
    })
})

// Maximize the minimized card
function maximize() {
    musicCard.style.height = '600px';
    musicCard.style.marginTop = 0;
    minimizedCard.style.visibility = 'hidden';
    cancelCard.className = 'fa fa-caret-down'; 
}

function timerForInitialPlay(index) {
    timer = setInterval(() => {
        audioSeeker.value = num++;
        (secondCount >= 9) ? timeRange = `${minuteCount}:${secondCount+=1}`: timeRange = `${minuteCount}:0${secondCount+=1}`;
        if(secondCount > 58) {
            secondCount = -1;
            minuteCount+=1;

        }
        if(audioSeeker.value == Math.floor(audios[index].duration)) {
            autoRepeat();
        }
        musicTimeStart.textContent = timeRange;
        minimizedTime.textContent = musicTimeStart.textContent;
    }, 1000)
}

function timerForPlayback() {
    timer = setInterval(() => {
        audioSeeker.value = num++;
        (secondCount >= 9) ? timeRange = `${minuteCount}:${secondCount+=1}`: timeRange = `${minuteCount}:0${secondCount+=1}`;
        if(secondCount > 58) {
           secondCount = -1;
           minuteCount+=1;
        }
        if(audioSeeker.value == Math.floor(playlist[indx].duration)) {
           autoRepeat();
        }
        musicTimeStart.textContent = timeRange;
        minimizedTime.textContent = musicTimeStart.textContent;
    }, 1000)
}

minimizedCard.addEventListener('click', () => {
    if(minimize) {
        maximize();
    }
})

 // next button controls
nextSong.addEventListener('click', () => {
    playlistQueue[playlistQueue.length-1].pause();
    playlistQueue[playlistQueue.length-1].currentTime = 0;
    if(indx < playlist.length-1) {
        currentSong.push(playlist[indx+=1]);
        playbackControls();
        timerForPlayback();
        nextSong.classList.remove('grey');
    }
    if(currentSong.length > 1 && indx <= playlist.length-1) {
        let previousSong = currentSong.shift();
        previousSong.pause();
        previousSong.currentTime = 0;
    }
//  Last song 
    if(indx == playlist.length-1) {
        playlist[indx].currentTime = 0;
        playlist[indx].play();
        playbackControls();
        timerForPlayback();
        nextSong.classList.add('grey');
        if(audioSeeker.value == Math.floor(playlist[indx].duration)) {
            autoRepeat();
        }
    }
})

// previous button controls
previousSong.addEventListener('click', () => {
    playlistQueue[playlistQueue.length-1].pause();
    playlistQueue[playlistQueue.length-1].currentTime = 0;
    if(indx > 0) {
        currentSong.push(playlist[indx-=1]);
        playbackControls();
        timerForPlayback();
        nextSong.classList.remove('grey');
    }
    if(currentSong.length > 1 && indx >= 0) {
        let previousSong = currentSong.shift();
        previousSong.pause();
        previousSong.currentTime = 0;
    }
    // first song
    if(indx == 0 ) {
        clearTimeout(timer)
        timerForPlayback();
        playlist[0].currentTime = 0;
        playlist[0].play();
        num = 0;
        secondCount = 0;
        minuteCount = 0;
        audioSeeker.value = 0;
        musicTimeStart.textContent = `0:00`;
    }
})
/// Play/pause controls
play.addEventListener('click', () => {
    if(play.classList.contains('fa-play')) {
        playlist[indx].play();
        play.className = 'fa fa-pause';
        timerForPlayback();
    }
   
    
    else {
        playlist[indx].pause();
        play.className = 'fa fa-play';
        clearInterval(timer);
    }
})

// Cancel minimized option
cancelCard.addEventListener('click', () => {
    if (cancelCard.classList.contains('fa-caret-down')) {
        musicCard.style.height = '70px';
        musicCard.style.marginTop = '550px';
        musicCard.style.overflow = 'hidden';
        cancelCard.className = 'fa fa-times';
        minimizedCard.style.visibility = 'visible';
        minimize = true;
    }
    else {
        musicCard.style.display = 'none';
        playlistQueue[playlistQueue.length-1].pause();
        playlistQueue[playlistQueue.length-1].currentTime = 0;
        playlist[indx].pause();
        playlist[indx].currentTime = 0;
        maximize();
        minimize = false
        clearInterval(timer);
        num = 0;
        secondCount = 0;
        minuteCount = 0;
        audioSeeker.value = 0;
        musicTimeStart.textContent = `0:00`;
    }
})

// Repeat button interaction
repeat.addEventListener('click', () => {
    if(darkmode) {
        if(repeat.classList.contains('aqua')) {
            repeat.classList.add('grey');
            repeat.classList.remove('aqua');
        }
        else {
            repeat.classList.add('aqua');
            repeat.classList.remove('grey');
        }
    }

    if(!darkmode) {
        if(repeat.classList.contains('neutral')) {
            repeat.classList.add('grey');
            repeat.classList.remove('neutral');
        }
        else {
            repeat.classList.add('neutral');
            repeat.classList.remove('grey');
        }
    }

})

//Toggle dark mode

toggleDark.addEventListener('click', () => {
    if(darkmode) {
        darkmode = false;
      toggleDark.style.border = '1px solid #054c68';
      movableButton.classList.remove('dark');
      body.classList.remove('body-dark')
      movableButton.classList.remove('dark');
      header.className = 'header';
      background.classList.remove('dark-mode-wrapper');
      movableButton.style.backgroundColor = '#f0ffff';
      musicCard.style.background = '#f0ffff';
      musicCard.style.color = '#054c68';

      if(repeat.classList.contains('aqua')) {
          repeat.classList.add('neutral');
          repeat.classList.remove('aqua');
        }
    }
    else {
      darkmode = true;
      toggleDark.style.border = '1px solid aqua';
      body.classList.add('body-dark')
      movableButton.classList.add('dark');
      header.className = 'header-dark';
      background.classList.add('dark-mode-wrapper');
      movableButton.style.backgroundColor = 'aqua';
      musicCard.style.background = '#2e2b2b';
      musicCard.style.color = 'aqua';

      if(repeat.classList.contains('neutral')) {
        repeat.classList.add('aqua');
        repeat.classList.remove('neutral');
      }
    }
})

// Auto repeat function
function autoRepeat() {
    if(repeat.classList.contains('aqua') || repeat.classList.contains('neutral')) {
        num = 0;
        audioSeeker.value = 0;
        secondCount = 0;
        minuteCount = 0;
        play.className = 'fa fa-pause';
        timeRange = '0:00';
        playlist[indx].play();
    }
    else {
        clearInterval(timer);
        num = 0;
        audioSeeker.value = 0;
        secondCount = 0;
        minuteCount = 0;
        play.className = 'fa fa-play';
        timeRange = '0:00';
    }
}

// Play Functions
function playbackControls() {
    num = 0;
    secondCount = 0;
    minuteCount = 0;
    audioSeeker.value = 0;
    musicTimeStart.textContent = `0:00`;
    playlist[indx].play();
    img.setAttribute('src', `images/image ${imgIndex[indx]}.jpg`)
    audioSeeker.setAttribute('max', Math.floor(playlist[indx].duration));
    newArtist = musicList[indx].firstElementChild.nextElementSibling.firstChild.nextSibling.nextElementSibling.innerText;
    newSongName = musicList[indx].firstElementChild.nextElementSibling.firstChild.textContent;
    songNameField.textContent = newSongName;
    artistField.textContent = newArtist;
    play.className = 'fa fa-pause';
    minimizedCard.innerHTML = musicList[indx].innerHTML;
    minimizedTime = minimizedCard.lastElementChild.firstElementChild.nextElementSibling.nextElementSibling;
    clearInterval(timer);
    minutes = Math.floor(playlist[indx].duration / 60);
    seconds = Math.floor(playlist[indx].duration % 60);
    (seconds > 9) ? seconds = seconds: seconds = `0${seconds}`;
    duration = `${minutes}:${seconds}`;
    musicTimeEnd.textContent = duration;
}

function initialPlayControl(music, index) {
    artist = music.firstElementChild.nextElementSibling.firstChild.nextSibling.nextElementSibling.innerText;
    songName = music.firstElementChild.nextElementSibling.firstChild.textContent;
    songNameField.textContent = songName;
    artistField.textContent = artist;
    play.className = 'fa fa-pause';
    img.setAttribute('src', `images/image ${imgIndex[index]}.jpg`)
    audioSeeker.setAttribute('max', Math.floor(audios[index].duration));
    minutes = Math.floor(audios[index].duration / 60);
    seconds = Math.floor(audios[index].duration % 60);
    (seconds > 9) ? seconds = seconds: seconds = `0${seconds}`;
    duration = `${minutes}:${seconds}`;
    musicCard.style.display = 'block';
    minimizedCard.innerHTML = music.innerHTML;
    minimizedTime = minimizedCard.lastElementChild.firstElementChild.nextElementSibling.nextElementSibling;
    clearInterval(timer);
    num = 0;
    audioSeeker.value = 0;
    secondCount = 0;
    minuteCount = 0;
    musicTimeStart.textContent = `0:00`;
    musicTimeEnd.textContent = duration;
}