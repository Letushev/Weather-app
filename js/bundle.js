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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendor_helpers__ = __webpack_require__(5);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__search__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__todayForecast__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__weekForecast__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__storage__ = __webpack_require__(1);
/* harmony export (immutable) */ exports["init"] = init;








const request = {
  hourly_api_url: 'http://api.weatherbit.io/v2.0/forecast/3hourly?days=1',
  daily_api_url: 'http://api.weatherbit.io/v2.0/forecast/daily?days=8',
  key: 'e83a8a7ac30d465b93bd8e2bb270bbf7'
};

function init([lat, long]) {
  const daily_url = buildDailyUrl(lat,long);
  const hourly_url = buildHourlyUrl(lat,long);

  get(daily_url)
    .then(renderForecastValues)
    .then(__WEBPACK_IMPORTED_MODULE_3__weekForecast__["a" /* showWeekForecast */])
    .then(__WEBPACK_IMPORTED_MODULE_2__todayForecast__["a" /* showTodayMain */])
    .then(get(hourly_url)
            .then(renderForecastValues)
            .then(__WEBPACK_IMPORTED_MODULE_2__todayForecast__["b" /* showTodayForecast */])
            .then(saveToHistory)
            .then(setIcons));
}

const buildDailyUrl = (lat, long) => `${request.daily_api_url}&lat=${lat}&lon=${long}&key=${request.key}`

const buildHourlyUrl = (lat, long) => `${request.hourly_api_url}&lat=${lat}&lon=${long}&key=${request.key}`

const get = url => fetch(url).then(response => response.json())
/* harmony export (immutable) */ exports["get"] = get;


const renderForecastValues = forecast => {
  forecast.country = getCountryName(forecast.country_code);

  forecast.data.forEach(time => {
    time.dayName = getDayName(time.datetime);
    time.date = getDate(time.datetime);
    time.hours = getTime(time.datetime);
    time.min_temp = Math.round(time.min_temp);
    time.max_temp = Math.round(time.max_temp);
    time.temp = Math.round(time.temp);
    time.skycon = getSkyconClass(time.weather.code, time.weather.icon);
  });

  return forecast;
}

const getTime = date => date.split(':')[1] + ':00';

const getDate = date => date.split('-').reverse().join('/');

const getCountryName = code => __WEBPACK_IMPORTED_MODULE_0__vendor_helpers__["a" /* countries */].hasOwnProperty(code) ? __WEBPACK_IMPORTED_MODULE_0__vendor_helpers__["a" /* countries */][code] : code;

const getDayName = date => {
  const d = new Date(date);
  return __WEBPACK_IMPORTED_MODULE_0__vendor_helpers__["b" /* days */][d.getDay()];
}

const getSkyconClass = (code, icon) => {
  if(code < 600) {
    return 'RAIN';
  }else if(code >= 600 && code < 610) {
    return 'SNOW';
  }else if(code >= 610 && code < 700){
    return 'SLEET';
  }else if(code >= 700 && code < 800){
    return 'FOG';
  }else if(icon === 'c01d') {
    return 'CLEAR_DAY';
  }else if(icon === 'c01n') {
    return 'CLEAR_NIGHT';
  }else if(icon === 'c02d' || icon === 'c03d') {
    return 'PARTLY_CLOUDY_DAY';
  }else if(icon === 'c02n' || icon === 'c03n') {
    return 'PARTLY_CLOUDY_NIGHT';
  }else if(code >= 804 && code <= 900) {
    return 'CLOUDY';
  }
}

const setIcons = () => {
  let skycons = new Skycons({"color":"#fff"});

  __WEBPACK_IMPORTED_MODULE_0__vendor_helpers__["c" /* icons */].forEach(icon => {
    const elements = document.getElementsByClassName(icon);
    if(elements.length > 0) {
      for(const element of elements) {
        skycons.set(element, icon);
      }
    }
  });

  skycons.play();
}

const saveToHistory = forecast => {
  const cityName = forecast.city_name;
  const history = document.querySelector('.history-list');
  if(!isInHistory(cityName)) {
    localStorage.setItem(cityName, JSON.stringify([forecast.lat, forecast.lon]));
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__storage__["a" /* addToStorageList */])(cityName, history);
  }
}

const isInHistory = cityName => {
  let is = false;
  for(let i = 0; i < localStorage.length; i++) {
    if(localStorage.key(i) === cityName) {
      is = true;
    }
  }
  return is;
}

document.querySelector('.cel').addEventListener('click', function() {
  if(!this.classList.contains('active')) {
    document.querySelectorAll('.temp').forEach(temp => temp.textContent = convertToFar(temp.textContent));
    this.classList.add('active');
    document.querySelector('.far').classList.remove('active');
  }
});

document.querySelector('.far').addEventListener('click', function() {
  if(!this.classList.contains('active')) {
    document.querySelectorAll('.temp').forEach(temp => temp.textContent = convertToCel(temp.textContent));
    this.classList.add('active');
    document.querySelector('.cel').classList.remove('active');
  }
});

const convertToFar = temp => Math.round(temp * 1.8 + 32);
const convertToCel = temp => Math.round((temp - 32)/1.8);

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__search__["a" /* setSearchListeners */])();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__storage__["b" /* showStorageLists */])();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__storage__["c" /* setStorageListeners */])();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app__ = __webpack_require__(0);
/* harmony export (immutable) */ exports["a"] = addToStorageList;
/* harmony export (immutable) */ exports["c"] = setStorageListeners;
/* harmony export (immutable) */ exports["b"] = showStorageLists;


function addToStorageList(cityName, list) {
  const city = document.createElement('a');
  city.textContent = cityName;
  list.appendChild(city);
  showStorageLists();
  setStorageListeners();
}

function setStorageListeners() {
  const lists = document.querySelectorAll('.dropdown-content');
  lists.forEach(list => {
    list.addEventListener('click', function(e) {
      initStorageRequest(e);
    });
  });
}

const initStorageRequest = e => {
  const cityName = e.target.textContent;
  document.getElementById('city-search').value = cityName;
  const [lat, lng] = JSON.parse(localStorage.getItem(cityName));
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__app__["init"])([lat,lng]);
}

function showStorageLists() {
  const historyCopy = document.querySelector('.history-list').cloneNode();
  const favoritiesCopy = document.querySelector('.favorities-list').cloneNode();
  for(let i = 0; i < localStorage.length; i++) {
    const city = document.createElement('a');
    city.textContent = localStorage.key(i);
    if(JSON.parse(localStorage.getItem(localStorage.key(i))).length === 3) {
      const city = document.createElement('a');
      city.textContent = localStorage.key(i);
      favoritiesCopy.appendChild(city);
    }
    historyCopy.appendChild(city);
  }
  document.querySelector('.history-list').replaceWith(historyCopy);
  document.querySelector('.favorities-list').replaceWith(favoritiesCopy);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "scss/main.css";

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app__ = __webpack_require__(0);
/* harmony export (immutable) */ exports["a"] = setSearchListeners;


const input = document.getElementById('city-search');
const searchButton = document.getElementById('searchButton');
const request = {
  google_api: 'https://maps.googleapis.com/maps/api/geocode/json?',
  key: 'AIzaSyCWt-oX6XfeWXSXMS2dCj5_tmbmOf6-D9A'
}

function setSearchListeners() {
  const options = {
    types: ['(cities)']
  };

  const autocomplete = new google.maps.places.SearchBox(input);

  autocomplete.addListener('places_changed', function() {
    const place = autocomplete.getPlaces()[0];
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__app__["init"])([lat, lng]);
  });

  input.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
      getCoords(input.value);
    }
  });

  searchButton.addEventListener('click', function() {
    getCoords(input.value);
  });
}

const buildGeoUrl = location => `${request.google_api}address=${location}&key=${request.key}`

const getCoords = location => {
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__app__["get"])(buildGeoUrl(location))
    .then(renderCoords);
}
/* unused harmony export getCoords */


const renderCoords = data => {
  const {lat, lng} = data.results[0].geometry.location;
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__app__["init"])([lat, lng]);
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__storage__ = __webpack_require__(1);
/* harmony export (immutable) */ exports["a"] = showTodayMain;
/* harmony export (immutable) */ exports["b"] = showTodayForecast;


const favorities = document.querySelector('.favorities-list');
const weatherToday = document.querySelector('.weather-today');

function showTodayMain(forecast) {
  const today = forecast.data[0];
  const main = `
    <button type="button" class="star">&#x2606;</button>

    <h1>${forecast.city_name}<span class="city-country">${forecast.country}</span></h1>

    <div class="today-main-values">
      <p class="mainTemp"><span class="temp">${today.temp}</span>&deg;</p>
      <ul>
        <li><span class="temp">${today.min_temp}</span>&deg; | <span class="temp">${today.max_temp}</span>&deg;</li>
        <li>Humidity: ${today.rh}%</li>
        <li>Precipitation: ${today.pop}%</li>
      </ul>
      <canvas class="${today.skycon}" width="80px" height="80px"></canvas>
    </div>

    <p class="description">${today.weather.description}</p>
  `;
  weatherToday.innerHTML = main;

  const star = document.querySelector('.star');
  star.addEventListener('click', function() {
    localStorage.setItem(forecast.city_name, JSON.stringify([forecast.lat, forecast.lon, 'star']));
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__storage__["a" /* addToStorageList */])(forecast.city_name, favorities);
  });
}

function showTodayForecast(forecast) {
  const table = document.createElement('table');
  forecast.data.forEach(time => {
    table.innerHTML += addHoursForecast(time);
  });
  weatherToday.appendChild(table);
  return forecast;
}

const addHoursForecast = time => {
  const hoursForecast = `
    <tr>
      <th>${time.hours}</th>
      <td><canvas class="${time.skycon}" width="20px" height="20px"></canvas></td>
      <td><span class="temp">${time.temp}</span>&deg;</td>
      <td>${time.wind_spd} m/s <span class="wind-dir" style="transform:rotate(${time.wind_dir}deg)">&uarr;</span></td>
    </tr>
  `;
  return hoursForecast;
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/* harmony export (immutable) */ exports["b"] = days;


const icons  = ["CLEAR_DAY", "CLEAR_NIGHT", "PARTLY_CLOUDY_DAY",
                       "PARTLY_CLOUDY_NIGHT", "CLOUDY", "RAIN", "SLEET",
                       "SNOW", "FOG"];
/* harmony export (immutable) */ exports["c"] = icons;


const countries = {
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
/* harmony export (immutable) */ exports["a"] = countries;



/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = showWeekForecast;
function showWeekForecast(forecast) {
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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(2);


/***/ })
/******/ ]);