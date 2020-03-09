let x = [], y = [], l=[];

let sounds = [];
let userPlaylistTracks, userPlaylists;
let media;
let sum=0;
let valor, dif;

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
        rectMode(CORNER);
        x[i]=random(0,windowWidth);
        y[i]=random(100,windowHeight);
        valor=10;

        //textSize(24);
        //text(userPlaylists.items[i].name, 100, 200);
    }
}

function draw() {
    for(let i = 0; i < userPlaylists.items.length; i++) {
        strokeWeight(0.5);
        l[i]=userPlaylists.items[i].tracks.total;

        if(x[i]>windowWidth-l[i]*valor) x[i]=windowWidth-l[i]*valor;
        if(y[i]>windowHeight-l[i]*valor) y[i]=windowHeight-l[i]*valor;

        if ((mouseX >= x[i]) && (mouseX <= (x[i] + l[i]*valor)) && (mouseY >= y[i]) && (mouseY <= (y[i] + l[i]*valor))) {

            stroke(0,255,255)
            rect(x[i], y[i], l[i]*valor, l[i]*valor);
            if(l[i]>1) {
                for (let j = 0; j < (userPlaylists.items[i].tracks.total)/5-1; j++) {
                    dif=((j+1)*valor);
                    //dif=((j+1)*valor)/2;
                    rect(x[i]+2.5*dif, y[i]+2.5*dif, l[i]*valor-5*dif, l[i]*valor-5*dif);
                }
            }

        } else {
            stroke(255);
            rect(x[i], y[i], l[i]*valor, l[i]*valor);
            stroke(0);
            if(l[i]>1) {
                for (let j = 0; j < (userPlaylists.items[i].tracks.total)/5-1; j++) {
                    dif=((j+1)*valor);
                    //dif=((j+1)*valor)/2;
                    rect(x[i]+2.5*dif, y[i]+2.5*dif, l[i]*valor-5*dif, l[i]*valor-5*dif);
                }
            }
        }
    }
}