import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
import createCountryListTl from './hbs/createCountryListTl.hbs';
import createCountryInfoTl from './hbs/createCountryInfoTl.hbs';

const DEBOUNCE_DELAY = 300;

const searchInputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoOutputRef = document.querySelector('.country-info');

searchInputRef.addEventListener('input', debounce(onSerchingInput, DEBOUNCE_DELAY));

function onSerchingInput(e) {
  const searchingValue = e.target.value.trim();
  if (!searchingValue) {
    removeAllMurkup();
    return;
  }

  fetchCountries(searchingValue)
    .then(responce => {
      if (responce.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }

      if (responce.length > 1 && responce.length < 11) {
        renderCountryListMurekup(responce);
        return;
      }

      renderCountryInfoMurekup(responce);
    })
    .catch(oncatchError);
}

function oncatchError(error) {
  if (error === 404) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    return;
  }
  console.warn(`Error status ${error}`);
}

function removeAllMurkup() {
  countryListRef.innerHTML = '';
  countryInfoOutputRef.innerHTML = '';
}

function renderCountryListMurekup(countries) {
  countryListRef.innerHTML = createCountryListTl(countries);
  countryInfoOutputRef.innerHTML = '';
}

function renderCountryInfoMurekup(country) {
  countryListRef.innerHTML = '';
  countryInfoOutputRef.innerHTML = createCountryInfoTl(country);
}
