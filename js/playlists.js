let x = [], y = [], l=[];

let sounds = [];
let userPlaylists;
let valor, dif, m;
let cor = [];

const client = new DeepstreamClient('localhost:6020');

function preload() {
    userPlaylists = loadJSON('php/playlist-object.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    client.login();

    totalPlaylists = Object.keys(userPlaylists).length;

    for(let i = 0; i < totalPlaylists; i++) {
        let list = document.createElement("div");
        list.innerText = userPlaylists[i].name;
        list.classList.add("playlist");
        document.querySelector(".list-playlists").appendChild(list);
    }

    background(0);
    textSize(20);
    noFill();

    for(let i = 0; i < totalPlaylists; i++) {
        m = color(255, 255, cor[i]);
        stroke(m);
        rectMode(CORNER);
        x[i]=random(10,windowWidth);
        y[i]=random(0,windowHeight);
        valor=1;
    }
}

function draw() {

    for(let i = 0; i < totalPlaylists; i++) {
            strokeWeight(0.5);
            l[i] = userPlaylists[i].tracks.total;

            if (x[i] > windowWidth - l[i] * valor) x[i] = windowWidth - l[i] * valor;
            if (y[i] > windowHeight - l[i] * valor) y[i] = windowHeight - l[i] * valor;

            if ((mouseX >= x[i]) && (mouseX <= (x[i] + l[i] * valor)) && (mouseY >= y[i]) && (mouseY <= (y[i] + l[i] * valor))) {

                stroke(0, 255, 255);
                rect(x[i], y[i], l[i] * valor, l[i] * valor);
                if (l[i] > 1) {
                    for (let j = 0; j < (userPlaylists[i].tracks.total) / 5 - 1; j++) {
                        dif = ((j + 1) * valor);
                        //dif=((j+1)*valor)/2;
                        rect(x[i] + 2.5 * dif, y[i] + 2.5 * dif, l[i] * valor - 5 * dif, l[i] * valor - 5 * dif);
                        text(userPlaylists[i].name, x[i], y[i] - 10);
                    }
                }

            } else {
                stroke(255);
                rect(x[i], y[i], l[i] * valor, l[i] * valor);
                stroke(0);
                noFill();
                if (l[i] > 1) {
                    for (let j = 0; j < (userPlaylists[i].tracks.total) / 5 - 1; j++) {
                        dif = ((j + 1) * valor);
                        //dif=((j+1)*valor)/2;
                        rect(x[i] + 2.5 * dif, y[i] + 2.5 * dif, l[i] * valor - 5 * dif, l[i] * valor - 5 * dif);
                        text(userPlaylists[i].name, x[i], y[i] - 10);
                    }
                }
            }
    }
}
