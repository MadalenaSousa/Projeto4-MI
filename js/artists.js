let user, artists, totalArtists, topArtists;
let x;
let waves = [];
let newWave;
let popularity = [];


const client = new DeepstreamClient('localhost:6020');
const record = [];
let recordList;

function preload() {
    topArtists = loadJSON('php/artists-object.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    artists = topArtists;
    client.login();
    totalArtists = Object.keys(artists).length;

    for (let i = 0; i < totalArtists; i++) {
        let list = document.createElement("div");
        list.innerText = artists[i].name;
        list.classList.add("artist");
        document.querySelector(".list-songs").appendChild(list);
        popularity.push(artists[i].popularity);
    }

    recordList = client.record.getList('all-artists');

    for (let i = 0; i < totalArtists; i++) {
        document.querySelectorAll(".artist")[i].addEventListener("click", function () { //sempre que clico num artista
            record[i] = client.record.getRecord(artists[i].name); //crio um novo record no servidor
            record[i].set({ //defino o novo record
                user: "user",
                artist: artists[i].name,
                color: map(artists[i].popularity, min(popularity), max(popularity), 0, 255),
                divisoes: map(artists[i].followers.total, 0, 60000000, 10, 100),
                y: map(i, 0, totalArtists, windowHeight / 7, windowHeight - (windowHeight / 10))

            });

            recordList.addEntry(artists[i].name);
            //recordList.removeEntry(songs[i].name);
        });
    }

    recordList.subscribe(function () {
        if (recordList.isEmpty() === false) {
            var lastArtist = recordList.getEntries()[recordList.getEntries().length - 1];
            var currentRecord = client.record.getRecord(lastArtist);

            currentRecord.whenReady(function () {
                console.log(recordList.getEntries());
                addNewWave(currentRecord.get('artist'), currentRecord.get('color'), currentRecord.get('divisoes'), currentRecord.get('y'));
            });
        }
    }, true);
}

function addNewWave(name, color, divisoes, y) {
    newWave = new waveArtist(name, color, divisoes, y);
    waves.push(newWave);
    console.log(waves);
}

function draw() {
    background(0);

    if (waves.length > 0) {
        for (let i = 0; i < waves.length; i++) {
            waves[i].display();
        }
    }
}

class waveArtist {
    x;
    numeroLinhas;

    constructor(name, color, divisoes, y) {
        this.name = name;
        this.color = color;
        this.divisoes = divisoes;
        this.y = y;

    }

    display() {
        this.x = 300;
        this.numeroLinhas = 3;
        stroke(255, 255 - this.color, 255);
        fill(0);
        strokeWeight(2);


        /* beginShape();
         vertex(this.x-this.l, this.y-0);
         bezierVertex(this.x-this.l, this.y-0,this.l/3, this.y-0, this.l/2, this.y-(this.a/3));
         bezierVertex(2*(this.l/3), this.y-(2*(this.a/3)), this.x-(4*(this.l/15)),this.y-this.a, this.x-0, this.y-this.a);
         bezierVertex(this.x+(4*(this.l/15)), this.y-this.a, this.x+(4*(this.l/15)), this.y-(this.a/3), this.x-0, this.y-(this.a/3));
         bezierVertex(this.x-(2*(this.l/15)), this.y-(this.a/3), this.x-(2*(this.l/15)), this.y-(2*(this.a/3)), this.x-0, this.y-(2*(this.a/3)));
         endShape();*/

       /* beginShape();

        vertex((this.x - 300), this.y - 0);
        bezierVertex(this.x - 300, this.y - 0, 100, this.y - 0, 300 / 2, this.y - (150 / 3));
        bezierVertex(200, this.y - (2 * (150 / 3)), this.x - (4 * (300 / 15)), this.y - 150, this.x - 0, this.y - 150);
        bezierVertex(this.x + 60, this.y - 150, this.x + 60, this.y - 50, this.x - 0, this.y - 50);
        bezierVertex(this.x - (2 * (300 / 15)), this.y - 50, this.x - (2 * (300 / 15)), this.y - ((2 * 150) / 3), this.x - 0, this.y - ((2 * 150) / 3));
        bezierVertex(this.x - (2 * ((300 - (this.numeroLinhas - 1) * (1800 / (this.numeroLinhas * 7))) / 15)), this.y - ((2 * 150) / 3), this.x - (2 * ((300 - (this.numeroLinhas - 1) * (1800 / (this.numeroLinhas * 7))) / 15)), this.y - 50 - ((this.numeroLinhas - 1) * (150 / (this.numeroLinhas * 3))), this.x - 0, this.y - 50 - ((this.numeroLinhas - 1) * (150 / (this.numeroLinhas * 3))));
        bezierVertex(((this.x + 60) - (((6 * 300) / 30) / this.numeroLinhas) * (this.numeroLinhas - 1)), this.y - 50 - ((this.numeroLinhas - 1) * (150 / (this.numeroLinhas * 3))), (this.x + 60) - (((6 * 300) / 30) / this.numeroLinhas) * (this.numeroLinhas - 1), this.y - (150 - (this.numeroLinhas - 1) * (150 / (this.numeroLinhas * 3))), this.x - 0, this.y - (150 - (this.numeroLinhas - 1) * (150 / (this.numeroLinhas * 3))));
        bezierVertex(this.x - (4 * ((300 - (this.numeroLinhas - 1) * (1800 / (this.numeroLinhas * 7))) / 15)), this.y - (150 - (this.numeroLinhas - 1) * (150 / (this.numeroLinhas * 3))), 200 + (this.numeroLinhas - 1) * 10, this.y - (2 * ((150 - (this.numeroLinhas - 1) * (150 / (this.numeroLinhas * 3))) / 3)), 300 / 2 + ((((2 / 6) * 300) / this.numeroLinhas) * (this.numeroLinhas - 1)), this.y - ((150 - (this.numeroLinhas - 1) * (150 / (this.numeroLinhas * 3))) / 3));
        bezierVertex(100 + (this.numeroLinhas - 1) * 22, this.y - 0, this.x - 300 + (this.numeroLinhas - 1) * (1800 / (this.numeroLinhas * 7)), this.y - 0, (this.x - 300) + ((this.numeroLinhas - 1) * (1800 / (this.numeroLinhas * 7))), this.y - 0);
        vertex(this.x - 300, this.y - 0);


        endShape();
*/
        for (let i = 0; i < this.numeroLinhas; i++) {
            noFill();
            line(0,this.y-0,width, this.y-0);
            beginShape();
            vertex((this.x - 300) + (i * (((3/5)*300)/this.numeroLinhas)), this.y - 0);
            bezierVertex((this.x - 300) + (i * (((3/5)*300)/this.numeroLinhas)), this.y - 0, (this.x-(300/ 2) + (i*(((3/10)*300)/this.numeroLinhas)))-(300*(1/12)), this.y-0, this.x-(300/ 2) + (i*(((3/10)*300)/this.numeroLinhas)), this.y - ((4/15)*150));
            bezierVertex((this.x-(300/ 2) + (i*(((3/10)*300)/this.numeroLinhas)))+((1/30)*300), (this.y - ((4/15)*150))-((1/10)*150), this.x - (4 * ((300 - i * (1800 / (this.numeroLinhas * 7))) / 15)), this.y - (150 - i * (150 / (this.numeroLinhas * 3))), this.x - 0, this.y - (150 - i * (150 / (this.numeroLinhas * 3))));
            bezierVertex(((this.x + 60) - (((6 * 300) / 30) / this.numeroLinhas) * i), this.y - (150 - i * (150 / (this.numeroLinhas * 3))), ((this.x + 60) - (((6 * 300) / 30) / this.numeroLinhas) * i), this.y - 50 - (i * (150 / (this.numeroLinhas * 3))), this.x - 0, this.y - 50 - (i * (150 / (this.numeroLinhas * 3))));
            bezierVertex(this.x - (2 * ((300 - i * (1800 / (this.numeroLinhas * 7))) / 15)), this.y - 50 - (i * (150 / (this.numeroLinhas * 3))), this.x - (2 * ((300 - i * (1800 / (this.numeroLinhas * 7))) / 15)), this.y - ((2 * 150) / 3), this.x - 0, this.y - ((2 * 150) / 3));
            endShape();
        }


        /*
        beginShape();
        vertex(0, this.y);
        bezierVertex(100, 280, this.x-60, this.y, this.x-40, this.y-20);
        bezierVertex(this.x-40, this.y-18, this.x-30, this.y-40, this.x, this.y-40);
        bezierVertex(this.x+60, this.y-40, this.x+60, this.y+40, this.x, this.y+40);
        bezierVertex(this.x-30, this.y+40, this.x-30, this.y, this.x, this.y);
        endShape();

        beginShape();
        vertex(100, this.y);
        bezierVertex(130, 280, this.x-50, this.y, this.x-30, this.y-20);
        bezierVertex(this.x-30, this.y-20, this.x-20, this.y-30, this.x, this.y-30);
        bezierVertex(this.x+40, this.y-30, this.x+40, this.y+30, this.x, this.y+30);
        bezierVertex(this.x-15, this.y+30, this.x-20, this.y, this.x, this.y);
        endShape();

        beginShape();
        vertex(200, this.y);
        bezierVertex(160, 280, this.x-40, this.y, this.x-20, this.y-20);
        bezierVertex(this.x-20, this.y-22, this.x-10, this.y-20, this.x, this.y-20);
        bezierVertex(this.x+20, this.y-20, this.x+20, this.y+20, this.x, this.y+20);
        bezierVertex(this.x, this.y+20, this.x-10, this.y, this.x, this.y);
        endShape();*/
        /*
        for (let g = 0; g < this.divisoes; g++) {

            //começa no 140
            if (g === 0) {
                this.x = 140;
            } else {
                this.x = 140 + g * ((windowWidth - 200) / this.divisoes);
            }

            stroke(255,255-this.color, 255);

            noFill();
/*
            //se for par arco para cima
            if (g % 2 === 0) {
                beginShape();
                vertex(this.x, this.y);
                bezierVertex(this.x, this.y - 50, this.x + ((windowWidth - 200) / this.divisoes), this.y - 50, this.x + ((windowWidth - 200) / this.divisoes), this.y);
                endShape();
            }

            //se não for par arco para baixo
            else {
                beginShape();
                vertex(this.x, this.y);
                bezierVertex(this.x, this.y + 50, this.x + ((windowWidth - 200) / this.divisoes), this.y + 50, this.x + ((windowWidth - 200) / this.divisoes), this.y);
                endShape();
            }
            }
         */


        textAlign(LEFT);
        noStroke();
        fill(255, 255 - this.color, 255);
        text(this.name, (width-(width/4.5))-( this.name.length*7), this.y - 20, 136);
    }
}
