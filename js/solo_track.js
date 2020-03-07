let id = location.search.substring(4);
let userTracks, trackFeatures;

function preload() {
    userTracks = loadJSON('php/userPlaylistTracks.json');
    trackFeatures = loadJSON('php/userTrackFeatures.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(id);
}

function draw() {
    background(0);
    fill(255);

    for(let i = 0; i < Object.keys(userTracks).length; i++) {
        if(userTracks[i].id === id) {
            text(userTracks[i].name, width/2, height/2);
        }
    }

}