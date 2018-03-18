import Component from './../framework/Component';
import { elements } from './../utils/elements';

export default class Current extends Component {

  constructor() {
    super();
  }

  update(props) {
    super.update(props);
    this.render();
  }

  render() {
    elements.currentWrapper.innerHTML =
     `<section>
        <h1>${this.props.cityName}<span class="country">${this.props.current.country}</span></h1>
        <div class="current-main-values">
          <p class="current-temp"><span class="temp">${this.props.current.temp}</span>&deg;</p>
          <ul>
            <li>${this.props.current.wind_spd} m/s <span class="wind-dir" style="transform:rotate(${this.props.current.wind_dir}deg)">&uarr;</span></li>
            <li>Feels like: <span class="temp">${this.props.current.app_temp}</span>&deg;</li>
            <li>Humidity: ${this.props.current.rh}%</li>
          </ul>
          <canvas class="${this.props.current.weather.icon}" width="80px" height="80px"></canvas>
        </div>
        <p class="description">${this.props.current.weather.description}</p>
      </section>

      <table>
        <tr>
          <th>Pressure</th>
          <td>${this.props.current.pres} mb</td>
        </tr>
        <tr>
          <th>Dew point</th>
          <td>${this.props.current.dewpt}&deg;</td>
        </tr>
        <tr>
          <th>Cloud coverage</th>
          <td>${this.props.current.clouds}%</td>
        </tr>
        <tr>
          <th>Visibility</th>
          <td>${this.props.current.vis} km</td>
        </tr>
        <tr>
          <th>Sunrise</th>
          <td>${this.props.current.sunrise}</td>
        </tr>
        <tr>
          <th>Sunset</th>
          <td>${this.props.current.sunset}</td>
        </tr>
      </table>`;

      this.createStarButton();
  }

  createStarButton() {
    const favorites = JSON.parse(localStorage.getItem('favorites'));

    const star = document.createElement('button');
    star.className = 'star';
    star.textContent = '\u2606';
    if (favorites && !!favorites.find(({cityName}) => cityName === this.props.cityName)) {
      star.classList.add('favorite');
      star.setAttribute('disabled', '');
    }

    star.addEventListener('click', () => {
      this.props.onMakeFavorite(this.props.cityName)
    });

    elements.currentWrapper.appendChild(star);
  }

}
