let x, y;
let sounds = [];
let userPlaylistTracks, userPlaylist, userArtist;
//let cor=255;
let media;
let sum=0;

function preload() {
    userPlaylistTracks = loadJSON('php/userPlaylistTracks.json');
    userPlaylist=loadJSON('php/userPlaylist.json');
    userArtist=loadJSON('php/userArtist.json');

    for(let i = 0; i < sounds.length; i++) {
        sounds[i] = loadSound(userPlaylistTracks[i].uri);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(userPlaylistTracks);
    console.log(userPlaylist);
    console.log(userArtist);
    console.log(sounds);

    background(0);
    fill(255); //preenchimento das letras

    textSize(72);
    text('MY PLAYLISTS', 100, 100);

    noFill();
    text(Object.keys(userPlaylist).length, 100, 200);
    for(let i = 0; i < Object.keys(userPlaylist).length; i++) {

        //text(Object.keys(userPlaylist), 100, 200);

        //stroke(cor,255,255);
        //cor=cor-30;
        stroke(255);
        rectMode(CENTER)
        rect(windowWidth/2, windowHeight/2, Object.keys(userPlaylistTracks).length*3, Object.keys(userPlaylistTracks).length*3);

    }
}

function draw() {

}