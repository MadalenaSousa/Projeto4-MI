let x;
let y = [];
let topartists;
let artiststoptracks;
let toptracksfeatures;
let artiststoptracksfeatures;
let c;
let div=100;
let dance=[];
let danceabilityavg;
let altura=50;



function preload() {
    topartists = loadJSON('php/userTopArtists.json');
    artiststoptracks = loadJSON('php/TopArtistsAlbumsTracks.json');
    toptracksfeatures = loadJSON('php/TopTracksAudioFeatures.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    let magenta = color(255, 0, 255);
    let azul = color(0, 255, 255);
    let amarelo = color(255, 255, 0);
    for(let i = 0; i < Object.keys(artiststoptracks).length; i++) {
  //      dance[i] = toptracksfeatures.audio_features[i].loudness;
    }


/*
    for(let t = 0; t < Object.keys(artiststoptracks).length; t++) {

        dance[t]=toptracksfeatures[t].audio_features.danceability;

    }*/
    console.log(dance);

  //  console.log(artiststoptracksfeatures[0].audio_features_danceability);


    for(let i = 0; i < 10; i++) {
        if(i===0){
            y[0]=windowHeight/6;
        }else {
            y[i] = y[i - 1] + (windowHeight / 15);
        }
    }
    c = color(255);
    console.log(topartists.items.length);
   // console.log(dance);
    //Map que vai transformar a média de daceability de cada artista
    // let altura=map(danceabilityavg, 0,1,0,windowHeight/4);
}

function draw() {
    let magenta = color(255, 0, 255);
    let azul = color(0, 255, 255);
    let amarelo = color(255, 255, 0);
    background(0);
    // For de cada artista
    for(let i = 0; i < 10; i++) {



        //line(140,y[i], width, y[i]);
        stroke(255);
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
            if(topartists.items[i].popularity>0 && topartists.items[i].popularity<= (100/3)){
                stroke(amarelo);
            }
            if(topartists.items[i].popularity>(100/3) && topartists.items[i].popularity<= (2*(100/3))){
                stroke(azul);
            }
            if(topartists.items[i].popularity>(2*(100/3)) && topartists.items[i].popularity<=100){
                stroke(magenta);
            }

            //se for par arco para cima
            if (g%2===0) {
                beginShape();
                vertex(x, y[i]);
                bezierVertex(x, y[i]-altura, x+((windowWidth-200)/div), y[i]-altura, x+((windowWidth-200)/div), y[i]);
                endShape();
            }

            //se não for par arco para baixo
            else {
                beginShape();
                vertex(x, y[i]);
                bezierVertex(x, y[i]+altura, x+((windowWidth-200)/div), y[i]+altura, x+((windowWidth-200)/div), y[i]);
                endShape();
            }
        }

    }
}
