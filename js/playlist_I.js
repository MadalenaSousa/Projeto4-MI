let x, y;
let sounds = [];
let userPlaylist, userPlaylistTracks, playlistFeatures;
let nb;

function preload() {
    userPlaylist = loadJSON('php/userPlaylist.json');
    userPlaylistTracks = loadJSON('php/userPlaylistTracks.json');
    //playlistFeatures = loadJSON('php/userPlaylistFeatures.json');


    for(let i = 0; i < sounds.length; i++) {
        sounds[i] = loadSound(userPlaylist[i].uri);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(userPlaylist);
    console.log(sounds);
    console.log(userPlaylistTracks);
    //console.log(playlistFeatures);
}

function draw() {
    background(0);
    fill(255);

    textSize(72);
    let nb = userPlaylist.total;
    text('TOTAL', 100, 100);
    text(nb, 100,200);
    text(Object.keys(userTracks).length, 100, 300);

    noFill();
    stroke(255);


    for(let i = 0; i < (userPlaylist.total).length; i++) {
        ellipse(windowWidth/2, windowHeight/2, (userPlaylist.total)*50, (userPlaylist.total)*50);
    }
}