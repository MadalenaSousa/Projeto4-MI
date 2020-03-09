let x = [], y = [], l=[];

let sounds = [];
let userPlaylistTracks, userPlaylists;
let valor, dif;

function preload() {
    userPlaylistTracks = loadJSON('php/userPlaylistTracks.json');
    userPlaylists = loadJSON('php/userPlaylist.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    background(0);
    textSize(20);
    noFill();

    for(let i = 0; i < userPlaylists.items.length; i++) {
        m = color(255, 255, cor[i]);
        stroke(m);
        rectMode(CORNER);
        x[i]=random(10,windowWidth);
        y[i]=random(0,windowHeight);
        valor=1;
    }
}

function draw() {
    for(let i = 0; i < userPlaylists.items.length; i++) {
        strokeWeight(0.5);
        l[i] = userPlaylists.items[i].tracks.total;

        if(x[i] > windowWidth - l[i] * valor)   x[i] = windowWidth - l[i] * valor;
        if(y[i] > windowHeight - l[i] * valor)   y[i] = windowHeight - l[i] * valor;

        if ((mouseX >= x[i]) && (mouseX <= (x[i] + l[i] * valor)) && (mouseY >= y[i]) && (mouseY <= (y[i] + l[i] * valor))) {

            stroke(0,255,255);
            rect(x[i], y[i], l[i]*valor, l[i]*valor);
            if(l[i] > 1) {
                for (let j = 0; j < (userPlaylists.items[i].tracks.total)/5-1; j++) {
                    dif = ((j+1)*valor);
                    //dif=((j+1)*valor)/2;
                    rect(x[i]+2.5*dif, y[i]+2.5*dif, l[i]*valor-5*dif, l[i]*valor-5*dif);
                    text(userPlaylists.items[i].name, x[i], y[i]-10);
                }
            }

        } else {
            stroke(255);
            rect(x[i], y[i], l[i]*valor, l[i]*valor);
            stroke(0);
            noFill();
            if(l[i]>1) {
                for (let j = 0; j < (userPlaylists.items[i].tracks.total) / 5-1; j++) {
                    dif = ((j+1) * valor);
                    //dif=((j+1)*valor)/2;
                    rect(x[i]+2.5*dif, y[i]+2.5*dif, l[i]*valor-5*dif, l[i]*valor-5*dif);
                    text(userPlaylists.items[i].name, x[i], y[i]-10);
                }
            }
        }
    }
}

function mousePressed() {
    for(let i = 0; i < userPlaylists.items.length; i++) {
        if((mouseX >= x[i]) && (mouseX <= (x[i] + l[i]*valor)) && (mouseY >= y[i]) && (mouseY <= (y[i] + l[i]*valor))){
            location.replace('php/getPlaylistTracks.php?id=' + userPlaylists.items[i].id)
        }
    }
}