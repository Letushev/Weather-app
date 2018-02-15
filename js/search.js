import {init, get} from './app';

const input = document.getElementById('city-search');
const searchButton = document.getElementById('searchButton');
const request = {
  google_api: 'https://maps.googleapis.com/maps/api/geocode/json?',
  key: 'AIzaSyCWt-oX6XfeWXSXMS2dCj5_tmbmOf6-D9A'
}

export function setSearchListeners() {
  const options = {
    types: ['(cities)']
  };

  const autocomplete = new google.maps.places.SearchBox(input);

  autocomplete.addListener('places_changed', function() {
    const place = autocomplete.getPlaces()[0];
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    init([lat, lng]);
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

export const getCoords = location => {
  get(buildGeoUrl(location))
    .then(renderCoords);
}

const renderCoords = data => {
  const {lat, lng} = data.results[0].geometry.location;
  init([lat, lng]);
}
