import Component from './../framework/Component';

import { elements } from './../utils/elements';
import { getPlaceInfo } from './../utils/api';
import { bindAll } from './../utils/helpers';

export default class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isValid: true
    };

    bindAll(
      this,
      'handleAutocompleteSearch',
      'handleButtonSearch'
    );

    this.autocomplete = new google.maps.places.Autocomplete(elements.searchInput, {
      types: ['(cities)'],
    });
    this.autocomplete.addListener('place_changed', this.handleAutocompleteSearch);

    elements.searchButton.addEventListener('click', this.handleButtonSearch);
  }

  update(props) {
    super.update(props);
    this.findPlaceInfoByCityName(this.props.cityName);
  }

  render() {
    const { isValid } = this.state;
    if (!isValid) {
      elements.searchInput.placeholder = 'Wrong city name. Please try again...';
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
    this.findPlaceInfoByCityName(elements.searchInput.value.trim());
  }

  findPlaceInfoByCityName(cityName) {
    if (this.isValidCityName(cityName)) {
      getPlaceInfo(cityName)
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

