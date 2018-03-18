import Component from './../framework/Component';
import { elements } from './../utils/elements';

export default class Forecast extends Component {

  constructor() {
    super();
  }

  update(props) {
    super.update(props);
    this.render();
  }

  render() {
    let result = this.props.forecast.reduce((forecast, dayWeather) => forecast += this.addDayWeather(dayWeather), '');
    elements.forecastWrapper.innerHTML = result;
  }

  addDayWeather(dayWeather) {
    return `
      <div class="day-forecast">

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

      </div>
    `;
  }
}
