let waterdata;
var socket;
let projection;
let zoom = 200000;
let zuflussp = [];
let schonflussp = [];
let imgunder;
let imgover;
let attrthresh = 30;
let attrindex = 0;
let zuflussattrarray = [
  {
    x: 1450,
    y: 685,
  },
  {
    x: 1400,
    y: 700,
  },
  {
    x: 2020,
    y: 780,
  },
];
let schonflussattarray = [
  {
    x: 400,
    y: 850,
  },
  {
    x: 1300,
    y: 1180,
  },
];
function preload() {
  waterdata = loadJSON("100066nachdatum.json", function (d) {
    console.log(waterdata, "geladen");
    //hier Lade ich ein Testbild rein um nicht ständig ein Video abspielen zu müssen
  });
}

function setup() {
  socket = socket.io.connect("http://localhost:3000/");
  var canvas = createCanvas(1920, 1080);
  canvas.parent("partikel");

  frameRate(25);
  // Partikel generieren
  //   for (i = 0; i < 15; i++) {
  //     let tp = new TestPartikel(random(150, 250), 560);
  //     tp.setAttractor(createVector(attrarray[0].x, attrarray[0].y));
  //     testp.push(tp);
  //   }
}

function draw() {
  clear();
  background(255, 0);
  //console.log(mouseX, mouseY);
  //der Controller
  for (i = 0; i < zuflussp.length; i++) {
    if (zuflussp.length == 0) {
      console.log("Leeres Array");
    } else {
      zuflussp[i].update();

      zuflussp[i].display();

      zuflussp[i].vecind();
    }
    if (zuflussp[i].getAttractorDistance() < attrthresh) {
      let ind = zuflussp[i].getAttractorIndex();
      //console.log(ind, testp[i].getAttractorDistance());

      if (ind >= zuflussattrarray.length - 1) {
        zuflussp.splice(i, 1);
        console.log("Länge:", zuflussp.length);
      } else {
        ind++;
        zuflussp[i].setAttractor(
          createVector(zuflussattrarray[ind].x, zuflussattrarray[ind].y)
        );
        zuflussp[i].setAttractorIndex(ind);
      }
    }
  }
  for (i = 0; i < schonflussp.length; i++) {
    if (schonflussp.length == 0) {
      console.log("Leeres Array");
    } else {
      schonflussp[i].update();

      schonflussp[i].display();

      schonflussp[i].vecind();
    }
    if (schonflussp[i].getAttractorDistance() < attrthresh) {
      let ind = schonflussp[i].getAttractorIndex();
      if (ind >= schonflussattarray.length - 1) {
        schonflussp.splice(i, 1);
        console.log("Länge:", zuflussp.length);
      } else {
        ind++;
        schonflussp[i].setAttractor(
          createVector(schonflussattarray[ind].x, schonflussattarray[ind].y)
        );
        schonflussp[i].setAttractorIndex(ind);
      }
    }
  }
  for (i = 0; i < zuflussattrarray.length; i++) {
    push();
    fill("yellow");
    ellipse(zuflussattrarray[i].x, zuflussattrarray[i].y, 10);
    pop();
  }
  for (i = 0; i < schonflussattarray.length; i++) {
    push();
    fill("green");
    ellipse(schonflussattarray[i].x, schonflussattarray[i].y, 10);
    pop();
  }
  //Bild overlay
}

//Dies ist das Testpartikel, hier wird getestet wie das Partikel fliesst
class Partikel {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.speed = createVector(0, 0);
    this.acc = createVector(1, 1);
    this.origin = createVector(x, y);
    this.prevpos = createVector(x, y);
    this.attractor = createVector(0, 0);
    this.attractorIndex = 0;
    this.maxSpeed = random(2, 3);
  }
  //zeigt wo und in welche richtung die Partikel fliessen
  vecind() {
    push();
    stroke(0, 255, 0);
    strokeWeight(5);
    line(
      this.origin.x,
      this.origin.y,
      this.speed.x + this.origin.x,
      this.speed.y + this.origin.y
    );
    pop();
  }
  update() {
    // console.log(this.proximity);

    this.acc = p5.Vector.sub(this.attractor, this.position);
    // if (this.acc.mag() > attrthresh) {
    this.acc.setMag(0.1);
    // console.log(this.acc);
    this.speed.add(this.acc);
    this.speed.limit(this.maxSpeed);
    this.position.add(this.speed);
    /* } else {
      attrindex++;
    }*/
  }
  display() {
    ellipse(this.position.x, this.position.y, 10);
  }

  getPosition() {
    return this.position.copy();
  }
  setAttractor(a) {
    this.attractor = a.copy();
  }
  getAttractorIndex() {
    return this.attractorIndex;
  }
  setAttractorIndex(i) {
    this.attractorIndex = i;
  }
  getAttractorDistance() {
    return p5.Vector.sub(this.attractor, this.position).mag();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    let tp = new Partikel(1920, random(650, 660));
    tp.setAttractor(createVector(zuflussattrarray[0].x, zuflussattrarray[0].y));
    zuflussp.push(tp);
    var data = {"taste": "links"};
    socket.emit("Taste", data)

  } else if (keyCode === RIGHT_ARROW) {
    let tp = new Partikel(-5, random(700, 800));
    tp.setAttractor(
      createVector(schonflussattarray[0].x, schonflussattarray[0].y)
    );
    schonflussp.push(tp);
    var data = {"taste": "rechts"};
    socket.emit("Taste", data)
  }
}

function particleSpawner() {
  // neue zuflüsse mit zufälligen Intervallen Rauslassen for Loop
  // schon im Fluss Partikel durch Websocket Triggern ->Status mitgeben, delay ?
}

function keypress() {}
