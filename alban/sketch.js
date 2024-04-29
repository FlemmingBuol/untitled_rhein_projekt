let waterdata;
var socket;
let zuflussp = [];
let schonflussp = [];
let imgunder;
let imgover;
let databobject;

let attrthresh = 30;
let attrindex = 0;
let screen="alban";
let zuflussattrarray = [
  {
    x: 505,
    y: 1060,
  },
  {
    x: 545,
    y: 1075,
  },
  {
    x: 565,
    y: 1070,
  },
  {
    x: 750,
    y: 1075,
  },
  {
    x: 1300,
    y: 1090,
  },
];
let schonflussattarray = [
  {
    x: 2000,
    y: 1250,
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
  socket.on("newdatapoint", (d) => {
   // console.log(d);
   dataobject = d

if (d.probenahmestelle === "GEW_ST_ALBANTEICH_MUEHLEGRABEN"){
  particleSpawner(databobject)

}
  });
  socket.on("checkScreen",(data)=>{
    console.log(data)
    if(data.screen==screen){
      //spawn 
      particleSpawneralt({"parameter":data.data})

    }
  })
  var canvas = createCanvas(1080, 1920);
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
        // hier passiert Fehler vielleicht ?
        let payload={"screen":"nix","data":zuflussp[i].data,}
        socket.emit("altePartikelSta",payload)
        console.log("gerade gekillt"+ zuflussp[i].data)
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
  // for (i = 0; i < zuflussattrarray.length; i++) {
  //   push();
  //   fill("yellow");
  //   ellipse(zuflussattrarray[i].x, zuflussattrarray[i].y, 10);
  //   pop();
  // }
  // for (i = 0; i < schonflussattarray.length; i++) {
  //   push();
  //   fill("green");
  //   ellipse(schonflussattarray[i].x, schonflussattarray[i].y, 10);
  //   pop();
  // }
  //Particles Spawn
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
    this.data = data
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
    push()
    fill(255)
    textSize(20)
    textAlign(CENTER)
    text(this.data, this.position.x, this.position.y-10);
    pop()
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
//   emitnewParticles();
//   console.log("Partikel entstanden");
// }
// function emitnewParticles() {
//   console.log(zuflussp);
//   let tp = new Partikel(505, random(1060, 1065), waterdata[0].fields.gruppe);
//   tp.setAttractor(createVector(zuflussattrarray[0].x, zuflussattrarray[0].y));
//   zuflussp.push(tp);
  // if (keyCode === LEFT_ARROW) {

  //   let tp = new Partikel(505,random(1060,1065),waterdata[i].fields.gruppe);
  //   tp.setAttractor(createVector(zuflussattrarray[0].x, zuflussattrarray[0].y));
  //   zuflussp.push(tp);
  //   var data = {"Taste": "left"};
  //   socket.emit("Taste", data)

  // } else if (keyCode === RIGHT_ARROW) {
  //   let tp = new Partikel(-5, random(1100, 1400));
  //   tp.setAttractor(
  //     createVector(schonflussattarray[0].x, schonflussattarray[0].y)
  //   );
  //   schonflussp.push(tp);
  //   var data = {"Taste": "right"
  // ,
  // "x": mouseX,
  // "y": mouseY
  // };
  //   socket.emit("Taste", data)
  // }}
// }

function particleSpawner(d) {
  //console.log(zuflussp);
  let tp = new Partikel(505, random(1060, 1065), dataobject.parameter);
  tp.setAttractor(createVector(zuflussattrarray[0].x, zuflussattrarray[0].y));
  zuflussp.push(tp);
  console.log("Partikel entstanden");

}

function particleSpawneralt(d) {
  //console.log(zuflussp);
  let tp = new Partikel(-50, 1300, dataobject.parameter);
  tp.setAttractor(createVector(schonflussattarray[0].x, schonflussattarray[0].y));
  schonflussp.push(tp);
  console.log("altes Partikel entstanden");

}



