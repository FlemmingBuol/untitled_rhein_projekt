let waterdata;
var socket;
let databobject;
let projection;
let zoom = 200000;
let zuflussp = [];
let schonflussp = [];
let imgunder;
let screen = "birs";
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
let schonflussattrarray = [
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
  socket = io.connect("http://localhost:3000/");
  var canvas = createCanvas(1920, 1080);
  canvas.parent("partikel");
  socket.on("newdatapoint", (d) => {
     console.log(d.probenahmestelle);
    dataobject = d;
    if (d.probenahmestelle === "GEW_BIRS_BIRSK") {
      particleSpawner(databobject);
    } else
    if (d.probenahmestelle === "GEW_RHEIN_IWB") {
      particleSpawneralt(dataobject);

    }
  });
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
        let payload = { screen: "alban", data: zuflussp[i].data };
        socket.emit("altePartikelSta", payload);
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
      if (ind >= schonflussattrarray.length - 1) {
        let payload = { screen: "alban", data: schonflussp[i].data };
        socket.emit("altePartikelSta", payload);
        schonflussp.splice(i, 1);
        console.log("Länge:", schonflussp.length);
      } else {
        ind++;
        schonflussp[i].setAttractor(
          createVector(schonflussattrarray[ind].x, schonflussattrarray[ind].y)
        );
        schonflussp[i].setAttractorIndex(ind);
      }
    }
  }
  // Display die Coordinaten der Attraktoren
    for (i = 0; i < zuflussattrarray.length; i++) {
      push();
    fill("yellow");
     ellipse(zuflussattrarray[i].x, zuflussattrarray[i].y, 10);
     pop();
   }
    for (i = 0; i < schonflussattrarray.length; i++) {
      push();
     fill("green");
     ellipse(schonflussattrarray[i].x, schonflussattrarray[i].y, 10);
     pop();
    }
  //Bild overlay
}

//Dies ist das Testpartikel, hier wird getestet wie das Partikel fliesst
class Partikel {
  constructor(x, y, data) {
    this.position = createVector(x, y);
    this.speed = createVector(0, 0);
    this.acc = createVector(1, 1);
    this.origin = createVector(x, y);
    this.prevpos = createVector(x, y);
    this.attractor = createVector(0, 0);
    this.attractorIndex = 0;
    this.maxSpeed = random(2, 3);
    this.data = data;
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
    push();
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text(this.data, this.position.x, this.position.y - 10);
    pop();
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

// function keyPressed() {
//   if (keyCode === LEFT_ARROW) {
//     let tp = new Partikel(1920, random(650, 660));
//     tp.setAttractor(createVector(zuflussattrarray[0].x, zuflussattrarray[0].y));
//     zuflussp.push(tp);
//     var data = {"Taste": "links"};
//     socket.emit("Taste", data)

//   } else if (keyCode === RIGHT_ARROW) {
//     let tp = new Partikel();
//     tp.setAttractor(
//       createVector(schonflussattarray[0].x, schonflussattarray[0].y)
//     );
//     schonflussp.push(tp);
//     var data = {"Taste": "rechts"};
//     socket.emit("Taste", data)
//   }
// }

function particleSpawner(d) {
  //console.log(zuflussp);
  let tp = new Partikel(1920, random(650, 660), dataobject.parameter);
  tp.setAttractor(createVector(zuflussattrarray[0].x, zuflussattrarray[0].y));
  zuflussp.push(tp);
  console.log("Partikel entstanden");
  console.log(dataobject);
}

function particleSpawneralt(d) {

  let tp = new Partikel(-5, random(700, 800), dataobject.parameter);
  tp.setAttractor(
    createVector(schonflussattrarray[0].x, schonflussattrarray[0].y)
  );
  schonflussp.push(tp);
  console.log(schonflussp);

  console.log("altes Partikel entstanden");
  //console.log(dataobject);
}
