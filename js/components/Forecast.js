import { elements } from './../utils/elements';

export default class Forecast {

  constructor() {
    this.props = null;
    this.state = null;
  }

  update(nextProps) {
    this.props = nextProps;
    this.updateState(this.props);
  }

  updateState(nextState) {
    this.state = Object.assign({}, this.state, nextState);
    this.showForecast();
  }

  showForecast() {
    let forecast = '';
    this.state.forecast.forEach(dayWeather => forecast += this.addDayWeather(dayWeather));
    elements.forecastWrapper.innerHTML = forecast;
  }

  addDayWeather(dayWeather) {
    return `<div class="day-forecast">

              <h2>${dayWeather.day}</h2>
              <time>${dayWeather.datetime}</time>
              <p class="description">${dayWeather.weather.description}</p>

              <div class="day-main-values">
                <canvas class="${dayWeather.weather.icon}" width="40px" height="40px"></canvas>
                <ul>
                  <li><span class="temp">${dayWeather.min_temp}</span>&deg; | <span class="temp">${dayWeather.max_temp}</span>&deg;</li>
                  <li>${dayWeather.wind_spd} m/s <span class="wind-dir" style="transform:rotate(${dayWeather.wind_dir}deg)">&uarr;</span></li>
                </ul>
              </div>

            </div>`;
  }
}
