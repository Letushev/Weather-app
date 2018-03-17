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
      url_city_name: new URLSearchParams(location.search).get('city') || '',
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
    console.log('I am here');
    const INITIAL_CITY = 'Kiev';

    if (this.state.url_city_name) { // smth present in url ?= -> search it
      this.search.update({city_name: this.state.url_city_name});
    } else {
      if (this.storage.state.history.length !== 0) { // history is not empty -> search by last
        this.search.update({city_name: JSON.parse(localStorage.getItem('last'))});
      } else { // history is empty -> search by INITIAL
        this.search.update({city_name: INITIAL_CITY});
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
    this.storage.update({city_name: this.state.current.city_name});
  }

  render(data) {
    let new_current = data[0];
    let new_forecast = data[1];

    new_current.country = utils.getCountryName(new_current.country_code);
    new_current.temp = Math.round(new_current.temp);
    new_current.app_temp = Math.round(new_current.app_temp);
    new_current.weather.icon = utils.getSkyconClass(new_current.weather.code, new_current.weather.icon);
    new_current.pres = Math.round(new_current.pres);

    new_forecast = new_forecast.map(day => {
      day.day = utils.getWeekDay(day.datetime);
      day.datetime = utils.renderDate(day.datetime);
      day.max_temp = Math.round(day.max_temp);
      day.min_temp = Math.round(day.min_temp);
      day.weather.icon = utils.getSkyconClass(day.weather.code, day.weather.icon);
      return day;
    });

    this.updateState({current: new_current, forecast: new_forecast});
  }

  showWeather() {
    this.current.update({current: this.state.current});
    this.forecast.update({forecast: this.state.forecast});
    utils.startSkycons();
  }

  onSearch(location) {
    this.getWeather(location);
  }

  onStar(city_name) {
    this.storage.update({favorite: city_name});
  }

  onDropdownItemClick(dropdown_city_name) {
    this.search.update({city_name: dropdown_city_name});
  }

  onDegreeChange(degree, convertor) {
    const newState = Object.assign({}, this.state);

    newState.degree = degree;
    newState.current.temp = convertor(newState.current.temp);
    newState.current.app_temp = convertor(newState.current.app_temp);

    newState.forecast = newState.forecast.map(day => {
      day.max_temp = convertor(day.max_temp);
      day.min_temp = convertor(day.min_temp);
      return day;
    });

    this.updateState(newState);
  }

  addToHistoryStack() {
    if (history.length === 2 && history.state === null) { // First entry
      history.replaceState(this.state, this.state.current.city_name, `?city=${this.state.current.city_name}`);
    } else {
      history.pushState(this.state, this.state.current.city_name, `?city=${this.state.current.city_name}`);
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
