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
      this.saveToHistory(this.props.cityName);
    }
  }

  updateState(nextState) {
    this.state = Object.assign({}, this.state, nextState);
    this.showDropdowns();
    for (const key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  saveToHistory(cityName) {
    if (!this.isInDropdown(cityName, 'history')) {
      this.updateState({history: this.state.history.concat(cityName)});
    }
    this.updateState({last: cityName});
  }

  makeFavorite(cityName) {
    if (!this.isInDropdown(cityName, 'favorites')) {
      const star = document.querySelector('.star');
      star.classList.add('favorite');
      star.setAttribute('disabled', '');
      this.updateState({favorites: this.state.favorites.concat(cityName)});
    }
  }

  showDropdowns() {
    elements.historyDropdown.innerHTML = '';
    elements.favoritesDropdown.innerHTML = '';

    this.state.history.forEach(cityName => {
      this.addToDropdown(cityName, elements.historyDropdown);
    });

    this.state.favorites.forEach(cityName => {
      this.addToDropdown(cityName, elements.favoritesDropdown);
    })

    this.showClearHistoryButton();
  }

  showClearHistoryButton() {
    if (this.state.history.length !== 0) {
      const clearHistoryButton = document.createElement('button');
      clearHistoryButton.textContent = 'Clear history';
      clearHistoryButton.className = 'clear-history-button';

      clearHistoryButton.addEventListener('click', () => {
        this.updateState({history: [this.state.last]});
      });

      elements.historyDropdown.appendChild(clearHistoryButton);
    }
  }

  addToDropdown(cityName, container) {
    const dropdownItem = document.createElement('button');
    dropdownItem.textContent = cityName;
    dropdownItem.className = 'dropdown-city';

    dropdownItem.addEventListener('click', () => {
      this.props.onDropdownItemClick(cityName);
    })

    if (container === elements.favoritesDropdown) {
      this.addUnstarButton(dropdownItem, cityName);
    }

    container.appendChild(dropdownItem);
  }

  addUnstarButton(container, containerCityName) {
    const unstarButton = document.createElement('button');
    unstarButton.textContent = '\u00d7';
    unstarButton.className = 'unstar-button';

    unstarButton.addEventListener('click', e => {
      this.updateState({favorites: this.state.favorites.filter(cityName => cityName !== containerCityName)});

      if (containerCityName === this.state.last) {
        const star = document.querySelector('.star');
        star.classList.remove('favorite');
        star.removeAttribute('disabled');
      }

      e.stopPropagation();
    })

    container.appendChild(unstarButton);
  }

  isInDropdown(cityName, dropdown) {
    return this.state[dropdown].includes(cityName);
  }

}
