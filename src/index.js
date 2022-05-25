import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoOutputRef = document.querySelector('.country-info');

searchInputRef.addEventListener('input', debounce(onSerchingInput, DEBOUNCE_DELAY));

function onSerchingInput(e) {
  const searchingValue = e.target.value.trim();
  if (!searchingValue) {
    countryListRef.innerHTML = '';
    countryInfoOutputRef.innerHTML = '';
    return;
  }

  fetchCountries(searchingValue)
    .then(responce => {
      if (responce.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }

      if (responce.length > 1 && responce.length < 11) {
        countryListRef.innerHTML = createCountryListMurkup(responce);
        countryInfoOutputRef.innerHTML = '';
        return;
      }

      countryListRef.innerHTML = '';
      countryInfoOutputRef.innerHTML = createCountryInfoMurkup(responce);
    })
    .catch(catchError);
}

function catchError(error) {
  if (error === 404) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    return;
  }
  console.warn(`Error status ${error}`);
}

function createCountryInfoMurkup([country]) {
  return `
        <div class = "country-info__title">
            <span class = "country-info__flag">
                <img src = "${country.flags.svg}">                
            </span>
            <div class = "country-info__name">${country.name.official}</div>        
        </div>
        <ul class="country-info__description">
            <li class="country-info__item"><span class="country-info__item--subtitle">Capital: </span> ${
              country.capital
            }</li>
            <li class="country-info__item"><span class="country-info__item--subtitle">Population: </span> ${
              country.population
            }</li>
            <li class="country-info__item"><span class="country-info__item--subtitle">Languages: </span> ${getLanguagesListString(
              country.languages,
            )}</li>
        </ul>
    `;
}

function getLanguagesListString(languages) {
  return Object.values(languages).join(', ');
}

function createCountryListMurkup(сountries) {
  return сountries
    .map(
      country => `<li class = "country-item">
    <span class = "country-item__flag">
    <img src = "${country.flags.svg}">
    </span>
    <span class = "country-item__name">${country.name.official}</span>
    </li>`,
    )
    .join('');
}
