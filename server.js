// This is based on a tutorial from https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
require('dotenv').config();

const apiKey = process.env.API_KEY;
let cityData = {};

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  
  let citiesUrl = `http://api.openweathermap.org/data/2.5/group?id=524901,5318313,2643743,1815286,1816670&units=imperial&appid=${apiKey}`;

  request(citiesUrl, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Trouble getting top cities', weatherIcon: null, cities: null});
    } else {
      cityData = JSON.parse(body);
      
      res.render('index', {weather: null, error: 'Trouble getting top cities', weatherIcon: null, cities: cityData});
    }
  });
});

app.post('/', function (req, res) {
  // using body-parser to get the input from the user 
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  
  
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again', weatherIcon: null, cities: null});
    } else {
      let weather = JSON.parse(body);
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again', weatherIcon:null, cities: null});
      } else {
        weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
        
        res.render('index', {weather: weatherText, error: null, weatherIcon: weatherIcon, cities: cityData});
      }
    }
  });
  
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
