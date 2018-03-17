/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
const elements = {
  search_input:       document.getElementById('search-input'),
  search_button:      document.getElementById('search-button'),

  history_dropdown:   document.querySelector('.history-dropdown'),
  favorites_dropdown: document.querySelector('.favorites-dropdown'),

  celsius_button:     document.querySelector('.celsius-button'),
  fahrenheit_button:  document.querySelector('.fahrenheit-button'),

  current_wrapper:    document.querySelector('.current-wrapper'),
  forecast_wrapper:   document.querySelector('.forecast-wrapper')
};
/* harmony export (immutable) */ exports["a"] = elements;



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Current__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Forecast__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Search__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Storage__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Degree__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__vendor_utils__ = __webpack_require__(9);







class App {

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

    this.search = new __WEBPACK_IMPORTED_MODULE_2__Search__["a" /* default */]({onSearch: this.onSearch});
    this.current = new __WEBPACK_IMPORTED_MODULE_0__Current__["a" /* default */]({onStar: this.onStar});
    this.forecast = new __WEBPACK_IMPORTED_MODULE_1__Forecast__["a" /* default */]();
    this.storage = new __WEBPACK_IMPORTED_MODULE_3__Storage__["a" /* default */]({onDropdownItemClick: this.onDropdownItemClick});
    this.degree = new __WEBPACK_IMPORTED_MODULE_4__Degree__["a" /* default */]({onDegreeChange: this.onDegreeChange});

    this.init();
  }

  bindCallbacks() {
    this.onSearch = this.onSearch.bind(this);
    this.onStar = this.onStar.bind(this);
    this.onDropdownItemClick = this.onDropdownItemClick.bind(this);
    this.onDegreeChange = this.onDegreeChange.bind(this);
  }

  init() {
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

    new_current.country = __WEBPACK_IMPORTED_MODULE_5__vendor_utils__["a" /* getCountryName */](new_current.country_code);
    new_current.temp = Math.round(new_current.temp);
    new_current.app_temp = Math.round(new_current.app_temp);
    new_current.weather.icon = __WEBPACK_IMPORTED_MODULE_5__vendor_utils__["b" /* getSkyconClass */](new_current.weather.code, new_current.weather.icon);
    new_current.pres = Math.round(new_current.pres);

    new_forecast = new_forecast.map(day => {
      day.day = __WEBPACK_IMPORTED_MODULE_5__vendor_utils__["c" /* getWeekDay */](day.datetime);
      day.datetime = __WEBPACK_IMPORTED_MODULE_5__vendor_utils__["d" /* renderDate */](day.datetime);
      day.max_temp = Math.round(day.max_temp);
      day.min_temp = Math.round(day.min_temp);
      day.weather.icon = __WEBPACK_IMPORTED_MODULE_5__vendor_utils__["b" /* getSkyconClass */](day.weather.code, day.weather.icon);
      return day;
    });

    this.updateState({current: new_current, forecast: new_forecast});
  }

  showWeather() {
    this.current.update({current: this.state.current});
    this.forecast.update({forecast: this.state.forecast});
    __WEBPACK_IMPORTED_MODULE_5__vendor_utils__["e" /* startSkycons */]();
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
/* harmony export (immutable) */ exports["default"] = App;


const app = new App();

window.addEventListener('popstate', function(e) {
  app.updateState(e.state);
  if (e.state) {
    app.degree.update({degree: e.state.degree});
  }
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "scss/styles.css";

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_elements__ = __webpack_require__(0);


class Current {

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
    __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].current_wrapper.innerHTML =
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

    __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].current_wrapper.appendChild(star);
  }

}
/* harmony export (immutable) */ exports["a"] = Current;



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_elements__ = __webpack_require__(0);


class Degree {

  constructor(props) {
    this.props = props;
    this.state = {
      degree: 'M'
    }

    __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].celsius_button.classList.add('active');

    __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].celsius_button.addEventListener('click', e => {
      if (!e.target.classList.contains('active')) {
        this.updateState({degree: 'M'});
        this.props.onDegreeChange('M', this.convertToC);
      }
    });

    __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].fahrenheit_button.addEventListener('click', e => {
      if (!e.target.classList.contains('active')) {
        this.updateState({degree: 'I'});
        this.props.onDegreeChange('I', this.convertToF);
      }
    });
  }

  update(nextProps) {
    this.props = Object.assign({}, this.props, nextProps);
    this.updateState({degree: this.props.degree});
  }

  updateState(nextState) {
    this.state = nextState;
    this.changeActiveButton(this.state.degree);
  }

  changeActiveButton(degree) {
    const target_button = degree === 'M' ? __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].celsius_button : __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].fahrenheit_button;

    if (!target_button.classList.contains('active')) {
      const sibling = target_button.nextElementSibling || target_button.previousElementSibling;
      target_button.classList.add('active');
      sibling.classList.remove('active');
    }
  }

  convertToC(temp) {
    return Math.round((temp - 32) / 1.8);
  }

  convertToF(temp) {
    return Math.round(temp * 1.8 + 32);
  }

}
/* harmony export (immutable) */ exports["a"] = Degree;



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_elements__ = __webpack_require__(0);


class Forecast {

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
    __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].forecast_wrapper.innerHTML = forecast;
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
/* harmony export (immutable) */ exports["a"] = Forecast;



/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_elements__ = __webpack_require__(0);


class Search {

  constructor(props) {
    this.props = props;
    this.state = null;
    this.request = {
      API_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
      API_KEY: 'AIzaSyCWt-oX6XfeWXSXMS2dCj5_tmbmOf6-D9A'
    }
    this.autocomplete = new google.maps.places.Autocomplete(__WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].search_input, {types: ['(cities)']});

    this.getPlaceFromAutocomplete = this.getPlaceFromAutocomplete.bind(this);

    this.autocomplete.addListener('place_changed', this.getPlaceFromAutocomplete);
    __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].search_button.addEventListener('click', () => {
      this.findLocationByCityName(__WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].search_input.value.trim());
    });
  }

  update(nextProps) {
    this.props = Object.assign({}, this.props, nextProps);
    this.findLocationByCityName(this.props.city_name);
  }

  updateState(nextState) {
    this.state = Object.assign({}, this.state, nextState);
    this.props.onSearch(this.state);
  }

  getPlaceFromAutocomplete() {
    const place = this.autocomplete.getPlace();
    /* When enter is pressed, the 'place_changed' event fires
       The result of getPlace() is object like { name: 'input text' } */
    if (Object.keys(place).length === 1) { // enter pressed -> search in Google geocode api
      this.findLocationByCityName(place.name.trim());
    } else {                               // chosen from autocomplete list -> get location immediately
      this.getLocation(place);
    }
  }

  findLocationByCityName(city_name) {
    if (city_name) {
      const url = `${this.request.API_URL}?address=${city_name}&key=${this.request.API_KEY}`;

      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(data => this.getLocation(data.results[0]))
        .catch(() => alert('Wrong city. Please, try again...'));
    }
  }

  getLocation(info) {
    let lat = info.geometry.location.lat,
        lng = info.geometry.location.lng;
    lat = typeof(lat) === 'function' ? lat() : lat;
    lng = typeof(lng) === 'function' ? lng() : lng;

    this.updateState({lat, lng});
  }

}
/* harmony export (immutable) */ exports["a"] = Search;




/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_elements__ = __webpack_require__(0);


class Storage {

  constructor(props) {
    this.props = props;
    this.state =  {
      history: JSON.parse(localStorage.getItem('history')) || [],
      favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      last: JSON.parse(localStorage.getItem('last')) || ''
    };
  }

  update(nextProps) {
    this.props = Object.assign({}, this.props, nextProps);
    if (nextProps.favorite) {
      this.makeFavorite(this.props.favorite);
    } else {
      this.saveToHistory(this.props.city_name);
    }
  }

  updateState(nextState) {
    this.state = Object.assign({}, this.state, nextState);
    this.showDropdowns();
    for (const key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  saveToHistory(city_name) {
    if (!this.isInDropdown(city_name, 'history')) {
      this.updateState({history: this.state.history.concat(city_name)});
    }
    this.updateState({last: city_name});
  }

  makeFavorite(city_name) {
    if (!this.isInDropdown(city_name, 'favorites')) {
      const star = document.querySelector('.star');
      star.classList.add('favorite');
      star.setAttribute('disabled', '');
      this.updateState({favorites: this.state.favorites.concat(city_name)});
    }
  }

  showDropdowns() {
    __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].history_dropdown.innerHTML = '';
    __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].favorites_dropdown.innerHTML = '';

    this.state.history.forEach(city_name => {
      this.addToDropdown(city_name, __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].history_dropdown);
    });

    this.state.favorites.forEach(city_name => {
      this.addToDropdown(city_name, __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].favorites_dropdown);
    })

    this.showClearHistoryButton();
  }

  showClearHistoryButton() {
    if (this.state.history.length !== 0) {
      const clear_history_button = document.createElement('button');
      clear_history_button.textContent = 'Clear history';
      clear_history_button.className = 'clear-history-button';

      clear_history_button.addEventListener('click', () => {
        this.updateState({history: [this.state.last]});
      });

      __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].history_dropdown.appendChild(clear_history_button);
    }
  }

  addToDropdown(city_name, container) {
    const dropdown_item = document.createElement('button');
    dropdown_item.textContent = city_name;
    dropdown_item.className = 'dropdown-city';

    dropdown_item.addEventListener('click', () => {
      this.props.onDropdownItemClick(city_name);
    })

    if (container === __WEBPACK_IMPORTED_MODULE_0__vendor_elements__["a" /* elements */].favorites_dropdown) {
      this.addUnstarButton(dropdown_item, city_name);
    }

    container.appendChild(dropdown_item);
  }

  addUnstarButton(container, container_city_name) {
    const unstar_button = document.createElement('button');
    unstar_button.textContent = '\u00d7';
    unstar_button.className = 'unstar-button';

    unstar_button.addEventListener('click', e => {
      this.updateState({favorites: this.state.favorites.filter(city_name => city_name !== container_city_name)});

      if (container_city_name === this.state.last) {
        const star = document.querySelector('.star');
        star.classList.remove('favorite');
        star.removeAttribute('disabled');
      }

      e.stopPropagation();
    })

    container.appendChild(unstar_button);
  }

  isInDropdown(city_name, dropdown) {
    return this.state[dropdown].includes(city_name);
  }

}
/* harmony export (immutable) */ exports["a"] = Storage;



/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
const COUNTRIES = {
  'AF' : 'Afghanistan',
  'AX' : 'Aland Islands',
  'AL' : 'Albania',
  'DZ' : 'Algeria',
  'AS' : 'American Samoa',
  'AD' : 'Andorra',
  'AO' : 'Angola',
  'AI' : 'Anguilla',
  'AQ' : 'Antarctica',
  'AG' : 'Antigua And Barbuda',
  'AR' : 'Argentina',
  'AM' : 'Armenia',
  'AW' : 'Aruba',
  'AU' : 'Australia',
  'AT' : 'Austria',
  'AZ' : 'Azerbaijan',
  'BS' : 'Bahamas',
  'BH' : 'Bahrain',
  'BD' : 'Bangladesh',
  'BB' : 'Barbados',
  'BY' : 'Belarus',
  'BE' : 'Belgium',
  'BZ' : 'Belize',
  'BJ' : 'Benin',
  'BM' : 'Bermuda',
  'BT' : 'Bhutan',
  'BO' : 'Bolivia',
  'BA' : 'Bosnia And Herzegovina',
  'BW' : 'Botswana',
  'BV' : 'Bouvet Island',
  'BR' : 'Brazil',
  'IO' : 'British Indian Ocean Territory',
  'BN' : 'Brunei Darussalam',
  'BG' : 'Bulgaria',
  'BF' : 'Burkina Faso',
  'BI' : 'Burundi',
  'KH' : 'Cambodia',
  'CM' : 'Cameroon',
  'CA' : 'Canada',
  'CV' : 'Cape Verde',
  'KY' : 'Cayman Islands',
  'CF' : 'Central African Republic',
  'TD' : 'Chad',
  'CL' : 'Chile',
  'CN' : 'China',
  'CX' : 'Christmas Island',
  'CC' : 'Cocos (Keeling) Islands',
  'CO' : 'Colombia',
  'KM' : 'Comoros',
  'CG' : 'Congo',
  'CD' : 'Congo, Democratic Republic',
  'CK' : 'Cook Islands',
  'CR' : 'Costa Rica',
  'CI' : 'Cote D\'Ivoire',
  'HR' : 'Croatia',
  'CU' : 'Cuba',
  'CY' : 'Cyprus',
  'CZ' : 'Czech Republic',
  'DK' : 'Denmark',
  'DJ' : 'Djibouti',
  'DM' : 'Dominica',
  'DO' : 'Dominican Republic',
  'EC' : 'Ecuador',
  'EG' : 'Egypt',
  'SV' : 'El Salvador',
  'GQ' : 'Equatorial Guinea',
  'ER' : 'Eritrea',
  'EE' : 'Estonia',
  'ET' : 'Ethiopia',
  'FK' : 'Falkland Islands (Malvinas)',
  'FO' : 'Faroe Islands',
  'FJ' : 'Fiji',
  'FI' : 'Finland',
  'FR' : 'France',
  'GF' : 'French Guiana',
  'PF' : 'French Polynesia',
  'TF' : 'French Southern Territories',
  'GA' : 'Gabon',
  'GM' : 'Gambia',
  'GE' : 'Georgia',
  'DE' : 'Germany',
  'GH' : 'Ghana',
  'GI' : 'Gibraltar',
  'GR' : 'Greece',
  'GL' : 'Greenland',
  'GD' : 'Grenada',
  'GP' : 'Guadeloupe',
  'GU' : 'Guam',
  'GT' : 'Guatemala',
  'GG' : 'Guernsey',
  'GN' : 'Guinea',
  'GW' : 'Guinea-Bissau',
  'GY' : 'Guyana',
  'HT' : 'Haiti',
  'HM' : 'Heard Island & Mcdonald Islands',
  'VA' : 'Holy See (Vatican City State)',
  'HN' : 'Honduras',
  'HK' : 'Hong Kong',
  'HU' : 'Hungary',
  'IS' : 'Iceland',
  'IN' : 'India',
  'ID' : 'Indonesia',
  'IR' : 'Iran, Islamic Republic Of',
  'IQ' : 'Iraq',
  'IE' : 'Ireland',
  'IM' : 'Isle Of Man',
  'IL' : 'Israel',
  'IT' : 'Italy',
  'JM' : 'Jamaica',
  'JP' : 'Japan',
  'JE' : 'Jersey',
  'JO' : 'Jordan',
  'KZ' : 'Kazakhstan',
  'KE' : 'Kenya',
  'KI' : 'Kiribati',
  'KR' : 'Korea',
  'KW' : 'Kuwait',
  'KG' : 'Kyrgyzstan',
  'LA' : 'Lao People\'s Democratic Republic',
  'LV' : 'Latvia',
  'LB' : 'Lebanon',
  'LS' : 'Lesotho',
  'LR' : 'Liberia',
  'LY' : 'Libyan Arab Jamahiriya',
  'LI' : 'Liechtenstein',
  'LT' : 'Lithuania',
  'LU' : 'Luxembourg',
  'MO' : 'Macao',
  'MK' : 'Macedonia',
  'MG' : 'Madagascar',
  'MW' : 'Malawi',
  'MY' : 'Malaysia',
  'MV' : 'Maldives',
  'ML' : 'Mali',
  'MT' : 'Malta',
  'MH' : 'Marshall Islands',
  'MQ' : 'Martinique',
  'MR' : 'Mauritania',
  'MU' : 'Mauritius',
  'YT' : 'Mayotte',
  'MX' : 'Mexico',
  'FM' : 'Micronesia, Federated States Of',
  'MD' : 'Moldova',
  'MC' : 'Monaco',
  'MN' : 'Mongolia',
  'ME' : 'Montenegro',
  'MS' : 'Montserrat',
  'MA' : 'Morocco',
  'MZ' : 'Mozambique',
  'MM' : 'Myanmar',
  'NA' : 'Namibia',
  'NR' : 'Nauru',
  'NP' : 'Nepal',
  'NL' : 'Netherlands',
  'AN' : 'Netherlands Antilles',
  'NC' : 'New Caledonia',
  'NZ' : 'New Zealand',
  'NI' : 'Nicaragua',
  'NE' : 'Niger',
  'NG' : 'Nigeria',
  'NU' : 'Niue',
  'NF' : 'Norfolk Island',
  'MP' : 'Northern Mariana Islands',
  'NO' : 'Norway',
  'OM' : 'Oman',
  'PK' : 'Pakistan',
  'PW' : 'Palau',
  'PS' : 'Palestinian Territory, Occupied',
  'PA' : 'Panama',
  'PG' : 'Papua New Guinea',
  'PY' : 'Paraguay',
  'PE' : 'Peru',
  'PH' : 'Philippines',
  'PN' : 'Pitcairn',
  'PL' : 'Poland',
  'PT' : 'Portugal',
  'PR' : 'Puerto Rico',
  'QA' : 'Qatar',
  'RE' : 'Reunion',
  'RO' : 'Romania',
  'RU' : 'Russian Federation',
  'RW' : 'Rwanda',
  'BL' : 'Saint Barthelemy',
  'SH' : 'Saint Helena',
  'KN' : 'Saint Kitts And Nevis',
  'LC' : 'Saint Lucia',
  'MF' : 'Saint Martin',
  'PM' : 'Saint Pierre And Miquelon',
  'VC' : 'Saint Vincent And Grenadines',
  'WS' : 'Samoa',
  'SM' : 'San Marino',
  'ST' : 'Sao Tome And Principe',
  'SA' : 'Saudi Arabia',
  'SN' : 'Senegal',
  'RS' : 'Serbia',
  'SC' : 'Seychelles',
  'SL' : 'Sierra Leone',
  'SG' : 'Singapore',
  'SK' : 'Slovakia',
  'SI' : 'Slovenia',
  'SB' : 'Solomon Islands',
  'SO' : 'Somalia',
  'ZA' : 'South Africa',
  'GS' : 'South Georgia And Sandwich Isl.',
  'ES' : 'Spain',
  'LK' : 'Sri Lanka',
  'SD' : 'Sudan',
  'SR' : 'Suriname',
  'SJ' : 'Svalbard And Jan Mayen',
  'SZ' : 'Swaziland',
  'SE' : 'Sweden',
  'CH' : 'Switzerland',
  'SY' : 'Syrian Arab Republic',
  'TW' : 'Taiwan',
  'TJ' : 'Tajikistan',
  'TZ' : 'Tanzania',
  'TH' : 'Thailand',
  'TL' : 'Timor-Leste',
  'TG' : 'Togo',
  'TK' : 'Tokelau',
  'TO' : 'Tonga',
  'TT' : 'Trinidad And Tobago',
  'TN' : 'Tunisia',
  'TR' : 'Turkey',
  'TM' : 'Turkmenistan',
  'TC' : 'Turks And Caicos Islands',
  'TV' : 'Tuvalu',
  'UG' : 'Uganda',
  'UA' : 'Ukraine',
  'AE' : 'United Arab Emirates',
  'GB' : 'United Kingdom',
  'US' : 'United States',
  'UM' : 'United States Outlying Islands',
  'UY' : 'Uruguay',
  'UZ' : 'Uzbekistan',
  'VU' : 'Vanuatu',
  'VE' : 'Venezuela',
  'VN' : 'Viet Nam',
  'VG' : 'Virgin Islands, British',
  'VI' : 'Virgin Islands, U.S.',
  'WF' : 'Wallis And Futuna',
  'EH' : 'Western Sahara',
  'YE' : 'Yemen',
  'ZM' : 'Zambia',
  'ZW' : 'Zimbabwe'
};
/* harmony export (immutable) */ exports["a"] = COUNTRIES;



/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__countries__ = __webpack_require__(8);
/* harmony export (immutable) */ exports["e"] = startSkycons;
/* harmony export (immutable) */ exports["c"] = getWeekDay;
/* harmony export (immutable) */ exports["d"] = renderDate;
/* harmony export (immutable) */ exports["a"] = getCountryName;
/* harmony export (immutable) */ exports["b"] = getSkyconClass;


const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ICONS  = [ "CLOUDY",
                 "RAIN",
                 "SLEET",
                 "SNOW",
                 "FOG",
                 "CLEAR_DAY",
                 "CLEAR_NIGHT",
                 "PARTLY_CLOUDY_DAY",
                 "PARTLY_CLOUDY_NIGHT" ];

function startSkycons() {
  const skycons = new Skycons({"color" : "#fff"});
  ICONS.forEach(icon => {
    document.querySelectorAll(`.${icon}`).forEach(element => skycons.set(element, icon));
  });
  skycons.play();
}

function getWeekDay(datetime) {
  return DAYS[new Date(datetime).getDay()];
}

function renderDate(datetime) {
  return datetime.split('-').reverse().join('/');
}

function getCountryName(code) {
  return __WEBPACK_IMPORTED_MODULE_0__countries__["a" /* COUNTRIES */].hasOwnProperty(code) ? __WEBPACK_IMPORTED_MODULE_0__countries__["a" /* COUNTRIES */][code] : code;
}

function getSkyconClass(code, icon) {
    if (code < 600)                              { return 'RAIN'; }
    else if (code >= 600 && code < 610)          { return 'SNOW'; }
    else if (code >= 610 && code < 700)          { return 'SLEET'; }
    else if (code >= 700 && code < 800)          { return 'FOG'; }
    else if (icon === 'c01d')                    { return 'CLEAR_DAY'; }
    else if (icon === 'c01n')                    { return 'CLEAR_NIGHT'; }
    else if (icon === 'c02d' || icon === 'c03d') { return 'PARTLY_CLOUDY_DAY'; }
    else if (icon === 'c02n' || icon === 'c03n') { return 'PARTLY_CLOUDY_NIGHT'; }
    else if (code >= 804 && code <= 900)         { return 'CLOUDY'; }
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ })
/******/ ]);