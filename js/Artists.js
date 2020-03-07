let artists = [];
let myTopArtists;

function preload() {
    myTopArtists = loadJSON('php/userTopArtists.json');

}

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log(myTopArtists);
    console.log(artists);
}


function draw() {
    background(0);
    fill(255);

    textSize(72);
    text('DURAÇÃO VS AMPLITUDE', 100, 100);

    noFill();
    stroke(255);
    for (let i = 0; i < Object.keys(myTopArtists).length; i++) {
        document.getElementById("lista").innerHTML = myTopArtists[i].name;
    }
}