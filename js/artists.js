let user, artists, totalArtists, topArtists;
let x;
let waves = [];
let newWave;
let popularity=[];


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
                y: map(i, 0, totalArtists, windowHeight / 7, windowHeight-(windowHeight / 10))

            });

            recordList.addEntry(artists[i].name);
            //recordList.removeEntry(songs[i].name);
        });
    }

    recordList.subscribe(function () {
        if (recordList.isEmpty() === false) {
            let currentRecord = [];

            for(let i = 0; i < recordList.getEntries().length; i++) {
                currentRecord[i] = client.record.getRecord(recordList.getEntries()[i]);
                currentRecord[i].whenReady(function () {
                    console.log(recordList.getEntries());
                    addNewWave(currentRecord[i].get('artist'), currentRecord[i].get('color'), currentRecord[i].get('divisoes'), currentRecord[i].get('y'));
                    //  addNewFlower(currentRecord.get('song'), currentRecord.get('x'), currentRecord.get('y'), currentRecord.get('raio'), currentRecord.get('color'), currentRecord.get('energy'), currentRecord.get('energy'), currentRecord.get('url'));
                });
            }
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

    constructor(name, color, divisoes, y) {
        this.name = name;
        this.color = color;
        this.divisoes = divisoes;
        this.y = y;

    }

    display() {

        for (let g = 0; g < this.divisoes; g++) {

            //começa no 140
            if (g === 0) {
                this.x = 140;
            } else {
                this.x = 140 + g * ((windowWidth - 200) / this.divisoes);
            }

            stroke(255,255-this.color, 255);

            noFill();

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
        textAlign(RIGHT);
        noStroke();
        fill(255,255-this.color, 255);
        text(this.name, 5, this.y - 6, 136);
    }
}
