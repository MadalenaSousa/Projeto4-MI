let x, y;
let sounds = [];
let userPlaylistTracks;
let cor=255;
let alfa, angulo, r, t;

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

    t=userPlaylistTracks.length;
    alfa=0;
    angulo=TWO_PI/t;
    r=userPlaylistTracks.popularity;
    text(t, 100, 200);

    background(0);
    fill(255); //preenchimento das letras

    textSize(72);
    text('TOTAL', 100, 100);

    noFill();
    for(let i = 0; i < Object.keys(userPlaylistTracks).length; i++) {
        //desenha x quadrados pelo número de quantas músicas existirem numa playlist
        stroke(cor, 255, 255);
        cor = cor - 30;
        //quanto maior o raio -> menor valor do vermelho -> mais ciano

        x = windowWidth / 2 + (userPlaylistTracks[i].popularity/10) * cos(alfa);
        y = windowHeight / 2 + (userPlaylistTracks[i].popularity/10) * sin(alfa);

        line(windowWidth / 2, windowHeight / 2, userPlaylistTracks[i].popularity /10, userPlaylistTracks[i].popularity/10 );
        //raior maior quanto maior a popularidade de cada música pertencente à playlist
        alfa = alfa + angulo;
    }
}

function draw() {

}