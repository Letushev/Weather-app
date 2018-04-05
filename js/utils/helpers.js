import { COUNTRIES } from './countries';

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

export const startSkycons = () => {
  const skycons = new Skycons({"color" : "#fff"});
  ICONS.forEach(icon => {
    document.querySelectorAll(`.${icon}`).forEach(element => skycons.set(element, icon))
  });
  skycons.play();
};

const getWeekDay = datetime => DAYS[new Date(datetime).getDay()];

const renderDate = datetime => datetime.split('-').reverse().join('/');

const getCountryName = code => COUNTRIES.hasOwnProperty(code) ? COUNTRIES[code] : code;

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

export const bindAll = (context, ...names) => {
  names.forEach(name => context[name] = context[name].bind(context));
};

export const editCurrentValues = current => {
  current.country = getCountryName(current.country_code);
  current.temp = Math.round(current.temp);
  current.app_temp = Math.round(current.app_temp);
  current.wind_spd = Math.round(current.wind_spd);
  current.weather.icon = getSkyconClass(current.weather.code, current.weather.icon);
  current.pres = Math.round(current.pres);

  return current;
};

export const editForecastValues = forecast => {
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
