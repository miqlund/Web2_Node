"use strict";

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jalkapallo20",
  database: "asiakas",
});

module.exports = {
  fetchTypes: function (req, res) {
    connection.query(
      "SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi",
      function (error, results, fields) {
        if (error) {
          console.log("Virhe haettaessa dataa asiakas-taulusta, syy " + error);
          res.send({ status: 500, error: error, response: null });
        } else {
          console.log("Data = " + JSON.stringify(results));
          res.json(results);
        }
      }
    );
  },

  // Haetaan kaikki asiakkaat
  fetchAll: function (req, res) {
    var query = "SELECT * FROM asiakas WHERE 1=1";

    if (req.query.length != 0) {
      for (var key in req.query) {
        query += " AND " + key + " LIKE '" + req.query[key] + "%'";
      }
      console.log("Ei tultu SELECT:in kautta");
    } else {
      query = "SELECT * FROM asiakas WHERE 1=1";
      console.log("Tultiin SELECT:in kautta");
    }
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa asiakas-taulusta, syy " + error);
        res.send({ status: 500, error: error, response: null });
      } else {
        res.json(results);
      }
    });
  },

  create: function (req, res) {
    res.send("Kutsuttiin create");
  },

  update: function (req, res) {},

  delete: function (req, res) {
    res.send("Kutsuttiin delete");
  },
};
