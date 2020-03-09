let x;
let a = [];
let b = [];
let c = [];
let y = [];
let topartists;
let artiststoptracks;
let toptracksfeatures;
let topartistsalbums;
let div = [];
let dance = [];
let altura = 50;
let cor;
let popularidade = [];
let seguidores = [];
let minimo, maximo;
let cores = [];

function preload() {
    topartists = loadJSON('php/userTopArtists.json');
    artiststoptracks = loadJSON('php/TopArtistsAlbumsTracks.json');
    toptracksfeatures = loadJSON('php/TopTracksAudioFeatures.json');
    topartistsalbums = loadJSON('php/TopArtistsAlbums.json');

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    /* let magenta = color(255, 0, 255);
     let azul = color(0, 255, 255);
     let amarelo = color(255, 255, 0);*/
    let artists = [];
    let albums = [];
    let n = 0;

    for (let j = 0; j <topartists.items.length; j++) {
       // if(topartistsalbums[j].items.album_type==="album"){

       albums[j]=add(topartistsalbums[j].items.total_tracks)
    }

    console.log(albums);
    for (let i = 0; i < 10; i++) {
        popularidade = topartists.items[i].popularity;
        // console.log(popularidade);
        seguidores = topartists.items[i].followers.total;

        if (i === 0) {
            y[0] = windowHeight / 6;
        } else {
            y[i] = y[i - 1] + (windowHeight / 15);
        }

    }
}

function draw() {
    let magenta = color(255, 0, 255);
    let azul = color(0, 255, 255);
    let amarelo = color(255, 255, 0);


    background(0);
    // For de cada artista
    for (let i = 0; i < 10; i++) {
        div[i] = map(topartists.items[i].followers.total, 0, 60000000, 10, 100);
        console.log(div);

        //line(140,y[i], width, y[i]);
        // stroke(255);
        textAlign(RIGHT);
        text(topartists.items[i].name, 5, y[i] - 6, 136);


        if (topartists.items[i].popularity >= min(popularidade) && topartists.items[i].popularity <= (100 - (2 * ((100 - min(popularidade)) / 3)))) {
            cores[i] = color(255, 255, 0);
            //    stroke(a, b, c);
            a[i] = 255;
            b[i] = 255;
            c[i] = 0;


        } else if (topartists.items[i].popularity > (100 - (2 * ((100 - min(popularidade)) / 3))) && topartists.items[i].popularity <= (100 - ((100 - min(popularidade)) / 3))) {
            //cores[i] = color(0, 255, 255);

            a[i] = 0;
            b[i] = 255;
            c[i] = 255;
            //  stroke(a, b, c);


        } else if (topartists.items[i].popularity > (100 - ((100 - min(popularidade)) / 3)) && topartists.items[i].popularity <= 100) {
            //cores[i] = color(255, 0, 255);

            a[i] = 255;
            b[i] = 0;
            c[i] = 255;
            //  stroke(a, b, c);

        }
        //var linha=color(cores[i]);

        //Map que vai relacionar com a energy ou seja divisões
        for (let g = 0; g < div[i]; g++) {
            //começa no 140
            if (g === 0) {
                x = 140;
            } else {
                x = 140 + g * ((windowWidth - 200) / div[i]);
            }
            // var cp=color(a[i], b[i], c[i]);
            //stroke(cp);
            noFill();
            stroke(255);
            // stroke(cor);
            //se for par arco para cima

            if (g % 2 === 0) {
                //stroke(a, b, c);

                beginShape();
                vertex(x, y[i]);
                bezierVertex(x, y[i] - altura, x + ((windowWidth - 200) / div[i]), y[i] - altura, x + ((windowWidth - 200) / div[i]), y[i]);
                endShape();
            }

            //se não for par arco para baixo
            else {
                // stroke(a, b, c);

                beginShape();
                vertex(x, y[i]);
                bezierVertex(x, y[i] + altura, x + ((windowWidth - 200) / div[i]), y[i] + altura, x + ((windowWidth - 200) / div[i]), y[i]);
                endShape();
            }
        }

    }
}


function getFollowers(index) {
    return topartists.items[index];
}

