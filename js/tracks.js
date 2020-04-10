let x = [];
let y = [];
let sounds = [];
let playlistSongs, topSongs, songs, c, totalSongs;
let white = [];
let loud = [];
let raio = [];
let shakeX = [];
let shakeY = [];
let randomX, randomY;
let fromPlaylist = false;

/*const client = new DeepstreamClient('localhost:6020');
client.login();

const record = client.record.getRecord('some-name');

const input = document.querySelector('input');

input.onkeyup = (function() {
    record.set('firstname', input.value)
});

record.subscribe('firstname', function(value) {
    input.value = value
});*/

function preload() {
    playlistSongs = loadJSON('php/playlist-songs-object.json');
    topSongs = loadJSON('php/top-songs-object.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    songs = topSongs;
    totalSongs = Object.keys(songs).length;


    for (let i = 0; i < totalSongs; i++) {
        loud[i] = getAudioFeatures(i).loudness;
        raio[i] = getRaioFromTrack(i);
    }

    for (let i = 0; i < totalSongs; i++) {
        x[i] = getRaioFromTrack(i) + ((windowWidth - getRaioFromTrack(i)) / songs.length) * i;
        y[i] = windowHeight - getRaioFromTrack(i);
        white[i] = map(getAudioFeatures(i).positivity, 0, 1, 0, 255);
        shakeX[i] = getAudioFeatures(i).energy * 5;
        shakeY[i] = getAudioFeatures(i).energy * 5;
    }
}

function draw() {
    background(0);

    fill(255);
    for(let i; i < totalSongs; i++) {
        ellipse(random(width), random(height), 50, 50)
    }


    if(fromPlaylist) {
        songs = playlistSongs;
    } else {
        songs = topSongs;
    }

    for(let i = 0; i < totalSongs; i++) {
        if(dist(mouseX, mouseY, x[i], y[i]) <= getRaioFromTrack(i)){
            c = color(255, 255, white[i]);
            randomX = random(-shakeX[i], shakeX[i]);
            randomY = random(-shakeY[i], shakeY[i]);
        } else {
            c = color(255);
            randomX = 0;
            randomY = 0;
        }

        //stroke(c);
        stroke(255);
        noFill();
        ellipse(x[i] + randomX, y[i] + randomY, getRaioFromTrack(i) * 2, getRaioFromTrack(i) * 2);
        //line(x[i], windowHeight, x[i], 0);

        noStroke();
        fill(255);
        text(songs[i].name, x[i], y[i])
    }
}

function mouseWheel(event) {
    print(event.delta);

    for(let i = 0; i < totalSongs; i++) {

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
    return songs[index].audio_features.duration_ms / 4000;
}

function getAudioFeatures(index) {
    return songs[index].audio_features;
}