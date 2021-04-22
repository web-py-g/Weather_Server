const fetch = require("node-fetch");

function convertWind (wind){
  const dirs = {N: 'С', W: 'З', E: 'В', S: 'Ю'};
  let result = '';

  if (wind === 0) {result += dirs.N;}
  if ((wind > 0) && (wind <= 45) ) {result += dirs.N + '/' + dirs.E;}
  if ((wind > 45) && (wind <= 90) ) {result += dirs.E;}
  if ((wind > 90) && (wind <= 135) ) {result += dirs.E + '/' + dirs.S;}
  if ((wind > 135) && (wind <= 180) ) {result +=dirs.S;}
  if ((wind > 180) && (wind <= 225) ) {result += dirs.S + '/' + dirs.W;}
  if ((wind > 225) && (wind <= 270) ) {result +=dirs.W;}
  if ((wind > 270) && (wind <= 315) ) {result += dirs.N + '/' + dirs.W;}
  if ((wind > 315) && (wind <= 360) ) {result +=dirs.N;}

  return result;
}

class ApiRequester {
  constructor(){
      this.key = '&appid=23b165255fbf21ce4cfa7be39b155b62&lang=ru&units=metric';
      this.urlSample = "https://api.openweathermap.org/data/2.5/weather?";
  }

  async simlifyJsonData(jsonData){

    let resJson = {
      cityName : jsonData.name,
      coords : {
        lat : jsonData.coord.lat,
        lon : jsonData.coord.lon
      },
      temp : jsonData.main.temp + '°C',
      icon : "https://openweathermap.org/img/wn/" + (jsonData.weather[0].icon) + "@2x.png",
      wind : jsonData.wind.speed + ' м/с' + ', ' + convertWind(jsonData.wind.deg),
      pressure : jsonData.main.pressure + ' мм.рт.с',
      humidity : jsonData.main.humidity + '%',
      cloud : jsonData.clouds.all + '%',
      id : jsonData.id
    }

    return resJson;
  }

  async getResponse(cityIdentifier) {

    const response = await fetch(this.urlSample + cityIdentifier + this.key)
    .then(function(resp) {
  		if (resp.status != 200) {
  			return null;
  		}
  		return resp.json();
      })
      
    return this.simlifyJsonData(response);
  }
}

module.exports = ApiRequester;