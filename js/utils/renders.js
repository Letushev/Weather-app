import { COUNTRIES } from './countries';

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

export function startSkycons() {
  const skycons = new Skycons({"color" : "#fff"});
  ICONS.forEach(icon => {
    document.querySelectorAll(`.${icon}`).forEach(element => skycons.set(element, icon));
  });
  skycons.play();
}

export function getWeekDay(datetime) {
  return DAYS[new Date(datetime).getDay()];
}

export function renderDate(datetime) {
  return datetime.split('-').reverse().join('/');
}

export function getCountryName(code) {
  return COUNTRIES.hasOwnProperty(code) ? COUNTRIES[code] : code;
}

export function getSkyconClass(code, icon) {
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
