const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const progressBar = $('.progress-bar');
const songCurrentTime = $('.currentTime');
const songDurationTime = $('.durationTime');
const volumeIcon = $('.volume-change');
const volumeBar = $('.volume');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMute: false,
    currentVolum: 0.0,

    songs: [
        {
            name: 'Waing For You',
            singer: 'Mono',
            path: 'assets/music/Waiting For You.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/share/2022/08/17/e/a/a/5/1660733423986.jpg',
        },
        {
            name: 'Như Những Phút Ban Đầu',
            singer: 'Hoài Lâm',
            path: 'assets/music/nhuphutbandau.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/covers/7/c/7c6be286dd1c9831e37a14eca4016975_1467343706.jpg',
        },

        {
            name: '3107(Cover)',
            singer: '3107',
            path: 'assets/music/3107-Cover-Music-30-365.mp3',
            image: 'https://lyricvn.com/wp-content/uploads/2020/03/61b35411029c6156973232016738c1b7.jpg',
        },
        {
            name: 'Theres No One At All',
            singer: 'Sơn Tùng MTP',
            path: 'assets/music/Theres-No-One-At-All-Son-Tung-M-TP.mp3',
            image: 'https://cdnmedia.thethaovanhoa.vn/Upload/XmJnTp3BYsa9r8REW2g/files/2022/04/son-tung-m-tp.JPG',
        },
        {
            name: 'Buông Đôi Tay Nhau Ra',
            singer: 'Sơn Tùng MTP',
            path: 'assets/music/Buong-Doi-Tay-Nhau-Ra-Son-Tung-M-TP.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/c/c0/Buongdoitaynhauramtp.jpg',
        },
        {
            name: 'We Dont Talk Anymore',
            singer: 'Charlie Puth',
            path: 'assets/music/We Don_t Talk Anymore - Charlie Puth_ Se.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/8/89/Wedonttalkanymore.jpg',
        },
        {
            name: 'Anh Đã Quen Với Cô Đơn',
            singer: 'Soobin Hoàng Sơn',
            path: 'assets/music/Anh-Da-Quen-Voi-Co-Don-Soobin-Hoang-Son.mp3',
            image: 'https://i.scdn.co/image/ab67616d0000b2732922307c16bb852a0849bea0',
        },
        {
            name: 'Lần Cuối',
            singer: 'Karik',
            path: 'assets/music/Lan-Cuoi-Karik.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2021/03/09/c/3/5/4/1615261605117.jpg',
        },
        {
            name: 'Say Do You',
            singer: 'Tiên Tiên',
            path: 'assets/music/Say-You-Do-Tien-Tien.mp3',
            image: 'https://imgt.taimienphi.vn/cf/Images/hi/2018/3/22/loi-bai-hat-say-you-do.jpg',
        },
        {
            name: 'Cơn Mưa Rào',
            singer: 'JSOL',
            path: 'assets/music/Con-Mua-Rao-JSOL.mp3',
            image: 'https://imgt.taimienphi.vn/cf/Images/hi/2018/6/22/loi-bai-hat-con-mua-rao.jpg',
        },
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('\n')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay, dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to, thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }

        // Xử lý khi play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song được pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(100 * audio.currentTime / audio.duration)
                progress.value = progressPercent
                songCurrentTime.textContent = _this.timeFormat(this.currentTime)
                songDurationTime.textContent = _this.timeFormat(this.duration)
            }
        }

        // Xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý bật tắt random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lyys lặp lại 1 song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.onclick()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) { //target vào thẻ song ko có class active và ko phải thẻ option
                // Xử  lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử  lý khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }

        //Volume
        volumeIcon.onclick = function(){
            _this.isMute = !_this.isMute;
            volumeIcon.classList.toggle('active', _this.isMute)
            if(_this.isMute){
                _this.currentVolum = audio.volume
                audio.volume = 0;
                volumeBar.value = 0
            } else {
                volumeBar.value = _this.currentVolum 
                audio.volume = _this.currentVolum
            }
        }

        volumeBar.onchange = function(e) {
            _this.currentVolum = e.target.value /100
            audio.volume = _this.currentVolum
            audio.play()
            if(audio.volume === 0){
                volumeIcon.classList.add('active')
            }else{
                _this.isMute = false;
                volumeIcon.classList.remove('active')
            }
        }
    },

    scrollToActiveSong: function () {
        if (this.currentIndex == 0 || this.currentIndex == 1) {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }, 500)
        } else {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 500)
        }
    },

    loadCurrentSong: function () {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    timeFormat: function(seconds) {
        const date = new Date(null)
        date.setSeconds(seconds)
        return date.toISOString().slice(14, 19)
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex)

        this.currentIndex = newIndex

        this.loadCurrentSong()
    },

    start: function () {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải bài hát đầu tiên
        this.loadCurrentSong()

        //Render playlist
        this.render()
    }
}

app.start()
