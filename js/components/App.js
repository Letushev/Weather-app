import Component from './../framework/Component';

import Current from './Current';
import Forecast from './Forecast';
import Search from './Search';
import Storage from './Storage';
import Degree from './Degree';

import { getWeatherInfo } from './../utils/api';
import { editCurrentValues, editForecastValues, bindAll, startSkycons } from './../utils/helpers';

export default class App extends Component {

  constructor() {
    super();

    this.state = {
      location: {
        cityName: new URLSearchParams(location.search).get('city') || '',
        lat: null,
        lng: null
      },
      current: null,
      forecast: null
    };

    bindAll(
      this,
      'onLocationIsFound',
      'onDegreeChange',
      'onDropdownItemClick',
      'onMakeFavorite',
      'addToHistoryStack'
    );

    this._search = new Search({onLocationIsFound: this.onLocationIsFound});
    this._current = new Current();
    this._forecast = new Forecast();
    this._storage = new Storage({onDropdownItemClick: this.onDropdownItemClick});
    this._degree = new Degree({onDegreeChange: this.onDegreeChange});

    this.init();

    window.addEventListener('popstate', ({ state }) => {
      this.updateState(state);
    });
  }

  init() {
    const initialCityName = 'Kiev';

    if (this.state.location.cityName) { // smth present in url ?= -> search it
      this._search.update({cityName: this.state.location.cityName});
    } else {
      if (JSON.parse(localStorage.getItem('last'))) { // history is not empty -> search by last location
        this.onLocationIsFound(JSON.parse(localStorage.getItem('last')));
      } else { // history is empty -> search by INITIAL
        this._search.update({cityName: initialCityName});
      }
    }
  }

  onLocationIsFound(location) {
    this.getWeather(location);
    this._storage.update({locationForHistory: location});
  }

  getWeather(location, degree = 'M') {
    getWeatherInfo(location, degree)
      .then(weatherInfo => this.computeNextState(location, weatherInfo))
      .then(this.updateState)
      .then(this.addToHistoryStack);
  }

  computeNextState(nextLocation, [nextCurrent, nextForecast]) {
    return {
      location: nextLocation,
      current: editCurrentValues(nextCurrent),
      forecast: editForecastValues(nextForecast)
    };
  }

  render() {
    this._current.update({
      cityName: this.state.location.cityName,
      current: this.state.current,
      onMakeFavorite: this.onMakeFavorite
    });

    this._forecast.update({
      forecast: this.state.forecast
    });

    startSkycons();
  }

  onMakeFavorite(cityName) {
    this._storage.update({favorite: cityName});
  }

  onDropdownItemClick(location) {
    this.onLocationIsFound(location);
  }

  onDegreeChange(degree) {
    this.getWeather(this.state.location, degree);
  }

  addToHistoryStack() {
    history.pushState(
      this.state,
      this.state.location.cityName,
      `?city=${this.state.location.cityName}`
    );
  }

}

new App();
