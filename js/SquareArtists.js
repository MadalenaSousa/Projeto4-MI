let user, artists, totalArtists, topArtists;
let waves = [];
let newWave;
let popularity = [];
let followers = [];
let speed = [];
let positivity = [];
let danceability = [];
let loudness = [];
let energy = [];
let remove;
let alfa = 0;
var canvasnova = document.createElement("CANVAS");
var cruz = document.createElement("div");
const client = new DeepstreamClient('localhost:6020');
const record = [];
let personRecord;
let clientsRecords = [];
let recordList;

function preload() {
    topArtists = loadJSON('php/' + userid + '-artists-object.json');
    user = loadJSON('php/' + userid + '-user-object.json');
}

function setup() {
    createCanvas(600, 600);
    client.login({username: user.name}, (success, data) => {
        if (success) {
            console.log("User logged in successfully");
            client.record.has(user.name, function (error, hasRecord) {
                console.log(error);
                if (hasRecord === false) {
                    console.log("Record of this user doesnt exist, it will be created");
                    personRecord = client.record.getRecord(user.name);
                    personRecord.set({
                        name: user.name,
                        id: user.id,
                        profile_pic: user.profile_pic
                    });
                } else {
                    console.log("A record of this user already exists, it will be retrieved");
                    personRecord = client.record.getRecord(user.name);
                }
            });
        } else {
            console.log('Login failed');
        }
    });

    client.presence.getAll((error, clients) => {
        for (let i = 0; i < clients.length; i++) {
            console.log('Clients present on login: ' + clients);
            clientsRecords[i] = client.record.getRecord(clients[i]);
            clientsRecords[i].subscribe(function () {
                createUserDiv(clientsRecords[i].get('name'), clientsRecords[i].get('profile_pic'))
            });
        }
    });

    client.presence.subscribe((username, isLoggedIn) => {
        if (isLoggedIn) {
            console.log('A new client logged in');
            clearArray(clientsRecords);
            client.presence.getAll((error, clients) => {
                for (let i = 0; i < clients.length; i++) {
                    console.log('Updated clients list: ' + clients);
                    clientsRecords[i] = client.record.getRecord(clients[i]);
                    clientsRecords[i].subscribe(function () {
                        createUserDiv(clientsRecords[i].get('name'), clientsRecords[i].get('profile_pic'))
                    });
                }
            });
        }
    });

    artists = topArtists;
    totalArtists = Object.keys(artists).length;


    for (let i = 0; i < totalArtists; i++) {
        popularity.push(artists[i].popularity);
        danceability.push(artists[i].top_tracks_average_features.danceability);
        followers.push(artists[i].followers.total);
        speed.push(artists[i].top_tracks_average_features.speed);
        positivity.push(artists[i].top_tracks_average_features.positivity);
        loudness.push(artists[i].top_tracks_average_features.loudness);
        energy.push(artists[i].top_tracks_average_features.energy);

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
                    addNewWave(recordsOnList[i].get('artist'), recordsOnList[i].get('color'), recordsOnList[i].get('divisoes'), recordsOnList[i].get('largura'), recordsOnList[i].get('x'), recordsOnList[i].get('y'), recordsOnList[i].get('shake'));
                });
            }
        }
    });

    for (let i = 0; i < totalArtists; i++) {

            console.log("Clicou na música" + artists[i].name);
            client.record.has(artists[i].name, function (error, hasRecord) {
                if (hasRecord === false) {
                    console.log('doesnt have record with name: ' + topArtists[i].name + ", can create it");
                    record[i] = client.record.getRecord(artists[i].name); //crio um novo record no servidor
                    record[i].set({ //defino o novo record
                        user: user.name,
                        artist: artists[i].name,
                        color: map(artists[i].popularity, min(popularity), max(popularity), 0, 255),
                        divisoes: map(artists[i].top_tracks_average_features.danceability, min(danceability), max(danceability), 3, 10),
                        largura: map(artists[i].followers.total, min(followers), max(followers), 300/12, 300/3),
                        x: map(artists[i].top_tracks_average_features.positivity, min(positivity), max(positivity), 300/12+25, 300 -  300/20),
                        y: map(artists[i].top_tracks_average_features.speed, min(speed), max(speed), 25, 300 - 25),
                        shake: map(artists[i].top_tracks_average_features.energy, min(energy), max(energy), 0.1, 0.6)

                    });

                    recordList.addEntry(artists[i].name);

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Record with name: ' + artists[i].name + ", already exists, cannot create it");
                }
            });

    }



}


function addNewWave(name, color, divisoes, largura, x, y, shake) {
    newWave = new waveArtist(name, color, divisoes, largura, x, y, shake);
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

}

function sharePopUp() {
    document.querySelector('.share-button').addEventListener('click', function () {
        document.querySelector('.share').classList.toggle('hide');
    });

}

function desenho(){
    if (waves.length > 0) {
        for (let i = 0; i < waves.length; i++) {
            waves[i].display();
        }
    }
}



function closeArtistRoomConnection() {
    let allRecords = [];
    let recordsToRemove = [];

    for (let i = 0; i < recordList.getEntries().length; i++) {
        allRecords[i] = client.record.getRecord(recordList.getEntries()[i]);
        allRecords[i].whenReady(function () {
            console.log('Record to delete: ' + allRecords[i].get('artist') + ' Owner of the record: ' + allRecords[i].get('user'));
            if (allRecords[i].get('user') === user.name) {
                recordsToRemove.push(allRecords[i]);
            }
        });
    }

    if (recordsToRemove.length === 0) {
        client.close();
    } else {
        for (let i = 0; i < recordsToRemove.length; i++) {
            recordList.removeEntry(recordsToRemove[i].get('artist'));
            client.record.getRecord(recordsToRemove[i].get('artist')).delete();
        }

        recordsToRemove[recordsToRemove.length - 1].on('delete', function () {
            client.close();
        });
    }

    client.on('connectionStateChanged', connectionState => {
        if (connectionState === 'CLOSED') {
            console.log('Connection state changed to: ' + connectionState + ', you will be redirected to homepage');
            document.location = './homepage.php';
        }
    });
}

function draw() {
    background(0);
    alfa = alfa + PI / 56;
    if (waves.length > 0) {
        for (let i = 0; i < waves.length; i++) {
            waves[i].display();
        }
    }
}


class waveArtist {

    constructor(name, color, divisoes, largura, x, y, shake) {
        this.name = name;
        this.color = color;
        this.divisoes = divisoes;
        this.largura = largura;
        this.x = x;
        this.y = y;
        this.shake = shake;
    }


    display() {

        this.onda();

    }

    onda() {
        stroke(255, 255 - this.color, 255);
        fill(0);
        strokeWeight(2);
        stroke(255, 255 - this.color, 255);
        beginShape();
        fill(0);
        vertex(this.x - this.largura, this.y - 0);
        bezierVertex(this.x - this.largura, this.y - 0, this.x - (this.largura / 2) - (this.largura * (1 / 12)), this.y - 0, this.x - (this.largura / 2), this.y - ((4 / 15) * (this.largura / 2)));
        bezierVertex(this.x - (this.largura / 2) + (1 / 30) * this.largura, this.y - ((4 / 15) * (this.largura / 2)) - ((1 / 10) * (this.largura / 2)), this.x - (4 * (this.largura / 15)), this.y - (this.largura / 2), this.x - 0, this.y - (this.largura / 2));
        bezierVertex(this.x + (this.largura / 5), this.y - (this.largura / 2), this.x + (this.largura / 5), this.y - (this.largura / 6), this.x - 0, this.y - (this.largura / 6));
        bezierVertex(this.x - (2 * (this.largura / 15)), this.y - (this.largura / 6), this.x - (2 * (this.largura / 15)), this.y - ((2 * (this.largura / 2)) / 3), this.x - 0, this.y - ((2 * (this.largura / 2)) / 3));
        bezierVertex(this.x - (2 * ((this.largura - (this.divisoes) * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - ((2 * (this.largura / 2)) / 3), this.x - (2 * ((this.largura - (this.divisoes) * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - (this.largura / 6) - ((this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))), this.x - 0, this.y - (this.largura / 6) - ((this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))));
        bezierVertex((this.x + (this.largura / 5)) - (((6 * this.largura) / 30) / this.divisoes) * (this.divisoes), this.y - (this.largura / 6) - ((this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))), (this.x + (this.largura / 5)) - (((6 * this.largura) / 30) / this.divisoes) * (this.divisoes), this.y - ((this.largura / 2) - (this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))), this.x - 0, this.y - ((this.largura / 2) - (this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))));
        bezierVertex(this.x - (4 * ((this.largura - (this.divisoes) * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - ((this.largura / 2) - (this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))), (this.x - (this.largura / 2) + ((this.divisoes) * (((3 / 10) * this.largura) / this.divisoes))) + ((1 / 30) * this.largura), (this.y - ((4 / 15) * (this.largura / 2))) - ((1 / 10) * (this.largura / 2)), this.x - (this.largura / 2) + ((this.divisoes) * (((3 / 10) * this.largura) / this.divisoes)), this.y - ((4 / 15) * (this.largura / 2)));
        bezierVertex((this.x - (this.largura / 2) + ((this.divisoes) * (((3 / 10) * this.largura) / this.divisoes))) - (this.largura * (1 / 12)), this.y - 0, (this.x - this.largura) + ((this.divisoes) * (((3 / 5) * this.largura) / this.divisoes)), this.y - 0, (this.x - this.largura) + ((this.divisoes) * (((3 / 5) * this.largura) / this.divisoes)), this.y - 0);
        vertex(this.x - this.largura, this.y - 0);
        endShape();


        noFill();

        for (let i = 0; i < this.divisoes; i++) {
            strokeWeight(2);
            beginShape();
            vertex((this.x - this.largura) + (i * (((3 / 5) * this.largura) / this.divisoes)), this.y - 0);
            bezierVertex((this.x - this.largura) + (i * (((3 / 5) * this.largura) / this.divisoes)), this.y - 0, (this.x - (this.largura / 2) + (i * (((3 / 10) * this.largura) / this.divisoes))) - (this.largura * (1 / 12)), this.y - 0, this.x - (this.largura / 2) + (i * (((3 / 10) * this.largura) / this.divisoes)), this.y - ((4 / 15) * (this.largura / 2)));
            bezierVertex((this.x - (this.largura / 2) + (i * (((3 / 10) * this.largura) / this.divisoes))) + ((1 / 30) * this.largura), (this.y - ((4 / 15) * (this.largura / 2))) - ((1 / 10) * (this.largura / 2)), this.x - (4 * ((this.largura - i * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - ((this.largura / 2) - i * ((this.largura / 2) / (this.divisoes * 3))), this.x - 0, this.y - ((this.largura / 2) - i * ((this.largura / 2) / (this.divisoes * 3))));
            bezierVertex((this.x + (this.largura / 5)) - (((6 * this.largura) / 30) / this.divisoes) * i, this.y - ((this.largura / 2) - i * ((this.largura / 2) / (this.divisoes * 3))), ((this.x + (this.largura / 5)) - (((6 * this.largura) / 30) / this.divisoes) * i), this.y - (this.largura / 6) - (i * ((this.largura / 2) / (this.divisoes * 3))), this.x - 0, this.y - (this.largura / 6) - (i * ((this.largura / 2) / (this.divisoes * 3))));
            bezierVertex(this.x - (2 * ((this.largura - i * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - (this.largura / 6) - (i * ((this.largura / 2) / (this.divisoes * 3))), this.x - (2 * ((this.largura - i * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - ((2 * (this.largura / 2)) / 3), this.x - 0, this.y - ((2 * (this.largura / 2)) / 3));
            endShape();
        }

        textAlign(LEFT);
        noStroke();
        fill(255, 255 - this.color, 255);
//        text(this.name, (this.x-this.largura - (this.name.length * 6.5)), this.y - 10, 136);
        text(this.name, (this.x - this.largura / 4), this.y - 10, 136);

    }

}

