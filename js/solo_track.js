let trackAnalysis, up;

function preload() {
    trackAnalysis = loadJSON('php/trackAnalysis.json');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    up = 0;

    console.log(trackAnalysis.bars[0].start);
}

function draw() {
    background(0);
    fill(255);
    stroke(255);

    console.log(millis()/1000);

    for(let i = 0; i < trackAnalysis.sections.length; i++) {
        if((millis() / 1000 > trackAnalysis.sections[i].start) && (millis() / 1000 < trackAnalysis.sections[i].start + trackAnalysis.sections[i].duration)) {
            up = windowHeight / 10;
        } else {
            up = 0;
        }

        ellipse(map(trackAnalysis.sections[i].start, 0, trackAnalysis.track.duration, 0, windowWidth), windowHeight / 6 - up, 5, 5);

        if(i < trackAnalysis.sections.length - 1) {
            console.log(i);
            line(map(trackAnalysis.sections[i].start, 0, trackAnalysis.track.duration, 0, windowWidth), windowHeight / 6 - up, map(trackAnalysis.sections[i + 1].start, 0, trackAnalysis.track.duration, 0, windowWidth), windowHeight / 6 - up);
        }
    }

    for(let i = 0; i < trackAnalysis.bars.length; i++) {
        if((millis() / 1000 > trackAnalysis.bars[i].start) && (millis() / 1000 < trackAnalysis.bars[i].start + trackAnalysis.bars[i].duration)) {
            up = windowHeight / 10;
        } else {
            up = 0;
        }

        ellipse(map(trackAnalysis.bars[i].start, 0, trackAnalysis.track.duration, 0, windowWidth), (windowHeight / 6 * 2) - up, 4, 4);
    }

    for(let i = 0; i < trackAnalysis.beats.length; i++) {
        if((millis() / 1000 > trackAnalysis.beats[i].start) && (millis() / 1000 < trackAnalysis.beats[i].start + trackAnalysis.beats[i].duration)) {
            up = windowHeight / 10;
        } else {
            up = 0;
        }

        ellipse(map(trackAnalysis.beats[i].start, 0, trackAnalysis.track.duration, 0, windowWidth), (windowHeight / 6 * 3) - up, 3, 3);
    }

    for(let i = 0; i < trackAnalysis.tatums.length; i++) {
        if((millis() / 1000 > trackAnalysis.tatums[i].start) && (millis() / 1000 < trackAnalysis.tatums[i].start + trackAnalysis.tatums[i].duration)) {
            up = windowHeight / 10;
        } else {
            up = 0;
        }

        ellipse(map(trackAnalysis.tatums[i].start, 0, trackAnalysis.track.duration, 0, windowWidth), (windowHeight / 6 * 4) - up, 2, 2);
    }

    for(let i = 0; i < trackAnalysis.segments.length; i++) {
        if((millis() / 1000 > trackAnalysis.segments[i].start) && (millis() / 1000 < trackAnalysis.segments[i].start + trackAnalysis.segments[i].duration)) {
            up = windowHeight / 10;
        } else {
            up = 0;
        }

        ellipse(map(trackAnalysis.segments[i].start, 0, trackAnalysis.track.duration, 0, windowWidth), (windowHeight / 6 * 5) - up, 1, 1);
    }
}