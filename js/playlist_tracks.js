let x = [];
let y = [];
let sounds = [];
let userTracks, trackFeatures, c;
let white = [];
let loud = [];
let raio = [];
let shakeX = [];
let shakeY = [];
let randomX, randomY;

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
        loud[i] = trackFeatures.audio_features[i].loudness;
        raio[i] = getRaioFromTrack(i);
    }

    for(let i = 0; i < Object.keys(userTracks).length; i++) {
        x[i] = getRaioFromTrack(i) + ((windowWidth - getRaioFromTrack(i)) / Object.keys(userTracks).length) * i;
        y[i] = windowHeight - getRaioFromTrack(i);
        white[i] = map(getAudioFeatures(i).valence, 0, 1, 0, 255);
        shakeX[i] = getAudioFeatures(i).energy * 5;
        shakeY[i] = getAudioFeatures(i).energy * 5;
    }
}

function draw() {
    background(0);
    noFill();

    for(let i = 0; i < Object.keys(userTracks).length; i++) {
        if(dist(mouseX, mouseY, x[i], y[i]) <= getRaioFromTrack(i)){
            c = color(255, 255, white[i]);
            randomX = random(-shakeX[i], shakeX[i]);
            randomY = random(-shakeY[i], shakeY[i]);
        } else {
            c = color(255);
            randomX = 0;
            randomY = 0;
        }

        stroke(c);
        ellipse(x[i] + randomX, y[i] + randomY, getRaioFromTrack(i) * 2, getRaioFromTrack(i) * 2);
        text(userTracks[i].name, x[i], y[i])
    }
}

function mousePressed() {
    for(let i = 0; i < Object.keys(userTracks).length; i++) {
        if(dist(mouseX, mouseY, x[i], y[i]) <= (getRaioFromTrack(i))){
            location.replace('solo_track.php?id=' + userTracks[i].id)
        }
    }
}

function mouseWheel(event) {
    print(event.delta);

    for(let i = 0; i < Object.keys(userTracks).length; i++) {

        y[i] = y[i] - event.delta;

        if(y[i] <= map(getAudioFeatures(i).loudness, min(loud), 0, getRaioFromTrack(i), windowHeight - getRaioFromTrack(i))) {
            y[i] = map(getAudioFeatures(i).loudness, min(loud), 0, getRaioFromTrack(i), windowHeight - getRaioFromTrack(i));
        }

        if(y[i] >= windowHeight - getRaioFromTrack(i)) {
            y[i] = windowHeight - getRaioFromTrack(i);
        }
    }
}

function getRaioFromTrack(index) {
    return userTracks[index].duration_ms / 4000;
}

function getAudioFeatures(index) {
    return trackFeatures.audio_features[index];
}