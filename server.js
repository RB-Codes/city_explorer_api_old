'use strict'
require('dotenv').config();

const express = require('express');

const cors = require('cors');

const pg = require('pg');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.get('/', (request, response) => {
  response.status(200).send('You are online Boss')
});
app.get('/location', loc)

function loc(request, response) {
  const city = request.query.city;
  let queryS =`SELECT * FROM LOCATIONS WHERE search_query =$1;`
  let stored=[city];
  notclint.query(queryS,stored)
    .then(daBazz=>{
      if(daBazz.rows.length==0){
        let key = process.env.LOCATIONIQ_KEY;
        let url = `https://eu1.locationiq.com/v1/search.php?key=${key}&queryS=${city}&format=json`;
        superagent.get(url)
          .then(geoData => {
            const locationData = new Location(city, geoData.body);
            let queryS = `INSERT INTO locations(search_query,formatted_query,latitude,longitude) VALUES ($1, $2, $3, $4);`
            let stored =[locationData.search_query,locationData.formatted_query,locationData.latitude,locationData.longitude];
            notclint.query(queryS,stored)
            console.log('this from apis');
            response.status(200).json(locationData);
          });
      }else{
        console.log('this from db');
        response.status(200).send(daBazz.rows[0]);
      }
    })
}

var cityLoc=[];
function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData[0].display_name;
  this.latitude = locationData[0].lat;
  this.longitude = locationData[0].lon;
  cityLoc.push(this);
}



app.get('/weather', (request, response) => {
  // const weatherData = require('./data/weather.json');
  
  superagent.get(url)
    .then(weatherData => {
      var notArrResult = [];
      // console.log(weatherData.data)
      // response.send(weatherData.body.data);

      weatherData.body.data.forEach((element,idx) => {
        if(idx < 8){
          let notResult= new Weather(element);
          notArrResult.push(notResult);

        }else{
        }
        // console.log(locationData);
      });
      response.status(200).json(notArrResult);
    });
});
function Weather(weatherData) {
  this.forecast = weatherData.weather.description;
  this.time = new Date(weatherData.datetime).toDateString();

}



app.get('*', (request, response) => {
  response.status(404).send('Nobody is here you are alone')
});

app.get((error, request, response) => {
  response.status(500).send('Process Failed')
});

