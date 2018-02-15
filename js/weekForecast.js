export function showWeekForecast(forecast) {
  const copy = document.querySelector('.weather-forecast').cloneNode();
  forecast.data.forEach(day => {
    copy.innerHTML += addDayForecast(day);
  });
  document.querySelector('.weather-forecast').replaceWith(copy);
  return forecast;
}

const addDayForecast = day => {
  const dayForecast = `
    <div class="day-forecast">
        <h2>${day.dayName}</h2>
        <time>${day.date}</time>
        <p>${day.weather.description}</p>
        <div class="main-values">
          <canvas class="${day.skycon}" width="40px" height="40px"></canvas>
          <ul>
            <li><span class="temp">${day.min_temp}</span>&deg; | <span class="temp">${day.max_temp}</span>&deg;</li>
            <li>${day.wind_spd} m/s <span class="wind-dir" style="transform:rotate(${day.wind_dir}deg)">&uarr;</span></li>
          </ul>
        </div>
      </div>
  `;
  return dayForecast;
}
