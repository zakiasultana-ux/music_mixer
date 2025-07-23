console.log("Music Mixer Edit - Main JS Loaded");

// varibles 

const dragbtn = document.querySelectorAll(".dragbtn");
const targetZones = document.querySelectorAll(".target-zone");
const dragbox = document.querySelector("#soundDex");
const resetBtn = document.querySelector("#reset-btn");
const playbtn = document.querySelector('#play-btn');
const pausebtn = document.querySelector('#pause-btn');
const rewindbtn = document.querySelector('#rewind-btn');
const stopbtn = document.querySelector('#stop-btn');
const forwardbtn = document.querySelector('#forward-btn');
const vol = document.querySelector('#volumeControl');
const audioel = document.querySelectorAll('audio');

let currentDraggedElement = null;
let activeAudio = [];
let volumeLevel = 0.8;

// functions

function dragStart() {
    console.log("Drag Start Called");
    currentDraggedElement = this;
    console.log(currentDraggedElement);
}

function dragOver(event) {
    console.log("Drag Over Called");
    event.preventDefault();
}

function drop(event) {
    console.log("Drop Called");
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
    dragbtn.forEach(btn => {
        document.body.appendChild(btn);
        if (btn) {
            dragbox.appendChild(btn);
        }
    });
    currentDraggedElement = null;
}

function dragEnter(event) {
    event.preventDefault();
    this.classList.add("highlight");
}

function dragLeave() {
    this.classList.remove("highlight");
}

function playAudio() { 
    console.log("Play Audio Called");
    playbtn.style.display = "none";
    pausebtn.style.display = "block";

    activeAudio = [];

    targetZones.forEach(zone => {
        const btn = zone.querySelector(".dragbtn");
        if (btn) {
            const soundId = btn.dataset.sound;
            activeAudio.push(soundId);
            console.log(activeAudio);
            const audio = document.querySelector(`audio[data-sound="${soundId}"]`);
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
        }
    });

}

function pauseAudio() { 
    console.log("Pause Audio Called");
    activeAudio.forEach(soundId => {
        const audio = document.querySelector(`audio[data-sound="${soundId}"]`);
        if (audio) audio.pause();
    }); 
    playbtn.style.display = "block";
    pausebtn.style.display = "none";
}

function stopAudio() {
    console.log("Stop Audio Called");
    activeAudio.forEach(soundId => {
        const audio = document.querySelector(`audio[data-sound="${soundId}"]`);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    playbtn.style.display = "block";
    pausebtn.style.display = "none";
}

function rewindAudio() { 
    console.log("Rewind Audio Called");
     activeAudio.forEach(soundId => {
        const audio = document.querySelector(`audio[data-sound="${soundId}"]`);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }); 
}

function forwardAudio() {
    console.log("Forward Audio Called");
    activeAudio.forEach(soundId => {
        const audio = document.querySelector(`audio[data-sound="${soundId}"]`);
        if (audio) {
            audio.currentTime += 5;
            if (audio.currentTime >= audio.duration) {
                audio.currentTime = 0;
            }
        }
    });
}

function setVolume() {
    console.log("Set Volume Called");
    volumeLevel = (this.value/100); 
    activeAudio.forEach(soundId => {
        const audio = document.querySelector(`audio[data-sound="${soundId}"]`);
        if (audio) {
            audio.volume = volumeLevel;
        }
    });
}

// Event Listeners

dragbtn.forEach(btn => {
    btn.addEventListener("dragstart", dragStart);
});

targetZones.forEach(target => {
    target.addEventListener("dragover", dragOver);
    target.addEventListener("drop", drop);
    target.addEventListener("dragenter", dragEnter);
    target.addEventListener("dragleave", dragLeave);
});

resetBtn.addEventListener("click", resetGame);
playbtn.addEventListener('click', playAudio);
stopbtn.addEventListener('click', stopAudio);
rewindbtn.addEventListener('click', rewindAudio);
pausebtn.addEventListener('click', pauseAudio);
forwardbtn.addEventListener('click', forwardAudio);
vol.addEventListener('change', setVolume);