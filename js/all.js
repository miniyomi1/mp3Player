function doFirst() {
    // const $ = document.querySelector.bind(document);
    // const $$ = document.querySelectorAll.bind(document);

    let playbtn = document.getElementById('playButton');
    let songloop = document.getElementById('songloop');
    let previews = document.getElementById('previews');
    let next = document.getElementById('next');
    let defaultBar = document.getElementById('defaultBar');
    let progressBar = document.getElementById('progressBar');
    let defaultVoice = document.getElementById('defaultVoice');
    let voiceBar = document.getElementById('voiceBar');
    let voiceCicle = document.getElementById('voiceCicle');

    let mySong = new Audio();
    let album ={
        singer:'123',
        allsong: ['song/Marigold.mp3',
            'song/Prelude_No_18.mp3',
            'song/Natural.mp3',
            'song/Atlantean_Twilight.mp3',
            'song/Soul_Groove.mp3']
    }
    console.log(album.allsong[0]);
    let songs = ['song/Marigold.mp3', 
                 'song/Prelude_No_18.mp3',
                 'song/Natural.mp3',
                 'song/Atlantean_Twilight.mp3',
                 'song/Soul_Groove.mp3'];
    let currentSong = 0;
    mySong.src = songs[currentSong];

    barsize = parseInt(window.getComputedStyle(defaultBar).width);
    voicesize = parseInt(window.getComputedStyle(defaultVoice).width);

    //事件聆聽
    playbtn.addEventListener('click', playOrPause, false);
    progressBar.addEventListener('click', playOrPause, false);
    defaultBar.addEventListener('click', clickedBar, false);
    defaultVoice.addEventListener('click', clickVoice, false);
    previews.addEventListener('click',preSong,false);
    next.addEventListener('click',nextSong,false);
    songloop.addEventListener('click',loopSong,false);

    function playOrPause() {
        if (!mySong.paused) {
            mySong.pause();
            playButton.style.backgroundImage = 'url(img/icon/play.svg)';
        } else {
            mySong.play();
            playButton.style.backgroundImage = 'url(img/icon/pause.svg)';
            upbar = setInterval(update, 1000); 
            timer = setInterval(upTime, 1000);           
        }
    };
    

    function update() {
        if (!mySong.ended) {
            let size = barsize / mySong.duration * mySong.currentTime;
            progressBar.style.width = size + 'px';//播放進度條
        } else {
            progressBar.style.width = '0px';
            playButton.style.backgroundImage = 'url(img/icon/play.svg)';
            clearInterval(upbar);
        }
    };

    //直接抓取mySong.duration 會得到NaN 要透過onloadedmetadata事件才抓取的到
    mySong.onloadedmetadata = function () {
        console.log(mySong.duration)
        let min = Math.floor(mySong.duration / 60);
        let sec = Math.floor(mySong.duration) - (min * 60);
        songTime.innerText = min + ':' + (sec < 10 ? '0' + sec : sec);
    };

    function upTime(){
        console.log(mySong.currentTime);
        let nowSec = Math.floor(mySong.currentTime) % 60;
        let nowMin = Math.floor((mySong.currentTime) / 60);
        nowTime.innerText = nowMin + (nowSec < 10 ? ':0' + nowSec : ':' + nowSec); 
        console.log(nowMin);
        if (mySong.paused){
            clearInterval(timer);
        }
    }

    function preSong(){
        if(currentSong<=0){
            currentSong=0;
        }else{
            currentSong--;
        }
        mySong.src = songs[currentSong];
        mySong.play();
        playButton.style.backgroundImage ='url(img/icon/pause.svg)';
        setInterval(update, 1000);
          
    };

    function nextSong() {
        if (currentSong >= (songs.length-1)) {
            currentSong = songs.length-1;
        } else {
            currentSong++;
        }
        mySong.src = songs[currentSong];
        mySong.play();
        playButton.style.backgroundImage = 'url(img/icon/pause.svg)';
        setInterval(update, 1000);
        
    };

    function clickedBar(e) {
        let mouseX = e.clientX - defaultBar.offsetLeft;
        let newTime = mouseX / (barsize / mySong.duration);
        mySong.currentTime = newTime;
        progressBar.style.width = mouseX + 'px';

    }

    function clickVoice(e) {
        let voiceX = e.clientX - defaultVoice.offsetLeft;
        let newVoice = voiceX / voicesize;
        mySong.volume = newVoice;
        voiceBar.style.width = voiceX + 'px';
        voiceCicle.style.left = voiceX + 'px';

    }
    
    function loopSong(){
        mySong.loop='loop';
    }

};
window.addEventListener('load', doFirst, false);