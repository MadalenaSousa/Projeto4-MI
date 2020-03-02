let x, y;
let sounds = [];
let userTracks;

function preload() {
    userTracks = loadJSON('userPlaylistTracks.json');

    for(let i = 0; i < sounds.length; i++) {
        sounds[i] = loadSound(userTracks[i].uri);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(userTracks);
    console.log(sounds);
}

function draw() {
    background(0);
    fill(255);

    textSize(72);
    text('DURAÇÃO VS AMPLITUDE', 100, 100);

    noFill();
    stroke(255);
    for(let i = 0; i < Object.keys(userTracks).length; i++) {
        ellipse(windowWidth/2, windowHeight/2, userTracks[i].duration_ms / 1000, userTracks[i].duration_ms / 1000);
    }
}