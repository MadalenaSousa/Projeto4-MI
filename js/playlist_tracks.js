let x = [];
let y = [];
let sounds = [];
let userTracks, trackFeatures;
let c;

function preload() {
    userTracks = loadJSON('php/userPlaylistTracks.json');
    trackFeatures = loadJSON('php/userTrackFeatures.json');

    for(let i = 0; i < Object.keys(sounds).length; i++) {
        sounds[i] = loadSound(userTracks[i].uri);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    for(let i = 0; i < Object.keys(userTracks).length; i++) {
        x[i] = random(windowWidth);
        y[i] = random(windowHeight);
    }

    c = color(255);

    console.log(sounds);
    console.log(trackFeatures);
}

function draw() {
    background(0);
    noFill();

    for(let i = 0; i < Object.keys(userTracks).length; i++) {
        if(dist(mouseX, mouseY, x[i], y[i]) <= (userTracks[i].duration_ms / 2000)){
            c = color(255, 255, 0);
        } else {
            c = color(255);
        }

        stroke(c);

        ellipse(x[i], y[i], userTracks[i].duration_ms / 1000, userTracks[i].duration_ms / 1000);
        text(userTracks[i].name, x[i], y[i]);
    }
}