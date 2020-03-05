let x, y;
let sounds = [];
let userPlaylistTracks, userPlaylists;
let cor=255;

function preload() {
    userPlaylistTracks = loadJSON('php/userPlaylistTracks.json');
    //userPlaylists=loadJSON('php/userPlaylists.json');

    for(let i = 0; i < sounds.length; i++) {
        sounds[i] = loadSound(userPlaylistTracks[i].uri);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(userPlaylistTracks);
    console.log(sounds);

    background(0);
    fill(255); //preenchimento das letras

    textSize(72);
    text('MY PLAYLISTS', 100, 100);

    noFill();
    for(let i = 0; i < Object.keys(userPlaylistTracks).length; i++) {
        stroke(cor,255,255);
        cor=cor-30;
        rectMode(CENTER)
        rect(windowWidth/2, windowHeight/2, userPlaylistTracks[i].popularity*3, userPlaylistTracks[i].popularity*3);

    }
}

function draw() {

}