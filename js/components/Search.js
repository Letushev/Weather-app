import { elements } from './../vendor/elements';

export default class Search {

  constructor(props) {
    this.props = props;
    this.state = null;
    this.request = {
      API_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
      API_KEY: 'AIzaSyCWt-oX6XfeWXSXMS2dCj5_tmbmOf6-D9A'
    }
    this.autocomplete = new google.maps.places.Autocomplete(elements.search_input, {types: ['(cities)']});

    this.getPlaceFromAutocomplete = this.getPlaceFromAutocomplete.bind(this);

    this.autocomplete.addListener('place_changed', this.getPlaceFromAutocomplete);
    elements.search_button.addEventListener('click', () => {
      this.findLocationByCityName(elements.search_input.value.trim());
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

