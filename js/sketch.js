let x, y;
let duration;

function setup() {
    createCanvas(windowWidth, windowHeight);

    duration = document.getElementsByClassName('duration');
    uri = document.getElementsByClassName('uri')
}

function draw() {
    background(0);
    stroke(255);
    noFill();

    textSize(48);
    text('DURAÇÃO VS AMPLITUDE', 100, 100);

    for(let i = 0; i < duration.length; i++) {
        console.log(uri[i].innerText); //n dá, bloqueado pela CORS policy
        ellipse(windowWidth/2, windowHeight/2, duration[i].innerText / 1000, duration[i].innerText / 1000);
    }
}