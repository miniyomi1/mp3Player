function doFirst() {
    
    // const $ = document.querySelector.bind(document);
    let playbtn = document.getElementById('playButton');
    let songloop = document.getElementById('songloop');
    let previews = document.getElementById('previews');
    let next = document.getElementById('next');
    let songchange = document.getElementById('songchange');
    let defaultBar = document.getElementById('defaultBar');
    let progressBar = document.getElementById('progressBar');
    let defaultVoice = document.getElementById('defaultVoice');
    let voiceBar = document.getElementById('voiceBar');
    let songName = document.querySelector('.songName');
    let singer = document.querySelector('.singer');
    let mySong = new Audio();
    let album ={
        singer:'A singer',
        allsong: [{ name: 'Marigold',src: 'song/Marigold.mp3'},
            { name: 'Prelude No 18', src: 'song/Prelude_No_18.mp3'},
            { name: 'Natural', src:'song/Natural.mp3'},
            { name: 'Atlantean Twilight', src:'song/Atlantean_Twilight.mp3'},
            { name: 'Soul_Groove', src:'song/Soul_Groove.mp3' }]
        };
    let currentSong = 0;
    let repeatTypes = 0;
    let randomTypes = 0;
    mySong.src = album.allsong[currentSong].src;
    songName.innerText = album.allsong[currentSong].name;
    singer.innerText= album.singer;
    barsize = parseInt(window.getComputedStyle(defaultBar).width);
    voicesize = parseInt(window.getComputedStyle(defaultVoice).width);

    playbtn.addEventListener('click', playOrPause, false);
    progressBar.addEventListener('click', playOrPause, false);
    defaultBar.addEventListener('click', clickedBar, false);
    defaultVoice.addEventListener('click', clickVoice, false);
    previews.addEventListener('click',preSong,false);
    next.addEventListener('click',nextSong,false);
    songloop.addEventListener('click', loopAllSong,false);
    songchange.addEventListener('click',randomSong,false)


    //開始與暫停
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
    
    //更新進度及各種狀態播放
    function update() {
        if (!mySong.ended) {
            let size = barsize / mySong.duration * mySong.currentTime;
            progressBar.style.width = size + 'px';//播放進度條
        } else {
            progressBar.style.width = '0px';

            switch (repeatTypes) {
                case 0:
                    if (randomTypes === 1){
                        currentSong = Math.floor(Math.random() * album.allsong.length);
                        console.log(currentSong);
                        songName.innerText = album.allsong[currentSong].name;
                        mySong.src = album.allsong[currentSong].src;
                        playButton.style.backgroundImage = 'url(img/icon/pause.svg)';
                        mySong.play();

                    }else{
                        playButton.style.backgroundImage = 'url(img/icon/play.svg)';
                        clearInterval(upbar);
                    }
                    break;

                case 1:
                    mySong.loop = true;
                    break;
                case 2:
                    if (currentSong>album.allsong.length){
                        currentSong=0;
                        songName.innerText = album.allsong[currentSong].name;
                        mySong.src = album.allsong[currentSong].src;
                        playButton.style.backgroundImage = 'url(img/icon/pause.svg)';
                        mySong.play();
                    }else{
                        currentSong++;
                        songName.innerText = album.allsong[currentSong].name;
                        mySong.src = album.allsong[currentSong].src;
                        playButton.style.backgroundImage = 'url(img/icon/pause.svg)';
                        mySong.play();
                    }
                    break;
            }
            
        }
    };

    //歌曲總時間
    //直接抓取mySong.duration 會得到NaN 透過onloadedmetadata事件才抓取的到
    mySong.onloadedmetadata = function () {
        let min = Math.floor(mySong.duration / 60);
        let sec = Math.floor(mySong.duration) - (min * 60);
        songTime.innerText = min + ':' + (sec < 10 ? '0' + sec : sec);
    };

    //更新歌曲目前時間
    function upTime(){
        let nowSec = Math.floor(mySong.currentTime) % 60;
        let nowMin = Math.floor((mySong.currentTime) / 60);
        nowTime.innerText = nowMin + (nowSec < 10 ? ':0' + nowSec : ':' + nowSec); 
        if (mySong.paused){
            clearInterval(timer);
        }
    }

    //前一首歌曲
    function preSong(){
        if(currentSong<=0){
            currentSong=0;
        }else{
            currentSong--;
        }
        songName.innerText = album.allsong[currentSong].name;
        mySong.src = album.allsong[currentSong].src;
        mySong.play();
        playButton.style.backgroundImage ='url(img/icon/pause.svg)';
        setInterval(update, 1000);
          
    };
    //下一首歌曲
    function nextSong() {
        if (currentSong >= (album.allsong.length-1)) {
            currentSong = album.allsong.length-1;
        } else {
            currentSong++;
        }
        songName.innerText = album.allsong[currentSong].name;
        mySong.src = album.allsong[currentSong].src;
        mySong.play();
        playButton.style.backgroundImage = 'url(img/icon/pause.svg)';
        setInterval(update, 1000);
        
    };

    //點擊進度條更新進度條長度
    function clickedBar(e) {
        let mouseX = e.clientX - defaultBar.offsetLeft;
        let newTime = mouseX / (barsize / mySong.duration);
        mySong.currentTime = newTime;
        progressBar.style.width = mouseX + 'px';
    }

    //音量控制
    function clickVoice(e) {
        let voiceX = e.clientX - defaultVoice.offsetLeft;
        let newVoice = voiceX / voicesize;
        mySong.volume = newVoice;
        voiceBar.style.width = voiceX + 'px';
    }
    //單曲循環 全部循環(狀態)
    function loopAllSong(){
        switch (repeatTypes) {
            case 0:
                mySong.loop = true;
                songloop.style.backgroundImage = 'url(img/icon/radom-1-active.svg)';
                repeatTypes = 1;
                randomTypes = 0;
                songchange.style.backgroundImage = 'url(img/icon/s.svg)';
                break;
            
            case 1:
                mySong.loop = false;
                songloop.style.backgroundImage = 'url(img/icon/radom-active.svg)';
                repeatTypes = 2;
                randomTypes = 0;
                songchange.style.backgroundImage = 'url(img/icon/s.svg)';
                break;

            case 2:
                mySong.loop = false;
                songloop.style.backgroundImage = 'url(img/icon/radom.svg)';
                repeatTypes = 0;
                break;
        }
    }
    //隨機循環狀態
    function randomSong(){
        switch (randomTypes) {
            case 0:
                songchange.style.backgroundImage = 'url(img/icon/s-active.svg)';
                randomTypes = 1;
                repeatTypes = 0;
                songloop.style.backgroundImage = 'url(img/icon/radom.svg)';
                break;

            case 1:
                songchange.style.backgroundImage = 'url(img/icon/s.svg)';
                randomTypes = 0;
                break;
        }
    }

};
window.addEventListener('load', doFirst, false);
