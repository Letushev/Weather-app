import {init} from './app';

export function addToStorageList(cityName, list) {
  const city = document.createElement('a');
  city.textContent = cityName;
  list.appendChild(city);
  showStorageLists();
  setStorageListeners();
}

export function setStorageListeners() {
  const lists = document.querySelectorAll('.dropdown-content');
  lists.forEach(list => {
    list.addEventListener('click', function(e) {
      initStorageRequest(e);
    });
  });
}

const initStorageRequest = e => {
  const cityName = e.target.textContent;
  document.getElementById('city-search').value = cityName;
  const [lat, lng] = JSON.parse(localStorage.getItem(cityName));
  init([lat,lng]);
}

export function showStorageLists() {
  const historyCopy = document.querySelector('.history-list').cloneNode();
  const favoritiesCopy = document.querySelector('.favorities-list').cloneNode();
  for(let i = 0; i < localStorage.length; i++) {
    const city = document.createElement('a');
    city.textContent = localStorage.key(i);
    if(JSON.parse(localStorage.getItem(localStorage.key(i))).length === 3) {
      const city = document.createElement('a');
      city.textContent = localStorage.key(i);
      favoritiesCopy.appendChild(city);
    }
    historyCopy.appendChild(city);
  }
  document.querySelector('.history-list').replaceWith(historyCopy);
  document.querySelector('.favorities-list').replaceWith(favoritiesCopy);
}
