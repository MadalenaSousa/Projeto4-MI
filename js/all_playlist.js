let x, y, l;
let sounds = [];
let userPlaylistTracks, userPlaylists;
let cor=255;
let media;
let sum=0;

function preload() {
    userPlaylistTracks = loadJSON('php/userPlaylistTracks.json');
    userPlaylists=loadJSON('php/userPlaylist.json');

    for(let i = 0; i < sounds.length; i++) {
        sounds[i] = loadSound(userPlaylistTracks[i].uri);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(userPlaylistTracks);
    console.log(userPlaylists);
    console.log(sounds);

    background(0);
    fill(255); //preenchimento das letras

    textSize(72);
    text('MY PLAYLISTS', 100, 100);

    noFill();
    for(let i = 0; i < userPlaylists.items.length; i++) {

        stroke(255);
        l=userPlaylists.items[i].tracks.total;
        rectMode(CENTER)
        if(l>=500) rect(windowWidth/2, windowHeight/2, 500, 500);
        else rect(windowWidth/2, windowHeight/2, l, l);
        textSize(24);
        text(userPlaylists.items[i].name, 100, 200);
    }
}

function draw() {
}