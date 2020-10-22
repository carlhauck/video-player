// Get our elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const fullScreen = player.querySelector(".fullscreen");
const ranges = player.querySelectorAll(".player__slider");
const voiceButton = player.querySelector(".voice-button");

// Speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "en-US";

// Build our functions
function enableVoice() {
  //   recognition = new SpeechRecognition();
  //   recognition.interimResults = true;
  //   recognition.lang = "en-US";
}

function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function skipVoice(seconds) {
  video.currentTime += parseFloat(seconds);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function openFullscreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    /* Firefox */
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    /* IE/Edge */
    video.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozRequestFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

recognition.addEventListener("result", (e) => {
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");

  if (e.results[0].isFinal) {
    console.log(transcript);
    if (transcript.includes("play")) {
      video.play();
    } else if (transcript.includes("pause")) {
      video.pause();
    } else if (transcript.includes("exit")) {
      exitFullscreen();
    } else if (transcript.includes("full screen")) {
      openFullscreen();
    } else if (transcript.includes("skip ahead")) {
      skipVoice(25);
    } else if (transcript.includes("skip back")) {
      skipVoice(-10);
    }
  }
});

// Hook up event listeners
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);

toggle.addEventListener("click", togglePlay);
skipButtons.forEach((button) => button.addEventListener("click", skip));
fullScreen.addEventListener("click", openFullscreen);
voiceButton.addEventListener("click", enableVoice);

ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) => range.addEventListener("mousemove", handleRangeUpdate));

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

// Speech Recognition
recognition.addEventListener("end", recognition.start);
recognition.start();
