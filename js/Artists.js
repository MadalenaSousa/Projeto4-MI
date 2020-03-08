let x;
let y = [];
let topartists;
let c;
let div=100;
let danceability=[];
let danceabilityavg;
let altura=50;

function preload() {
    topartists = loadJSON('php/userTopArtists.json');
    //artiststoptracks = loadJSON('php/TopArtistsAlbumsTracks.json');
    artiststoptracksfeatures = loadJSON('php/TopTracksAudioFeatures.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    for(let t = 0; t < artiststoptracksfeatures.length; t++) {
        danceability=artiststoptracksfeatures.audio_features[t].danceability;

    }

    for(let i = 0; i < 10; i++) {
        if(i===0){
            y[0]=windowHeight/6;
        }else {
            y[i] = y[i - 1] + (windowHeight / 15);
        }
    }
    c = color(255);
    console.log(topartists.items.length);
    console.log(danceability);
    //Map que vai transformar a média de daceability de cada artista
   // let altura=map(danceabilityavg, 0,1,0,windowHeight/4);
}

function draw() {
    background(0);
   // For de cada artista
    for(let i = 0; i < 10; i++) {
        stroke(255);
        //line(140,y[i], width, y[i]);
        fill(255);
        textAlign(RIGHT);
        text(topartists.items[i].name, 5, y[i]-6, 136);



    //Map que vai relacionar com a energy ou seja divisões
        for (let g=0; g<div; g++) {
           //começa no 140
            if(g===0){
                x=140;
             }else {
                x =140+g*((windowWidth-200) / div);
            }

            noFill();

         //se for par arco para cima
            if (g%2===0) {
                stroke(255);
                beginShape();
                vertex(x, y[i]);
                bezierVertex(x, y[i]-altura, x+((windowWidth-200)/div), y[i]-altura, x+((windowWidth-200)/div), y[i]);
                endShape();
            }

         //se não for par arco para baixo
            else {
                beginShape();
                stroke(255);
                vertex(x, y[i]);
                bezierVertex(x, y[i]+altura, x+((windowWidth-200)/div), y[i]+altura, x+((windowWidth-200)/div), y[i]);
                endShape();
            }
        }

    }
}