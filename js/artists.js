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
    createCanvas(windowWidth - windowWidth / 6, windowHeight);
    artists = topArtists;
    client.login();
    totalArtists = Object.keys(artists).length;

    createArtistDiv();
    createUserDiv();
    logoutPopUp();
    sharePopUp();

    for (let i = 0; i < totalArtists; i++) {
        popularity.push(artists[i].popularity);
    }

    recordList = client.record.getList('all-artists');
    remove = document.querySelectorAll(".remove");

    recordList.subscribe(function () {
        console.log("LISTA DE RECORDS ATUAL: " + recordList.getEntries());
        if (recordList.isEmpty()) {
            clearWaves();
            console.log("Não há músicas na lista");
        } else {
            clearWaves();
            let recordsOnList = [];
            for (let i = 0; i < recordList.getEntries().length; i++) {
                recordsOnList[i] = client.record.getRecord(recordList.getEntries()[i]);
                recordsOnList[i].whenReady(function () {
                    addNewWave(recordsOnList[i].get('artist'), recordsOnList[i].get('color'), recordsOnList[i].get('divisoes'), recordsOnList[i].get('y'));
                });
            }
        }
    });

    for (let i = 0; i < totalArtists; i++) {
        recordList.subscribe(function () {
            if (contains(recordList.getEntries(), artists[i].name)) {
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
                        user: user.name,
                        artist: artists[i].name,
                        color: map(artists[i].popularity, min(popularity), max(popularity), 0, 255),
                        divisoes: map(artists[i].followers.total, 1, 60000000, 3, 10),
                        y: map(i, 0, totalArtists, windowHeight / 3, windowHeight - (windowHeight / 50))

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

    document.querySelector('.confirm-logout').addEventListener('click', closeArtistRoomConnection);

    document.querySelector('.download').addEventListener('click', function () {
        console.log('Canvas will be downloaded');
        saveCanvas('public-artists-artboard.png');
    });
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

function logoutPopUp() {
    document.querySelector(".leave").addEventListener('click', function () {
        document.querySelector('.logout').classList.toggle('hide');
    });

    document.querySelector(".back").addEventListener('click', function () {
        document.querySelector('.logout').classList.add('hide');
    });
}

function sharePopUp() {
    document.querySelector('.share-button').addEventListener('click', function () {
        document.querySelector('.share').classList.toggle('hide');
    });

    document.querySelector(".close-share").addEventListener('click', function () {
        document.querySelector('.share').classList.add('hide');
    });
}

function createArtistDiv() {
    for (let i = 0; i < totalArtists; i++) {
        let song = document.createElement("div");

        let nomeDiv = document.createElement("div");
        let nome = document.createElement("span");

        let remove = document.createElement("div");

        nomeDiv.setAttribute("style", "margin: 0px");
        nomeDiv.classList.add('artist');

        nome.innerHTML = '<b>' + artists[i].name + '</b>';

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

function closeArtistRoomConnection() {
    let allRecords = [];
    let recordsToRemove = [];
    for(let i = 0; i < recordList.getEntries().length; i++) {
        allRecords[i] = client.record.getRecord(recordList.getEntries()[i]);
        allRecords[i].whenReady(function () {
            console.log('Record to delete: ' + allRecords[i].get('artist') + ' Owner of the record: ' + allRecords[i].get('user'));
            if (allRecords[i].get('user') === user.name) {
                recordsToRemove.push(allRecords[i]);
            }
        });
    }


    for(let i = 0; i < recordsToRemove.length; i++) {
        recordList.removeEntry(recordsToRemove[i].get('artist'));
        client.record.getRecord(recordsToRemove[i].get('artist')).delete();
    }

    recordsToRemove[recordsToRemove.length - 1].on('delete', function () {
        client.close();
    });

    client.on('connectionStateChanged', connectionState => {
        if(connectionState === 'CLOSED') {
            console.log('Connection state changed to: ' + connectionState + ', you will be redirected to homepage');
            document.location = './homepage.php';
        }
    });
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
        this.x = 300;
        stroke(255, 255 - this.color, 255);
       /* beginShape();
        fill(0);
        vertex(this.x - 300, this.y - 0);
        bezierVertex(this.x - 300, this.y - 0, this.x - (300 / 2) - (300 * (1 / 12)), this.y - 0, this.x - (300 / 2), this.y - ((4 / 15) * 150));
        bezierVertex(this.x - (300 / 2) + ((1 / 30) * 300), (this.y - ((4 / 15) * 150)) - ((1 / 10) * 150), this.x - (4 * (300/ 15)), this.y - 150, this.x - 0, this.y - 150);
        bezierVertex(this.x + 60, this.y - 150, this.x + 60, this.y - 50, this.x - 0, this.y - 50);
        bezierVertex(this.x - (2 * (300 / 15)), this.y - 50, this.x - (2 * (300 / 15)), this.y - ((2 * 150) / 3), this.x - 0, this.y - ((2 * 150) / 3));
        bezierVertex(this.x - (2 * ((300 - (this.divisoes - 1) * (1800 / (this.divisoes * 7))) / 15)), this.y - ((2 * 150) / 3), this.x - (2 * ((300 - (this.divisoes - 1) * (1800 / (this.divisoes * 7))) / 15)), this.y - 50 - ((this.divisoes - 1) * (150 / (this.divisoes * 3))), this.x - 0, this.y - 50 - ((this.divisoes - 1) * (150 / (this.divisoes * 3))));
        bezierVertex(((this.x + 60) - (((6 * 300) / 30) / this.divisoes) * (this.divisoes - 1)), this.y - 50 - ((this.divisoes - 1) * (150 / (this.divisoes * 3))), (this.x + 60) - (((6 * 300) / 30) / this.divisoes) * (this.divisoes - 1), this.y - (150 - (this.divisoes - 1) * (150 / (this.divisoes * 3))), this.x - 0, this.y - (150 - (this.divisoes - 1) * (150 / (this.divisoes * 3))));
        bezierVertex(this.x - (4 * ((300 - (this.divisoes - 1) * (1800 / (this.divisoes * 7))) / 15)), this.y - (150 - (this.divisoes - 1) * (150 / (this.divisoes * 3))), (this.x - (300 / 2) + (this.divisoes * (((3 / 10) * 300) / this.divisoes))) + ((1 / 30) * 300), (this.y - ((4 / 15) * 150)) - ((1 / 10) * 150), this.x - (300 / 2) + ((this.divisoes - 1) * (((3 / 10) * 300) / this.divisoes)), this.y - ((4 / 15) * 150));
        bezierVertex((this.x - (300 / 2) + ((this.divisoes - 1) * (((3 / 10) * 300) / this.divisoes))) - (300 * (1 / 12)), this.y - 0, (this.x - 300) + ((this.divisoes - 1) * (((3 / 5) * 300) / this.divisoes)), this.y - 0, (this.x - 300) + ((this.divisoes - 1) * (((3 / 5) * 300) / this.divisoes)), this.y - 0);
        vertex(this.x - 300, this.y - 0);
        endShape();
        noFill();
*/        noFill();

        for (let i = 0; i < this.divisoes; i++) {
            strokeWeight(1.8);
            line(0, this.y - 0, width, this.y - 0);
            strokeWeight(2);
            beginShape();
            vertex((this.x - 300) + (i * (((3 / 5) * 300) / this.divisoes)), this.y - 0);
            bezierVertex((this.x - 300) + (i * (((3 / 5) * 300) / this.divisoes)), this.y - 0, (this.x - (300 / 2) + (i * (((3 / 10) * 300) / this.divisoes))) - (300 * (1 / 12)), this.y - 0, this.x - (300 / 2) + (i * (((3 / 10) * 300) / this.divisoes)), this.y - ((4 / 15) * 150));
            bezierVertex((this.x - (300 / 2) + (i * (((3 / 10) * 300) / this.divisoes))) + ((1 / 30) * 300), (this.y - ((4 / 15) * 150)) - ((1 / 10) * 150), this.x - (4 * ((300 - i * (1800 / (this.divisoes * 7))) / 15)), this.y - (150 - i * (150 / (this.divisoes * 3))), this.x - 0, this.y - (150 - i * (150 / (this.divisoes * 3))));
            bezierVertex(((this.x + 60) - (((6 * 300) / 30) / this.divisoes) * i), this.y - (150 - i * (150 / (this.divisoes * 3))), ((this.x + 60) - (((6 * 300) / 30) / this.divisoes) * i), this.y - 50 - (i * (150 / (this.divisoes * 3))), this.x - 0, this.y - 50 - (i * (150 / (this.divisoes * 3))));
            bezierVertex(this.x - (2 * ((300 - i * (1800 / (this.divisoes * 7))) / 15)), this.y - 50 - (i * (150 / (this.divisoes * 3))), this.x - (2 * ((300 - i * (1800 / (this.divisoes * 7))) / 15)), this.y - ((2 * 150) / 3), this.x - 0, this.y - ((2 * 150) / 3));
            endShape();
        }

        textAlign(LEFT);
        noStroke();
        fill(255, 255 - this.color, 255);
        text(this.name, (width - (width / 26)) - (this.name.length * 6.5), this.y - 20, 136);
    }
}

