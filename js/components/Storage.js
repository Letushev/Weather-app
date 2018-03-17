import { elements } from './../vendor/elements';

export default class Storage {

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
    elements.history_dropdown.innerHTML = '';
    elements.favorites_dropdown.innerHTML = '';

    this.state.history.forEach(city_name => {
      this.addToDropdown(city_name, elements.history_dropdown);
    });

    this.state.favorites.forEach(city_name => {
      this.addToDropdown(city_name, elements.favorites_dropdown);
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

      elements.history_dropdown.appendChild(clear_history_button);
    }
  }

  addToDropdown(city_name, container) {
    const dropdown_item = document.createElement('button');
    dropdown_item.textContent = city_name;
    dropdown_item.className = 'dropdown-city';

    dropdown_item.addEventListener('click', () => {
      this.props.onDropdownItemClick(city_name);
    })

    if (container === elements.favorites_dropdown) {
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
