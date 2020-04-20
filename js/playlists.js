let userPlaylists, totalPlaylists;
let fromPlaylist = false;
let mountains = [];
let newMountain;

const client = new DeepstreamClient('localhost:6020');
const record = [];
let recordList;


function preload() {
    userPlaylists = loadJSON('php/playlist-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth/6, windowHeight);

    client.login();
    totalPlaylists=Object.keys(userPlaylists).length;

    for(let i = 0; i < totalPlaylists; i++) {
        let list = document.createElement("div");
        list.innerText = userPlaylists[i].name;
        list.classList.add("playlist");
        document.querySelector(".list-playlists").appendChild(list);
    }

    recordList = client.record.getList('all-playlists');

    for (let i = 0; i < totalPlaylists; i++) {
        document.querySelectorAll(".playlist")[i].addEventListener("click", function () { //sempre que clico numa música
            record[i] = client.record.getRecord(userPlaylists[i].name); //crio um novo record no servidor
            record[i].set({ //defino o novo record
                playlist: userPlaylists[i].name,
                px: random(0, windowWidth-200),
                py: random(0, windowHeight-200),
                color: color(255),
                largura: userPlaylists[i].tracks.total
            });

            recordList.addEntry(userPlaylists[i].name);
        });
    }

    recordList.subscribe(function () {
        if(recordList.isEmpty() === false) {
            var lastPlaylist = recordList.getEntries()[recordList.getEntries().length-1];
            var currentRecord = client.record.getRecord(lastPlaylist);

            currentRecord.whenReady(function () {
                console.log(recordList.getEntries());
                addNewFlower(currentRecord.get('playlist'), currentRecord.get('px'), currentRecord.get('py'), currentRecord.get('largura'), currentRecord.get('color'));
            });
        }
    }, true);
}

function addNewFlower(name, px, py, largura, color) {
    newMountain = new classMountain(name, px, py, largura, color);
    mountains.push(newMountain);
    console.log(mountains);
}

function draw() {
    background(0);

    if(mountains.length > 0) {
        for(let i = 0; i < mountains.length; i++) {
            mountains[i].display();
        }
    }
}


class classMountain {
    c;
    /*
    nval;
    resolution= 13; // número de "vértices"
    rad= 200;  //tamanho
    round= random(0, 100); //valor q ainda nao percebi o q afeta bem
    nInt= 500; // tmb n sei q faz
    nAmp= 0.4; // valor=1 -> redonda
    nSeed= random(0, 60); // tambem n sei q afeta
    t = 0;
    tChange = 0.01;*/

    constructor(name, px, py, largura, color) {
        this.name = name;
        this.px = px;
        this.py = py;
        this.largura = largura;
        this.color  = color;
    }

    display() {
        if(dist(mouseX, mouseY, this.px, this.py) <= this.largura){
            this.c = color(0,200,255);

        } else {
            this.c = color(255);
        }

        //desenho
        stroke(this.c);
        strokeWeight(2);
        noFill();
        rectMode(CENTER);
        rect(this.px, this.py, this.largura * 2, this.largura * 2);

        //****************************************************************************************
        /*beginShape();
        for (let a=-1; a <= TWO_PI; a += TWO_PI/resolution) {

            nVal = map(noise(cos(a)*nInt+nSeed, sin(a)*nInt+nSeed, t), 0.0, 1.0, nAmp, 1.0);

            x = px + cos(a)*(rad+round) *nVal;
            y = py + sin(a)*rad *nVal;

            curveVertex(x, y);
        }
        endShape(CLOSE);

        //t += tChange;
        //****************************************************************************************
*/
        //nome da playlist
        noStroke();
        fill(this.c);
        textSize(12);
        text(this.name, this.px, this.py);
    }

}