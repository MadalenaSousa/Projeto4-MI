let x;
let y = [];
let topArtists, topArtistsAlbums;
let div = [];
let altura = 50;
let seguidores = [];
let white = [];
let popularity = [];

function preload() {
    topArtists = loadJSON('php/userTopArtists.json');
    topArtistsAlbums = loadJSON('php/userTopArtistsAlbums.json');

}

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (let j = 0; j < topArtists.items.length; j++) {
        popularity[j] = topArtists.items[j].popularity;
    }

    for (let i = 0; i < topArtists.items.length; i++) {
        white[i] = map(topArtists.items[i].popularity, min(popularity), max(popularity), 0, 255);
        seguidores = topArtists.items[i].followers.total;

        if (i === 0) {
            y[0] = windowHeight / 6;
        } else {
            y[i] = y[i - 1] + (windowHeight / 15);
        }
    }
}

function draw() {
    background(0);

    // For de cada artista
    for (let i = 0; i < 10; i++) {
        div[i] = map(topArtists.items[i].followers.total, 0, 60000000, 10, 100);

        fill(255, 255 - white[i], 255);
        noStroke();
        textAlign(RIGHT);
        text(topArtists.items[i].name, 5, y[i] - 6, 136);


        for (let g = 0; g < div[i]; g++) {
            //começa no 140
            if (g === 0) {
                x = 140;
            } else {
                x = 140 + g * ((windowWidth - 200) / div[i]);
            }

            stroke(255, 255 - white[i], 255);
            noFill();

            //se for par arco para cima
            if (g % 2 === 0) {
                beginShape();
                vertex(x, y[i]);
                bezierVertex(x, y[i] - altura, x + ((windowWidth - 200) / div[i]), y[i] - altura, x + ((windowWidth - 200) / div[i]), y[i]);
                endShape();
            }

            //se não for par arco para baixo
            else {
                beginShape();
                vertex(x, y[i]);
                bezierVertex(x, y[i] + altura, x + ((windowWidth - 200) / div[i]), y[i] + altura, x + ((windowWidth - 200) / div[i]), y[i]);
                endShape();
            }
        }

    }
}
