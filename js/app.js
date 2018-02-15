"use strict";

import * as helpers from './vendor/helpers';
import {setSearchListeners} from './search';
import {showTodayMain, showTodayForecast} from './todayForecast';
import {showWeekForecast} from './weekForecast';
import {addToStorageList, setStorageListeners, showStorageLists} from './storage';

const request = {
  hourly_api_url: 'http://api.weatherbit.io/v2.0/forecast/3hourly?days=1',
  daily_api_url: 'http://api.weatherbit.io/v2.0/forecast/daily?days=8',
  key: 'e83a8a7ac30d465b93bd8e2bb270bbf7'
};

export function init([lat, long]) {
  const daily_url = buildDailyUrl(lat,long);
  const hourly_url = buildHourlyUrl(lat,long);

  get(daily_url)
    .then(renderForecastValues)
    .then(showWeekForecast)
    .then(showTodayMain)
    .then(get(hourly_url)
            .then(renderForecastValues)
            .then(showTodayForecast)
            .then(saveToHistory)
            .then(setIcons));
}

const buildDailyUrl = (lat, long) => `${request.daily_api_url}&lat=${lat}&lon=${long}&key=${request.key}`

const buildHourlyUrl = (lat, long) => `${request.hourly_api_url}&lat=${lat}&lon=${long}&key=${request.key}`

export const get = url => fetch(url).then(response => response.json())

const renderForecastValues = forecast => {
  forecast.country = getCountryName(forecast.country_code);

  forecast.data.forEach(time => {
    time.dayName = getDayName(time.datetime);
    time.date = getDate(time.datetime);
    time.hours = getTime(time.datetime);
    time.min_temp = Math.round(time.min_temp);
    time.max_temp = Math.round(time.max_temp);
    time.temp = Math.round(time.temp);
    time.skycon = getSkyconClass(time.weather.code, time.weather.icon);
  });

  return forecast;
}

const getTime = date => date.split(':')[1] + ':00';

const getDate = date => date.split('-').reverse().join('/');

const getCountryName = code => helpers.countries.hasOwnProperty(code) ? helpers.countries[code] : code;

const getDayName = date => {
  const d = new Date(date);
  return helpers.days[d.getDay()];
}

const getSkyconClass = (code, icon) => {
  if(code < 600) {
    return 'RAIN';
  }else if(code >= 600 && code < 610) {
    return 'SNOW';
  }else if(code >= 610 && code < 700){
    return 'SLEET';
  }else if(code >= 700 && code < 800){
    return 'FOG';
  }else if(icon === 'c01d') {
    return 'CLEAR_DAY';
  }else if(icon === 'c01n') {
    return 'CLEAR_NIGHT';
  }else if(icon === 'c02d' || icon === 'c03d') {
    return 'PARTLY_CLOUDY_DAY';
  }else if(icon === 'c02n' || icon === 'c03n') {
    return 'PARTLY_CLOUDY_NIGHT';
  }else if(code >= 804 && code <= 900) {
    return 'CLOUDY';
  }
}

const setIcons = () => {
  let skycons = new Skycons({"color":"#fff"});

  helpers.icons.forEach(icon => {
    const elements = document.getElementsByClassName(icon);
    if(elements.length > 0) {
      for(const element of elements) {
        skycons.set(element, icon);
      }
    }
  });

  skycons.play();
}

const saveToHistory = forecast => {
  const cityName = forecast.city_name;
  const history = document.querySelector('.history-list');
  if(!isInHistory(cityName)) {
    localStorage.setItem(cityName, JSON.stringify([forecast.lat, forecast.lon]));
    addToStorageList(cityName, history);
  }
}

const isInHistory = cityName => {
  let is = false;
  for(let i = 0; i < localStorage.length; i++) {
    if(localStorage.key(i) === cityName) {
      is = true;
    }
  }
  return is;
}

document.querySelector('.cel').addEventListener('click', function() {
  if(!this.classList.contains('active')) {
    document.querySelectorAll('.temp').forEach(temp => temp.textContent = convertToFar(temp.textContent));
    this.classList.add('active');
    document.querySelector('.far').classList.remove('active');
  }
});

document.querySelector('.far').addEventListener('click', function() {
  if(!this.classList.contains('active')) {
    document.querySelectorAll('.temp').forEach(temp => temp.textContent = convertToCel(temp.textContent));
    this.classList.add('active');
    document.querySelector('.cel').classList.remove('active');
  }
});

const convertToFar = temp => Math.round(temp * 1.8 + 32);
const convertToCel = temp => Math.round((temp - 32)/1.8);

setSearchListeners();
showStorageLists();
setStorageListeners();
