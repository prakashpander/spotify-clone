let curentSong = new Audio;
curentSong.preload = "auto";
let iconChange = document.querySelector("#playbtn");
let currFolder;

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
      playMusic(songs[e]);
    });
  });
}

async function main() {
  let songs = await getSong("cs1");
  playMusic(songs[0], true);
  renderSongList(songs);

  document.querySelectorAll(".card[data-folder]").forEach(card => {
    card.addEventListener("click", async () => {
      let folder = card.getAttribute("data-folder");
      let songs = await getSong(folder);
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

  document.querySelector(".previous").addEventListener("click", () => {
    curentSong.pause();
    let index = songs.indexOf(curentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  document.querySelector(".next-btn").addEventListener("click", () => {
    curentSong.pause();
    let index = songs.indexOf(curentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
}

main();
