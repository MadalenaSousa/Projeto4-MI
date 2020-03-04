let x, y;
let sounds = [];
let userPlaylistTracks;
let cor=0;

function preload() {
    userPlaylistTracks = loadJSON('php/userPlaylistTracks.json');
    // músicas pertencentes a uma playlist

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
    text('TOTAL', 100, 100);

    noFill();
    for(let i = 0; i < Object.keys(userPlaylistTracks).length; i++) {
        //desenha x quadrados pelo número de quantas músicas existirem numa playlist
        stroke(0,cor,cor);
        cor=cor+30;
        //quanto maior o raio -> maior valor de azul e verde
        rectMode(CENTER)
        rect(windowWidth/2, windowHeight/2, userPlaylistTracks[i].popularity*5, userPlaylistTracks[i].popularity*5);
        //raior maior quanto maior a popularidade de cada música pertencente à playlist
    }
}

function draw() {

}