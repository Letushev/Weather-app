import { elements } from './../vendor/elements';

export default class Current {

  constructor(props) {
    this.props = props;
    this.state = null;
  }

  update(nextProps) {
    this.props = Object.assign({}, this.props, nextProps);
    this.updateState({current: this.props.current});
  }

  updateState(nextState) {
    this.state = nextState;
    this.showCurrentWeather();
    this.createStarButton();
  }

  showCurrentWeather() {
    elements.current_wrapper.innerHTML =
     `<section>
        <h1>${this.state.current.city_name}<span class="country">${this.state.current.country}</span></h1>
        <div class="current-main-values">
          <p class="current-temp"><span class="temp">${this.state.current.temp}</span>&deg;</p>
          <ul>
            <li>${this.state.current.wind_spd} m/s <span class="wind-dir" style="transform:rotate(${this.state.current.wind_dir}deg)">&uarr;</span></li>
            <li>Feels like: <span class="temp">${this.state.current.app_temp}</span>&deg;</li>
            <li>Humidity: ${this.state.current.rh}%</li>
          </ul>
          <canvas class="${this.state.current.weather.icon}" width="80px" height="80px"></canvas>
        </div>
        <p class="description">${this.state.current.weather.description}</p>
      </section>

      <table>
        <tr>
          <th>Pressure</th>
          <td>${this.state.current.pres} mb</td>
        </tr>
        <tr>
          <th>Dew point</th>
          <td>${this.state.current.dewpt}&deg;</td>
        </tr>
        <tr>
          <th>Cloud coverage</th>
          <td>${this.state.current.clouds}%</td>
        </tr>
        <tr>
          <th>Visibility</th>
          <td>${this.state.current.vis} km</td>
        </tr>
        <tr>
          <th>Sunrise</th>
          <td>${this.state.current.sunrise}</td>
        </tr>
        <tr>
          <th>Sunset</th>
          <td>${this.state.current.sunset}</td>
        </tr>
      </table>`;
  }

  createStarButton() {
    const star = document.createElement('button');
    const favorites = JSON.parse(localStorage.getItem('favorites'));

    star.className = 'star';
    star.textContent = '\u2606';
    star.setAttribute('type', 'button');
    if (favorites && favorites.includes(this.state.current.city_name)) {
      star.classList.add('favorite');
      star.setAttribute('disabled', '');
    }

    star.addEventListener('click', () => this.props.onStar(this.state.current.city_name));

    elements.current_wrapper.appendChild(star);
  }

}
