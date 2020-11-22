"use strict";

var mysql = require("mysql");
var bodyParser = require("body-parser");
const e = require("express");

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

fetchCustomer: function (req, res) {
  var query = 'SELECT AVAIN, NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN FROM asiakas WHERE AVAIN=' + req.params.id;
     
  connection.query(query, function (error, results, fields) {
    if (error) {
          console.log('Virhe syy: ' + error);
          res.status(500).json({ 'status': 'not ok', 'status_text': error.sqlMessage });
      } else {
          res.status(200).json(results);
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
    if(req.params.id === 0) {
      res.status(404).JSON({});
    }
    console.log("Muokattiin käyttäjää:")
    console.dir(req.body)
    console.log(req.params.id)

    var sqlEdit ="UPDATE asiakas SET NIMI='" + req.body.nimi + "', OSOITE='" + req.body.osoite + "', POSTINRO='" + req.body.postinro + "', POSTITMP='" + req.body.postitmp + "' WHERE AVAIN='" + req.params.id + "'" ;

    var editedData = [req.body.nimi, req.body.osoite, req.body.postinro, req.body.postitmp];

    connection.query(sqlEdit, function(error, results, fields){
      if ( error ){
        console.log("Virhe: " + error);
        res.send({"status": "500", "error": error, "response": null}); 
      }
      else
      {					
        res.send({"status": "OK", "error": ""}); 
      }
      });
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
