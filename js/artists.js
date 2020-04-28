let user, artists, totalArtists, topArtists;
let x;
let waves = [];
let newWave;
let popularity = [];
let remove;

const client = new DeepstreamClient('localhost:6020');
const record = [];
let recordList;

function preload() {
    topArtists = loadJSON('php/' + userid + '-artists-object.json');
    user = loadJSON('php/' + userid + '-user-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth/6, windowHeight);
    artists = topArtists;
    client.login();
    totalArtists = Object.keys(artists).length;

    createArtistDiv();
    createUserDiv();

    for (let i = 0; i < totalArtists; i++) {
        popularity.push(artists[i].popularity);
    }

    recordList = client.record.getList('all-artists');
    remove = document.querySelectorAll(".remove");

    recordList.subscribe(function () {
        console.log("LISTA DE RECORDS ATUAL: " + recordList.getEntries());
        if(recordList.isEmpty()) {
            clearWaves();
            console.log("Não há músicas na lista");
        } else {
            clearWaves();
            let recordsOnList = [];
            for(let i = 0; i < recordList.getEntries().length; i++){
                recordsOnList[i] = client.record.getRecord(recordList.getEntries()[i]);
                recordsOnList[i].whenReady(function () {
                    addNewWave(recordsOnList[i].get('artist'), recordsOnList[i].get('color'), recordsOnList[i].get('divisoes'), recordsOnList[i].get('y'));
                });
            }
        }
    });

    for (let i = 0; i < totalArtists; i++) {
        recordList.subscribe(function () {
            if(contains(recordList.getEntries(), artists[i].name)){
                remove[i].classList.remove('hide');
            } else {
                remove[i].classList.add('hide');
            }
        });

        document.querySelectorAll(".artist")[i].addEventListener("click", function () {
            console.log("Clicou na música" + artists[i].name);
            client.record.has(artists[i].name, function (error, hasRecord) {
                if (hasRecord === false) {
                    console.log('doesnt have record with name: ' + topArtists[i].name + ", can create it");
                    record[i] = client.record.getRecord(artists[i].name); //crio um novo record no servidor
                    record[i].set({ //defino o novo record
                        user: "user",
                        artist: artists[i].name,
                        color: map(artists[i].popularity, min(popularity), max(popularity), 0, 255),
                        divisoes: map(artists[i].followers.total, 0, 60000000, 10, 100),
                        y: map(i, 0, totalArtists, windowHeight / 7, windowHeight - (windowHeight / 10))

                    });

                    recordList.addEntry(artists[i].name);

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Record with name: ' + artists[i].name + ", already exists, cannot create it");
                }
            });

        });

        remove[i].addEventListener("click", function () {
            client.record.has(artists[i].name, function (error, hasRecord) {
                if (hasRecord) {
                    console.log('Has record with name: ' + artists[i].name + ', can delete it');

                    recordList.removeEntry(artists[i].name);
                    client.record.getRecord(artists[i].name).delete();

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Doesnt have record with name: ' + artists[i].name + ', cannot delete it');
                }
            });
        });

    }
}

function addNewWave(name, color, divisoes, y) {
    newWave = new waveArtist(name, color, divisoes, y);
    waves.push(newWave);
    console.log(waves);
}

function clearWaves() {
     waves.splice(0, waves.length);
}

function contains(array, nome) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === nome) {
            return true;
        }
    }
    return false;
}

function createArtistDiv() {
    for(let i = 0; i < totalArtists; i++) {
        let song = document.createElement("div");

        let nomeDiv = document.createElement("div");
        let nome = document.createElement("span");

        let remove = document.createElement("div");

        nomeDiv.setAttribute("style", "margin: 0px");
        nomeDiv.classList.add('artist');

        nome.innerHTML ='<b>' + artists[i].name + '</b>';

        nomeDiv.appendChild(nome);

        remove.innerText = "x";
        remove.classList.add("remove");
        remove.setAttribute("style", "cursor: pointer; margin-left: 5px;");

        song.classList.add('unit');

        song.appendChild(nomeDiv);
        song.appendChild(remove);
        document.querySelector(".list-songs").appendChild(song);
    }
}

function createUserDiv() {
    let userDiv = document.createElement('div');
    let person = document.createElement('div');
    let img = document.createElement('img');

    img.setAttribute('src', user.profile_pic);
    img.setAttribute('width', '30px');
    img.setAttribute('height', '30px');

    person.innerText = user.name;
    person.classList.add('username');

    userDiv.classList.add('user');
    userDiv.appendChild(img);
    userDiv.appendChild(person);

    document.querySelector(".list-people").appendChild(userDiv);
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
        this.numeroLinhas=6;
        stroke(255, 255 - this.color, 255);
        noFill();

        /* beginShape();
         vertex(this.x-this.l, this.y-0);
         bezierVertex(this.x-this.l, this.y-0,this.l/3, this.y-0, this.l/2, this.y-(this.a/3));
         bezierVertex(2*(this.l/3), this.y-(2*(this.a/3)), this.x-(4*(this.l/15)),this.y-this.a, this.x-0, this.y-this.a);
         bezierVertex(this.x+(4*(this.l/15)), this.y-this.a, this.x+(4*(this.l/15)), this.y-(this.a/3), this.x-0, this.y-(this.a/3));
         bezierVertex(this.x-(2*(this.l/15)), this.y-(this.a/3), this.x-(2*(this.l/15)), this.y-(2*(this.a/3)), this.x-0, this.y-(2*(this.a/3)));
         endShape();*/
        for (let i = 0; i < this.numeroLinhas; i++) {
            beginShape();
            vertex((this.x - 300) + (i * (1500 / (this.numeroLinhas*7))), this.y - 0);
            bezierVertex(this.x - 300 + i * (1500 / (this.numeroLinhas*7)), this.y - 0, 100 + i * 22, this.y - 0, 300 / 2 + ((((2 / 6) * 300) / this.numeroLinhas) * i), this.y - ((150 - i * (150 /(this.numeroLinhas*3))) / 3));
            bezierVertex(200 + i * 10, this.y - (2 * ((150 - i * (150 / (this.numeroLinhas*3))) / 3)), this.x - (4 * ((300 - i * (1500 / (this.numeroLinhas*7))) / 15)), this.y - (150 - i * (150 / (this.numeroLinhas*3))), this.x - 0, this.y - (150 - i * (150 / (this.numeroLinhas*3))));
            bezierVertex(((this.x + 60) - (((6 * 300) / 30) / this.numeroLinhas) * i), this.y - (150 - i * (150 / (this.numeroLinhas*3))), ((this.x + 60) - (((6 * 300) / 30) /this.numeroLinhas) * i), this.y - 50 - (i * (150 / (this.numeroLinhas*3))), this.x - 0, this.y - 50 - (i * (150 / (this.numeroLinhas*3))));
            bezierVertex(this.x - (2 * ((300 - i * (1500 / (this.numeroLinhas*7))) / 15)), this.y - 50 - (i * (150 / (this.numeroLinhas*3))), this.x - (2 * ((300 - i * (1500 / (this.numeroLinhas*7))) / 15)), this.y - ((2 * 150) / 3), this.x - 0, this.y - ((2 * 150) / 3));
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
        text(this.name, 5, this.y - 6, 136);
    }
}
