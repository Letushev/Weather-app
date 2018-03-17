const API_URL = 'https://api.weatherbit.io/v2.0';
const API_KEY = '3182fa324b4340ef9cb632451ebb05c1'; // e83a8a7ac30d465b93bd8e2bb270bbf7

const get = query => {
  const url = `${API_URL}${query}&key=${API_KEY}`;
  return  fetch(url)
            .then(response => {
              if (response.ok) {
                return response.json();
              }
            });
}

export const getWeatherInfo = (location, degree) =>
  Promise.all([ get(`/current?lat=${location.lat}&lon=${location.lng}&units=${degree}`)
                  .then(info => info.data[0]),
                get(`/forecast/daily?lat=${location.lat}&lon=${location.lng}&days=8&units=${degree}`)
                  .then(info => info.data) ]);
