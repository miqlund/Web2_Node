"use strict";

var mysql = require("mysql");
var bodyParser = require("body-parser");

// Luodaan yhteys tietokantaan
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",                 // OMA KÄYTTÄJÄ
  password: "Jalkapallo20",     // OMA SALASANA
  database: "asiakas",          // OMA TIETOKANNAN NIMI
});

module.exports = {

  
  fetchTypes: function (req, res) {
    connection.query(
      "SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi",
      function (error, results, fields) {
        if (error) {
          console.log("Virhe haettaessa dataa, syy " + error);
          res.send({ status: 500, error: error, response: null });
        } else {
          console.log("Data = " + JSON.stringify(results));
          res.json(results);
        }
      }
    );
  },

  // Tehtävä 2
  // Haetaan kaikki asiakkaat
  fetchAll: function (req, res) {
    var query = "SELECT AVAIN, NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN FROM asiakas WHERE 1=1";

    if (req.query.length != 0) {
      for (var key in req.query) {
        query += " AND " + key + " LIKE '" + req.query[key] + "%'";
      }
    } else {
      query = "SELECT AVAIN, NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN FROM asiakas WHERE 1=1";
    }
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa, syy " + error);
        res.send({ status: 500, error: error, response: null });
      } else {
        res.json(results);
      }
    });
  },


  // Tehtävä 4 ja 9
  // Lisätään asiakas tietokantaan ja tarkistetaan virheet
  create: function(req, res){
    console.log("Lisättiin käyttäjä:")
    console.dir(req.body)

  if ( req.body.nimi == "" || req.body.osoite == "" )
  {
        res.send({"status": "500", "error": "Kenttä on tyhjä"}); 
  }
  else 
  {
    var sqlInsert = "INSERT INTO asiakas(NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES ('" + req.body.nimi + "', '" + req.body.osoite + "', '" + req.body.postinro + "', '" + req.body.postitmp + "', '" + "11.11.2020', '" + "2')";
    
    connection.query(sqlInsert, function(error, results, fields){
      if ( error ){
        console.log("Virhe: " + error);
        res.send({"status": "500", "error": error, "response": null}); 
      }
      else
      {					
        res.send({"status": "OK", "error": ""}); 
      }
    });
  }
  },


  update: function (req, res) {
    console.log("Muokattiin käyttäjää:")
    console.dir(req.body)

  if ( req.body.nimi == "") {
        res.send({"status": "500", "error": "Nimi on tyhjä"}); 
  }
  if ( req.body.osoite == "") {
    res.send({"status": "500", "error": "Osoite on tyhjä"}); 
  }
  if ( req.body.postinro == "") {
    res.send({"status": "500", "error": "Postinumero on tyhjä"}); 
  }
  if ( req.body.postitmp == "") {
    res.send({"status": "500", "error": "Postitoimipaikka on tyhjä"}); 
  }
  else {
    var sqlEdit ="UPDATE asiakas SET NIMI=?, OSOITE=?, POSTINRO=?, POSTITMP=? WHERE AVAIN='" + req.params.id + "'" ;

    var editedData = [req.body.nimi, req.body.osoite, req.body.postinro, req.body.postitmp];

    connection.query(sqlEdit, editedData, function(error, results, fields){
      if ( error ){
        console.log("Virhe: " + error);
        res.send({"status": "500", "error": error, "response": null}); 
      }
      else
      {					
        res.send({"status": "OK", "error": ""}); 
      }
      });
    }
  },

  // Tehtävä 6
  // Poistetaan asiakas tietokannasta
  delete: function (req, res) {
    console.log("Poistettiin id: " + JSON.stringify(req.params));
    
  var sqlDelete = "DELETE FROM asiakas WHERE AVAIN='" + req.params.id + "'" ;

  connection.query(sqlDelete, function(error, results, fields){
    if ( error ){
      console.log("Asiakkaan poistossa virhe: " + error);
      res.send({"status": 234, "error": error, "response": null}); 
    }
    else
    {
      res.json(results);
    }
});
}
};
