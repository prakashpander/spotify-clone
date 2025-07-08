let curentSong = new Audio();
curentSong.preload = "auto";
let iconChange = document.querySelector("#playbtn");
let currFolder;
let songs = [];

let login = document.getElementById("login");
let signup = document.getElementById("signup");

login.addEventListener("click", () => {
    window.location.href = "login_page.html";
});

signup.addEventListener("click", () => {
    window.location.href = "login_page.html";
});

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

async function getSong(folder) {
    const response = await fetch("songs.json");
    const allSongs = await response.json();
    currFolder = folder;
    return allSongs[folder] || [];
}

let playMusic = async (track, pause = false) => {
    try {
        curentSong.src = `songs/${currFolder}/${track}`;
        if (!pause) {
            curentSong.load();
            await curentSong.play();
            iconChange.classList.add("fa-circle-pause");
        }
        iconChange.classList.add("fa-circle-play");
        document.querySelector(".songName-info").innerHTML = track.replace(".mp3", "").replace(/%20/g, " ");
        document.querySelector(".songbar-time").innerHTML = "00:00/00:00";
    } catch (error) {
        console.log(error);
    }
}

function renderSongList(songList) {
    let songUl = document.querySelector(".song-list-ul");
    songUl.innerHTML = "";
    for (const song of songList) {
        songUl.innerHTML += `<li>
            <div class="song-list-desgin">
            <div class="music-icon"><i class="fa-solid fa-music"></i></div>
            <div class="info">
                <div>${song.replaceAll(/%20|\.mp3|\//g, " ")}</div>
                <div>Prakash</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <span><i class="fa-regular fa-circle-play"></i></span>
            </div>
            </div>
        </li>`;
    }

    Array.from(document.querySelector(".song-list-ul").getElementsByTagName("li")).forEach((li, i) => {
        li.addEventListener("click", () => playMusic(songList[i]));
    });
}

function renderSongItem(songName) {
    return `<li>
        <div class="song-list-desgin">
        <div class="music-icon"><i class="fa-solid fa-music"></i></div>
        <div class="info">
            <div>${songName.replaceAll(/%20|\.mp3|\//g, " ")}</div>
            <div>Prakash</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <span><i class="fa-regular fa-circle-play"></i></span>
        </div>
        </div>
    </li>`;
}

async function main() {
    songs = await getSong("cs1");
    playMusic(songs[0], true);
    renderSongList(songs);

    document.querySelectorAll(".card[data-folder]").forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.getAttribute("data-folder");
            songs = await getSong(folder);
            playMusic(songs[0], true);
            renderSongList(songs);
            document.querySelector(".cricle").style.left = "0%";
            document.querySelector(".fillbar").style.width = "0%";
            iconChange.classList.remove("fa-circle-pause");
            iconChange.classList.add("fa-circle-play");
            document.querySelector(".left").style.left = 0;
        });
    });

    iconChange.parentElement.addEventListener("click", async () => {
        if (curentSong.paused) {
            await curentSong.play();
            iconChange.classList.remove("fa-circle-play");
            iconChange.classList.add("fa-circle-pause");
        } else {
            curentSong.pause();
            iconChange.classList.remove("fa-circle-pause");
            iconChange.classList.add("fa-circle-play");
        }
    });

    curentSong.addEventListener("timeupdate", () => {
        let timeProgress = (curentSong.currentTime / curentSong.duration) * 100;
        document.querySelector(".songbar-time").innerHTML = `${formatTime(curentSong.currentTime)} / ${formatTime(curentSong.duration)}`;
        document.querySelector(".cricle").style.left = `${timeProgress}%`;
        document.querySelector(".fillbar").style.width = `${timeProgress}%`;
    });

    document.querySelector(".slidebar").addEventListener("click", e => {
        const slider = document.querySelector(".slidebar");
        const rect = slider.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percent = (offsetX / rect.width) * 100;
        curentSong.currentTime = (curentSong.duration * percent) / 100;
        document.querySelector(".cricle").style.left = `${percent}%`;
        document.querySelector(".fillbar").style.width = `${percent}%`;
    });

    document.addEventListener("click", e => {
        if (e.target.closest(".search-btn") && !document.querySelector(".search-input")) {
            document.querySelector(".search-btn").innerHTML = `<div class="search-container">
                <li class="top search-btn"><img src="./SVGS/search.svg" alt="home" class="img invert home-top">
                <input type="text" placeholder="Search song..." class="search-input"></li>
                <div class="search-cross-btn"><i class="fa-solid fa-xmark remove-search"></i></div>
            </div>`;
        }
    });

    document.addEventListener("click", e => {
        if (e.target.closest(".remove-search")) {
            document.querySelector(".search-btn").innerHTML = `<li class="top search-btn"><img src="./SVGS/search.svg" alt="home" class="img invert home-top"> Search</li>`;
            renderSongList(songs);
        }
    });

    document.addEventListener("keyup", e => {
        if (e.target.classList.contains("search-input")) {
            let value = e.target.value.trim().toLowerCase();
            let match = songs.find(song => song.toLowerCase().includes(value));
            let songUl = document.querySelector(".song-list-ul");
            songUl.innerHTML = match ? renderSongItem(match) : `<li>No match found</li>`;
            if (value === "") renderSongList(songs);
        }
    });

    document.querySelector(".backword").addEventListener("click", () => {
        curentSong.currentTime -= 10;
    });

    document.querySelector(".forword").addEventListener("click", () => {
        curentSong.currentTime += 10;
    });

    document.querySelector(".menu-btn").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    });

    document.querySelector(".cross-btn").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-200%";
    });

    document.querySelector(".previous").addEventListener("click", () => {
        curentSong.pause();
        let index = songs.indexOf(curentSong.src.split("/").pop());
        if (index > 0) playMusic(songs[index - 1]);
    });

    document.querySelector(".next-btn").addEventListener("click", () => {
        curentSong.pause();
        let index = songs.indexOf(curentSong.src.split("/").pop());
        if (index < songs.length - 1) playMusic(songs[index + 1]);
    });

    curentSong.addEventListener("ended", () => {
        curentSong.currentTime = 0;
    });
}

main();
