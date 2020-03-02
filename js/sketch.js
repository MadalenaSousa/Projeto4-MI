let x, y;
let duration;
let userTracks;

function preload() {
    userTracks = loadJSON('userPlaylistTracks.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(userTracks);
    console.log(Object.keys(userTracks).length);
}

function draw() {
    background(0);
    fill(255);

    textSize(48);
    text('DURAÇÃO VS AMPLITUDE', 100, 100);

    noFill();
    stroke(255);
    for(let i = 0; i < Object.keys(userTracks).length; i++) {
        ellipse(windowWidth/2, windowHeight/2, userTracks[i].duration_ms / 1000, userTracks[i].duration_ms / 1000);
    }
}