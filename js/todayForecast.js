import {addToStorageList} from './storage';

const favorities = document.querySelector('.favorities-list');
const weatherToday = document.querySelector('.weather-today');

export function showTodayMain(forecast) {
  const today = forecast.data[0];
  const main = `
    <button type="button" class="star">&#x2606;</button>

    <h1>${forecast.city_name}<span class="city-country">${forecast.country}</span></h1>

    <div class="today-main-values">
      <p class="mainTemp"><span class="temp">${today.temp}</span>&deg;</p>
      <ul>
        <li><span class="temp">${today.min_temp}</span>&deg; | <span class="temp">${today.max_temp}</span>&deg;</li>
        <li>Humidity: ${today.rh}%</li>
        <li>Precipitation: ${today.pop}%</li>
      </ul>
      <canvas class="${today.skycon}" width="80px" height="80px"></canvas>
    </div>

    <p class="description">${today.weather.description}</p>
  `;
  weatherToday.innerHTML = main;

  const star = document.querySelector('.star');
  star.addEventListener('click', function() {
    localStorage.setItem(forecast.city_name, JSON.stringify([forecast.lat, forecast.lon, 'star']));
    addToStorageList(forecast.city_name, favorities);
  });
}

export function showTodayForecast(forecast) {
  const table = document.createElement('table');
  forecast.data.forEach(time => {
    table.innerHTML += addHoursForecast(time);
  });
  weatherToday.appendChild(table);
  return forecast;
}

const addHoursForecast = time => {
  const hoursForecast = `
    <tr>
      <th>${time.hours}</th>
      <td><canvas class="${time.skycon}" width="20px" height="20px"></canvas></td>
      <td><span class="temp">${time.temp}</span>&deg;</td>
      <td>${time.wind_spd} m/s <span class="wind-dir" style="transform:rotate(${time.wind_dir}deg)">&uarr;</span></td>
    </tr>
  `;
  return hoursForecast;
}
