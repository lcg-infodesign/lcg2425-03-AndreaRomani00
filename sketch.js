let data;

function preload() {
  data = loadTable("assets/data/data.csv", "csv", "header");
}

let riverColor = "#1e90ff"; // colore fiumi
let textColor = "#ffffff"; // colore testo bianco
let bgColor = "#0f1632"; // colore sfondo
let countryFill = "#ffffff"; // poligoni
let padding, vPadding, polygonSize;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('position', 'absolute'); // assicura che il canvas si estenda su tutta la pagina
  
  background(bgColor);
  noLoop(); // impedisce il ridisegno continuo

  // imposta dimensione griglia
  let gridSize = 6; // numero di righe e colonne della "tabella"
  let spacing = width / gridSize; // spazio tra i poligoni (in funzione della griglia)
  
  // calcola numero colonne e righe
  let cols = floor(width / spacing); // numero di colonne
  let rows = floor((height - 120) / spacing); // numero di righe, considerando lo spazio per il titolo

  polygonSize = spacing * 0.7; // dimensione dei poligoni
  padding = polygonSize * 0.3; // padding orizzontale
  vPadding = polygonSize * 0.4; // padding verticale

  fill(textColor);
  textAlign(CENTER, CENTER);
  textSize(24);
  textFont("Courier");
  text("una marea di fiumi!!", width / 2, 50); // testo del titolo

  // centratura
  let totalWidth = cols * (polygonSize + padding) - padding; // larghezza totale della griglia
  let totalHeight = rows * (polygonSize + vPadding) - vPadding; // altezza totale della griglia

  // centratura griglia
  let xpos = (width - totalWidth) / 2 + polygonSize / 2; // centrato orizzontalmente
  let ypos = 100 + polygonSize / 2; // centrato verticalmente sotto il titolo

  let visibleDataCount = min(data.getRowCount(), cols * rows); // massimo numero di paesi da visualizzare

  // disegna i poligoni
  for (let i = 0; i < visibleDataCount; i++) {
    let row = data.rows[i].obj;

    drawCountryWithRivers(xpos, ypos, polygonSize, row);

    xpos += polygonSize + padding; // aggiorna posizione orizzontale
    if (xpos > width - polygonSize) {
      xpos = (width - totalWidth) / 2 + polygonSize / 2; // reset x alla riga successiva
      ypos += polygonSize + vPadding; 
    }
  }
}

function draw() {}

// funzione fiumi (Curve di Bezier)
function drawCountryWithRivers(x, y, size, countryData) {
  push();
  translate(x, y); 

  let numSides = int(random(8, 12)); // numero di lati casuale

  // poligono paese
  fill(countryFill);
  stroke(200, 200, 200);
  strokeWeight(2);
  beginShape();
  let vertices = [];
  for (let i = 0; i < numSides; i++) {
    let angle = map(i, 0, numSides, 0, TWO_PI); // calcolo la posizione dei vertici
    let radius = random(size * 0.4, size * 0.5);
    let xPoint = cos(angle) * radius;
    let yPoint = sin(angle) * radius;
    vertex(xPoint, yPoint);
    vertices.push({ x: xPoint, y: yPoint }); // salvo i vertici per usarli dopo
  }
  endShape(CLOSE);

  // fiumi (curve) dentro il poligono
  noFill();
  stroke(riverColor);
  strokeWeight(2);

  let density = countryData.density;
  for (var i = 0; i < density / 10; i++) {
    let start = random(vertices);
    let end = random(vertices);

    let ctrl1X = lerp(start.x, end.x, random(0.3, 0.5)) + random(-size * 0.2, size * 0.2);
    let ctrl1Y = lerp(start.y, end.y, random(0.3, 0.5)) + random(-size * 0.2, size * 0.2);
    let ctrl2X = lerp(start.x, end.x, random(0.6, 0.8)) + random(-size * 0.2, size * 0.2);
    let ctrl2Y = lerp(start.y, end.y, random(0.6, 0.8)) + random(-size * 0.2, size * 0.2);

    bezier(start.x, start.y, ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, end.x, end.y);
  }

  // nome paese (sotto)
  fill(textColor);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  textFont("Courier"); // uso courier come font
  text(countryData.country, 0, size * 0.6);

  pop();
}

// ridimensiona il canvas a tutta la finestra
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup(); // ricalcola la posizione della griglia
}
