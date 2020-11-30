'use strict';

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const axios = require('axios');
const fs = require('fs');

const app = express();

app.get('/status/:plz', (req, res) => {

  let plz = req.params.plz;
  let test = "t";

  let gemData = JSON.parse(fs.readFileSync('gemeinden.json'));
  let gemeinden = gemData.data.find(gemeinde => gemeinde.plz === plz);

  axios.get('https://corona-ampel.gv.at/sites/corona-ampel.gv.at/files/assets/Warnstufen_Corona_Ampel_Gemeinden_aktuell.json')
      .then(function (response) {
          let ampelData = response.data;
          let ampelStatus = ampelData[0].Warnstufen.find(gemeinde => gemeinde.GKZ === gemeinden.gkz);
          res.send(ampelStatus);
      })
      .catch(function (error) {
          res.send(error);
      });
});

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

module.exports = app;
