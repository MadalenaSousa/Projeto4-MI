let x;
let y = [];
let topArtists, totalArtists;
let div = [];
let altura = [];
let seguidores = [];
let white = [];
let popularity = [];
let a=0;
let clicar = [a,a,a,a,a,a,a,a,a,a];

function preload() {
    topArtists = loadJSON('php/artists-object.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    totalArtists = Object.keys(topArtists).length;

    for (let j = 0; j < totalArtists; j++) {
        popularity[j] = topArtists[j].popularity;
    }

    for (let i = 0; i < totalArtists; i++) {
        white[i] = map(topArtists[i].popularity, min(popularity), max(popularity), 0, 255);
        seguidores = topArtists[i].followers.total;
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
        if (clicar[i] === 0) {
            altura[i] = 0;

        }
        div[i] = map(topArtists.items[i].followers.total, 0, 60000000, 10, 100);
        fill(255, 255 - white[i], 255);
        noStroke();
        textAlign(RIGHT);
        text(topArtists[i].name, 5, y[i] - 6, 136);
        ellipse(5, y[i] - 6, 10, 10);

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
                bezierVertex(x, y[i] - altura[i], x + ((windowWidth - 200) / div[i]), y[i] - altura[i], x + ((windowWidth - 200) / div[i]), y[i]);
                endShape();
            }

            //se não for par arco para baixo
            else {
                beginShape();
                vertex(x, y[i]);
                bezierVertex(x, y[i] + altura[i], x + ((windowWidth - 200) / div[i]), y[i] + altura[i], x + ((windowWidth - 200) / div[i]), y[i]);
                endShape();
            }
        }

    }
}

function mousePressed() {
    for (let i = 0; i < 10; i++) {
        if (dist(mouseX, mouseY, 5, y[i] - 6) <= 10 && clicar === 0) {
            altura[i] = 50;
            a=1;
            clicar[i] = a;
        } else if (dist(mouseX, mouseY, 5, y[i] - 6) <= 10 && clicar === 1) {
            altura[i] = 0;
            a=0;
            clicar[i] = a;
        }
    }
}


