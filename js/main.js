console.log("welcome to the world of javascript");

//variables

const labels = document.querySelectorAll(".draggable-sound");
const targetZones = document.querySelectorAll(".slot");
const resetBtn = document.querySelector("#resetSequenceBtn");
const playBtn = document.querySelector("#playSequenceBtn");
const pauseBtn = document.querySelector("#pauseSequenceBtn");
const stopBtn = document.querySelector("#stopSequenceBtn");
const rewindBtn = document.querySelector("#rewindSequenceBtn");
const ffBtn = document.querySelector("#fastForwardSequenceBtn");
const labelBox = document.querySelector("#soundDex");
const volumeSlider = document.querySelector("#masterVolume");

let currentDraggedElement = null;
let activeAudio = [];// Array to keep track of active audio elements
let currentSoundIndex = 0;
let isPlayingSequence = false;
let globalVolume = 0.8; // default starting volume

// functions 

function dragStart() {
    console.log("Drag Start Called");
    currentDraggedElement = this;
}

function dragOver(event) {
    event.preventDefault();
}

function dragEnter(event) {
    event.preventDefault();
    this.classList.add("highlight");
}

function dragLeave() {
    this.classList.remove("highlight");
}

function drop(event) {
    event.preventDefault();
    this.classList.remove("highlight");

    if (this.children.length > 0) {
        console.log("This drop zone already has a label.");
        return;
    }
    this.appendChild(currentDraggedElement);
    currentDraggedElement = null;
}

function resetGame() {
    console.log("Reset Game Called");
    
    targetZones.forEach(zone => {
        while (zone.firstChild) {
            zone.removeChild(zone.firstChild);
        }
    });

    labels.forEach(label => {
        if (label) {
            labelBox.appendChild(label);
        }
    });

    currentDraggedElement = null;
    stopSequence();
}

function playSequence() {
    console.log("Play Sequence Called");

    // Toggle buttons
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";

    // Reset before starting
    activeAudio = [];
    currentSoundIndex = 0;
    isPlayingSequence = true;

    // Loop through each drop zone
    targetZones.forEach(zone => {
        const label = zone.querySelector(".draggable-sound");
        if (label) {
            const instrument = label.dataset.instrument;
            const audio = new Audio(`audio/${instrument}.mp3`);
            audio.volume = globalVolume;
            activeAudio.push(audio);
        }
    });

    // Start sequence if any sounds available
    if (activeAudio.length > 0) {
        playNextSound();
    }
}


function pauseSequence() {
    console.log("Pause Sequence Called");

    if (!isPlayingSequence) return;

    const currentAudio = activeAudio[currentSoundIndex];
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();

        // Toggle buttons
        pauseBtn.style.display = "none";
        playBtn.style.display = "inline-block";
    }
}

function playNextSound() {
    if (!isPlayingSequence || currentSoundIndex >= activeAudio.length) {
        isPlayingSequence = false;
        return;
    }

    const currentAudio = activeAudio[currentSoundIndex];
    currentAudio.volume = globalVolume; // Ensure volume is set
    currentAudio.play();

    // When finished, play next
    currentAudio.onended = () => {
        currentSoundIndex++;
        playNextSound();
    };
}

function stopSequence() {
    console.log("Stop Sequence Called");

    activeAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    activeAudio = []; // Clear after stopping
    currentSoundIndex = 0;
    isPlayingSequence = false;

    playBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
}

function fastForwardSequence() {
    console.log("Fast Forward Called");

    if (!isPlayingSequence) return;

    const currentAudio = activeAudio[currentSoundIndex];
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentSoundIndex++;
    playNextSound();
}

function rewindSequence() {
    console.log("Rewind Called");

    previousAudio.volume = globalVolume;

    if (!isPlayingSequence || currentSoundIndex <= 0) {
        console.log("No previous sound to rewind to.");
        return;
    }

    // Stop current sound
    const currentAudio = activeAudio[currentSoundIndex];
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // Step back one index
    currentSoundIndex--;

    // Play the previous one again
    const previousAudio = activeAudio[currentSoundIndex];
    if (previousAudio) {
        previousAudio.volume = globalVolume; // Ensure volume is set
        previousAudio.play();
        previousAudio.onended = () => {
            currentSoundIndex++;
            playNextSound();
        };
    }
}

function volumecontrol() {
    console.log("Volume Control Called");
    globalVolume = parseFloat(volumeSlider.value);
    console.log("Volume set to:", globalVolume);

    // Update volume of any currently playing sounds
    activeAudio.forEach(audio => {
        audio.volume = globalVolume;
    });
}

//Event listeners

labels.forEach(label => {
    label.addEventListener("dragstart", dragStart);
});

targetZones.forEach(target => {
    target.addEventListener("dragover", dragOver);
    target.addEventListener("dragenter", dragEnter);
    target.addEventListener("dragleave", dragLeave);
    target.addEventListener("drop", drop);
});

resetBtn.addEventListener("click", resetGame);

playBtn.addEventListener("click", playSequence);

stopBtn.addEventListener("click", stopSequence);

ffBtn.addEventListener("click", fastForwardSequence);

rewindBtn.addEventListener("click", rewindSequence);

volumeSlider.addEventListener("input", volumecontrol);

pauseBtn.addEventListener("click", pauseSequence);