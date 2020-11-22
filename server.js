var express = require("express"); // Paketti pyyntojen reitittämiseen
var app = express();
var fs = require("fs");

// Otetaan käyttöön body-parser, jotta voidaan html-requestista käsitellä viestin body post requestia varten... *
var bodyParser = require("body-parser");
// Pyyntöjen reitittämistä varten voidaan käyttää Controllereita
var customerController = require("./customerController");

const http = require("http");
const url = require("url");

const hostname = "127.0.0.1";
const port = process.env.PORT || 3002;

//CORS middleware
var allowCrossDomain = function (req, res, next) {
  // Jos haluttaisiin rajata hakuja joidenkin ehtojen perusteella, niin määritettäisiin näin:
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};
// Otetaan käyttöön CORS säännöt:
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //* ...jsonina

// Staattiset tiedostot, esim. kuvat, tyylitiedostot, scriptit käyttöliittymää varten
app.use(express.static("public"));

// REST API Asiakas
app
  .route("/Types") // route reitittää pyynnön merkkijonon ja metodin perusteella customerControlleriin
  .get(customerController.fetchTypes);

app
  .route("/Asiakas")
  .get(customerController.fetchAll)
  .post(customerController.create);

app
  .route("/Asiakas/:id")
  .put(customerController.update)
  .get(customerController.fetchCustomer)
  .delete(customerController.delete);


app.get("/", function (request, response) {
  fs.readFile("node.html", function(err, data){
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(data);
    response.end();    
});


});

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
