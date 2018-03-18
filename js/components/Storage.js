import Component from './../framework/Component';

import { elements } from './../utils/elements';
import { bindAll } from './../utils/helpers';

export default class Storage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isInList: false,
      list: ''
    };

    bindAll(this, 'handleClearHistory');

    if (!localStorage.length) {
      localStorage.setItem('history', JSON.stringify([]));
      localStorage.setItem('favorites', JSON.stringify([]));
    }

    this.showDropdowns(elements.historyDropdown, elements.favoritesDropdown);
    elements.clearHistoryButton.addEventListener('click', this.handleClearHistory);
  }

  update(props) {
    super.update(props);

    if (props.locationForHistory) {
      localStorage.setItem('last', JSON.stringify(this.props.locationForHistory));
      this.addToList(this.props.locationForHistory, 'history');
    }

    if (props.favorite) {
      this.addToList(this.findStorageObj(this.props.favorite, 'history'), 'favorites');
    }
  }

  findStorageObj(cityNameToFind, storageToFind) {
    const storage = JSON.parse(localStorage.getItem(storageToFind));
    return storage.find(({cityName}) => cityName === cityNameToFind);
  }

  addToList(newLocation, newList) {
    if (this.findStorageObj(newLocation.cityName, newList)) {
      this.updateState({
        isInList: true,
        list: newList
      });
    } else {
      const list = JSON.parse(localStorage.getItem(newList));
      list.push(newLocation);
      localStorage.setItem(newList, JSON.stringify(list));
      this.updateState({
        isInList: false,
        list: newList
      });
    }
  }

  render() {
    if (this.state.list === 'history' && !this.state.isInList) {
      this.showInDropdown(this.props.locationForHistory.cityName, elements.historyDropdown);
    }

    if (this.state.list === 'favorites' && !this.state.isInList) {
      this.showInDropdown(this.props.favorite, elements.favoritesDropdown);

      const star = document.querySelector('.star');
      star.classList.add('favorite');
      star.setAttribute('disabled', '');
    }
  }

  handleClearHistory() {
    localStorage.setItem('history', JSON.stringify([JSON.parse(localStorage.getItem('last'))]));
    elements.historyDropdown.querySelectorAll('.dropdown-city').forEach(city => {
      elements.historyDropdown.removeChild(city)
    });
    this.showDropdowns(elements.historyDropdown);
  }

  showInDropdown(dropdownCityName, container) {
    const dropdownItem = document.createElement('button');
    dropdownItem.textContent = dropdownCityName;
    dropdownItem.className = 'dropdown-city';

    const storageName = container === elements.historyDropdown ? 'history' : 'favorites';

    dropdownItem.addEventListener('click', () => {
      this.props.onDropdownItemClick(this.findStorageObj(dropdownCityName, storageName));
    });

    if (storageName === 'favorites') {
      dropdownItem.appendChild(this.showUnstarButton(dropdownCityName));
    }

    container.appendChild(dropdownItem);
  }

  showDropdowns(...dropdowns) {
    dropdowns.forEach(dropdown => {
      const storageName = dropdown === elements.historyDropdown ? 'history' : 'favorites';
      const list = JSON.parse(localStorage.getItem(storageName));
      list.forEach(obj => this.showInDropdown(obj.cityName, dropdown));
    });
  }

  showUnstarButton(cityName) {
    const unstarButton = document.createElement('button');
    unstarButton.textContent = '\u00d7';
    unstarButton.className = 'unstar-button';
    unstarButton.addEventListener('click', e => this.unstarCity(e, cityName));

    return unstarButton;
  }

  unstarCity(e, cityName) {
    const list = JSON.parse(localStorage.getItem('favorites'));

    if (cityName === JSON.parse(localStorage.getItem('last')).cityName) {
      const star = document.querySelector('.star');
      star.classList.remove('favorite');
      star.removeAttribute('disabled');
    }

    list.splice(list.indexOf(this.findStorageObj(cityName, 'favorites')), 1);
    localStorage.setItem('favorites', JSON.stringify(list));
    elements.favoritesDropdown.removeChild(e.target.parentNode);

    e.stopPropagation();
  }
}
