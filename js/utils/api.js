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

export const getWeatherInfo = (location, degree) => {
  const currentQuery = `/current?lat=${location.lat}&lon=${location.lng}&units=${degree}`;
  const forecastQuery = `/forecast/daily?lat=${location.lat}&lon=${location.lng}&days=8&units=${degree}`;

  return Promise.all([
    get(WEATHER_API_URL, currentQuery, WEATHER_API_KEY)
      .then(info => info.data[0]),
    get(WEATHER_API_URL, forecastQuery, WEATHER_API_KEY)
      .then(info => info.data)
  ]);
}

export const getPlaceInfo = cityName => {
  const searchQuery = `?address=${cityName}&language=en`;
  return get(GOOGLE_API_URL, searchQuery, GOOGLE_API_KEY);
}
