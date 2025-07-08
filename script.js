let curentSong = new Audio;
curentSong.preload = "auto";
let iconChange = document.querySelector("#playbtn");
let currFolder;
let songs = [];
let currentSongIndex = 0;


let login = document.getElementById("login");
let signup = document.getElementById("signup");

login?.addEventListener("click", () => {
    window.location.href = "login_page.html";
});

signup?.addEventListener("click", () => {
    window.location.href = "login_page.html";
});

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

async function getSong(folder) {
    try {
        const response = await fetch("songs.json");
        const allSongs = await response.json();

        if (!allSongs[folder]) {
            console.warn(`Folder "${folder}" not found in songs.json`);
            return [];
        }

        currFolder = `songs/${folder}/`;
        return allSongs[folder];

    } catch (error) {
        console.error("Error loading songs:", error);
        return [];
    }
}

let playMusic = async (track, pause = false) => {
    try {
        if (!track) {
            console.warn("No track to play.");
            return;
        }

        curentSong.src = `${currFolder}${track}`;
        currentSongIndex = songs.indexOf(track);

        if (!pause) {
            curentSong.preload = "auto";
            curentSong.load();
            await curentSong.play();
            iconChange.classList.remove("fa-circle-play");
            iconChange.classList.add("fa-circle-pause");
        }

        document.querySelector(".songName-info").innerHTML = track.replace(".mp3", "").replace(/%20/g, " ");
        document.querySelector(".songbar-time").innerHTML = "00:00/00:00";

    } catch (error) {
        console.log(error);
    }
}

function renderSongList(songs) {
    let songUl = document.querySelector(".song-list-ul");
    songUl.innerHTML = "";

    if (songs.length === 0) {
        songUl.innerHTML = `<li style="text-align: center;">No songs found in this folder</li>`;
        return;
    }

    for (const song of songs) {
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

    Array.from(songUl.getElementsByTagName("li")).forEach((li, e) => {
        li.addEventListener("click", () => {
            currentSongIndex = e;
            playMusic(songs[e]);
        });
    });
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
            document.querySelector(".left").style.left = "0";
        });
    });

    iconChange.parentElement.addEventListener("click", async () => {
        if (curentSong.paused) {
            curentSong.preload = "auto";
            await curentSong.play();
            iconChange.classList.remove("fa-circle-play");
            iconChange.classList.add("fa-circle-pause");
        } else {
            curentSong.pause();
            iconChange.classList.remove("fa-circle-pause");
            iconChange.classList.add("fa-circle-play");
        }
    });

    document.addEventListener("click", (e) => {
                if (e.target.closest(".search-btn") && !document.querySelector(".search-input")) {
                        document.querySelector(".search-btn").innerHTML = `<div class="search-container">
                        <li class="top search-btn"><img src="./SVGS/search.svg" alt="home" class="img invert home-top">
                        <input type="text" placeholder="Search song..." class="search-input"></li>
                        <div class="search-cross-btn"><i class="fa-solid fa-xmark remove-search"></i></div>
                        </div>`
                }
        });

        function renderSongItem(songName) {
                let songli = document.querySelector(".song-list-ul");
                songli.innerHTML = "";
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
                                </li>`
        }

        document.addEventListener("click", (e) => {
                if (e.target.closest(".remove-search")) {
                        let searchBtn = document.querySelector(".search-btn");
                        searchBtn.innerHTML = ` <li class="top search-btn"><img src="./SVGS/search.svg" alt="home" class="img invert home-top">
                         Search</li>`

                        let songli = document.querySelector(".song-list-ul");
                        songli.innerHTML = songs.map(song => {
                                return renderSongItem(song);
                                }).join('');

                }
        });


        document.addEventListener("keyup", (e) => {
                if (e.target.classList.contains("search-input")) {
                        let value = e.target.value.trim().toLowerCase();
                        let match = songs.find(song => song.trim().toLowerCase().includes(value))
                        let songli = document.querySelector(".song-list-ul");

                        if (match) {
                                songli.innerHTML = renderSongItem(match);
                        }
                        else {
                                songli.innerHTML = match ? renderSongItem(match) : `<li> Please Search in another folder </li>`;
                        }
                        if (value === '') {
                                songli.innerHTML = songs.map(song => {
                                return renderSongItem(song);
                                }).join('');
                                return;
                        }
                }
        });

    

    curentSong.addEventListener("timeupdate", () => {
        let timeProgress = (curentSong.currentTime / curentSong.duration) * 100;
        document.querySelector(".songbar-time").innerHTML = `${formatTime(curentSong.currentTime)} / ${formatTime(curentSong.duration)}`;
        document.querySelector(".cricle").style.left = timeProgress + "%";
        document.querySelector(".fillbar").style.width = `${timeProgress}%`;
    });

    document.querySelector(".slidebar").addEventListener("click", e => {
        const slider = document.querySelector(".slidebar");
        const rect = slider.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percent = (offsetX / rect.width) * 100;
        curentSong.currentTime = ((curentSong.duration) * percent) / 100;
        document.querySelector(".cricle").style.left = percent + "%";
        document.querySelector(".fillbar").style.width = percent + "%";
    });

    document.querySelector(".menu-btn").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".cross-btn").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-200%";
    });

    document.querySelector(".backword").addEventListener("click", () => {
        curentSong.currentTime -= 10;
    });

    document.querySelector(".forword").addEventListener("click", () => {
        curentSong.currentTime += 10;
    });

   document.querySelector(".next-btn").addEventListener("click", () => {
    curentSong.pause();
    if ((currentSongIndex + 1) < songs.length) {
        currentSongIndex += 1;
        playMusic(songs[currentSongIndex]);
    }
});

document.querySelector(".previous").addEventListener("click", () => {
    curentSong.pause();
    if ((currentSongIndex - 1) >= 0) {
        currentSongIndex -= 1;
        playMusic(songs[currentSongIndex]);
    }
});


}

main();
