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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_helpers__ = __webpack_require__(2);


class Component {

  constructor(props) {
    this.state = {};
    this.props = props || {};

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_helpers__["a" /* bindAll */])(
      this,
      'update',
      'updateState'
    );
  }

  update(nextProps) {
    this.props = Object.assign({}, this.props, nextProps);
  }

  updateState(nextState) {
    this.state = Object.assign({}, this.state, nextState);
    this.render();
  }

  render() {}
}
/* harmony export (immutable) */ exports["a"] = Component;



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
const elements = {
  searchInput:        document.querySelector('.search-input'),
  searchButton:       document.querySelector('.search-button'),

  historyDropdown:    document.querySelector('.history-dropdown'),
  favoritesDropdown:  document.querySelector('.favorites-dropdown'),
  clearHistoryButton: document.querySelector('.clear-history-button'),

  celsiusButton:      document.querySelector('.celsius-button'),
  fahrenheitButton:   document.querySelector('.fahrenheit-button'),

  currentWrapper:     document.querySelector('.current-wrapper'),
  forecastWrapper:    document.querySelector('.forecast-wrapper')
};
/* harmony export (immutable) */ exports["a"] = elements;



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__countries__ = __webpack_require__(11);


const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ICONS = [
  "CLOUDY",
  "RAIN",
  "SLEET",
  "SNOW",
  "FOG",
  "CLEAR_DAY",
  "CLEAR_NIGHT",
  "PARTLY_CLOUDY_DAY",
  "PARTLY_CLOUDY_NIGHT"
];

const startSkycons = () => {
  const skycons = new Skycons({"color" : "#fff"});
  ICONS.forEach(icon => {
    document.querySelectorAll(`.${icon}`).forEach(element => skycons.set(element, icon))
  });
  skycons.play();
};
/* harmony export (immutable) */ exports["d"] = startSkycons;


const getWeekDay = datetime => DAYS[new Date(datetime).getDay()];

const renderDate = datetime => datetime.split('-').reverse().join('/');

const getCountryName = code => __WEBPACK_IMPORTED_MODULE_0__countries__["a" /* COUNTRIES */].hasOwnProperty(code) ? __WEBPACK_IMPORTED_MODULE_0__countries__["a" /* COUNTRIES */][code] : code;

const  getSkyconClass = (code, icon) => {
  if (code < 600)                              { return 'RAIN'; }
  else if (code >= 600 && code < 610)          { return 'SNOW'; }
  else if (code >= 610 && code < 700)          { return 'SLEET'; }
  else if (code >= 700 && code < 800)          { return 'FOG'; }
  else if (icon === 'c01d')                    { return 'CLEAR_DAY'; }
  else if (icon === 'c01n')                    { return 'CLEAR_NIGHT'; }
  else if (icon === 'c02d' || icon === 'c03d') { return 'PARTLY_CLOUDY_DAY'; }
  else if (icon === 'c02n' || icon === 'c03n') { return 'PARTLY_CLOUDY_NIGHT'; }
  else if (code >= 804 && code <= 900)         { return 'CLOUDY'; }
};

const bindAll = (context, ...names) => {
  names.forEach(name => context[name] = context[name].bind(context));
};
/* harmony export (immutable) */ exports["a"] = bindAll;


const editCurrentValues = current => {
  current.country = getCountryName(current.country_code);
  current.temp = Math.round(current.temp);
  current.app_temp = Math.round(current.app_temp);
  current.wind_spd = Math.round(current.wind_spd);
  current.weather.icon = getSkyconClass(current.weather.code, current.weather.icon);
  current.pres = Math.round(current.pres);

  return current;
};
/* harmony export (immutable) */ exports["b"] = editCurrentValues;


const editForecastValues = forecast => {
  forecast = forecast.map(day => {
    day.day = getWeekDay(day.datetime);
    day.datetime = renderDate(day.datetime);
    day.wind_spd = Math.round(day.wind_spd);
    day.max_temp = Math.round(day.max_temp);
    day.min_temp = Math.round(day.min_temp);
    day.weather.icon = getSkyconClass(day.weather.code, day.weather.icon);
    return day;
  });

  return forecast;
}
/* harmony export (immutable) */ exports["c"] = editForecastValues;



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
const WEATHER_API_URL = 'https://api.weatherbit.io/v2.0';
const WEATHER_API_KEY = 'e83a8a7ac30d465b93bd8e2bb270bbf7'; // 3182fa324b4340ef9cb632451ebb05c1

const GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_API_KEY = 'AIzaSyCWt-oX6XfeWXSXMS2dCj5_tmbmOf6-D9A';

const get = (apiUrl, query, apiKey) => {
  return  fetch(`${apiUrl}${query}&key=${apiKey}`)
            .then(response => {
              if (response.ok) {
                return response.json();
              }
            });
}

const getWeatherInfo = (location, degree) => {
  const currentQuery = `/current?lat=${location.lat}&lon=${location.lng}&units=${degree}`;
  const forecastQuery = `/forecast/daily?lat=${location.lat}&lon=${location.lng}&days=8&units=${degree}`;

  return Promise.all([
    get(WEATHER_API_URL, currentQuery, WEATHER_API_KEY)
      .then(info => info.data[0]),
    get(WEATHER_API_URL, forecastQuery, WEATHER_API_KEY)
      .then(info => info.data)
  ]);
}
/* harmony export (immutable) */ exports["a"] = getWeatherInfo;


const getPlaceInfo = cityName => {
  const searchQuery = `?address=${cityName}&language=en`;
  return get(GOOGLE_API_URL, searchQuery, GOOGLE_API_KEY);
}
/* harmony export (immutable) */ exports["b"] = getPlaceInfo;



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__framework_Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Current__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Forecast__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Search__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Storage__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Degree__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_api__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_helpers__ = __webpack_require__(2);











class App extends __WEBPACK_IMPORTED_MODULE_0__framework_Component__["a" /* default */] {

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

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__utils_helpers__["a" /* bindAll */])(
      this,
      'onLocationIsFound',
      'onDegreeChange',
      'onDropdownItemClick',
      'onMakeFavorite',
      'addToHistoryStack'
    );

    this._search = new __WEBPACK_IMPORTED_MODULE_3__Search__["a" /* default */]({onLocationIsFound: this.onLocationIsFound});
    this._current = new __WEBPACK_IMPORTED_MODULE_1__Current__["a" /* default */]();
    this._forecast = new __WEBPACK_IMPORTED_MODULE_2__Forecast__["a" /* default */]();
    this._storage = new __WEBPACK_IMPORTED_MODULE_4__Storage__["a" /* default */]({onDropdownItemClick: this.onDropdownItemClick});
    this._degree = new __WEBPACK_IMPORTED_MODULE_5__Degree__["a" /* default */]({onDegreeChange: this.onDegreeChange});

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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__utils_api__["a" /* getWeatherInfo */])(location, degree)
      .then(weatherInfo => this.computeNextState(location, weatherInfo))
      .then(this.updateState)
      .then(this.addToHistoryStack)
      .catch(() => alert('Server error...'));
  }

  computeNextState(nextLocation, [nextCurrent, nextForecast]) {
    return {
      location: nextLocation,
      current: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__utils_helpers__["b" /* editCurrentValues */])(nextCurrent),
      forecast: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__utils_helpers__["c" /* editForecastValues */])(nextForecast)
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

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__utils_helpers__["d" /* startSkycons */])();
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
/* harmony export (immutable) */ exports["default"] = App;


new App();


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "scss/styles.css";

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__framework_Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_elements__ = __webpack_require__(1);



class Current extends __WEBPACK_IMPORTED_MODULE_0__framework_Component__["a" /* default */] {

  constructor() {
    super();
  }

  update(props) {
    super.update(props);
    this.render();
  }

  render() {
    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].currentWrapper.innerHTML =
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

    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].currentWrapper.appendChild(star);
  }

}
/* harmony export (immutable) */ exports["a"] = Current;



/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__framework_Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_elements__ = __webpack_require__(1);



class Degree extends __WEBPACK_IMPORTED_MODULE_0__framework_Component__["a" /* default */] {

  constructor(props) {
    super(props);

    this.state = {
      degree: 'M'
    }

    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].celsiusButton.classList.add('active');

    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].celsiusButton.addEventListener('click', e => {
      if (this.state.degree !== 'M') {
        this.updateState({degree: 'M'});
        this.props.onDegreeChange(this.state.degree);
      }
    });

    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].fahrenheitButton.addEventListener('click', e => {
      if (this.state.degree !== 'I') {
        this.updateState({degree: 'I'});
        this.props.onDegreeChange(this.state.degree);
      }
    });
  }

  render() {
    if (this.state.degree === 'M') {
      __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].celsiusButton.classList.add('active');
      __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].fahrenheitButton.classList.remove('active');
    }

    if (this.state.degree === 'I') {
      __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].celsiusButton.classList.remove('active');
      __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].fahrenheitButton.classList.add('active');
    }
  }
}
/* harmony export (immutable) */ exports["a"] = Degree;



/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__framework_Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_elements__ = __webpack_require__(1);



class Forecast extends __WEBPACK_IMPORTED_MODULE_0__framework_Component__["a" /* default */] {

  constructor() {
    super();
  }

  update(props) {
    super.update(props);
    this.render();
  }

  render() {
    let result = this.props.forecast.reduce((forecast, dayWeather) => forecast += this.addDayWeather(dayWeather), '');
    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].forecastWrapper.innerHTML = result;
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
/* harmony export (immutable) */ exports["a"] = Forecast;



/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__framework_Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_elements__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_api__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_helpers__ = __webpack_require__(2);






class Search extends __WEBPACK_IMPORTED_MODULE_0__framework_Component__["a" /* default */] {

  constructor(props) {
    super(props);

    this.state = {
      isValid: true
    };

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils_helpers__["a" /* bindAll */])(
      this,
      'handleAutocompleteSearch',
      'handleButtonSearch'
    );

    this.autocomplete = new google.maps.places.Autocomplete(__WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].searchInput, {
      types: ['(cities)'],
    });
    this.autocomplete.addListener('place_changed', this.handleAutocompleteSearch);

    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].searchButton.addEventListener('click', this.handleButtonSearch);
  }

  update(props) {
    super.update(props);
    this.findPlaceInfoByCityName(this.props.cityName);
  }

  render() {
    const { isValid } = this.state;
    if (!isValid) {
      __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].searchInput.placeholder = 'Wrong city name. Please try again...';
    }
  }

  isValidCityName(name) {
    return !!name && !/\d/.test(name);
  }

  handleAutocompleteSearch() {
    const place = this.autocomplete.getPlace();
    /* When enter is pressed, the 'place_changed' event fires
       The result of getPlace() is object like { name: 'input text' } */
    if (Object.keys(place).length === 1) { // enter pressed -> search in Google geocode api
      this.findPlaceInfoByCityName(place.name.trim());
    } else { // chosen from autocomplete list -> get location immediately
      this.getLocation(place);
    }
  }

  handleButtonSearch() {
    this.findPlaceInfoByCityName(__WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].searchInput.value.trim());
  }

  findPlaceInfoByCityName(cityName) {
    if (this.isValidCityName(cityName)) {
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_api__["b" /* getPlaceInfo */])(cityName)
        .then(placeInfo => this.getLocation(placeInfo.results[0], cityName));
    } else {
      this.updateState({isValid: false});
    }
  }

  getLocation(placeInfo, foundCityName) {
    let lat = placeInfo.geometry.location.lat,
        lng = placeInfo.geometry.location.lng,
        cityName = foundCityName || placeInfo.formatted_address.split(',')[0];

    lat = typeof(lat) === 'function' ? lat() : lat;
    lng = typeof(lng) === 'function' ? lng() : lng;

    this.props.onLocationIsFound({cityName, lat, lng});
  }

}
/* harmony export (immutable) */ exports["a"] = Search;




/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__framework_Component__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_elements__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_helpers__ = __webpack_require__(2);





class Storage extends __WEBPACK_IMPORTED_MODULE_0__framework_Component__["a" /* default */] {

  constructor(props) {
    super(props);

    this.state = {
      isInList: false,
      list: ''
    };

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_helpers__["a" /* bindAll */])(this, 'handleClearHistory');

    if (!localStorage.length) {
      localStorage.setItem('history', JSON.stringify([]));
      localStorage.setItem('favorites', JSON.stringify([]));
    }

    this.showDropdowns(__WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].historyDropdown, __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].favoritesDropdown);
    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].clearHistoryButton.addEventListener('click', this.handleClearHistory);
  }

  update(props) {
    super.update(props);

    if (props.locationForHistory) {
      localStorage.setItem('last', JSON.stringify(this.props.locationForHistory));
      this.addToList(this.props.locationForHistory, 'history');
    }

    if (props.favorite) {
      this.addToList(this.findStorageObj(this.props.favorite, 'history'), 'favorites');
    }
  }

  findStorageObj(cityNameToFind, storageToFind) {
    const storage = JSON.parse(localStorage.getItem(storageToFind));
    return storage.find(({cityName}) => cityName === cityNameToFind);
  }

  addToList(newLocation, newList) {
    if (this.findStorageObj(newLocation.cityName, newList)) {
      this.updateState({
        isInList: true,
        list: newList
      });
    } else {
      const list = JSON.parse(localStorage.getItem(newList));
      list.push(newLocation);
      localStorage.setItem(newList, JSON.stringify(list));
      this.updateState({
        isInList: false,
        list: newList
      });
    }
  }

  render() {
    if (this.state.list === 'history' && !this.state.isInList) {
      this.showInDropdown(this.props.locationForHistory.cityName, __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].historyDropdown);
    }

    if (this.state.list === 'favorites' && !this.state.isInList) {
      this.showInDropdown(this.props.favorite, __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].favoritesDropdown);

      const star = document.querySelector('.star');
      star.classList.add('favorite');
      star.setAttribute('disabled', '');
    }
  }

  handleClearHistory() {
    localStorage.setItem('history', JSON.stringify([JSON.parse(localStorage.getItem('last'))]));
    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].historyDropdown.querySelectorAll('.dropdown-city').forEach(city => {
      __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].historyDropdown.removeChild(city)
    });
    this.showDropdowns(__WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].historyDropdown);
  }

  showInDropdown(dropdownCityName, container) {
    const dropdownItem = document.createElement('button');
    dropdownItem.textContent = dropdownCityName;
    dropdownItem.className = 'dropdown-city';

    const storageName = container === __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].historyDropdown ? 'history' : 'favorites';

    dropdownItem.addEventListener('click', () => {
      this.props.onDropdownItemClick(this.findStorageObj(dropdownCityName, storageName));
    });

    if (storageName === 'favorites') {
      dropdownItem.appendChild(this.showUnstarButton(dropdownCityName));
    }

    container.appendChild(dropdownItem);
  }

  showDropdowns(...dropdowns) {
    dropdowns.forEach(dropdown => {
      const storageName = dropdown === __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].historyDropdown ? 'history' : 'favorites';
      const list = JSON.parse(localStorage.getItem(storageName));
      list.forEach(obj => this.showInDropdown(obj.cityName, dropdown));
    });
  }

  showUnstarButton(cityName) {
    const unstarButton = document.createElement('button');
    unstarButton.textContent = '\u00d7';
    unstarButton.className = 'unstar-button';
    unstarButton.addEventListener('click', e => this.unstarCity(e, cityName));

    return unstarButton;
  }

  unstarCity(e, cityName) {
    const list = JSON.parse(localStorage.getItem('favorites'));

    if (cityName === JSON.parse(localStorage.getItem('last')).cityName) {
      const star = document.querySelector('.star');
      star.classList.remove('favorite');
      star.removeAttribute('disabled');
    }

    list.splice(list.indexOf(this.findStorageObj(cityName, 'favorites')), 1);
    localStorage.setItem('favorites', JSON.stringify(list));
    __WEBPACK_IMPORTED_MODULE_1__utils_elements__["a" /* elements */].favoritesDropdown.removeChild(e.target.parentNode);

    e.stopPropagation();
  }
}
/* harmony export (immutable) */ exports["a"] = Storage;



/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(5);


/***/ })
/******/ ]);