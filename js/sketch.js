let x, y;
let danceability;

function setup() {
    createCanvas(1920, 1080);

    danceability = document.getElementsByClassName('danceability');
}

function draw() {
    stroke(0);
    noFill();

    for(let i = 0; i < danceability.length; i++) {
        console.log(danceability[i].innerText);
        ellipse(windowWidth/2, windowHeight/2, danceability[i].innerText * 500, danceability[i].innerText * 500);
    }
}