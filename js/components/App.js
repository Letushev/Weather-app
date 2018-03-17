import Current from './Current';
import Forecast from './Forecast';
import Search from './Search';
import Storage from './Storage';
import Degree from './Degree';
import * as utils from './../vendor/utils';

export default class App {

  constructor() {
    this.state = {
      current: null,
      forecast: null,
      degree: 'M',
      urlCityName: new URLSearchParams(location.search).get('city') || '',
    };

    this.request = {
      API_URL: 'https://api.weatherbit.io/v2.0',
      API_KEY: '3182fa324b4340ef9cb632451ebb05c1' // e83a8a7ac30d465b93bd8e2bb270bbf7
    }

    this.bindCallbacks();

    this.search = new Search({onSearch: this.onSearch});
    this.current = new Current({onStar: this.onStar});
    this.forecast = new Forecast();
    this.storage = new Storage({onDropdownItemClick: this.onDropdownItemClick});
    this.degree = new Degree({onDegreeChange: this.onDegreeChange});

    this.init();
  }

  bindCallbacks() {
    this.onSearch = this.onSearch.bind(this);
    this.onStar = this.onStar.bind(this);
    this.onDropdownItemClick = this.onDropdownItemClick.bind(this);
    this.onDegreeChange = this.onDegreeChange.bind(this);
  }

  init() {
    const initialCity = 'Kiev';

    if (this.state.urlCityName) { // smth present in url ?= -> search it
      this.search.update({cityName: this.state.urlCityName});
    } else {
      if (this.storage.state.history.length !== 0) { // history is not empty -> search by last
        this.search.update({cityName: JSON.parse(localStorage.getItem('last'))});
      } else { // history is empty -> search by INITIAL
        this.search.update({cityName: initialCity});
      }
    }
  }

  getWeather(location) {
    Promise.all([ this.get(`/current?lat=${location.lat}&lon=${location.lng}&units=${this.state.degree}`)
                    .then(info => info.data[0]),
                  this.get(`/forecast/daily?lat=${location.lat}&lon=${location.lng}&days=8&units=${this.state.degree}`)
                    .then(info => info.data) ])
      .then(data => this.render(data))
      .then(() => this.addToHistoryStack())
      .catch(() => alert('Server responded with error. Please, try again later...'));
  }

  get(query) {
    const url = `${this.request.API_URL}${query}&key=${this.request.API_KEY}`;
    return  fetch(url)
              .then(response => {
                if (response.ok) {
                  return response.json();
                }
              });
  }

  updateState(nextState) {
    this.state = Object.assign({}, this.state, nextState);
    this.showWeather();
    this.storage.update({cityName: this.state.current.cityName});
  }

  render(data) {
    let newCurrent = data[0];
    let newForecast = data[1];

    newCurrent.country = utils.getCountryName(newCurrent.country_code);
    newCurrent.temp = Math.round(newCurrent.temp);
    newCurrent.app_temp = Math.round(newCurrent.app_temp);
    newCurrent.weather.icon = utils.getSkyconClass(newCurrent.weather.code, newCurrent.weather.icon);
    newCurrent.pres = Math.round(newCurrent.pres);

    newForecast = newForecast.map(day => {
      day.day = utils.getWeekDay(day.datetime);
      day.datetime = utils.renderDate(day.datetime);
      day.max_temp = Math.round(day.max_temp);
      day.min_temp = Math.round(day.min_temp);
      day.weather.icon = utils.getSkyconClass(day.weather.code, day.weather.icon);
      return day;
    });

    this.updateState({current: newCurrent, forecast: newForecast});
  }

  showWeather() {
    this.current.update({current: this.state.current});
    this.forecast.update({forecast: this.state.forecast});
    utils.startSkycons();
  }

  onSearch(location) {
    this.getWeather(location);
  }

  onStar(cityName) {
    this.storage.update({favorite: cityName});
  }

  onDropdownItemClick(dropdownCityName) {
    this.search.update({cityName: dropdownCityName});
  }

  onDegreeChange(degree, convertor) {
    const newState = Object.assign({}, this.state);

    newState.degree = degree;
    newState.current.temp = convertor(newState.current.temp);
    newState.current.appTemp = convertor(newState.current.appTemp);

    newState.forecast = newState.forecast.map(day => {
      day.max_temp = convertor(day.max_temp);
      day.min_temp = convertor(day.min_temp);
      return day;
    });

    this.updateState(newState);
  }

  addToHistoryStack() {
    if (history.length === 2 && history.state === null) { // First entry
      history.replaceState(this.state, this.state.current.cityName, `?city=${this.state.current.cityName}`);
    } else {
      history.pushState(this.state, this.state.current.cityName, `?city=${this.state.current.cityName}`);
    }
  }

}

const app = new App();

window.addEventListener('popstate', function(e) {
  app.updateState(e.state);
  if (e.state) {
    app.degree.update({degree: e.state.degree});
  }
});
